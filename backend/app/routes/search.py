from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import SearchRequest, SearchResponse
from app.services.ai_service import get_ai_provider
from app.services.product_service import get_product_provider
from app.services.recommendation_service import rank_products

router = APIRouter(tags=["search"])


@router.post("/search", response_model=SearchResponse)
async def search(payload: SearchRequest, db: Session = Depends(get_db)):
    """
    Natural-language search: the AI service only extracts structured intent
    from the query. All actual product facts come from ProductProvider —
    the AI never invents a product.
    """
    ai = get_ai_provider()
    requirements = await ai.extract_requirements(payload.query)

    provider = get_product_provider(db)
    candidates = provider.list_products(category=requirements.category, limit=100)
    if not candidates and requirements.category:
        # widen search if the exact category had nothing, so results aren't empty
        candidates = provider.list_products(limit=100)

    ranked = rank_products(candidates, requirements, limit=24)

    return SearchResponse(extracted=requirements, results=ranked, result_count=len(ranked))
