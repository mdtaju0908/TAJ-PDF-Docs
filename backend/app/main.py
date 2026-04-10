# FastAPI application entry point with CORS, routing, and health check
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.responses import FileResponse
from starlette.requests import Request
from fastapi.exceptions import RequestValidationError
import os
import uvicorn
import logging

from app.core.config import settings
from app.core.security import get_rate_limiter
from app.api.deps import verify_api_key
from app.utils.file_handler import TMP_DIR, resolve_download_path, schedule_delete_file

# Routers
from app.api.routes.merge import router as merge_router
from app.api.routes.split import router as split_router
from app.api.routes.compress import router as compress_router
from app.api.routes.convert import router as convert_router
from app.api.routes.edit import router as edit_router
from app.api.routes.ocr import router as ocr_router
from app.api.routes.tools import router as tools_router
from app.api.routes.bg_remover import router as bg_remover_router

app = FastAPI(
    title="Smart PDF Tools Backend",
    version="1.0.0",
    description="Production-ready FastAPI backend for PDF operations with async support.",
)

# Basic logging configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("smart-pdf-backend")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with security and rate limiting dependencies
app.include_router(
    merge_router, prefix="/api", tags=["merge"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    split_router, prefix="/api", tags=["split"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    compress_router, prefix="/api", tags=["compress"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    convert_router, prefix="/api", tags=["convert"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    edit_router, prefix="/api", tags=["edit"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    ocr_router, prefix="/api", tags=["ocr"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    tools_router, prefix="/api", tags=["tools"], dependencies=[verify_api_key, get_rate_limiter()]
)
app.include_router(
    bg_remover_router, prefix="/api", tags=["bg-remover"], dependencies=[verify_api_key, get_rate_limiter()]
)


@app.get("/", tags=["system"])
async def root() -> JSONResponse:
    return JSONResponse({
        "message": "TAJ PDF Docs API is running",
        "status": "online",
        "documentation": "/docs"
    })

@app.get("/health", tags=["system"])
async def health() -> JSONResponse:
    # Simple health check endpoint
    return JSONResponse({"status": "ok"})

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTPException path={request.url.path} status={exc.status_code} detail={exc.detail}")
    return JSONResponse({"success": False, "message": exc.detail}, status_code=exc.status_code)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"ValidationError path={request.url.path} errors={exc.errors()}")
    return JSONResponse({"success": False, "message": "Invalid request"}, status_code=422)

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled path={request.url.path}")
    return JSONResponse({"success": False, "message": "Internal Server Error"}, status_code=500)

@app.get("/api/download/{file_id}", tags=["download"])
async def download_file(file_id: str, background_tasks: BackgroundTasks, request: Request):
    # Streams a file from the temp directory and deletes it afterwards
    file_path = resolve_download_path(file_id)
    if not os.path.exists(file_path):
        return JSONResponse({"success": False, "message": "File not found"}, status_code=404)
    schedule_delete_file(background_tasks, file_path)
    return FileResponse(file_path, filename=file_id, media_type="application/octet-stream")


if __name__ == "__main__":
    # Local development runner
    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.getenv("PORT", "8000")), reload=True)
