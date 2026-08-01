"""
AI Explanation Service.

Turns a risk score + flags into a plain-language narrative a non-finance
depositor can understand. Calls the Gemini API if GEMINI_API_KEY (or
GOOGLE_API_KEY) is set; otherwise falls back to a deterministic template so
the demo never breaks on a flaky connection or missing key mid-hackathon.
"""

import os

SYSTEM_PROMPT = (
    "You are explaining a cooperative financial-health risk score to an ordinary "
    "depositor with no finance background. Be direct, calm, and concrete. "
    "Reference the specific flags given. Keep it to 3-4 short sentences. "
    "Do not use jargon like 'related-party' without briefly explaining what it means "
    "in plain terms (e.g. 'money lent to board members' own families')."
)


def _build_user_prompt(cooperative_name: str, score: int, band: str, flags: list) -> str:
    flag_lines = "\n".join(f"- [{f['severity']}] {f['explanation']}" for f in flags) or "No flags raised."
    return (
        f"Cooperative: {cooperative_name}\n"
        f"Risk score: {score}/100 ({band})\n"
        f"Flags:\n{flag_lines}\n\n"
        f"Write the plain-language explanation now."
    )


def _fallback_explanation(cooperative_name: str, score: int, band: str, flags: list) -> str:
    if not flags:
        return (
            f"{cooperative_name} looks financially healthy right now (score {score}/100). "
            f"Deposits, withdrawals, and lending all follow normal, steady patterns with no "
            f"single group of people receiving an outsized share of loans."
        )
    lead = {
        "high_risk": "This cooperative shows serious warning signs.",
        "watch": "This cooperative shows some warning signs worth watching.",
        "healthy": "This cooperative looks broadly healthy, with a few things to keep an eye on.",
    }.get(band, "This cooperative has some flagged concerns.")

    top_flags = flags[:2]
    flag_text = " ".join(f["explanation"] for f in top_flags)
    return (
        f"{lead} {flag_text} A risk score of {score}/100 means we'd urge caution before "
        f"depositing new savings here until these issues are explained by the cooperative's board."
    )


def generate_explanation(cooperative_name: str, score: int, band: str, flags: list) -> str:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return _fallback_explanation(cooperative_name, score, band, flags)

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(
            f"{SYSTEM_PROMPT}\n\n{_build_user_prompt(cooperative_name, score, band, flags)}"
        )
        text = getattr(response, "text", None)
        return text.strip() or _fallback_explanation(cooperative_name, score, band, flags)
    except Exception:
        # Never let a network/API hiccup break the demo — fall back silently.
        return _fallback_explanation(cooperative_name, score, band, flags)


if __name__ == "__main__":
    sample_flags = [
        {"flag": "related_party_concentration", "severity": "critical",
         "explanation": "94.7% of all loan value has gone to related parties."},
        {"flag": "deposit_surge", "severity": "high",
         "explanation": "New deposits surged 3.39x above the historical rate in the last 60 days."},
    ]
    print(generate_explanation("Samunnat Bikash Sahakari Sanstha", 0, "high_risk", sample_flags))
