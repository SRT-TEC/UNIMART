from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewCreate(BaseModel):
    transaction_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None


class ReviewResponse(BaseModel):
    id: int
    transaction_id: int
    reviewer_id: int
    reviewee_id: int
    rating: int
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class SellerRatingSummary(BaseModel):
    user_id: int
    average_rating: float
    total_reviews: int
    rating_distribution: dict
