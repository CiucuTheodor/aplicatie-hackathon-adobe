from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class AnalyticsOverview(BaseModel):
    total_products: int
    average_price: float
    total_reviews: int
    average_rating: Optional[float] = None
    brands_tracked: Optional[int] = 0
    categories_tracked: Optional[int] = 0


class SentimentAnalysis(BaseModel):
    product_id: int
    product_name: Optional[str] = None
    positive: float
    neutral: float
    negative: float
    total_reviews: int
    average_score: Optional[float] = None
    aspect_insights: Optional[Dict[str, Any]] = None


class PriceAnalysis(BaseModel):
    product_id: int
    product_name: Optional[str] = None
    current_price: float
    minimum_price: float
    maximum_price: float
    average_price: float
    currency: str = "RON"
    price_change_percentage: Optional[float] = 0.0
    history_points: Optional[int] = 0


class TrendAnalysis(BaseModel):
    category: str
    trend_score: float
    trend_direction: str  # "increasing", "stable", "decreasing"
    search_interest: float
    top_brands: Optional[List[str]] = []

    model_config = ConfigDict(from_attributes=True)


class Recommendation(BaseModel):
    product_id: int
    product_name: str
    recommendation: str
    reason: str
    pros: Optional[List[str]] = []
    cons: Optional[List[str]] = []
    sentiment_score: Optional[float] = None
    price_score: Optional[float] = None
