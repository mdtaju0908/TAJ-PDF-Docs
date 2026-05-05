from typing import List, Optional
from pydantic import BaseModel, Field


class SplitOptions(BaseModel):
    ranges: str = Field("1-1", description="Page ranges to split, e.g., 1-3,5,7-9")


class RotateOptions(BaseModel):
    degrees: int = Field(..., description="Rotation degrees (90, 180, 270)")


class PageNumberOptions(BaseModel):
    position: str = Field("bottom-right", description="Position for page numbers")
    start: int = Field(1, description="Starting page number")
    font_size: int = Field(12, description="Font size")


class WatermarkOptions(BaseModel):
    text: str = Field(..., description="Watermark text")
    opacity: float = Field(0.2, description="Watermark opacity 0.0-1.0")
    font_size: int = Field(36, description="Font size")


class ProtectOptions(BaseModel):
    owner_password: Optional[str] = Field(None, description="Owner password")
    user_password: str = Field(..., description="User password")


class UnlockOptions(BaseModel):
    password: str = Field(..., description="Password to unlock the PDF")


class CompressOptions(BaseModel):
    quality: str = Field("screen", description="Ghostscript preset: screen, ebook, printer, prepress")


class PdfToWordOptions(BaseModel):
    # Placeholder for future options; currently plain export
    include_page_breaks: bool = True


class WordToPdfOptions(BaseModel):
    font_name: str = Field("Helvetica", description="Font for rendering DOCX text to PDF")
    font_size: int = Field(12, description="Font size")
    line_height: float = Field(1.2, description="Line height multiplier")


class OcrOptions(BaseModel):
    language: str = Field("eng", description="Tesseract language code")
    output_format: str = Field("searchable_pdf", description="OCR output format: searchable_pdf or txt")

