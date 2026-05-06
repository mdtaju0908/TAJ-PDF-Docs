import os
import subprocess
from typing import List, Optional

from fastapi import HTTPException, UploadFile

from app.core.config import settings
from app.services.word_to_pdf_service import _find_soffice
from app.utils.file_handler import save_upload_files


def _convert_with_libreoffice(input_path: str, timeout_seconds: int = 240) -> str:
    soffice = _find_soffice()
    outdir = settings.TMP_DIR
    cmd = [
        soffice,
        "--headless",
        "--norestore",
        "--invisible",
        "--convert-to",
        "pdf",
        input_path,
        "--outdir",
        outdir,
    ]
    try:
        proc = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=timeout_seconds,
            check=False,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="PowerPoint to PDF conversion timed out")

    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or b"").decode(errors="ignore")
        raise HTTPException(status_code=500, detail=f"PowerPoint to PDF conversion failed: {err.strip()}")

    base = os.path.splitext(os.path.basename(input_path))[0]
    out_name = f"{base}.pdf"
    out_path = os.path.join(outdir, out_name)
    if not os.path.exists(out_path):
        err = (proc.stderr or proc.stdout or b"").decode(errors="ignore")
        raise HTTPException(status_code=500, detail=f"Converted PDF not found. Details: {err.strip()}")
    return out_name


async def run(files: List[UploadFile], options: Optional[dict] = None) -> str:
    paths: List[str] = []
    try:
        paths = await save_upload_files(files, allowed_exts=[".ppt", ".pptx"])
        return _convert_with_libreoffice(paths[0])
    finally:
        for p in paths:
            try:
                os.remove(p)
            except Exception:
                pass
