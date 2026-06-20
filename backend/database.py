from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool
from models import Base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/stratwyze_crm"
)

engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("SQL_ECHO", "false").lower() == "true",
    poolclass=NullPool
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)

def create_initial_stages():
    """Create default pipeline stages."""
    db = SessionLocal()
    try:
        from models import Stage
        stages = [
            {"name": "Discovery", "order_index": 1},
            {"name": "Proposal", "order_index": 2},
            {"name": "Negotiation", "order_index": 3},
            {"name": "Closed Won", "order_index": 4},
            {"name": "Closed Lost", "order_index": 5},
        ]
        for stage_data in stages:
            if not db.query(Stage).filter_by(name=stage_data["name"]).first():
                db.add(Stage(**stage_data))
        db.commit()
    finally:
        db.close()
