"""
Database engine/session setup.

Designed so swapping SQLite (demo mode) for PostgreSQL/MySQL later is a
one-line change (DATABASE_URL) with zero changes to models, schemas, or
services. Everything upstream talks to SQLAlchemy's ORM layer only.
"""
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import get_settings

settings = get_settings()

if settings.database_url:
    # Real database (Postgres/MySQL) configured.
    engine = create_engine(settings.database_url, pool_pre_ping=True)
else:
    # Demo mode: local SQLite file, no setup required.
    engine = create_engine(
        "sqlite:///./shopsmart_demo.db",
        connect_args={"check_same_thread": False},
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency: yields a DB session and always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope():
    """Context-manager version, for use outside request handlers (seeding, scripts)."""
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
