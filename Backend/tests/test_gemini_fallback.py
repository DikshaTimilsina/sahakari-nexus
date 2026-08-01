import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from ai.ai_explanation import generate_explanation
from ai.llm_extractor import ExtractionUnavailable, structure


def test_explanation_uses_fallback_when_key_missing(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)

    explanation = generate_explanation("Demo Coop", 72, "watch", [{"severity": "high", "explanation": "Test flag"}])

    assert "warning signs" in explanation.lower() or "Test flag" in explanation
    assert "72/100" in explanation


def test_structure_requires_api_key_when_missing(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)

    try:
        structure("A long enough text with enough content to attempt extraction.")
    except ExtractionUnavailable:
        pass
    else:
        raise AssertionError("Expected ExtractionUnavailable when no API key is configured")
