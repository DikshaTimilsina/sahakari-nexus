"""
OCR Service — extracts raw text from an uploaded cooperative ledger/audit
document, whether it's a digital (text-layer) PDF or a scanned image/PDF.

Strategy (fastest + most reliable first):
  1. Try direct text extraction via pypdf. Digital PDFs (exported from Excel,
     Word, or accounting software) yield clean, high-confidence text instantly
     with zero OCR error — most real cooperative ledgers if born-digital will
     hit this path.
  2. If a page has little/no extractable text (i.e. it's a scanned image),
     rasterize that page and run Tesseract OCR on it.
  3. Track a rough confidence signal per page so the frontend/LLM extractor
     can flag low-confidence extractions for human review instead of silently
     trusting garbled OCR output.

This never raises for a missing dependency at import time — if pdf2image/
Tesseract aren't installed in some environment, scanned-page OCR degrades
gracefully to an explicit "needs_manual_review" result rather than crashing
the whole pipeline.
"""

from dataclasses import dataclass, field
from typing import Optional

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import pytesseract
    from pdf2image import convert_from_path
    from PIL import Image
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False


MIN_CHARS_FOR_DIGITAL_TEXT = 40  # below this, treat the page as "scanned, no text layer"


@dataclass
class OCRResult:
    raw_text: str
    confidence: float  # 0-1, heuristic
    method: str  # 'digital_text' | 'tesseract' | 'mixed' | 'failed'
    pages: int = 0
    needs_manual_review: bool = False
    warnings: list = field(default_factory=list)


def _extract_digital_pdf_text(file_path: str) -> tuple[str, int, list]:
    reader = PdfReader(file_path)
    page_texts = []
    for page in reader.pages:
        page_texts.append(page.extract_text() or "")
    return "\n\n".join(page_texts), len(reader.pages), page_texts


def _ocr_scanned_pages(file_path: str, page_texts: list) -> tuple[str, list]:
    """Run Tesseract only on pages that didn't yield real digital text."""
    warnings = []
    if not OCR_AVAILABLE:
        warnings.append("OCR fallback unavailable in this environment (pytesseract/poppler missing).")
        return "", warnings

    images = convert_from_path(file_path)
    ocr_texts = []
    for i, (page_text, image) in enumerate(zip(page_texts, images)):
        if len(page_text.strip()) >= MIN_CHARS_FOR_DIGITAL_TEXT:
            ocr_texts.append(page_text)  # already good, keep the digital text
            continue
        try:
            ocr_text = pytesseract.image_to_string(image)
            ocr_texts.append(ocr_text)
        except Exception as e:
            warnings.append(f"Tesseract failed on page {i + 1}: {e}")
            ocr_texts.append("")
    return "\n\n".join(ocr_texts), warnings


def _estimate_image_confidence(image) -> float:
    """Cheap heuristic in lieu of per-word Tesseract confidence scores:
    higher resolution scans tend to OCR more reliably."""
    width, height = image.size
    if width * height > 2_000_000:
        return 0.85
    if width * height > 800_000:
        return 0.7
    return 0.5


def extract_text(file_path: str) -> OCRResult:
    if PdfReader is None:
        return OCRResult(raw_text="", confidence=0.0, method="failed",
                          needs_manual_review=True,
                          warnings=["pypdf not installed — cannot read PDF."])

    try:
        digital_text, n_pages, page_texts = _extract_digital_pdf_text(file_path)
    except Exception as e:
        return OCRResult(raw_text="", confidence=0.0, method="failed",
                          needs_manual_review=True, warnings=[f"Failed to open PDF: {e}"])

    total_chars = sum(len(t.strip()) for t in page_texts)
    avg_chars_per_page = total_chars / max(n_pages, 1)

    if avg_chars_per_page >= MIN_CHARS_FOR_DIGITAL_TEXT:
        # Fully born-digital document — best case, no OCR needed at all.
        return OCRResult(raw_text=digital_text, confidence=0.97, method="digital_text",
                          pages=n_pages, needs_manual_review=False)

    # Some or all pages are scanned images — fall back to Tesseract per-page.
    combined_text, warnings = _ocr_scanned_pages(file_path, page_texts)
    scanned_page_count = sum(1 for t in page_texts if len(t.strip()) < MIN_CHARS_FOR_DIGITAL_TEXT)
    method = "mixed" if scanned_page_count < n_pages else "tesseract"

    # Tesseract text is inherently lower-confidence than a digital text layer;
    # flag for human review if a meaningful share of the document was scanned.
    confidence = 0.6 if scanned_page_count > 0 else 0.97
    needs_review = scanned_page_count > 0 and (scanned_page_count / max(n_pages, 1)) > 0.3

    return OCRResult(
        raw_text=combined_text or digital_text,
        confidence=confidence,
        method=method,
        pages=n_pages,
        needs_manual_review=needs_review,
        warnings=warnings,
    )


if __name__ == "__main__":
    print("OCR dependencies available:", OCR_AVAILABLE)
    print("pypdf available:", PdfReader is not None)
