"""
TrustNet AI — FastAPI entrypoint.

Route logic lives in api/routes.py; this file just wires up the app,
CORS, and database table creation on startup.
"""

import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse

if __package__ in (None, ""):
    sys.path.insert(0, os.path.dirname(__file__))
    from database.database import init_db
    from api.routes import router
else:
    from .database.database import init_db
    from .api.routes import router

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


@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
      <head><title>TrustNet AI Demo</title></head>
      <body>
        <h1>TrustNet AI Backend</h1>
        <p><a href='/health'>Health check</a></p>
        <p><a href='/api/v1/demo/analyze/healthy'>Run healthy demo</a></p>
        <p><a href='/api/v1/demo/analyze/collapsing'>Run collapsing demo</a></p>
        <p>After triggering demo, poll <code>/api/v1/jobs/&lt;job_id&gt;/status</code></p>
      </body>
    </html>
    """
