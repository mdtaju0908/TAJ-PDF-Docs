import json
import os
from typing import List, Optional

from fastapi import HTTPException, UploadFile
from pypdf import PdfReader

from app.utils.file_handler import create_temp_file, save_upload_files


def _page_text(path: str, page_index: int) -> str:
    reader = PdfReader(path)
    if page_index >= len(reader.pages):
        return ""
    return (reader.pages[page_index].extract_text() or "").strip()


async def run(files: List[UploadFile], options: Optional[dict] = None) -> str:
    paths: List[str] = []
    try:
        paths = await save_upload_files(files, allowed_exts=[".pdf"])
        if len(paths) < 2:
            raise HTTPException(status_code=400, detail="Compare requires exactly two PDF files")

        left, right = paths[0], paths[1]
        left_reader = PdfReader(left)
        right_reader = PdfReader(right)
        total = min(len(left_reader.pages), len(right_reader.pages))
        changed_pages: List[int] = []

        for idx in range(total):
            if _page_text(left, idx) != _page_text(right, idx):
                changed_pages.append(idx + 1)

        report = {
            "left_pages": len(left_reader.pages),
            "right_pages": len(right_reader.pages),
            "same_page_count": len(left_reader.pages) == len(right_reader.pages),
            "changed_pages": changed_pages,
            "changed_page_count": len(changed_pages),
        }

        out_path, out_id = create_temp_file(".json")
        with open(out_path, "w", encoding="utf-8") as fp:
            json.dump(report, fp, indent=2)
        return out_id
    finally:
        for p in paths:
            try:
                os.remove(p)
            except Exception:
                pass
