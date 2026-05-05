import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BACKEND_TOOL_ALIASES: Record<string, string> = {
  "page-numbers": "add-page-numbers",
  "watermark": "add-watermark",
  "organize": "organize-pdf",
  "scan": "scan-to-pdf",
  "repair": "repair-pdf",
  "sign": "sign-pdf",
  "redact": "redact-pdf",
  "crop": "crop-pdf",
};

export async function POST(req: NextRequest, { params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params;
  const backendTool = BACKEND_TOOL_ALIASES[tool] ?? tool;
  const formData = await req.formData();
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (!base) {
    return NextResponse.json(
      { success: false, message: "Backend URL not configured (NEXT_PUBLIC_API_URL)" },
      { status: 500 }
    );
  }
  const url = `${base}/api/${backendTool}`;
  try {
    console.debug("Forwarding request to", url, "tool", tool, "backendTool", backendTool);
    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: apiKey ? { "X-API-Key": apiKey } : undefined,
    });
    const data = await res.json().catch(() => ({}));
    console.debug("Backend status", res.status, "response", data);
    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    console.error("Route error", e?.message || String(e));
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
