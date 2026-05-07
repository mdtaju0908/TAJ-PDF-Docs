import asyncio
import json
import os
import shutil
import time
import uuid
from typing import Any, Dict, List

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from pypdf import PdfReader

from app.core.config import settings
from app.models.schemas import (
    CompressOptions,
    OcrOptions,
    PageNumberOptions,
    PdfToWordOptions,
    ProtectOptions,
    RotateOptions,
    SplitOptions,
    UnlockOptions,
    WatermarkOptions,
)
from app.services.compress_service import compress_pdf
from app.services.convert_service import jpg_to_pdf, pdf_to_jpg_zip, pdf_to_word
from app.services.edit_service import (
    add_page_numbers,
    add_watermark,
    protect_pdf,
    rotate_pdf,
    unlock_pdf,
)
from app.services.merge_service import merge_pdfs
from app.services.ocr_service import ocr_to_output
from app.services.split_service import split_pdf
from app.services.word_to_pdf_service import run as word_to_pdf_service
from app.services.pdf_to_ppt_service import run as pdf_to_ppt_service
from app.services.ppt_to_pdf_service import run as ppt_to_pdf_service
from app.services.pdf_to_excel_service import run as pdf_to_excel_service
from app.services.excel_to_pdf_service import run as excel_to_pdf_service
from app.services.html_to_pdf_service import run as html_to_pdf_service
from app.services.markdown_convert_service import run as markdown_convert_service
from app.services.markdown_convert_service import run_pdf as markdown_to_pdf_service
from app.services.markdown_convert_service import run_doc as markdown_to_doc_service
from app.services.markdown_convert_service import run_docx as markdown_to_docx_service
from app.services.organize_pdf_service import run as organize_pdf_service
from app.services.scan_to_pdf_service import run as scan_to_pdf_service
from app.services.repair_pdf_service import run as repair_pdf_service
from app.services.sign_pdf_service import run as sign_pdf_service
from app.services.redact_pdf_service import run as redact_pdf_service
from app.services.crop_pdf_service import run as crop_pdf_service
from app.services.compare_pdf_service import run as compare_pdf_service
from app.services.pdf_a_service import run as pdf_a_service
from app.services.edit_pdf_service import run as edit_pdf_service
from app.services.bg_remover_service import run as bg_remover_service
from app.utils.file_handler import TMP_DIR, secure_filename
from app.utils.response import success_response
from app.utils.s3_client import (
    delete_local_file as s3_delete_local,
    generate_signed_url as s3_signed_url,
    upload_file as s3_upload_file,
)

router = APIRouter()

CHUNK_UPLOAD_DIR = os.path.join(TMP_DIR, "chunk_uploads")
os.makedirs(CHUNK_UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".xlsx",
    ".html",
    ".htm",
    ".md",
}

TOOL_ALIASES = {
    "page-numbers": "add-page-numbers",
    "watermark": "add-watermark",
    "organize": "organize-pdf",
    "scan": "scan-to-pdf",
    "repair": "repair-pdf",
    "sign": "sign-pdf",
    "redact": "redact-pdf",
    "crop": "crop-pdf",
}

TOOL_MAP = {
    "edit": edit_pdf_service,
    "compare": compare_pdf_service,
    "pdf-a": pdf_a_service,
    "pdf-to-ppt": pdf_to_ppt_service,
    "ppt-to-pdf": ppt_to_pdf_service,
    "pdf-to-excel": pdf_to_excel_service,
    "excel-to-pdf": excel_to_pdf_service,
    "html-to-pdf": html_to_pdf_service,
    "markdown-convert": markdown_convert_service,
    "markdown-to-pdf": markdown_to_pdf_service,
    "markdown-to-doc": markdown_to_doc_service,
    "markdown-to-docx": markdown_to_docx_service,
    "organize-pdf": organize_pdf_service,
    "scan-to-pdf": scan_to_pdf_service,
    "repair-pdf": repair_pdf_service,
    "sign-pdf": sign_pdf_service,
    "redact-pdf": redact_pdf_service,
    "crop-pdf": crop_pdf_service,
    "word-to-pdf": word_to_pdf_service,
    "bg-remover": bg_remover_service,
}


class UploadInitPayload(BaseModel):
    file_name: str
    file_size: int
    mime_type: str = ""
    total_chunks: int


class UploadProcessPayload(BaseModel):
    tool: str
    upload_ids: List[str]
    options: Dict[str, Any] = {}


def _session_dir(upload_id: str) -> str:
    return os.path.join(CHUNK_UPLOAD_DIR, secure_filename(upload_id))


def _meta_path(upload_id: str) -> str:
    return os.path.join(_session_dir(upload_id), "meta.json")


def _read_meta(upload_id: str) -> Dict[str, Any]:
    path = _meta_path(upload_id)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Upload session not found")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _write_meta(upload_id: str, data: Dict[str, Any]) -> None:
    with open(_meta_path(upload_id), "w", encoding="utf-8") as f:
        json.dump(data, f)


def _chunk_path(upload_id: str, index: int) -> str:
    return os.path.join(_session_dir(upload_id), f"{index:06d}.part")


