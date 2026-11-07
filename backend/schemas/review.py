from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class ReviewBase(BaseModel):
    source: str = Field(..., description="Source platform e.g. eMAG, Reddit, Alternative")
    content: str = Field(..., min_length=2, description="Review textual content")
    rating: Optional[float] = Field(None, ge=1.0, le=5.0, description="Rating between 1 and 5 stars")
    title: Optional[str] = Field(None, max_length=500)
    author: Optional[str] = Field(None, max_length=255)
    external_id: Optional[str] = Field(None, max_length=255)
    published_at: Optional[datetime] = None


class ReviewCreate(ReviewBase):
    product_id: int


class ReviewResponse(ReviewBase):
    id: int
    product_id: int
    sentiment_score: Optional[float] = None
    sentiment_label: Optional[str] = None
    aspects: Optional[Dict[str, Any]] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewSentimentBreakdown(BaseModel):
    positive: float
    neutral: float
    negative: float
    total_reviews: int
    average_sentiment_score: float
