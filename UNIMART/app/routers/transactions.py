from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("/")
def list_transactions(db: Session = Depends(get_db)):
    return {"message": "Transactions endpoint is available", "transactions": []}