def _ensure_valid_file(name: str, size: int, total_chunks: int) -> None:
    ext = os.path.splitext(name)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext or 'unknown'}")
    if size <= 0:
        raise HTTPException(status_code=400, detail="File size must be greater than zero")
    if size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"Max allowed size is {settings.MAX_UPLOAD_SIZE_MB}MB")
    if total_chunks <= 0:
        raise HTTPException(status_code=400, detail="total_chunks must be greater than zero")


def _recompute_uploaded_size(upload_id: str, received_chunks: List[int]) -> int:
    total = 0
    for idx in received_chunks:
        cpath = _chunk_path(upload_id, idx)
        if os.path.exists(cpath):
            total += os.path.getsize(cpath)
    return total


def _cleanup_upload(upload_id: str) -> None:
    meta: Dict[str, Any] | None = None
    try:
        meta = _read_meta(upload_id)
    except Exception:
        pass
    if meta and meta.get("merged_file"):
        merged_file = meta["merged_file"]
        if os.path.exists(merged_file):
            try:
                os.remove(merged_file)
            except Exception:
                pass
    shutil.rmtree(_session_dir(upload_id), ignore_errors=True)


async def _run_tool_with_paths(tool: str, paths: List[str], options: Dict[str, Any]) -> str:
    if tool in TOOL_MAP:
        opened_files = []
        wrapped: List[UploadFile] = []
        try:
            for path in paths:
                f = open(path, "rb")
                opened_files.append(f)
                wrapped.append(UploadFile(filename=os.path.basename(path), file=f))
            return await TOOL_MAP[tool](wrapped, options)
        finally:
            for f in opened_files:
                try:
                    f.close()
                except Exception:
                    pass

    if tool == "merge":
        return await asyncio.to_thread(merge_pdfs, paths)
    if tool == "split":
        ranges = str(options.get("ranges", "1-1"))
        out_ids = await asyncio.to_thread(split_pdf, paths[0], SplitOptions(ranges=ranges).ranges)
        return out_ids[0] if out_ids else ""
    if tool == "compress":
        quality = str(options.get("quality", "screen"))
        return await asyncio.to_thread(compress_pdf, paths[0], CompressOptions(quality=quality).quality)
    if tool == "pdf-to-word":
        return await asyncio.to_thread(pdf_to_word, paths[0], PdfToWordOptions(**options))
    if tool == "jpg-to-pdf":
        return await asyncio.to_thread(jpg_to_pdf, paths)
    if tool == "pdf-to-jpg":
        return await asyncio.to_thread(pdf_to_jpg_zip, paths[0])
    if tool == "rotate":
        return await asyncio.to_thread(rotate_pdf, paths[0], RotateOptions(**options))
    if tool == "add-page-numbers":
        return await asyncio.to_thread(add_page_numbers, paths[0], PageNumberOptions(**options))
    if tool == "add-watermark":
        return await asyncio.to_thread(add_watermark, paths[0], WatermarkOptions(**options))
    if tool == "protect":
        return await asyncio.to_thread(protect_pdf, paths[0], ProtectOptions(**options))
    if tool == "unlock":
        return await asyncio.to_thread(unlock_pdf, paths[0], UnlockOptions(**options))
    if tool == "ocr":
        return await asyncio.to_thread(ocr_to_output, paths[0], OcrOptions(**options))

    raise HTTPException(status_code=400, detail="Unsupported tool")


def _success_download_response(out_id: str):
    if settings.AWS_S3_BUCKET and out_id:
        local_path = os.path.join(TMP_DIR, out_id)
        try:
            file_id = s3_upload_file(local_path)
            key = f"{settings.AWS_S3_PREFIX}{file_id}"
            url = s3_signed_url(key, expires_seconds=600)
            s3_delete_local(local_path)
            return success_response("Operation completed", url, file_id)
        except Exception:
            return success_response("Operation completed", f"/api/download/{out_id}", out_id)
    return success_response("Operation completed", f"/api/download/{out_id}", out_id)


@router.post("/upload/init")
async def upload_init(payload: UploadInitPayload):
    _ensure_valid_file(payload.file_name, payload.file_size, payload.total_chunks)
    upload_id = uuid.uuid4().hex
    session_dir = _session_dir(upload_id)
    os.makedirs(session_dir, exist_ok=True)
    meta = {
        "upload_id": upload_id,
        "file_name": secure_filename(payload.file_name),
        "mime_type": payload.mime_type,
        "file_size": payload.file_size,
        "total_chunks": payload.total_chunks,
        "received_chunks": [],
        "uploaded_size": 0,
        "status": "active",
        "created_at": int(time.time()),
        "merged_file": "",
    }
    _write_meta(upload_id, meta)
    return {"success": True, "upload_id": upload_id}


