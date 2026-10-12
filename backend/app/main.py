"""
ShopSmart backend entrypoint.

Run with:  uvicorn app.main:app --reload --port 8000
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database.connection import Base, engine, session_scope
from app.routes import chat, products, recommendations, search, users, wishlist

settings = get_settings()

app = FastAPI(
    title="ShopSmart API",
    description="Backend for ShopSmart — a natural-language shopping assistant.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Friendly, generic message to the client; details stay server-side.
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Please try again in a moment."},
    )


app.include_router(products.router)
app.include_router(search.router)
app.include_router(recommendations.router)
app.include_router(chat.router)
app.include_router(wishlist.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {
        "service": "ShopSmart API",
        "status": "ok",
        "demo_mode": settings.is_demo_mode,
        "ai_configured": settings.ai_configured,
        "product_api_configured": settings.product_api_configured,
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.on_event("startup")
def on_startup():
    """Create tables and seed demo data so the app works with zero setup."""
    from app.models import product, user  # noqa: F401  (register models with Base)

    Base.metadata.create_all(bind=engine)
    _seed_if_empty()


def _seed_if_empty():
    from app.data.mock_products import CATEGORIES, PRODUCTS
    from app.models.product import Category, Product

    with session_scope() as db:
        if db.query(Category).count() > 0:
            return  # already seeded

        category_objs = {}
        for c in CATEGORIES:
            obj = Category(name=c["name"], description=c["description"])
            db.add(obj)
            category_objs[c["name"]] = obj
        db.flush()

        for p in PRODUCTS:
            discount = 0
            if p.get("original_price") and p["original_price"] > p["price"]:
                discount = round((1 - p["price"] / p["original_price"]) * 100)
            db.add(Product(
                name=p["name"], brand=p["brand"], category_id=category_objs[p["category"]].id,
                description=p.get("description", ""), price=p["price"],
                original_price=p.get("original_price", 0), rating=p.get("rating", 0),
                review_count=p.get("review_count", 0), image_url=p.get("image_url", ""),
                availability=p.get("availability", "in_stock"),
                specifications=p.get("specifications", {}), key_features=p.get("key_features", []),
                pros=p.get("pros", []), cons=p.get("cons", []),
            ))
