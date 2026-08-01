"""
Shared small helpers used across the backend. Kept deliberately tiny —
if a helper is only used by one service, it belongs in that service file,
not here. This is for genuinely cross-cutting utilities.
"""

import re
from datetime import datetime


def slugify(text: str) -> str:
    """'Samunnat Bikash Sahakari' -> 'samunnat-bikash-sahakari' — used for
    shareable public score-page URLs."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[\s_]+", "-", text)


def safe_parse_date(value: str, fallback: str = "") -> str:
    """Normalizes a date string to YYYY-MM-DD, or returns the fallback if
    it can't be parsed — used when validating LLM-extracted date fields,
    which won't always come back in a clean ISO format."""
    if not value:
        return fallback
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            continue
    return fallback


def format_currency_npr(amount: float) -> str:
    """1250000.5 -> 'Rs. 12,50,000.50' (Nepali lakh-style grouping, not the
    Western 1,250,000 grouping) — matters for a Nepal-facing product where
    this is the format users actually expect."""
    if amount is None:
        return "Rs. 0.00"
    negative = amount < 0
    amount = abs(amount)
    whole = int(amount)
    decimal = round(amount - whole, 2)
    whole_str = str(whole)

    if len(whole_str) <= 3:
        grouped = whole_str
    else:
        last_three = whole_str[-3:]
        remaining = whole_str[:-3]
        parts = []
        while len(remaining) > 2:
            parts.insert(0, remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            parts.insert(0, remaining)
        grouped = ",".join(parts) + "," + last_three

    sign = "-" if negative else ""
    return f"{sign}Rs. {grouped}.{int(decimal * 100):02d}"


if __name__ == "__main__":
    print(slugify("Samunnat Bikash Sahakari Sanstha"))
    print(safe_parse_date("31/07/2026"))
    print(safe_parse_date("garbage", fallback="unknown"))
    print(format_currency_npr(1250000.5))
    print(format_currency_npr(842.3))
