from collections import defaultdict
from typing import Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import ChatHistory
from app.schemas.chat import ChatMessageIn, ChatMessageOut
from app.schemas.product import ExtractedRequirements
from app.services.ai_service import get_ai_provider
from app.services.product_service import get_product_provider
from app.services.recommendation_service import rank_products

router = APIRouter(tags=["chat"])

# In-memory per-session state. Fine for demo mode / a single backend instance;
# swap for Redis or the chat_history table for multi-instance deployments.
_session_history: Dict[str, List[dict]] = defaultdict(list)
_session_requirements: Dict[str, ExtractedRequirements] = defaultdict(ExtractedRequirements)


@router.post("/chat", response_model=ChatMessageOut)
async def chat(payload: ChatMessageIn, db: Session = Depends(get_db)):
    ai = get_ai_provider()
    history = _session_history[payload.session_id]
    known = _session_requirements[payload.session_id]

    result = await ai.chat_reply(payload.message, history, known)
    _session_requirements[payload.session_id] = result["requirements"]

    products = []
    if not result["needs_clarification"]:
        provider = get_product_provider(db)
        candidates = provider.list_products(category=result["requirements"].category, limit=100)
        if not candidates:
            candidates = provider.list_products(limit=100)
        products = rank_products(candidates, result["requirements"], limit=6)

    history.append({"role": "user", "content": payload.message})
    history.append({"role": "assistant", "content": result["reply"]})

    try:
        db.add(ChatHistory(
            user_id=payload.user_id, session_id=payload.session_id,
            message=payload.message, response=result["reply"],
        ))
        db.commit()
    except Exception:
        db.rollback()  # chat still works even if history logging fails (e.g. demo mode w/o tables)

    return ChatMessageOut(
        reply=result["reply"],
        session_id=payload.session_id,
        requirements=result["requirements"],
        products=products,
        needs_clarification=result["needs_clarification"],
        suggested_replies=result["suggested_replies"],
    )
