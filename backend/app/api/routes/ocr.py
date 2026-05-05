from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
import asyncio
from typing import List, Optional

from app.utils.file_handler import save_upload_files, resolve_download_path
from app.utils.response import success_response
from app.services.ocr_service import ocr_to_output
from app.models.schemas import OcrOptions
from app.core.config import settings
from app.utils.s3_client import upload_file as s3_upload_file, generate_signed_url as s3_signed_url, delete_local_file as s3_delete_local

router = APIRouter()


def _ocr_opts(
    language: str = Form("eng"),
    output_format: str = Form("searchable_pdf"),
) -> OcrOptions:
    return OcrOptions(language=language, output_format=output_format)


@router.post("/ocr")
async def ocr(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    options: OcrOptions = Depends(_ocr_opts),
):
    chosen: Optional[UploadFile] = file if file is not None else (files[0] if files else None)
    if chosen is None:
        raise HTTPException(status_code=400, detail="No file provided")
    paths = await save_upload_files([chosen], allowed_exts=[".pdf", ".jpg", ".jpeg", ".png", ".webp"])
    out_id = await asyncio.to_thread(ocr_to_output, paths[0], options)
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
