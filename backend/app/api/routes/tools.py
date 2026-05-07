from typing import List, Optional, Dict, Any
import json
import asyncio
import logging
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse

from app.utils.file_handler import save_upload_files, resolve_download_path
from app.utils.response import success_response
from app.services.merge_service import merge_pdfs
from app.services.split_service import split_pdf
from app.services.compress_service import compress_pdf
from app.services.convert_service import pdf_to_word, jpg_to_pdf, pdf_to_jpg_zip
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
from app.services.edit_service import rotate_pdf, add_page_numbers, add_watermark, protect_pdf, unlock_pdf
from app.services.ocr_service import ocr_to_output
from app.models.schemas import (
    SplitOptions,
    RotateOptions,
    PageNumberOptions,
    WatermarkOptions,
    ProtectOptions,
    UnlockOptions,
    CompressOptions,
    PdfToWordOptions,
    WordToPdfOptions,
    OcrOptions,
)

logger = logging.getLogger("smart-pdf-backend")

router = APIRouter()

ALLOWED_TOOLS = {
    "merge": [".pdf"],
    "split": [".pdf"],
    "compress": [".pdf"],
    "pdf-to-word": [".pdf"],
    "word-to-pdf": [".doc", ".docx"],
    "jpg-to-pdf": [".jpg", ".jpeg", ".png"],
    "pdf-to-jpg": [".pdf"],
    "rotate": [".pdf"],
    "add-page-numbers": [".pdf"],
    "add-watermark": [".pdf"],
    "protect": [".pdf"],
    "unlock": [".pdf"],
    "ocr": [".pdf", ".jpg", ".jpeg", ".png", ".webp"],
    "pdf-to-excel": [".pdf"],
    "pdf-to-ppt": [".pdf"],
    "ppt-to-pdf": [".ppt", ".pptx"],
    "edit": [".pdf"],
    "compare": [".pdf"],
    "pdf-a": [".pdf"],
    "excel-to-pdf": [".xlsx"],
    "html-to-pdf": [".html", ".htm"],
    "markdown-convert": [".md"],
    "markdown-to-pdf": [".md"],
    "markdown-to-doc": [".md"],
    "markdown-to-docx": [".md"],
    "organize-pdf": [".pdf"],
    "scan-to-pdf": [".jpg", ".jpeg", ".png"],
    "repair-pdf": [".pdf"],
    "sign-pdf": [".pdf"],
    "redact-pdf": [".pdf"],
    "crop-pdf": [".pdf"],
    "bg-remover": [".jpg", ".jpeg", ".png", ".webp"],
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

@router.get("/tools")
async def list_tools():
    return JSONResponse({"success": True, "tools": ALLOWED_TOOLS})


@router.post("/{tool}")
async def dynamic_tool(
    tool: str,
    request: Request,
    files: List[UploadFile] = File(...),
    options: Optional[str] = Form(None),
):
    if tool not in ALLOWED_TOOLS:
        return JSONResponse({"success": False, "message": "Tool not found", "code": "UNKNOWN_TOOL"}, status_code=200)
    allowed = ALLOWED_TOOLS[tool]
    logger.info(f"Tool={tool} files={[f.filename for f in files]}")
    try:
        opts: Dict[str, Any] = {}
        if options:
            try:
                opts = json.loads(options)
            except Exception:
                opts = {}
        else:
            try:
                form = await request.form()
                for k, v in form.items():
                    if k != "files":
                        opts[k] = v
            except Exception:
                opts = {}
        if tool in TOOL_MAP:
            out_id = await TOOL_MAP[tool](files, opts)
        else:
            paths = await save_upload_files(files, allowed_exts=allowed)
            if tool == "merge":
                out_id = await asyncio.to_thread(merge_pdfs, paths)
            elif tool == "split":
                ranges = str(opts.get("ranges", "1-1"))
                out_ids = await asyncio.to_thread(split_pdf, paths[0], ranges)
                out_id = out_ids[0] if out_ids else ""
            elif tool == "compress":
                quality = str(opts.get("quality", "screen"))
                out_id = await asyncio.to_thread(compress_pdf, paths[0], quality)
            elif tool == "pdf-to-word":
                out_id = await asyncio.to_thread(pdf_to_word, paths[0], PdfToWordOptions(**opts))
            elif tool == "jpg-to-pdf":
                out_id = await asyncio.to_thread(jpg_to_pdf, paths)
            elif tool == "pdf-to-jpg":
                out_id = await asyncio.to_thread(pdf_to_jpg_zip, paths[0])
            elif tool == "rotate":
                out_id = await asyncio.to_thread(rotate_pdf, paths[0], RotateOptions(**opts))
            elif tool == "add-page-numbers":
                out_id = await asyncio.to_thread(add_page_numbers, paths[0], PageNumberOptions(**opts))
            elif tool == "add-watermark":
                out_id = await asyncio.to_thread(add_watermark, paths[0], WatermarkOptions(**opts))
            elif tool == "protect":
                out_id = await asyncio.to_thread(protect_pdf, paths[0], ProtectOptions(**opts))
            elif tool == "unlock":
                out_id = await asyncio.to_thread(unlock_pdf, paths[0], UnlockOptions(**opts))
            elif tool == "ocr":
                out_id = await asyncio.to_thread(ocr_to_output, paths[0], OcrOptions(**opts))
            else:
                raise HTTPException(status_code=400, detail="Unsupported tool")
        logger.info(f"Tool={tool} result={out_id}")
        from app.core.config import settings
        from app.utils.s3_client import upload_file as s3_upload_file, generate_signed_url as s3_signed_url, delete_local_file as s3_delete_local
        if settings.AWS_S3_BUCKET and out_id:
            local_path = resolve_download_path(out_id)
            try:
                file_id = s3_upload_file(local_path)
                key = f"{settings.AWS_S3_PREFIX}{file_id}"
                url = s3_signed_url(key, expires_seconds=600)
                s3_delete_local(local_path)
                return JSONResponse({"success": True, "message": "Operation completed", "download_url": url})
            except Exception:
                return JSONResponse({"success": True, "message": "Operation completed", "download_url": f"/api/download/{out_id}"})
        else:
            return JSONResponse({"success": True, "message": "Operation completed", "download_url": f"/api/download/{out_id}"})
    except HTTPException as e:
        logger.error(f"Tool={tool} error={e.detail}")
        return JSONResponse({"success": False, "message": e.detail}, status_code=e.status_code)
    except Exception as e:
        logger.exception("Unhandled error")
        return JSONResponse({"success": False, "message": "Internal Server Error"}, status_code=500)
