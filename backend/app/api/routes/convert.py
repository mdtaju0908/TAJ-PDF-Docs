from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from typing import List, Optional
import asyncio

from app.utils.file_handler import save_upload_files, resolve_download_path
from app.utils.response import success_response
from app.services.convert_service import pdf_to_word, jpg_to_pdf, pdf_to_jpg_zip
from app.services.pdf_to_ppt_service import run as pdf_to_ppt_service
from app.services.word_to_pdf_service import word_to_pdf_lo
from app.utils.s3_client import upload_file as s3_upload_file, generate_signed_url as s3_signed_url, delete_local_file as s3_delete_local
from app.models.schemas import PdfToWordOptions, WordToPdfOptions
from app.core.config import settings

router = APIRouter()


def _pdf_to_word_opts(include_page_breaks: bool = Form(True)) -> PdfToWordOptions:
    return PdfToWordOptions(include_page_breaks=include_page_breaks)


@router.post("/pdf-to-word")
async def pdf_to_word_endpoint(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    options: PdfToWordOptions = Depends(_pdf_to_word_opts),
):
    # Converts PDF to DOCX
    chosen: Optional[UploadFile] = file if file is not None else (files[0] if files else None)
    if chosen is None:
        raise HTTPException(status_code=400, detail="No file provided")
    paths = await save_upload_files([chosen], allowed_exts=[".pdf"])
    out_id = await asyncio.to_thread(pdf_to_word, paths[0], options)
    if settings.AWS_S3_BUCKET:
        file_path = resolve_download_path(out_id)
        try:
            file_id = s3_upload_file(file_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(file_path)
            return success_response("Conversion completed successfully", url, file_id)
        except Exception:
            url = f"/api/download/{out_id}"
            return success_response("Conversion completed successfully", url, out_id)
    else:
        url = f"/api/download/{out_id}"
        return success_response("Conversion completed successfully", url, out_id)


def _word_to_pdf_opts(
    font_name: str = Form("Helvetica"),
    font_size: int = Form(12),
    line_height: float = Form(1.2),
) -> WordToPdfOptions:
    return WordToPdfOptions(font_name=font_name, font_size=font_size, line_height=line_height)


@router.post("/word-to-pdf")
async def word_to_pdf_endpoint(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    options: WordToPdfOptions = Depends(_word_to_pdf_opts),
):
    # Converts DOCX to PDF
    chosen: Optional[UploadFile] = file if file is not None else (files[0] if files else None)
    if chosen is None:
        raise HTTPException(status_code=400, detail="No file provided")
    paths = await save_upload_files([chosen], allowed_exts=[".docx"])
    out_id = await asyncio.to_thread(word_to_pdf_lo, paths[0])
    if settings.AWS_S3_BUCKET:
        file_path = resolve_download_path(out_id)
        try:
            file_id = s3_upload_file(file_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(file_path)
            return success_response("Conversion completed successfully", url, file_id)
        except Exception:
            url = f"/api/download/{out_id}"
            return success_response("Conversion completed successfully", url, out_id)
    else:
        url = f"/api/download/{out_id}"
        return success_response("Conversion completed successfully", url, out_id)


@router.post("/jpg-to-pdf")
async def jpg_to_pdf_endpoint(files: List[UploadFile] = File(...)):
    # Converts one or more images to a single PDF
    paths = await save_upload_files(files, allowed_exts=[".jpg", ".jpeg", ".png"])
    file_id = await asyncio.to_thread(jpg_to_pdf, paths)
    return success_response("PDF generated from images", f"/api/download/{file_id}")


@router.post("/pdf-to-jpg")
async def pdf_to_jpg_endpoint(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
):
    # Converts all PDF pages to JPG and returns a ZIP download URL
    chosen: Optional[UploadFile] = file if file is not None else (files[0] if files else None)
    if chosen is None:
        raise HTTPException(status_code=400, detail="No file provided")
    paths = await save_upload_files([chosen], allowed_exts=[".pdf"])
    out_id = await asyncio.to_thread(pdf_to_jpg_zip, paths[0])
    if settings.AWS_S3_BUCKET and out_id:
        file_path = resolve_download_path(out_id)
        try:
            file_id = s3_upload_file(file_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(file_path)
            return success_response("Conversion completed successfully", url, file_id)
        except Exception:
            url = f"/api/download/{out_id}"
            return success_response("Conversion completed successfully", url, out_id)
    else:
        url = f"/api/download/{out_id}" if out_id else ""
        return success_response("Conversion completed successfully", url, out_id)


@router.post("/pdf-to-ppt")
async def pdf_to_ppt_endpoint(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
):
    chosen: Optional[UploadFile] = file if file is not None else (files[0] if files else None)
    if chosen is None:
        raise HTTPException(status_code=400, detail="No file provided")
    out_id = await pdf_to_ppt_service([chosen], {})
    if settings.AWS_S3_BUCKET:
        file_path = resolve_download_path(out_id)
        try:
            file_id = s3_upload_file(file_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(file_path)
            return success_response("Conversion completed successfully", url, file_id)
        except Exception:
            url = f"/api/download/{out_id}"
            return success_response("Conversion completed successfully", url, out_id)
    else:
        url = f"/api/download/{out_id}"
        return success_response("Conversion completed successfully", url, out_id)
