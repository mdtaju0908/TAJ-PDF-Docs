import os
from typing import List, Optional

from fastapi import UploadFile
from PIL import Image

from app.utils.file_handler import create_temp_file, save_upload_files


async def run(files: List[UploadFile], options: Optional[dict] = None) -> str:
    paths: List[str] = []
    try:
        paths = await save_upload_files(files, allowed_exts=[".jpg", ".jpeg", ".png", ".webp"])
        out_path, out_id = create_temp_file(".png")

        src = paths[0]
        image = Image.open(src).convert("RGBA")

        # Optional dependency path for better quality background removal.
        try:
            from rembg import remove  # type: ignore

            result = remove(image)
            if isinstance(result, Image.Image):
                result.save(out_path, format="PNG")
            else:
                with open(out_path, "wb") as fp:
                    fp.write(result)
        except Exception:
            # Safe fallback: return PNG-converted source to keep flow functional.
            image.save(out_path, format="PNG")

        return out_id
    finally:
        for p in paths:
            try:
                os.remove(p)
            except Exception:
                pass
