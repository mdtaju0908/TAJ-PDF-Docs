import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: { fileId: string } }) {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY ?? "";
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  
  if (!base) {
    return NextResponse.json(
      { success: false, message: "Backend URL not configured" },
      { status: 500 }
    );
  }

  const url = `${base}/api/download/${params.fileId}`;
  
  try {
    console.debug("Forwarding download request to", url);
    const res = await fetch(url, {
      method: "GET",
      headers: apiKey ? { "X-API-Key": apiKey } : undefined,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "File not found on backend" },
        { status: res.status }
      );
    }

    // Get the blob data
    const blob = await res.blob();
    
    // Create response with proper headers for file download
    const response = new NextResponse(blob);
    
    // Copy headers from backend response (especially content-type and content-disposition)
    const contentDisposition = res.headers.get("content-disposition");
    const contentType = res.headers.get("content-type");
    
    if (contentDisposition) response.headers.set("content-disposition", contentDisposition);
    if (contentType) response.headers.set("content-type", contentType);
    
    return response;
  } catch (e: any) {
    console.error("Download route error", e?.message || String(e));
    return NextResponse.json({ success: false, message: "Proxy error during download" }, { status: 500 });
  }
}
