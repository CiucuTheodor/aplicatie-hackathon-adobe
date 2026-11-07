from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class PriceHistoryBase(BaseModel):
    price: float = Field(..., gt=0, description="Product price snapshot")
    currency: str = Field(default="RON", description="Currency symbol/code")


class PriceHistoryCreate(PriceHistoryBase):
    product_id: int


class PriceHistoryResponse(PriceHistoryBase):
    id: int
    product_id: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
