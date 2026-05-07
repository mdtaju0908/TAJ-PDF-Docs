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
    MAX_UPLOAD_SIZE_MB: int = 50
    TMP_DIR: str = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "tmp",
    )
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")
    AWS_S3_PREFIX: str = os.getenv("AWS_S3_PREFIX", "processed/")
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_S3_ENDPOINT_URL: str = os.getenv("AWS_S3_ENDPOINT_URL", "")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    SMTP_USE_TLS: bool = os.getenv("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes", "on"}
    SMTP_FROM_EMAIL: str = os.getenv("SMTP_FROM_EMAIL", "")
    REPORT_ISSUE_TO: str = os.getenv("REPORT_ISSUE_TO", "24tec2csml175@vgu.ac.in")

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
    MAX_UPLOAD_SIZE_MB=int(os.getenv("MAX_UPLOAD_SIZE_MB", "50")),
    TMP_DIR=os.getenv(
        "TMP_DIR",
        os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "tmp",
        ),
    ),
    AWS_REGION=os.getenv("AWS_REGION", "us-east-1"),
    AWS_S3_BUCKET=os.getenv("AWS_S3_BUCKET", ""),
    AWS_S3_PREFIX=os.getenv("AWS_S3_PREFIX", "processed/"),
    AWS_ACCESS_KEY_ID=os.getenv("AWS_ACCESS_KEY_ID", ""),
    AWS_SECRET_ACCESS_KEY=os.getenv("AWS_SECRET_ACCESS_KEY", ""),
    AWS_S3_ENDPOINT_URL=os.getenv("AWS_S3_ENDPOINT_URL", ""),
    SMTP_HOST=os.getenv("SMTP_HOST", ""),
    SMTP_PORT=int(os.getenv("SMTP_PORT", "587")),
    SMTP_USER=os.getenv("SMTP_USER", ""),
    SMTP_PASSWORD=os.getenv("SMTP_PASSWORD", ""),
    SMTP_USE_TLS=os.getenv("SMTP_USE_TLS", "true").lower() in {"1", "true", "yes", "on"},
    SMTP_FROM_EMAIL=os.getenv("SMTP_FROM_EMAIL", ""),
    REPORT_ISSUE_TO=os.getenv("REPORT_ISSUE_TO", "24tec2csml175@vgu.ac.in"),
)

# Ensure temp directory exists
os.makedirs(settings.TMP_DIR, exist_ok=True)
