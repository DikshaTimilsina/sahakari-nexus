"""
API routes — the FastAPI surface for TrustNet AI.

Two entry points into the same pipeline:
  1. /demo/analyze/{scenario}  — synthetic healthy/collapsing data (guaranteed
     to work, zero external dependencies — your judge-facing fallback).
  2. /documents/upload         — real PDF/image upload -> OCR -> LLM structuring
     -> same graph/risk/explanation pipeline. Requires ANTHROPIC_API_KEY.

Both write results to the database (AnalysisJob + Cooperative + RiskScore),
replacing the MVP's in-memory job dict so state survives a server restart.
"""

import os
import shutil
import threading
import uuid
from typing import Literal

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from database.database import SessionLocal, get_db
from database import models as db_models

from ai.data_generator import generate_healthy_cooperative, generate_collapsing_cooperative
from ai.graph_builder import build_graph, to_vis_json
from ai.risk_engine import score_cooperative
from ai.ai_explanation import generate_explanation
from ai import ocr_service
from ai import llm_extractor
from reports.report_generator import generate_text_report

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

SCENARIO_GENERATORS = {
    "healthy": generate_healthy_cooperative,
    "collapsing": generate_collapsing_cooperative,
}


# ---------- shared pipeline ----------

def _run_pipeline_and_persist(job_id: str, dataset: dict, extraction_meta: dict | None = None):
    """Runs graph build -> risk scoring -> AI explanation, then persists the
    cooperative + risk score + job result to the database. Uses its own DB
    session since this runs on a background thread, not a request."""
    db: Session = SessionLocal()
    try:
        job = db.query(db_models.AnalysisJob).filter_by(id=job_id).first()
        job.status = "processing"
        db.commit()

        G = build_graph(dataset)
        result = score_cooperative(dataset, G)
        explanation = generate_explanation(
            cooperative_name=dataset["name"],
            score=result["score"],
            band=result["band"],
            flags=result["flags"],
        )
        vis_graph = to_vis_json(G, highlighted_nodes=result["flagged_cluster_members"])

        coop = db_models.Cooperative(name=dataset["name"])
        db.add(coop)
        db.flush()  # get coop.id without committing yet

        risk_row = db_models.RiskScore(
            cooperative_id=coop.id,
            score=result["score"],
            band=result["band"],
            flags=result["flags"],
            ratios=result["ratios"],
            ai_explanation=explanation,
        )
        db.add(risk_row)

        payload = {
            "cooperative_name": dataset["name"],
            "scenario": dataset.get("scenario", "unknown"),
            "score": result["score"],
            "band": result["band"],
            "flags": result["flags"],
            "ratios": result["ratios"],
            "graph": vis_graph,
            "ai_explanation": explanation,
        }
        if extraction_meta:
            payload.update(extraction_meta)

        job.status = "done"
        job.result = payload
        db.commit()
    except Exception as e:
        db.rollback()
        job = db.query(db_models.AnalysisJob).filter_by(id=job_id).first()
        if job:
            job.status = "error"
            job.error = str(e)
            db.commit()
    finally:
        db.close()


def _create_job(db: Session, source: str) -> str:
    job = db_models.AnalysisJob(id=str(uuid.uuid4()), status="pending", source=source)
    db.add(job)
    db.commit()
    return job.id


# ---------- demo (synthetic) path ----------

@router.post("/demo/analyze/{scenario}")
def analyze_demo(scenario: Literal["healthy", "collapsing"], db: Session = Depends(get_db)):
    if scenario not in SCENARIO_GENERATORS:
        raise HTTPException(400, "scenario must be 'healthy' or 'collapsing'")

    job_id = _create_job(db, source=scenario)
    dataset = SCENARIO_GENERATORS[scenario]().to_dict()

    thread = threading.Thread(target=_run_pipeline_and_persist, args=(job_id, dataset), daemon=True)
    thread.start()

    return {"job_id": job_id, "status": "pending"}


# ---------- real document upload path ----------

@router.post("/documents/upload")
def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith((".pdf",)):
        raise HTTPException(400, "Only PDF uploads are supported right now.")

    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(file_path, "wb") as out:
        shutil.copyfileobj(file.file, out)

    ocr_result = ocr_service.extract_text(file_path)
    if ocr_result.method == "failed" or not ocr_result.raw_text.strip():
        raise HTTPException(422, f"Could not extract text from document: {ocr_result.warnings}")

    try:
        dataset = llm_extractor.structure(ocr_result.raw_text)
    except llm_extractor.ExtractionUnavailable as e:
        raise HTTPException(503, str(e))
    except llm_extractor.ExtractionFailed as e:
        raise HTTPException(422, f"Extraction failed: {e}")

    job_id = _create_job(db, source="upload")

    extraction_meta = {
        "extraction_confidence": min(ocr_result.confidence, dataset.get("extraction_confidence", 1.0)),
        "extraction_notes": dataset.get("extraction_notes", ""),
        "needs_manual_review": ocr_result.needs_manual_review or dataset.get("extraction_confidence", 1.0) < 0.6,
    }

    thread = threading.Thread(
        target=_run_pipeline_and_persist, args=(job_id, dataset, extraction_meta), daemon=True
    )
    thread.start()

    return {"job_id": job_id, "status": "pending", "ocr_method": ocr_result.method}


# ---------- job polling ----------

@router.get("/jobs/{job_id}/status")
def job_status(job_id: str, db: Session = Depends(get_db)):
    job = db.query(db_models.AnalysisJob).filter_by(id=job_id).first()
    if not job:
        raise HTTPException(404, "job not found")
    return {"job_id": job_id, "status": job.status, "error": job.error}


@router.get("/jobs/{job_id}/result")
def job_result(job_id: str, db: Session = Depends(get_db)):
    job = db.query(db_models.AnalysisJob).filter_by(id=job_id).first()
    if not job:
        raise HTTPException(404, "job not found")
    if job.status != "done":
        raise HTTPException(409, f"job not finished yet (status: {job.status})")
    return job.result


@router.get("/jobs/{job_id}/report", response_class=PlainTextResponse)
def job_report(job_id: str, db: Session = Depends(get_db)):
    job = db.query(db_models.AnalysisJob).filter_by(id=job_id).first()
    if not job:
        raise HTTPException(404, "job not found")
    if job.status != "done":
        raise HTTPException(409, f"job not finished yet (status: {job.status})")
    return generate_text_report(job.result)
