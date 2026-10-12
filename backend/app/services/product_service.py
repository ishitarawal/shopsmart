"""
Product data access, behind a provider abstraction.

Per the project rule: no fake integrations pretending to be real. Only
MockProductProvider and DatabaseProductProvider are implemented today.
ExternalAPIProvider is a real class with a real interface, but it raises
NotImplementedError until real credentials/docs for a specific external
API are supplied — the recommendation engine and routes never know or
care which provider is active, since all three speak in ProductOut.
"""
from abc import ABC, abstractmethod
from typing import List, Optional

from sqlalchemy.orm import Session

from app.config import get_settings
from app.data.mock_products import CATEGORIES, PRODUCTS
from app.schemas.product import ProductOut

settings = get_settings()


class ProductProvider(ABC):
    """Common interface every product source must implement."""

    @abstractmethod
    def list_products(
        self,
        category: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> List[ProductOut]:
        ...

    @abstractmethod
    def get_product(self, product_id: int) -> Optional[ProductOut]:
        ...

    @abstractmethod
    def list_categories(self) -> List[dict]:
        ...


class MockProductProvider(ProductProvider):
    """In-memory catalog. Powers demo mode with zero setup."""

    def __init__(self):
        self._products = [
            {**p, "id": i + 1, "discount_percent": self._discount(p)}
            for i, p in enumerate(PRODUCTS)
        ]

    @staticmethod
    def _discount(p: dict) -> int:
        if p.get("original_price") and p["original_price"] > p["price"]:
            return round((1 - p["price"] / p["original_price"]) * 100)
        return 0

    def list_products(self, category=None, limit=50, offset=0) -> List[ProductOut]:
        items = self._products
        if category:
            items = [p for p in items if p["category"].lower() == category.lower()]
        return [ProductOut(**p) for p in items[offset: offset + limit]]

    def get_product(self, product_id: int) -> Optional[ProductOut]:
        for p in self._products:
            if p["id"] == product_id:
                return ProductOut(**p)
        return None

    def list_categories(self) -> List[dict]:
        return [{"id": i + 1, **c} for i, c in enumerate(CATEGORIES)]


class DatabaseProductProvider(ProductProvider):
    """Reads products from the SQL database (Postgres/MySQL/SQLite)."""

    def __init__(self, db: Session):
        self.db = db

    def list_products(self, category=None, limit=50, offset=0) -> List[ProductOut]:
        from app.models.product import Category, Product  # local import avoids cycles

        query = self.db.query(Product)
        if category:
            query = query.join(Category).filter(Category.name.ilike(category))
        rows = query.offset(offset).limit(limit).all()
        return [self._to_out(p) for p in rows]

    def get_product(self, product_id: int) -> Optional[ProductOut]:
        from app.models.product import Product

        row = self.db.query(Product).filter(Product.id == product_id).first()
        return self._to_out(row) if row else None

    def list_categories(self) -> List[dict]:
        from app.models.product import Category

        return [{"id": c.id, "name": c.name, "description": c.description} for c in self.db.query(Category).all()]

    @staticmethod
    def _to_out(p) -> ProductOut:
        discount = 0
        if p.original_price and p.original_price > p.price:
            discount = round((1 - p.price / p.original_price) * 100)
        return ProductOut(
            id=p.id, name=p.name, brand=p.brand, category=p.category.name,
            description=p.description, price=p.price, original_price=p.original_price,
            discount_percent=discount, rating=p.rating, review_count=p.review_count,
            image_url=p.image_url, product_url=p.product_url, availability=p.availability,
            specifications=p.specifications or {}, key_features=p.key_features or [],
            pros=p.pros or [], cons=p.cons or [],
        )


class ExternalAPIProvider(ProductProvider):
    """
    Placeholder for a real external product/e-commerce API (Phase 4).

    Intentionally unimplemented: wiring this up to a specific API before
    credentials/docs are provided would be a fake integration. Once you
    give me the API, this class fetches + normalizes its response into
    ProductOut so nothing else in the app has to change.
    """

    def __init__(self):
        if not settings.product_api_configured:
            raise RuntimeError("ExternalAPIProvider requires PRODUCT_API_KEY and PRODUCT_API_BASE_URL")

    def list_products(self, category=None, limit=50, offset=0) -> List[ProductOut]:
        raise NotImplementedError("Connect a real product API in ExternalAPIProvider first.")

    def get_product(self, product_id: int) -> Optional[ProductOut]:
        raise NotImplementedError("Connect a real product API in ExternalAPIProvider first.")

    def list_categories(self) -> List[dict]:
        raise NotImplementedError("Connect a real product API in ExternalAPIProvider first.")


# Single shared mock instance (cheap, stateless-ish, avoids re-parsing seed data per request).
_mock_provider = MockProductProvider()


def get_product_provider(db: Optional[Session] = None) -> ProductProvider:
    """
    Provider resolution order:
      1. External API, if configured (Phase 4+)
      2. Database, if a real DATABASE_URL is set and has data
      3. Mock data (demo mode fallback — always works)
    """
    if settings.product_api_configured:
        try:
            return ExternalAPIProvider()
        except Exception:
            pass  # fall through to DB/mock so the app keeps working

    if db is not None and not settings.is_demo_mode:
        return DatabaseProductProvider(db)

    return _mock_provider
