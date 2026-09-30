from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.session import get_db
from app.model.review import Review
from app.model.transaction import Transaction, TransactionStatus
from app.model.user import User
from app.schemas.review import ReviewCreate, ReviewResponse, SellerRatingSummary
from app.core.security import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new review for a transaction."""
    transaction = db.query(Transaction).filter(
        Transaction.id == review_data.transaction_id,
        Transaction.status == TransactionStatus.COMPLETED
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found or not completed",
        )
    
    if transaction.buyer_id != current_user.id and transaction.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review transactions you were part of",
        )
    
    existing_review = db.query(Review).filter(
        Review.transaction_id == review_data.transaction_id,
        Review.reviewer_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this transaction",
        )
    
    review = Review(
        transaction_id=review_data.transaction_id,
        reviewer_id=current_user.id,
        reviewee_id=transaction.seller_id if transaction.buyer_id == current_user.id else transaction.buyer_id,
        rating=review_data.rating,
        comment=review_data.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/transaction/{transaction_id}", response_model=list[ReviewResponse])
def get_transaction_reviews(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    """Get all reviews for a specific transaction."""
    reviews = db.query(Review).filter(
        Review.transaction_id == transaction_id
    ).all()
    return reviews


@router.get("/user/{user_id}/seller", response_model=SellerRatingSummary)
def get_seller_rating(
    user_id: int,
    db: Session = Depends(get_db),
):
    """Get seller rating summary for a user."""
    reviews = db.query(Review).filter(
        Review.reviewee_id == user_id
    ).all()
    
    if not reviews:
        return SellerRatingSummary(
            user_id=user_id,
            average_rating=0.0,
            total_reviews=0,
            rating_distribution={}
        )
    
    ratings = [r.rating for r in reviews]
    average_rating = sum(ratings) / len(ratings)
    
    rating_distribution = {i: sum(1 for r in ratings if r == i) for i in range(1, 6)}
    
    return SellerRatingSummary(
        user_id=user_id,
        average_rating=average_rating,
        total_reviews=len(reviews),
        rating_distribution=rating_distribution
    )