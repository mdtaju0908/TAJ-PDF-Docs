import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!base) {
    return NextResponse.json(
      { success: false, message: "Backend URL not configured (NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }

  try {
    const payload = await req.json();
    const res = await fetch(`${base}/api/report-issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { "X-API-Key": apiKey } : {}),
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Proxy error while reporting issue" },
      { status: 500 }
    );
  }
}
