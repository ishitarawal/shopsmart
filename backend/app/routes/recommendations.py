from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import ProductOut, RecommendationRequest
from app.services.product_service import get_product_provider
from app.services.recommendation_service import rank_products

router = APIRouter(tags=["recommendations"])


@router.post("/recommendations", response_model=list[ProductOut])
def recommend(payload: RecommendationRequest, db: Session = Depends(get_db)):
    provider = get_product_provider(db)
    candidates = provider.list_products(category=payload.requirements.category, limit=100)
    if not candidates:
        candidates = provider.list_products(limit=100)
    return rank_products(candidates, payload.requirements, limit=payload.limit)
