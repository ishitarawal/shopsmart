from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.product import ExtractedRequirements, ProductOut


class ChatMessageIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    session_id: str = Field(..., description="Client-generated id, stable per conversation")
    user_id: Optional[int] = None


class ChatMessageOut(BaseModel):
    reply: str
    session_id: str
    # Present once enough requirements have been gathered to search products.
    requirements: Optional[ExtractedRequirements] = None
    products: List[ProductOut] = Field(default_factory=list)
    # True when the assistant is still asking clarifying questions.
    needs_clarification: bool = False
    suggested_replies: List[str] = Field(default_factory=list)
