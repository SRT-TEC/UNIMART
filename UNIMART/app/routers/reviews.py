from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/")
def list_reviews(db: Session = Depends(get_db)):
    return {"message": "Reviews endpoint is available", "reviews": []}
