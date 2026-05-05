from email.message import EmailMessage
import smtplib

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.core.config import settings

router = APIRouter()


class IssueReportPayload(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    tool: str = Field(default="general", max_length=120)
    page_url: str = Field(default="", max_length=500)
    issue: str = Field(..., min_length=10, max_length=5000)
    user_agent: str = Field(default="", max_length=500)


@router.post("/report-issue")
async def report_issue(payload: IssueReportPayload):
    if not settings.SMTP_HOST or not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        raise HTTPException(status_code=503, detail="Issue reporting email is not configured")

    msg = EmailMessage()
    msg["Subject"] = f"[TAJ PDF Docs] Issue Report - {payload.tool}"
    msg["From"] = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
    msg["To"] = settings.REPORT_ISSUE_TO
    msg["Reply-To"] = payload.email
    msg.set_content(
        "\n".join(
            [
                "New issue report received:",
                f"Name: {payload.name}",
                f"Email: {payload.email}",
                f"Tool: {payload.tool}",
                f"Page URL: {payload.page_url or '-'}",
                f"User Agent: {payload.user_agent or '-'}",
                "",
                "Issue Details:",
                payload.issue.strip(),
            ]
        )
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.send_message(msg)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to send issue email: {exc}")

    return {"success": True, "message": "Issue submitted successfully"}
