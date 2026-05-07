import os
from typing import List, Optional

from fastapi import UploadFile
from pypdf import PdfReader, PdfWriter

from app.utils.file_handler import create_temp_file, save_upload_files


async def run(files: List[UploadFile], options: Optional[dict] = None) -> str:
    paths: List[str] = []
    try:
        paths = await save_upload_files(files, allowed_exts=[".pdf"])
        out_path, out_id = create_temp_file(".pdf")

        reader = PdfReader(paths[0])
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        # Compatibility-focused rewrite. This is not a full PDF/A conformance workflow,
        # but produces a normalized output PDF until a strict PDF/A pipeline is introduced.
        writer.add_metadata({"/Producer": "TAJ PDF DOCS", "/Title": "PDF-A candidate"})
        with open(out_path, "wb") as fp:
            writer.write(fp)
        return out_id
    finally:
        for p in paths:
            try:
                os.remove(p)
            except Exception:
                pass
