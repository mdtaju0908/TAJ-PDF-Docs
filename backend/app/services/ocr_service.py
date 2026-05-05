import io
import os
from pdf2image import convert_from_path
import pytesseract
from pypdf import PdfReader, PdfWriter
from PIL import Image

from app.models.schemas import OcrOptions
from app.utils.file_handler import create_temp_file


LANG_ALIASES = {
    "en": "eng",
    "hi": "hin",
    "es": "spa",
    "fr": "fra",
    "de": "deu",
}


def _normalize_lang(language: str) -> str:
    value = (language or "eng").strip().lower()
    return LANG_ALIASES.get(value, value)


def _ocr_images_to_searchable_pdf(images: list[Image.Image], language: str) -> str:
    writer = PdfWriter()
    for img in images:
        pdf_bytes = pytesseract.image_to_pdf_or_hocr(img, extension="pdf", lang=language)
        reader = PdfReader(io.BytesIO(pdf_bytes))
        writer.add_page(reader.pages[0])
    out_path, out_id = create_temp_file(".pdf")
    with open(out_path, "wb") as f:
        writer.write(f)
    return out_id


def _ocr_images_to_text(images: list[Image.Image], language: str) -> str:
    extracted: list[str] = []
    for idx, img in enumerate(images, start=1):
        text = pytesseract.image_to_string(img, lang=language)
        extracted.append(f"--- Page {idx} ---\n{text.strip()}\n")
    out_path, out_id = create_temp_file(".txt")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(extracted).strip() + "\n")
    return out_id


def ocr_to_output(input_path: str, opts: OcrOptions) -> str:
    # OCR for both PDF and image files with selectable output format.
    ext = os.path.splitext(input_path)[1].lower()
    language = _normalize_lang(opts.language)
    output_format = (opts.output_format or "searchable_pdf").strip().lower()

    if ext == ".pdf":
        images = convert_from_path(input_path)
    else:
        images = [Image.open(input_path).convert("RGB")]

    if output_format == "txt":
        return _ocr_images_to_text(images, language)

    return _ocr_images_to_searchable_pdf(images, language)

