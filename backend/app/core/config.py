import os
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env from project root if present
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))


class Settings(BaseModel):
    # Application settings loaded from environment with defaults
    API_KEYS: List[str] = []
    ALLOWED_ORIGINS: List[str] = ["https://taj-pdf-docs.vercel.app"]
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60
    TMP_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "backend",
        "tmp",
    )
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")
    AWS_S3_PREFIX: str = os.getenv("AWS_S3_PREFIX", "processed/")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_S3_ENDPOINT_URL: str = os.getenv("AWS_S3_ENDPOINT_URL", "")

    class Config:
        arbitrary_types_allowed = True


def _get_env_list(key: str, default: List[str]) -> List[str]:
    # Helper to parse comma-separated environment variables into list
    value = os.getenv(key, "")
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


settings = Settings(
    API_KEYS=_get_env_list("API_KEYS", []),
    ALLOWED_ORIGINS=_get_env_list("ALLOWED_ORIGINS", ["https://taj-pdf-docs.vercel.app"]),
    RATE_LIMIT_REQUESTS_PER_MINUTE=int(os.getenv("RATE_LIMIT_REQUESTS_PER_MINUTE", "60")),
    TMP_DIR=os.getenv(
        "TMP_DIR",
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "backend",
            "tmp",
        ),
    ),
    AWS_REGION=os.getenv("AWS_REGION", "us-east-1"),
    AWS_S3_BUCKET=os.getenv("AWS_S3_BUCKET", ""),
    AWS_S3_PREFIX=os.getenv("AWS_S3_PREFIX", "processed/"),
    AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID", ""),
    AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY", ""),
    AWS_S3_ENDPOINT_URL=os.getenv("AWS_S3_ENDPOINT_URL", ""),
)

# Ensure temp directory exists
os.makedirs(settings.TMP_DIR, exist_ok=True)
