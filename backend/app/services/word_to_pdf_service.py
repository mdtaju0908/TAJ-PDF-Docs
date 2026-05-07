import os
import subprocess
import shutil
from typing import List, Optional
from fastapi import UploadFile, HTTPException
from app.core.config import settings
from app.utils.file_handler import save_upload_files


def _find_soffice() -> str:
    candidates = [
        os.getenv("LIBREOFFICE_PATH"),
        os.getenv("SOFFICE_PATH"),
        shutil.which("soffice"),
        "C:\\Program Files\\LibreOffice\\program\\soffice.exe",
        "C:\\Program Files (x86)\\LibreOffice\\program\\soffice.exe",
        "/usr/bin/soffice",
        "/usr/local/bin/soffice",
        "/snap/bin/libreoffice",
        "/usr/lib/libreoffice/program/soffice",
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
        if c and shutil.which(c):
            return c
    raise HTTPException(status_code=500, detail="LibreOffice 'soffice' executable not found. Please install LibreOffice and set LIBREOFFICE_PATH or ensure 'soffice' is on PATH.")


def word_to_pdf_lo(docx_path: str, timeout_seconds: int = 180) -> str:
    soffice = _find_soffice()
    outdir = settings.TMP_DIR
    cmd = [
        soffice,
        "--headless",
        "--norestore",
        "--invisible",
        "--convert-to",
        "pdf",
        docx_path,
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
        raise HTTPException(status_code=504, detail="LibreOffice conversion timed out")
    if proc.returncode != 0:
        err = (proc.stderr or proc.stdout or b"").decode(errors="ignore")
        raise HTTPException(status_code=500, detail=f"LibreOffice conversion failed: {err.strip()}")
    base = os.path.splitext(os.path.basename(docx_path))[0]
    out_name = f"{base}.pdf"
    out_path = os.path.join(outdir, out_name)
    if not os.path.exists(out_path):
        err = (proc.stderr or proc.stdout or b"").decode(errors="ignore")
        raise HTTPException(status_code=500, detail=f"Converted PDF not found. Details: {err.strip()}")
    try:
        os.remove(docx_path)
    except Exception:
        pass
    return out_name


async def run(files: List[UploadFile], options: Optional[dict] = None) -> str:
    paths: List[str] = []
    try:
        paths = await save_upload_files(files, allowed_exts=[".doc", ".docx"])
        return word_to_pdf_lo(paths[0])
    finally:
        for p in paths[1:]:
            try:
                os.remove(p)
            except Exception:
                pass
