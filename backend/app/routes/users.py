from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User, UserPreference

router = APIRouter(prefix="/users", tags=["users"])


class UserCreate(BaseModel):
    name: str
    email: EmailStr


class PreferencesUpdate(BaseModel):
    preferred_categories: list[str] = []
    preferred_brands: list[str] = []
    budget_min: float = 0
    budget_max: float = 0


@router.post("", status_code=201)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        return {"id": existing.id, "name": existing.name, "email": existing.email}
    user = User(name=payload.name, email=payload.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"id": user.id, "name": user.name, "email": user.email}


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "email": user.email}


@router.put("/{user_id}/preferences")
def update_preferences(user_id: int, payload: PreferencesUpdate, db: Session = Depends(get_db)):
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user_id).first()
    if not prefs:
        prefs = UserPreference(user_id=user_id)
        db.add(prefs)
    prefs.preferred_categories = payload.preferred_categories
    prefs.preferred_brands = payload.preferred_brands
    prefs.budget_min = payload.budget_min
    prefs.budget_max = payload.budget_max
    db.commit()
    return {"status": "updated"}
