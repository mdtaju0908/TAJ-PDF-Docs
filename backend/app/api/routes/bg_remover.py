from fastapi import APIRouter, UploadFile, File
from typing import List

from app.utils.response import success_response
from app.services.bg_remover_service import run as bg_remover_service

router = APIRouter()

@router.post("/bg-remover")
async def bg_remover(
    files: List[UploadFile] = File(...)
):
    file_id = await bg_remover_service(files, {})
    return success_response(
        "Background removed successfully",
        f"/api/download/{file_id}",
        file_id
    )
