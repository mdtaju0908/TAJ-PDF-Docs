from fastapi import APIRouter, UploadFile, File, Depends, Form
from typing import List
import asyncio

from app.utils.file_handler import save_upload_files, resolve_download_path
from app.utils.response import success_response
from app.services.split_service import split_pdf
from app.models.schemas import SplitOptions
from app.core.config import settings
from app.utils.s3_client import upload_file as s3_upload_file, generate_signed_url as s3_signed_url, delete_local_file as s3_delete_local

router = APIRouter()


def _split_opts(ranges: str = Form("1-1")) -> SplitOptions:
    return SplitOptions(ranges=ranges)


@router.post("/split")
async def split(
    file: UploadFile = File(...),
    options: SplitOptions = Depends(_split_opts),
):
    paths = await save_upload_files([file], allowed_exts=[".pdf"])
    ids = await asyncio.to_thread(split_pdf, paths[0], options.ranges)
    first_id = ids[0] if ids else ""
    if settings.AWS_S3_BUCKET and first_id:
        file_path = resolve_download_path(first_id)
        try:
            file_id = s3_upload_file(file_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(file_path)
            return success_response("Conversion completed successfully", url, file_id)
        except Exception:
            url = f"/api/download/{first_id}"
            return success_response("Conversion completed successfully", url, first_id)
    else:
        url = f"/api/download/{first_id}" if first_id else ""
        return success_response("Conversion completed successfully", url, first_id)
