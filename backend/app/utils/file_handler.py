import os
import uuid
import re
from typing import List, Tuple
from fastapi import UploadFile, HTTPException, BackgroundTasks

from app.core.config import settings

# Temp directory for storing operation results
TMP_DIR = settings.TMP_DIR
CHUNK_SIZE = 1024 * 1024  # 1 MB


def secure_filename(filename: str) -> str:
    # Sanitizes filename to prevent path traversal and remove special characters
    name = os.path.basename(filename)
    name = re.sub(r"[^A-Za-z0-9_.-]", "_", name)
    return name


async def save_upload_files(
    files: List[UploadFile], allowed_exts: List[str]
) -> List[str]:
    # Saves uploaded files to temp directory after validating extension
    saved_paths: List[str] = []
    max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    for f in files:
        if f.filename is None:
            raise HTTPException(status_code=400, detail="File must have a filename")
        ext = os.path.splitext(f.filename)[1].lower()
        if allowed_exts and ext not in allowed_exts:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {ext}")
        fid = uuid.uuid4().hex
        safe_name = secure_filename(f.filename)
        dest_name = f"{fid}_{safe_name}"
        dest_path = os.path.join(TMP_DIR, dest_name)
        total_bytes = 0
        with open(dest_path, "wb") as out:
            while True:
                chunk = await f.read(CHUNK_SIZE)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > max_size_bytes:
                    os.remove(dest_path)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File too large. Max allowed size is {settings.MAX_UPLOAD_SIZE_MB}MB",
                    )
                out.write(chunk)
        await f.seek(0)
        saved_paths.append(dest_path)
    return saved_paths


def create_temp_file(suffix: str) -> Tuple[str, str]:
    # Creates a random temp filename and returns (path, file_id)
    fid = uuid.uuid4().hex
    dest_name = f"{fid}{suffix}"
    dest_path = os.path.join(TMP_DIR, dest_name)
    return dest_path, dest_name


def schedule_delete_file(background_tasks: BackgroundTasks, path: str):
    # Schedules file deletion after response is sent
    background_tasks.add_task(_delete_file_safely, path)


def _delete_file_safely(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


def resolve_download_path(file_id: str) -> str:
    # Resolves a file id to absolute path in temp directory
    safe_id = secure_filename(file_id)
    return os.path.join(TMP_DIR, safe_id)

