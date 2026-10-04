from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/")
def list_items(db: Session = Depends(get_db)):
    return {"message": "Items endpoint is available", "items": []}
