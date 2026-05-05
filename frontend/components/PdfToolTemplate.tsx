"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOL_DEFINITIONS, type PdfToolId, getToolDefinition } from "@/lib/tools";
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

const panelToolPaths: Array<{ label: string; href: string }> = [
  { label: "Page Numbers", href: "/tools/page-numbers" },
  { label: "Watermark", href: "/tools/watermark" },
  { label: "Rotate", href: "/tools/rotate" },
  { label: "Protect", href: "/tools/protect" },
  { label: "Unlock", href: "/tools/unlock" },
  { label: "OCR", href: "/tools/ocr" }
];

export function PdfToolTemplate({ toolId }: PdfToolTemplateProps) {
  const router = useRouter();
  const tool = getToolDefinition(toolId);
  const files = useAppStore(s => s.uploadedFiles);
  const setUploadedFiles = useAppStore(s => s.setUploadedFiles);
  const setProcessing = useAppStore(s => s.setProcessing);
  const processingState = useAppStore(s => s.processingState);
  const hasFiles = files.length > 0;
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const hasResult = Boolean(resultUrl);
  const showActionPanel = hasFiles || hasResult;
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pageSize, setPageSize] = useState<string>("A4 (297x210 mm)");
  const [margin, setMargin] = useState<"none" | "small" | "big">("small");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
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

  const sourceFormatLabel = useMemo(() => {
    const firstExt = Object.values(tool.accept).flat()[0];
    if (!firstExt) return "FILE";
    return firstExt.replace(".", "").toUpperCase();
  }, [tool.accept]);

  const targetFromTitle = useMemo(() => {
    const lowerTitle = tool.title.toLowerCase();
    if (!lowerTitle.includes(" to ")) return null;
    const rawTarget = tool.title.split(/to/i)[1]?.trim() ?? "";
    const normalized = rawTarget.toLowerCase();
    if (!rawTarget) return null;
    if (normalized.includes("pdf/a")) return "PDF/A";
    if (normalized.includes("pdf")) return "PDF";
    if (normalized.includes("powerpoint")) return "PPTX";
    if (normalized.includes("word")) return "DOCX";
    if (normalized.includes("excel")) return "XLSX";
    if (normalized.includes("jpg") || normalized.includes("jpeg")) return "JPG";
    if (normalized.includes("png")) return "PNG";
    return rawTarget.toUpperCase();
  }, [tool.title]);

  const targetFormatLabel = useMemo(() => {
    if (tool.outputType) return tool.outputType.toUpperCase();
    if (targetFromTitle) return targetFromTitle;
    if (tool.title.toLowerCase().includes(" to ") && tool.title.toLowerCase().includes("pdf")) return "PDF";
    if (tool.extensionLabel && tool.title.toLowerCase().startsWith("pdf to")) {
      return tool.extensionLabel.toUpperCase();
    }
    return "PDF";
  }, [targetFromTitle, tool.extensionLabel, tool.outputType, tool.title]);

  const sourcePrompt = useMemo(() => {
    return sourceFormatLabel === "FILE" ? "file" : sourceFormatLabel;
  }, [sourceFormatLabel]);

  const guideHighlights = useMemo(
    () => [tool.actionLabel, "Secure Processing", "No Login", "Fast Output", "Any Device"],
    [tool.actionLabel]
  );

  const exploreTools = useMemo(
    () => TOOL_DEFINITIONS.filter(item => item.id !== tool.id).slice(0, 8),
    [tool.id]
  );

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

    setResultUrl(null);
    const formData = new FormData();
    files.forEach(file => formData.append("files", file));
    formData.append("orientation", orientation);
    formData.append("pageSize", pageSize);
    formData.append("margin", margin);
    formData.append("backgroundColor", backgroundColor);
    formData.append("mergeAll", String(mergeAll));

    const startTime = Date.now();

    setProcessing(true, {
      progress: 0,
      totalFiles: files.length,
      currentFileIndex: 1,
      fileName: files[0].name,
      fileSize: files[0].size,
      uploadSpeed: 0,
      timeLeft: 0
    });

    try {
      const { data } = await apiClient.post(`${toolId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const rawPercent = (progressEvent.loaded / progressEvent.total) * 100;
            const percent = Math.min(rawPercent, 90);
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = progressEvent.loaded / elapsed;
            const remaining = progressEvent.total - progressEvent.loaded;
            const time = speed > 0 ? remaining / speed : 0;
            
            // Estimate current file index based on cumulative size
            let currentIdx = 1;
            let currentFile = files[0];
            let accSize = 0;
            for (let i = 0; i < files.length; i++) {
              accSize += files[i].size;
              if (progressEvent.loaded <= accSize || i === files.length - 1) {
                currentIdx = i + 1;
                currentFile = files[i];
                break;
              }
            }

            setProcessing(true, {
              progress: percent,
              currentFileIndex: currentIdx,
              fileName: currentFile.name,
              fileSize: currentFile.size,
              uploadSpeed: speed,
              timeLeft: time
            });
          }
        }
      });
      if (!data?.success) {
        throw new Error(data?.message ?? `Unable to complete ${tool.title}.`);
      }
      setProcessing(true, { progress: 100, uploadSpeed: 0, timeLeft: 0 });
      const url: string | undefined = data?.download_url ?? data?.fileUrl ?? data?.file_url ?? data?.url;
      const normalizedUrl =
        typeof url === "string" && url.length > 0
          ? (url.startsWith("/") || /^https?:\/\//i.test(url) ? url : `/${url}`)
          : null;
      setResultUrl(normalizedUrl);
      setProcessing(false, { progress: 0 }); // ensure progress reset immediately
      toast.success(`${tool.title} completed successfully.`);
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message ?? `Unable to complete ${tool.title}.`;
      toast.error(message);
    } finally {
      setProcessing(false, { progress: 0 });
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-8 md:px-6 lg:px-10">
      <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => router.push("/#tools")}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span aria-hidden>←</span>
          <span>Back to all tools</span>
        </button>
        <div className="flex flex-wrap items-center justify-end gap-2 sm:ml-auto">
          {panelToolPaths.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-indigo-900 dark:hover:text-indigo-300"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">
            {tool.title}
          </h1>
          <p className="max-w-xl text-sm text-slate-600 md:text-base dark:text-slate-400">{tool.description}</p>
        </div>
        <div
          className={cn(
            "grid gap-8",
            hasFiles
              ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:items-start"
              : "grid-cols-1"
          )}
        >
          <div className={cn("space-y-4", !hasFiles && "w-full")}>
            <UploadBox
              onFilesSelected={accepted => setUploadedFiles([...(files ?? []), ...accepted])}
              accept={tool.accept}
              multiple
              busy={processingState.isProcessing}
              headline={`Select a ${sourcePrompt}`}
              subline={`Upload one ${sourcePrompt} to get ${targetFormatLabel}.`}
              ctaLabel={`Select ${sourcePrompt}`}
              variant="tool"
              sourceFormatLabel={sourceFormatLabel}
              targetFormatLabel={targetFormatLabel}
            />
            {hasFiles && (
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
          {showActionPanel && (
            <div className="space-y-4 lg:sticky lg:top-24">
              {hasFiles && renderPanel()}
              <div className="space-y-3 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
                {tool.allowOrientation && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-800 dark:text-slate-200">Page orientation</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={cn(
                          "flex-1 rounded-lg border px-3 py-2 text-xs",
                          orientation === "portrait"
                            ? "border-red-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
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
                            ? "border-red-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
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
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Page size</h4>
                    <select
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-red-400 focus:ring-1 focus:ring-red-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:focus:border-red-900"
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
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Margins</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={cn(
                          "flex-1 rounded-lg border px-3 py-2",
                          margin === "none"
                            ? "border-red-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
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
                            ? "border-red-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
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
                            ? "border-red-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
                            : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                        )}
                        onClick={() => setMargin("big")}
                      >
                        Big
                      </button>
                    </div>
                  </div>
                )}
                {tool.allowBackgroundColor && (
                  <div className="space-y-2 text-xs">
                    <h4 className="font-medium text-slate-800 dark:text-slate-200">Custom Background Color</h4>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-8 w-12 cursor-pointer rounded border border-slate-200 dark:border-slate-800 dark:bg-slate-950"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 rounded-lg border border-slate-200 p-2 text-xs outline-none focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        placeholder="#ffffff"
                      />
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
                        if (/^https?:\/\//i.test(resultUrl)) {
                          const directLink = document.createElement("a");
                          directLink.href = resultUrl;
                          directLink.target = "_blank";
                          directLink.rel = "noopener";
                          document.body.appendChild(directLink);
                          directLink.click();
                          document.body.removeChild(directLink);
                          return;
                        }
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
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    Files transfer over encrypted connections. Processed anonymously and auto-deleted after use — no login required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <section className="rounded-3xl border border-indigo-100 bg-white/90 p-5 shadow-sm md:p-7 dark:border-indigo-900/50 dark:bg-slate-900/90">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            TAJ PDF DOCS Tool Guide
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-slate-100">
            {tool.title} - Fast, Secure and Simple
          </h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base dark:text-slate-400">
            {tool.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {guideHighlights.map(highlight => (
              <span
                key={highlight}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <Card className="border-indigo-100 dark:border-indigo-900/50 dark:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-base dark:text-slate-100">How To Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>1. Upload your file in the upload area.</li>
                  <li>2. Set options based on your requirement.</li>
                  <li>3. Click &quot;{tool.actionLabel}&quot; to start.</li>
                  <li>4. Download the processed file instantly.</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="border-indigo-100 dark:border-indigo-900/50 dark:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-base dark:text-slate-100">Why This Tool</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>Clean workflow with minimal steps</li>
                  <li>Stable output quality for documents</li>
                  <li>Secure encrypted transfer in transit</li>
                  <li>Works smoothly on desktop and mobile</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-indigo-100 dark:border-indigo-900/50 dark:bg-slate-800/70">
              <CardHeader>
                <CardTitle className="text-base dark:text-slate-100">Best For</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>Office, legal and academic documents</li>
                  <li>Quick edits before sharing files</li>
                  <li>Daily PDF workflow automation</li>
                  <li>Bulk operations with simple controls</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick FAQs</h3>
            <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <summary className="cursor-pointer text-sm font-medium text-slate-900 dark:text-slate-100">
                Is this {tool.title.toLowerCase()} tool free to use?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Yes, you can process files without login for standard usage.
              </p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <summary className="cursor-pointer text-sm font-medium text-slate-900 dark:text-slate-100">
                Will my original file be changed?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                No, original files remain unchanged. You get a new processed output file.
              </p>
            </details>
            <details className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800/70">
              <summary className="cursor-pointer text-sm font-medium text-slate-900 dark:text-slate-100">
                Is my uploaded data secure?
              </summary>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Files are transferred over encrypted connections and processed anonymously.
              </p>
            </details>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Explore More Tools</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {exploreTools.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => router.push(`/tools/${item.id}`)}
                  className="rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-900 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
