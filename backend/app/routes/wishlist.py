from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import WishlistItem
from app.schemas.product import ProductOut, WishlistAddRequest
from app.services.product_service import get_product_provider

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=list[ProductOut])
def get_wishlist(user_id: int, db: Session = Depends(get_db)):
    provider = get_product_provider(db)
    items = db.query(WishlistItem).filter(WishlistItem.user_id == user_id).all()
    products = [provider.get_product(i.product_id) for i in items]
    return [p for p in products if p]


@router.post("", status_code=201)
def add_to_wishlist(payload: WishlistAddRequest, db: Session = Depends(get_db)):
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == payload.user_id, WishlistItem.product_id == payload.product_id)
        .first()
    )
    if existing:
        return {"status": "already_saved"}
    db.add(WishlistItem(user_id=payload.user_id, product_id=payload.product_id))
    db.commit()
    return {"status": "added"}


@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, user_id: int, db: Session = Depends(get_db)):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Not in wishlist")
    db.delete(item)
    db.commit()
    return {"status": "removed"}
