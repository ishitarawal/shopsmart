"""
SQLAlchemy ORM models for users and everything user-scoped: wishlist,
preferences, search history, and chat history.
"""
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(150))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    wishlist_items: Mapped[list["WishlistItem"]] = relationship(back_populates="user")
    preferences: Mapped["UserPreference"] = relationship(back_populates="user", uselist=False)


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="wishlist_items")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)
    preferred_categories: Mapped[list] = mapped_column(JSON, default=list)
    preferred_brands: Mapped[list] = mapped_column(JSON, default=list)
    budget_min: Mapped[float] = mapped_column(Float, default=0)
    budget_max: Mapped[float] = mapped_column(Float, default=0)
    preferences: Mapped[dict] = mapped_column(JSON, default=dict)

    user: Mapped["User"] = relationship(back_populates="preferences")


class SearchHistory(Base):
    __tablename__ = "search_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    query: Mapped[str] = mapped_column(Text)
    extracted_preferences: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)
    session_id: Mapped[str] = mapped_column(String(100), index=True, default="")
    message: Mapped[str] = mapped_column(Text)
    response: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
