import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function getBackendBase() {
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  const base = getBackendBase();
  if (!base) {
    return NextResponse.json(
      { success: false, message: "Backend URL not configured (NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const contentType = req.headers.get("content-type") ?? "";
  const targetUrl = `${base}/api/upload/${action}`;

  try {
    const isMultipart = contentType.includes("multipart/form-data");
    const body = isMultipart ? await req.formData() : await req.text();
    const res = await fetch(targetUrl, {
      method: "POST",
      body,
      headers: {
        ...(apiKey ? { "X-API-Key": apiKey } : {}),
        ...(isMultipart ? {} : { "Content-Type": contentType || "application/json" }),
      },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Upload proxy error" }, { status: 500 });
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  if (action !== "status") {
    return NextResponse.json({ success: false, message: "Unsupported action" }, { status: 400 });
  }

  const base = getBackendBase();
  if (!base) {
    return NextResponse.json(
      { success: false, message: "Backend URL not configured (NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const uploadId = _req.nextUrl.searchParams.get("upload_id");
  if (!uploadId) {
    return NextResponse.json({ success: false, message: "upload_id is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/upload/status/${encodeURIComponent(uploadId)}`, {
      method: "GET",
      headers: apiKey ? { "X-API-Key": apiKey } : undefined,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ success: false, message: "Upload proxy error" }, { status: 500 });
  }
}
