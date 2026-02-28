"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { type PdfToolId, getToolDefinition } from "@/lib/tools";
import { UploadBox } from "@/components/UploadBox";
import { PremiumPreview } from "@/components/PremiumPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import { MergePanel } from "@/components/panels/MergePanel";
import { SplitPanel } from "@/components/panels/SplitPanel";
import { CompressPanel } from "@/components/panels/CompressPanel";
import { EditPanel } from "@/components/panels/EditPanel";
import { NumberingPanel } from "@/components/panels/NumberingPanel";
import { WatermarkPanel } from "@/components/panels/WatermarkPanel";
import { RotatePanel } from "@/components/panels/RotatePanel";
import { ProtectPanel } from "@/components/panels/ProtectPanel";
import { UnlockPanel } from "@/components/panels/UnlockPanel";
import { OCRPanel } from "@/components/panels/OCRPanel";
import { useAppStore } from "@/lib/store";

interface PdfToolTemplateProps {
  toolId: PdfToolId;
}

export function PdfToolTemplate({ toolId }: PdfToolTemplateProps) {
  const router = useRouter();
  const tool = getToolDefinition(toolId);
  const files = useAppStore(s => s.uploadedFiles);
  const setUploadedFiles = useAppStore(s => s.setUploadedFiles);
  const setProcessing = useAppStore(s => s.setProcessing);
  const processingState = useAppStore(s => s.processingState);
  const addRecentFile = useAppStore(s => s.addRecentFile);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pageSize, setPageSize] = useState<string>("A4 (297x210 mm)");
  const [margin, setMargin] = useState<"none" | "small" | "big">("small");
  const [mergeAll, setMergeAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptString = useMemo(() => {
    const parts: string[] = [];
    for (const [mime, exts] of Object.entries(tool.accept)) {
      parts.push(mime);
      parts.push(...exts);
    }
    return parts.join(",");
  }, [tool.accept]);

  function renderPanel() {
    if (!files.length) return null;
    switch (tool.panelType) {
      case "merge":
        return <MergePanel files={files} mergeAll={mergeAll} onMergeAllChange={setMergeAll} />;
      case "split":
        return <SplitPanel />;
      case "compress":
        return <CompressPanel />;
      case "edit":
        return <EditPanel />;
      case "numbering":
        return <NumberingPanel />;
      case "watermark":
        return <WatermarkPanel />;
      case "rotate":
        return <RotatePanel />;
      case "protect":
        return <ProtectPanel />;
      case "unlock":
        return <UnlockPanel />;
      case "ocr":
        return <OCRPanel />;
      default:
        return null;
    }
  }

  async function handleConvert() {
    if (!files.length) {
      toast.error("Select at least one file to continue.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("orientation", orientation);
    formData.append("pageSize", pageSize);
    formData.append("margin", margin);
    formData.append("mergeAll", String(mergeAll));

    setProcessing(true, 0);

    try {
      const { data } = await apiClient.post(`${toolId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const url: string | undefined = data?.download_url ?? data?.fileUrl ?? data?.url;
      setResultUrl(url && typeof url === "string" && url.length > 0 ? url : null);
      setUploadedFiles([]); // reset UI files after success
      setProcessing(false, 0); // ensure progress reset immediately
      toast.success(`${tool.title} completed successfully.`);
      files.forEach(f =>
        addRecentFile({
          name: f.name,
          size: f.size,
          type: f.type,
          processedAt: Date.now(),
          toolId
        })
      );
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message ?? `Unable to complete ${tool.title}.`;
      toast.error(message);
    } finally {
      setProcessing(false, 0);
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="mb-2 inline-flex w-max items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm transition hover:bg-slate-50"
      >
        <span>←</span>
        <span>Back to all tools</span>
      </button>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            {tool.title}
          </h1>
          <p className="max-w-xl text-sm text-slate-600 md:text-base">{tool.description}</p>
        </div>
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <UploadBox
              onFilesSelected={accepted => setUploadedFiles([...(files ?? []), ...accepted])}
              accept={tool.accept}
              multiple
              busy={processingState.isProcessing}
            />
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-2 gap-6 md:grid-cols-2">
                {files.map((file, index) => (
                  <PremiumPreview
                    key={`${file.name}-${index}`}
                    file={file}
                    extensionLabel={
                      tool.extensionLabel ?? ((file.name.split(".").pop() || "").toUpperCase() || "PDF")
                    }
                    iconBg={tool.iconBg ?? "bg-gray-100"}
                    iconColor={tool.iconColor ?? "text-gray-500"}
                  />
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={acceptString}
              multiple
              className="hidden"
              onChange={e => {
                const selected = Array.from(e.target.files ?? []);
                if (selected.length) {
                  setUploadedFiles([...(files ?? []), ...selected]);
                }
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={() => inputRef.current?.click()}
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-white"
              >
                Add more files
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {renderPanel()}
            <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm">
              {tool.allowOrientation && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-800">Page orientation</h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs",
                        orientation === "portrait"
                          ? "border-red-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600"
                      )}
                      onClick={() => setOrientation("portrait")}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs",
                        orientation === "landscape"
                          ? "border-red-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600"
                      )}
                      onClick={() => setOrientation("landscape")}
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              )}
              {tool.allowPageSize && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-medium text-slate-800">Page size</h4>
                  <select
                    className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200"
                    value={pageSize}
                    onChange={e => setPageSize(e.target.value)}
                  >
                    <option value="A4 (297x210 mm)">A4 (297x210 mm)</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
              )}
              {tool.allowMargin && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-medium text-slate-800">Margins</h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2",
                        margin === "none"
                          ? "border-red-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600"
                      )}
                      onClick={() => setMargin("none")}
                    >
                      No margin
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2",
                        margin === "small"
                          ? "border-red-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600"
                      )}
                      onClick={() => setMargin("small")}
                    >
                      Small
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2",
                        margin === "big"
                          ? "border-red-500 bg-rose-50 text-rose-700"
                          : "border-slate-200 text-slate-600"
                      )}
                      onClick={() => setMargin("big")}
                    >
                      Big
                    </button>
                  </div>
                </div>
              )}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleConvert}
                  disabled={processingState.isProcessing || files.length === 0}
                  className={cn(
                    "w-full rounded-xl px-6 py-3 text-sm font-medium text-white transition",
                    "bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90",
                    processingState.isProcessing && "opacity-70"
                  )}
                >
                  {processingState.isProcessing
                    ? "Processing..."
                    : `Convert to ${tool.outputType?.toUpperCase() ?? "PDF"}`}
                </button>
                {resultUrl && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!resultUrl) return;
                      try {
                        const res = await fetch(resultUrl, { method: "GET" });
                        if (!res.ok) throw new Error("Failed to fetch file");
                        const blob = await res.blob();
                        const cd = res.headers.get("content-disposition") || "";
                        const nameMatch =
                          /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/i.exec(cd);
                        const resolvedName =
                          (nameMatch?.[1] && decodeURIComponent(nameMatch[1])) ||
                          nameMatch?.[2] ||
                          (tool.outputType ? `result.${tool.outputType}` : "result");
                        const objectUrl = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = objectUrl;
                        link.setAttribute("download", resolvedName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(objectUrl);
                      } catch (e) {
                        toast.error("Unable to download file");
                      }
                    }}
                    className="mt-3 w-full rounded-xl bg-green-600 px-6 py-3 text-center text-sm font-medium text-white"
                  >
                    Download File
                  </button>
                )}
                <p className="mt-2 text-[11px] text-slate-500">
                  Files transfer over encrypted connections. Processed anonymously and auto-deleted after use — no login required.
                </p>
              </div>
            </div>
          </div>
        </div>
        <aside className="max-w-xl space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Why teams trust TAJ PDF Docs</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>End-to-end encrypted uploads</li>
                <li>No training needed, optimized for non-technical teams</li>
                <li>Designed for legal, finance and operations workflows</li>
                <li>Scales from individual contributors to global teams</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
