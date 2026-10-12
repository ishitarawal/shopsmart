from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product import CategoryOut, ProductOut
from app.services.product_service import get_product_provider

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    category: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    provider = get_product_provider(db)
    return provider.list_products(category=category, limit=limit, offset=offset)


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    provider = get_product_provider(db)
    return provider.list_categories()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    provider = get_product_provider(db)
    product = provider.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
