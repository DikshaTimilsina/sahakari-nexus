"""
Database connection setup.

Uses SQLite by default (zero-config, perfect for a hackathon — no Postgres
server to install or forget to start before a demo). Swap DATABASE_URL to a
Postgres connection string when you're ready to deploy; SQLAlchemy's ORM
layer means no other code changes are needed.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./trustnet.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a session, always closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Call once at app startup."""
    Base.metadata.create_all(bind=engine)
