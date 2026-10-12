"""
SQLAlchemy ORM models for products and categories.

`specifications` is stored as JSON so each category (laptop, headphones,
shoes...) can carry a different shape of spec data without needing a new
table or migration per category — the Comparison page (Phase 9) reads
whichever keys are relevant to that product's category.
"""
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.connection import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text, default="")

    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    brand: Mapped[str] = mapped_column(String(100), index=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), index=True)
    description: Mapped[str] = mapped_column(Text, default="")

    price: Mapped[float] = mapped_column(Float, index=True)
    original_price: Mapped[float] = mapped_column(Float, default=0)
    rating: Mapped[float] = mapped_column(Float, default=0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)

    image_url: Mapped[str] = mapped_column(String(500), default="")
    product_url: Mapped[str] = mapped_column(String(500), default="")
    availability: Mapped[str] = mapped_column(String(50), default="in_stock")

    # Category-specific attributes, e.g. {"ram": "16GB", "battery": "10 hours"}
    specifications: Mapped[dict] = mapped_column(JSON, default=dict)
    key_features: Mapped[list] = mapped_column(JSON, default=list)
    pros: Mapped[list] = mapped_column(JSON, default=list)
    cons: Mapped[list] = mapped_column(JSON, default=list)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    category: Mapped["Category"] = relationship(back_populates="products")
