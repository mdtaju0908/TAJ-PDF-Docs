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

        # Current minimal edit pipeline: normalize and rewrite PDF.
        # Rich object-level editing should be implemented in a dedicated editor workflow.
        reader = PdfReader(paths[0])
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)

        with open(out_path, "wb") as fp:
            writer.write(fp)
        return out_id
    finally:
        for p in paths:
            try:
                os.remove(p)
            except Exception:
                pass
