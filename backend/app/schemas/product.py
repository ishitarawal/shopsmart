from typing import List, Optional

from pydantic import BaseModel, Field


class ProductOut(BaseModel):
    """Normalized product shape returned to the frontend, regardless of
    whether the product came from the DB, mock data, or an external API."""

    id: int
    name: str
    brand: str
    category: str
    description: str = ""
    price: float
    original_price: float = 0
    discount_percent: int = 0
    rating: float = 0
    review_count: int = 0
    image_url: str = ""
    product_url: str = ""
    availability: str = "in_stock"
    specifications: dict = Field(default_factory=dict)
    key_features: List[str] = Field(default_factory=list)
    pros: List[str] = Field(default_factory=list)
    cons: List[str] = Field(default_factory=list)

    # Populated only when returned from the recommendation engine.
    match_score: Optional[int] = None
    match_reasons: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class CategoryOut(BaseModel):
    id: int
    name: str
    description: str = ""

    model_config = {"from_attributes": True}


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    user_id: Optional[int] = None


class ExtractedRequirements(BaseModel):
    """Structured requirements the AI service pulls out of a free-text query."""

    category: Optional[str] = None
    budget_max: Optional[float] = None
    budget_min: Optional[float] = None
    use_case: Optional[str] = None
    preferences: List[str] = Field(default_factory=list)
    brand: Optional[str] = None
    raw_query: str = ""


class SearchResponse(BaseModel):
    extracted: ExtractedRequirements
    results: List[ProductOut]
    result_count: int


class RecommendationRequest(BaseModel):
    requirements: ExtractedRequirements
    limit: int = 12


class WishlistAddRequest(BaseModel):
    user_id: int
    product_id: int
