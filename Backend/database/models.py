"""
SQLAlchemy ORM models — the persistent version of the schema from the
architecture doc. Distinct from any Pydantic request/response schemas
(those describe API shapes; these describe stored rows).
"""

import uuid
from datetime import datetime

from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship

try:
    from .database import Base
except ImportError:
    from database.database import Base


def _uuid() -> str:
    return str(uuid.uuid4())


class Cooperative(Base):
    __tablename__ = "cooperatives"

    id = Column(String, primary_key=True, default=_uuid)
    name = Column(String, nullable=False)
    registration_number = Column(String, unique=True, nullable=True)
    district = Column(String, nullable=True)
    province = Column(String, nullable=True)
    license_status = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship("Member", back_populates="cooperative", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="cooperative", cascade="all, delete-orphan")
    risk_scores = relationship("RiskScore", back_populates="cooperative", cascade="all, delete-orphan")


class Member(Base):
    __tablename__ = "members"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"))
    name = Column(String)
    member_number = Column(String)
    join_date = Column(String)
    role = Column(String)  # 'member' | 'board' | 'staff'

    cooperative = relationship("Cooperative", back_populates="members")


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"))
    member_id = Column(String, ForeignKey("members.id"))
    amount = Column(Float)
    txn_date = Column(String)
    txn_type = Column(String)  # 'deposit' | 'withdrawal'


class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"))
    borrower_member_id = Column(String, ForeignKey("members.id"))
    amount = Column(Float)
    issue_date = Column(String)
    due_date = Column(String)
    status = Column(String)
    related_party_flag = Column(Boolean, default=False)


class MemberRelationship(Base):
    __tablename__ = "relationships"

    id = Column(String, primary_key=True, default=_uuid)
    member_a = Column(String, ForeignKey("members.id"))
    member_b = Column(String, ForeignKey("members.id"))
    relationship_type = Column(String)


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"))
    file_path = Column(String)
    doc_type = Column(String, nullable=True)
    ocr_status = Column(String, default="pending")
    ocr_confidence = Column(Float, nullable=True)
    raw_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    cooperative = relationship("Cooperative", back_populates="documents")


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"))
    score = Column(Float)
    band = Column(String)
    flags = Column(JSON)  # list of {flag, severity, explanation}
    ratios = Column(JSON)
    ai_explanation = Column(Text, nullable=True)
    computed_at = Column(DateTime, default=datetime.utcnow)

    cooperative = relationship("Cooperative", back_populates="risk_scores")


class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String, primary_key=True, default=_uuid)
    cooperative_id = Column(String, ForeignKey("cooperatives.id"), nullable=True)
    description = Column(Text)
    anonymous = Column(Boolean, default=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)


class AnalysisJob(Base):
    """
    Persists async job state — replaces the in-memory dict from the MVP.
    Survives a server restart, which the in-memory version didn't.
    """
    __tablename__ = "analysis_jobs"

    id = Column(String, primary_key=True, default=_uuid)
    status = Column(String, default="pending")  # pending | processing | done | error
    source = Column(String)  # 'healthy' | 'collapsing' | 'upload'
    result = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
