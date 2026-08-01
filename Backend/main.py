"""
TrustNet AI — FastAPI entrypoint.

Route logic lives in api/routes.py; this file just wires up the app,
CORS, and database table creation on startup.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import init_db
from api.routes import router

app = FastAPI(title="TrustNet AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before any real deployment
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/health")
def health():
    return {"status": "ok"}
