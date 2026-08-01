# Sahakari Sentinel — Backend (Hackathon MVP)

Working end-to-end pipeline: synthetic cooperative data → graph construction →
rule-based fraud/risk scoring → AI plain-language explanation → JSON API.

## What's built and tested
- `data_generator.py` — generates two realistic scenarios: `healthy` and
  `collapsing` (with a deliberate related-party lending ring + deposit-surge
  Ponzi pattern, tuned to match reported real-world cooperative collapses).
- `graph_builder.py` — builds a NetworkX graph (members, loans, relationships)
  and serializes it to `{nodes, edges}` JSON for frontend force-graph rendering.
- `risk_engine.py` — computes financial ratios + Louvain community detection,
  produces a 0–100 score and a list of explainable flags. **No black-box ML** —
  every flag maps to a named, inspectable rule, so you can defend it under
  judge questioning.
- `ai_explanation.py` — calls Claude API for a plain-language narrative if
  `ANTHROPIC_API_KEY` is set; otherwise falls back to a deterministic template
  so the demo never breaks on a flaky connection.
- `main.py` — FastAPI app with the async job pattern (`POST analyze` → returns
  `job_id` immediately → poll `status` → fetch `result`), matching the
  architecture diagram.

**Verified**: healthy scenario scores 100/100 with 0 flags; collapsing
scenario scores 0/100 with all 5 flags firing, including a correctly detected
9-member related-party lending ring via Louvain clustering.

## Run it

```bash
pip install -r requirements.txt --break-system-packages
export ANTHROPIC_API_KEY=sk-...   # optional — falls back gracefully without it
uvicorn main:app --reload --port 8000
```

Test it:
```bash
curl -X POST http://localhost:8000/api/v1/demo/analyze/collapsing
# -> {"job_id": "...", "status": "pending"}

curl http://localhost:8000/api/v1/jobs/<job_id>/status
curl http://localhost:8000/api/v1/jobs/<job_id>/result
```

## API surface

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/demo/analyze/{scenario}` | scenario = `healthy` \| `collapsing`, returns `job_id` |
| GET | `/api/v1/jobs/{job_id}/status` | poll job status |
| GET | `/api/v1/jobs/{job_id}/result` | full result once `status == done` |
| GET | `/health` | health check |

## What's NOT built yet (your next steps, in priority order)

1. **Frontend** — Next.js dashboard calling this API. The `graph` field in the
   result is already shaped for `react-force-graph` (`{nodes: [...], edges: [...]}`
   with a `flagged: true/false` field per node for highlighting the fraud ring in red).
2. **Real OCR/PDF upload** — currently stubbed via scenario selection for
   100% demo reliability. When you're ready, replace the single line marked
   `# TODO` in `main.py`'s `run_pipeline()` with:
   - OCR (feed PDF/image bytes directly to Claude's vision input — simpler
     than wrangling Tesseract for a hackathon)
   - LLM structured extraction into the same `dataset` dict shape used by
     `data_generator.py` (members/deposits/loans/relationships) — reuse that
     shape as your extraction target schema.
   - Keep the synthetic scenarios as a `?demo=true` fallback path in your UI,
     so if live OCR misparses something during the actual demo, you can
     instantly fall back to a guaranteed-clean run.
3. **Postgres persistence** — right now jobs live in an in-memory dict, which
   is fine for a single demo session but won't survive a server restart.
   Add it only if you have time left after the frontend is solid — it doesn't
   change anything judges see live.
4. **RAG compliance chat** (stretch) — only attempt if 1–3 are solid with
   time to spare.

## Demo script cheat-sheet
1. Trigger `collapsing` scenario, narrate score dropping to 0 live.
2. Point at the 5 flags, read the related-party and board-withdrawal ones aloud.
3. Show the graph — the flagged cluster (9 nodes) should render visually
   distinct (red/highlighted) from the rest.
4. Immediately trigger `healthy` scenario for contrast — score 100, 0 flags,
   clean graph. This side-by-side is your strongest 30 seconds.
