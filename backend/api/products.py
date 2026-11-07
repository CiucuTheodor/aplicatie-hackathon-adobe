import logging
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from database.connection import get_db
from database.models import Product as ProductModel, PriceHistory as PriceHistoryModel, Review as ReviewModel
from schemas.product import (
    Product,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductDetailResponse
)
from schemas.price import PriceHistoryResponse
from schemas.review import ReviewResponse
from data_collection.reviews import review_collector
from data_collection.prices import price_collector
from connectors.emag import emag_connector

logger = logging.getLogger("marketpulse.api.products")

router = APIRouter(
    prefix="/api/products",
    tags=["Products"]
)


@router.get("/", response_model=List[ProductResponse])
def get_products(
    search: Optional[str] = Query(None, description="Search term for name or brand"),
    category: Optional[str] = Query(None, description="Filter by category"),
    brand: Optional[str] = Query(None, description="Filter by brand"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(100, ge=1, le=500, description="Pagination limit"),
    db: Session = Depends(get_db)
):
    """
    Retrieve and filter tech products stored in the database.
    Supports full-text substring search, category, brand, and price boundaries.
    """
    query = db.query(ProductModel)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ProductModel.name.ilike(search_filter),
                ProductModel.brand.ilike(search_filter),
                ProductModel.category.ilike(search_filter)
            )
        )

    if category:
        query = query.filter(ProductModel.category.ilike(category.strip()))

    if brand:
        query = query.filter(ProductModel.brand.ilike(brand.strip()))

    if min_price is not None:
        query = query.filter(ProductModel.price >= min_price)

    if max_price is not None:
        query = query.filter(ProductModel.price <= max_price)

    products = query.order_by(ProductModel.id.asc()).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single product by its primary key ID.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product


@router.get("/{product_id}/detail", response_model=ProductDetailResponse)
def get_product_detail(product_id: int, db: Session = Depends(get_db)):
    """
    Retrieve deep product details including historical price changes and customer reviews.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product in the database and automatically register its initial price record.
    """
    product_dict = product_data.model_dump()
    new_product = ProductModel(**product_dict)

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    # Automatically initialize first price snapshot in price_history
    initial_price_entry = PriceHistoryModel(
        product_id=new_product.id,
        price=new_product.price,
        currency=new_product.currency
    )
    db.add(initial_price_entry)
    db.commit()
    db.refresh(new_product)

    logger.info(f"Created product: '{new_product.name}' (ID: {new_product.id})")
    return new_product


@router.post(
    "/import-from-emag",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def import_product_from_emag(
    query: str = Query(..., min_length=2, description="Product search term (e.g. 'iPhone 15', 'RTX 4070')"),
    category: Optional[str] = Query(None, description="Override category (defaults to auto-detected or Smartphone)"),
    db: Session = Depends(get_db)
):
    """
    Searches eMAG public catalog live, retrieves genuine retail price, rating,
    review volume, and product URL, then registers the product in MarketPulse AI.
    """
    results = emag_connector.search_products(query, limit=5)
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No products found on eMAG for query: '{query}'"
        )

    best = results[0]

    # Inferred category if not provided
    detected_cat = category or ("Smartphone" if "telefon" in best["name"].lower() or "iphone" in best["name"].lower() or "galaxy" in best["name"].lower() else "Technology")

    new_product = ProductModel(
        name=best["name"],
        brand=best["brand"],
        category=detected_cat,
        price=best["price"],
        currency=best.get("currency", "RON"),
        source="eMAG",
        source_url=best.get("source_url"),
        rating=best.get("rating", 0.0),
        review_count=best.get("review_count", 0)
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    # Initial price point
    initial_price_entry = PriceHistoryModel(
        product_id=new_product.id,
        price=new_product.price,
        currency=new_product.currency
    )
    db.add(initial_price_entry)
    db.commit()
    db.refresh(new_product)

    logger.info(f"Imported real product from eMAG: '{new_product.name}' (ID: {new_product.id}, Price: {new_product.price} {new_product.currency})")
    return new_product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: int,
    update_data: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing product's attributes.
    If the price changes, a new record is added to price_history.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    update_dict = update_data.model_dump(exclude_unset=True)

    # Track price modification in history
    new_price = update_dict.get("price")
    if new_price is not None and new_price != product.price:
        price_snapshot = PriceHistoryModel(
            product_id=product.id,
            price=new_price,
            currency=update_dict.get("currency", product.currency)
        )
        db.add(price_snapshot)

    for field, val in update_dict.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """
    Delete a product and cascade delete all its reviews and price records.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    db.delete(product)
    db.commit()
    return None


@router.get("/{product_id}/prices", response_model=List[PriceHistoryResponse])
def get_product_prices(product_id: int, db: Session = Depends(get_db)):
    """
    List all historical price points recorded for a given product.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product.price_history


@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    """
    List all customer reviews and feedback associated with a product.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    return product.reviews


@router.post("/{product_id}/collect-reviews")
def trigger_review_collection(
    product_id: int,
    sources: Optional[List[str]] = Query(None, description="Sources: alternative, reddit, emag, twitter"),
    limit_per_source: int = Query(5, ge=1, le=25),
    db: Session = Depends(get_db)
):
    """
    Trigger on-demand collection, sentiment analysis, and deduplication of reviews
    for this product across configured external connectors.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    summary = review_collector.collect_for_product(
        product=product,
        db=db,
        sources=sources,
        limit_per_source=limit_per_source
    )
    return summary


@router.post("/{product_id}/sync-price")
def trigger_price_sync(product_id: int, db: Session = Depends(get_db)):
    """
    Poll live market price from external catalog and record a new price point if changed.
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )

    return price_collector.update_product_price(product, db)