@router.post("/upload/chunk")
async def upload_chunk(
    upload_id: str = Form(...),
    chunk_index: int = Form(...),
    total_chunks: int = Form(...),
    chunk: UploadFile = File(...),
):
    safe_upload_id = secure_filename(upload_id)
    meta = _read_meta(safe_upload_id)
    if meta.get("status") != "active":
        raise HTTPException(status_code=400, detail="Upload session is not active")
    if total_chunks != meta["total_chunks"]:
        raise HTTPException(status_code=400, detail="Chunk count mismatch")
    if chunk_index < 0 or chunk_index >= meta["total_chunks"]:
        raise HTTPException(status_code=400, detail="Invalid chunk index")

    chunk_data = await chunk.read()
    if not chunk_data:
        raise HTTPException(status_code=400, detail="Chunk payload is empty")

    with open(_chunk_path(safe_upload_id, chunk_index), "wb") as f:
        f.write(chunk_data)

    received = set(meta.get("received_chunks", []))
    received.add(chunk_index)
    ordered = sorted(received)
    meta["received_chunks"] = ordered
    meta["uploaded_size"] = _recompute_uploaded_size(safe_upload_id, ordered)
    _write_meta(safe_upload_id, meta)

    return {
        "success": True,
        "upload_id": safe_upload_id,
        "received_chunks": len(ordered),
        "total_chunks": meta["total_chunks"],
        "progress": round((len(ordered) / max(meta["total_chunks"], 1)) * 100, 2),
    }


@router.get("/upload/status/{upload_id}")
async def upload_status(upload_id: str):
    safe_upload_id = secure_filename(upload_id)
    meta = _read_meta(safe_upload_id)
    received = len(meta.get("received_chunks", []))
    total = max(int(meta.get("total_chunks", 0)), 1)
    return {
        "success": True,
        "upload_id": safe_upload_id,
        "status": meta.get("status", "unknown"),
        "received_chunks": received,
        "total_chunks": total,
        "uploaded_size": int(meta.get("uploaded_size", 0)),
        "file_size": int(meta.get("file_size", 0)),
        "progress": round((received / total) * 100, 2),
    }


@router.post("/upload/complete")
async def upload_complete(upload_id: str = Form(...)):
    safe_upload_id = secure_filename(upload_id)
    meta = _read_meta(safe_upload_id)
    if meta.get("status") != "active":
        raise HTTPException(status_code=400, detail="Upload session is not active")

    total_chunks = int(meta["total_chunks"])
    missing = [idx for idx in range(total_chunks) if not os.path.exists(_chunk_path(safe_upload_id, idx))]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing chunks: {missing[:5]}")

    merged_name = f"{uuid.uuid4().hex}_{meta['file_name']}"
    merged_path = os.path.join(TMP_DIR, merged_name)
    with open(merged_path, "wb") as out:
        for idx in range(total_chunks):
            with open(_chunk_path(safe_upload_id, idx), "rb") as part:
                shutil.copyfileobj(part, out)

    merged_size = os.path.getsize(merged_path)
    if merged_size != int(meta["file_size"]):
        try:
            os.remove(merged_path)
        except Exception:
            pass
        raise HTTPException(status_code=400, detail="Merged file is corrupted (size mismatch)")

    ext = os.path.splitext(meta["file_name"])[1].lower()
    if ext == ".pdf":
        try:
            reader = PdfReader(merged_path)
            if len(reader.pages) == 0:
                raise HTTPException(status_code=400, detail="Corrupted PDF (no pages found)")
        except HTTPException:
            raise
        except Exception:
            try:
                os.remove(merged_path)
            except Exception:
                pass
            raise HTTPException(status_code=400, detail="Corrupted PDF file")

    meta["status"] = "completed"
    meta["merged_file"] = merged_path
    meta["uploaded_size"] = merged_size
    _write_meta(safe_upload_id, meta)

    # Chunks are no longer needed after merge.
    for idx in range(total_chunks):
        try:
            os.remove(_chunk_path(safe_upload_id, idx))
        except Exception:
            pass

    return {
        "success": True,
        "upload_id": safe_upload_id,
        "file_id": merged_name,
        "file_size": merged_size,
    }


@router.post("/upload/process")
async def upload_process(payload: UploadProcessPayload):
    if not payload.upload_ids:
        raise HTTPException(status_code=400, detail="upload_ids is required")

    normalized_tool = TOOL_ALIASES.get(payload.tool, payload.tool)
    paths: List[str] = []
    for upload_id in payload.upload_ids:
        safe_upload_id = secure_filename(upload_id)
        meta = _read_meta(safe_upload_id)
        if meta.get("status") != "completed" or not meta.get("merged_file"):
            raise HTTPException(status_code=400, detail=f"Upload not completed: {upload_id}")
        merged_path = meta["merged_file"]
        if not os.path.exists(merged_path):
            raise HTTPException(status_code=404, detail=f"Uploaded file missing: {upload_id}")
        paths.append(merged_path)

    out_id = await _run_tool_with_paths(normalized_tool, paths, payload.options or {})

    # Remove merged uploads once they are processed.
    for upload_id in payload.upload_ids:
        _cleanup_upload(upload_id)

    return _success_download_response(out_id)


@router.post("/upload/cancel")
async def upload_cancel(upload_id: str = Form(...)):
    safe_upload_id = secure_filename(upload_id)
    _cleanup_upload(safe_upload_id)
    return {"success": True, "upload_id": safe_upload_id, "status": "cancelled"}
