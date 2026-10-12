"""
Recommendation engine: takes extracted user requirements + normalized
product data and computes a transparent "ShopSmart Match" score.

Deliberately simple and explainable (weighted factor scoring, not a black
box) so the AI chat layer can honestly say *why* a product matched,
without inventing anything — every reason below is derived straight from
real product fields.
"""
from typing import List

from app.schemas.product import ExtractedRequirements, ProductOut

WEIGHTS = {
    "budget": 0.35,
    "category": 0.25,
    "preferences": 0.25,
    "rating": 0.15,
}


def _budget_score(product: ProductOut, req: ExtractedRequirements) -> float:
    if not req.budget_max:
        return 0.7  # neutral-ish when user gave no budget
    if product.price <= req.budget_max:
        # reward being comfortably under budget, but don't over-reward being far under
        headroom = (req.budget_max - product.price) / req.budget_max
        return min(1.0, 0.85 + headroom * 0.15)
    overshoot = (product.price - req.budget_max) / req.budget_max
    return max(0.0, 0.5 - overshoot)  # penalize going over budget


def _category_score(product: ProductOut, req: ExtractedRequirements) -> float:
    if not req.category:
        return 0.6
    return 1.0 if product.category.lower() == req.category.lower() else 0.0


def _preference_score(product: ProductOut, req: ExtractedRequirements) -> float:
    if not req.preferences:
        return 0.6
    haystack = " ".join(
        [product.description, " ".join(product.key_features), str(product.specifications)]
    ).lower()
    hits = sum(1 for p in req.preferences if p.lower() in haystack)
    return hits / len(req.preferences)


def _rating_score(product: ProductOut) -> float:
    return min(1.0, product.rating / 5.0)


def score_product(product: ProductOut, req: ExtractedRequirements) -> ProductOut:
    budget = _budget_score(product, req)
    category = _category_score(product, req)
    preference = _preference_score(product, req)
    rating = _rating_score(product)

    overall = (
        budget * WEIGHTS["budget"]
        + category * WEIGHTS["category"]
        + preference * WEIGHTS["preferences"]
        + rating * WEIGHTS["rating"]
    )

    reasons = []
    if req.budget_max and product.price <= req.budget_max:
        reasons.append(f"Within your ₹{int(req.budget_max):,} budget")
    if req.category and product.category.lower() == req.category.lower():
        reasons.append(f"Matches the category you asked for ({product.category})")
    if req.preferences:
        haystack = " ".join(
            [product.description, " ".join(product.key_features), str(product.specifications)]
        ).lower()
        matched_prefs = [p for p in req.preferences if p.lower() in haystack]
        if matched_prefs:
            reasons.append("Matches: " + ", ".join(matched_prefs))
    if product.rating >= 4.3:
        reasons.append(f"Highly rated ({product.rating}★ from {product.review_count:,} reviews)")

    product.match_score = round(overall * 100)
    product.match_reasons = reasons or ["Close to what you're looking for"]
    return product


def rank_products(products: List[ProductOut], req: ExtractedRequirements, limit: int = 12) -> List[ProductOut]:
    scored = [score_product(p, req) for p in products]
    scored.sort(key=lambda p: p.match_score, reverse=True)
    return scored[:limit]
