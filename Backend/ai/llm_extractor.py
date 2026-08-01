"""
LLM Extraction Service — turns raw OCR/PDF text into the same structured
dataset shape used everywhere else in the pipeline (members, deposits,
loans, relationships — matching data_generator.py's output), so the graph
builder and risk engine don't need to know whether the data came from a
real document or a synthetic scenario.

Requires GEMINI_API_KEY (or GOOGLE_API_KEY). Unlike ai_explanation.py
(which has a safe template fallback because "explain this score" degrades
gracefully to generic text), structured extraction has no honest fallback —
we can't fabricate a cooperative's actual members and loans from nothing.
When no key is set, this raises ExtractionUnavailable so the caller can
surface a clear error and point the user at the guaranteed-working demo
scenarios instead of silently returning fake-but-confident data.
"""

import os
import json
import re

SYSTEM_PROMPT = """You extract structured financial data from cooperative
ledger/audit documents. Read the raw text and return ONLY a JSON object
(no markdown fences, no commentary) with this exact shape:

{
  "name": "<cooperative name found in the document, or 'Unknown Cooperative'>",
  "members": [{"id": "<generate a short unique string>", "name": "...", "member_number": "...", "join_date": "YYYY-MM-DD or empty string", "role": "member|board|staff"}],
  "deposits": [{"id": "<generate>", "member_id": "<matching a members[].id>", "amount": <number>, "txn_date": "YYYY-MM-DD or empty string", "txn_type": "deposit|withdrawal"}],
  "loans": [{"id": "<generate>", "borrower_member_id": "<matching a members[].id>", "amount": <number>, "issue_date": "YYYY-MM-DD or empty string", "due_date": "YYYY-MM-DD or empty string", "status": "active|repaid|default", "related_party_flag": true|false}],
  "relationships": [{"id": "<generate>", "member_a": "<members[].id>", "member_b": "<members[].id>", "relationship_type": "family|business_partner|board_colleague"}],
  "extraction_confidence": <0-1 float, your own confidence that this is complete and accurate>,
  "extraction_notes": "<1-2 sentences on any ambiguity, missing fields, or guesses you made>"
}

If the document does not contain enough information for a field (e.g. no
loans table present), return an empty list for it rather than inventing
data. Do not fabricate members, amounts, or dates that are not evidenced in
the text — leave extraction_confidence low instead."""


class ExtractionUnavailable(Exception):
    """Raised when no Gemini API key is configured — there is no honest
    fallback for structured extraction, unlike the explanation service."""
    pass


class ExtractionFailed(Exception):
    """Raised when the LLM call succeeds but the response isn't valid JSON,
    or the API call itself errors out."""
    pass


def _strip_code_fences(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


def structure(raw_text: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        raise ExtractionUnavailable(
            "Structured extraction requires GEMINI_API_KEY (or GOOGLE_API_KEY). "
            "Use the healthy/collapsing demo scenarios instead, or set the key."
        )

    if not raw_text or len(raw_text.strip()) < 20:
        raise ExtractionFailed("OCR text is too short/empty to extract meaningful data from.")

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\nDocument text:\n\n{raw_text}\n\nReturn the JSON now."
        )
        raw_json = _strip_code_fences(getattr(response, "text", ""))
        parsed = json.loads(raw_json)
    except json.JSONDecodeError as e:
        raise ExtractionFailed(f"LLM did not return valid JSON: {e}")
    except Exception as e:
        raise ExtractionFailed(f"LLM extraction call failed: {e}")

    for required in ("members", "deposits", "loans", "relationships"):
        parsed.setdefault(required, [])
    parsed.setdefault("name", "Unknown Cooperative")
    parsed.setdefault("extraction_confidence", 0.5)
    parsed.setdefault("extraction_notes", "")

    # Reshape to match data_generator.py's dataset dict exactly, so downstream
    # graph_builder/risk_engine code needs zero branching on data source.
    return {
        "cooperative_id": parsed.get("cooperative_id", "extracted"),
        "name": parsed["name"],
        "scenario": "uploaded_document",
        "members": parsed["members"],
        "deposits": parsed["deposits"],
        "loans": parsed["loans"],
        "relationships": parsed["relationships"],
        "extraction_confidence": parsed["extraction_confidence"],
        "extraction_notes": parsed["extraction_notes"],
    }


if __name__ == "__main__":
    sample_text = (
        "Samunnat Bikash Sahakari Sanstha - Annual Ledger Summary\n"
        "Member: Suresh Thapa | Role: Board | Loan Amount: 472824.30 | Related Party: Yes\n"
        "Member: Sita Gurung | Role: Board | Loan Amount: 558899.82 | Related Party: Yes\n"
        "Total deposits 2024-2025: Rs. 6,112,842.23"
    )
    try:
        result = structure(sample_text)
        print(json.dumps(result, indent=2))
    except ExtractionUnavailable as e:
        print("ExtractionUnavailable (expected without an API key):", e)
