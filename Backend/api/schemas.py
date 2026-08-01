from pydantic import BaseModel
from typing import Optional, Literal


class JobStatusResponse(BaseModel):
    job_id: str
    status: Literal["pending", "processing", "done", "error"]
    error: Optional[str] = None


class RiskFlag(BaseModel):
    flag: str
    severity: str
    explanation: str


class ScoreResult(BaseModel):
    cooperative_name: str
    scenario: str
    score: int
    band: str
    flags: list[RiskFlag]
    ratios: dict
    graph: dict
    ai_explanation: Optional[str] = None
    extraction_confidence: Optional[float] = None
    extraction_notes: Optional[str] = None
    needs_manual_review: bool = False
