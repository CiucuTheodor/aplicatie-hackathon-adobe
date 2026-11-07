import logging
from typing import Optional, List
from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.connection import get_db
from database.models import Product as ProductModel, Review as ReviewModel, PriceHistory as PriceHistoryModel, TrendMetric as TrendMetricModel
from schemas.analytics import (
    AnalyticsOverview,
    SentimentAnalysis,
    PriceAnalysis,
    TrendAnalysis,
    Recommendation
)
from services.sentiment_analysis import sentiment_service
from services.forecasting import forecasting_service
from services.recommendations import recommendation_service
from data_collection.trends import trend_collector

logger = logging.getLogger("marketpulse.api.analytics")

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"]
)


@router.get("/overview", response_model=AnalyticsOverview)
def get_overview(db: Session = Depends(get_db)):
    """
    Dashboard overview displaying aggregated market indicators:
    total products, average market price, total collected reviews,
    average user rating, and count of monitored brands/categories.
    """
    total_products = db.query(func.count(ProductModel.id)).scalar() or 0
    avg_price = db.query(func.avg(ProductModel.price)).scalar() or 0.0
    total_reviews = db.query(func.count(ReviewModel.id)).scalar() or 0
    avg_rating = db.query(func.avg(ProductModel.rating)).filter(ProductModel.rating > 0).scalar()

    distinct_brands = db.query(func.count(func.distinct(ProductModel.brand))).scalar() or 0
    distinct_categories = db.query(func.count(func.distinct(ProductModel.category))).scalar() or 0

    return AnalyticsOverview(
        total_products=total_products,
        average_price=round(float(avg_price), 2),
        total_reviews=total_reviews,
        average_rating=round(float(avg_rating), 2) if avg_rating else 0.0,
        brands_tracked=distinct_brands,
        categories_tracked=distinct_categories
    )


@router.get("/sentiment", response_model=SentimentAnalysis)
def get_sentiment(product_id: int = Query(..., gt=0), db: Session = Depends(get_db)):
    """
    Sentiment breakdown (positive, neutral, negative percentages) and
    extracted aspect sentiment (battery, camera, display, etc.) for a product.
    Delegates calculation to SentimentAnalysisService.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    reviews = db.query(ReviewModel).filter(ReviewModel.product_id == product_id).all()
    aggregated = sentiment_service.aggregate_reviews(
        product_id=product.id,
        product_name=product.name,
        reviews=reviews
    )

    return SentimentAnalysis(**aggregated)


@router.get("/prices", response_model=PriceAnalysis)
def get_price_analysis(product_id: int = Query(..., gt=0), db: Session = Depends(get_db)):
    """
    Price dynamics analysis: current price, historical min/max, average,
    and percentage change over time. Delegates to PriceForecastingService.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    price_history = (
        db.query(PriceHistoryModel)
        .filter(PriceHistoryModel.product_id == product_id)
        .order_by(PriceHistoryModel.recorded_at.asc())
        .all()
    )

    analysis = forecasting_service.analyze_price_history(
        product_id=product.id,
        product_name=product.name,
        current_price=product.price,
        price_history=price_history,
        currency=product.currency
    )

    return PriceAnalysis(**analysis)


@router.get("/trends", response_model=List[TrendAnalysis])
def get_trends(category: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Market trend indicators by category or overall tech segment.
    Queries recorded trend metrics and calculates real-time category distribution.
    """
    query = db.query(TrendMetricModel)
    if category:
        query = query.filter(TrendMetricModel.category.ilike(category.strip()))

    recorded_trends = query.order_by(TrendMetricModel.trend_score.desc()).all()

    if recorded_trends:
        results = []
        for t in recorded_trends:
            # Find top brands in this category
            brands = [
                b[0] for b in db.query(ProductModel.brand)
                .filter(ProductModel.category.ilike(t.category))
                .distinct()
                .limit(5)
                .all()
            ]
            results.append(
                TrendAnalysis(
                    category=t.category,
                    trend_score=round(t.trend_score, 1),
                    trend_direction=t.trend_direction,
                    search_interest=round(t.search_interest, 1),
                    top_brands=brands
                )
            )
        return results

    # If no TrendMetric records have been scraped yet, dynamically derive category insights
    distinct_categories = [
        c[0] for c in db.query(ProductModel.category).distinct().all()
    ]

    results = []
    for cat in distinct_categories:
        if category and category.lower() != cat.lower():
            continue

        prod_count = db.query(func.count(ProductModel.id)).filter(ProductModel.category == cat).scalar() or 0
        review_count = (
            db.query(func.count(ReviewModel.id))
            .join(ProductModel, ReviewModel.product_id == ProductModel.id)
            .filter(ProductModel.category == cat)
            .scalar() or 0
        )
        brands = [
            b[0] for b in db.query(ProductModel.brand)
            .filter(ProductModel.category == cat)
            .distinct()
            .limit(5)
            .all()
        ]

        # Calculate a normalized trend score based on product volume and review engagement
        trend_score = min(100.0, max(20.0, (prod_count * 15.0) + (review_count * 2.5)))
        results.append(
            TrendAnalysis(
                category=cat,
                trend_score=round(trend_score, 1),
                trend_direction="increasing" if trend_score > 60 else "stable",
                search_interest=round(trend_score * 0.9, 1),
                top_brands=brands
            )
        )

    return results


@router.get("/recommendations", response_model=List[Recommendation])
def get_recommendations(
    category: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """
    Synthesizes market intelligence, sentiment analysis, and price comparisons
    to produce actionable recommendations and identify pros & cons.
    Delegates to RecommendationService.
    """
    query = db.query(ProductModel)
    if category:
        query = query.filter(ProductModel.category.ilike(category.strip()))

    products = query.limit(limit).all()
    if not products:
        return []

    # Gather sentiment summaries for each product
    sentiment_map = {}
    for p in products:
        revs = db.query(ReviewModel).filter(ReviewModel.product_id == p.id).all()
        sentiment_map[p.id] = sentiment_service.aggregate_reviews(p.id, p.name, revs)

    recommendations = recommendation_service.generate_recommendations(
        products=products,
        sentiment_data=sentiment_map
    )

    return recommendations


@router.post("/refresh-trends", response_model=List[TrendAnalysis])
def refresh_market_trends(db: Session = Depends(get_db)):
    """
    Triggers external collection of market trends for tracked technology categories
    via Google Trends and market indicators, then returns the fresh analysis.
    """
    trend_collector.refresh_trends(db)
    return get_trends(db=db)
