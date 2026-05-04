"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowRight,
  CloudUpload,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  Presentation
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { PdfToolId } from "@/lib/tools";

type FileKind = "pdf" | "docx" | "pptx" | "image" | "unknown";

const defaultAccept = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"]
};

const toolActions: Record<FileKind, { id: PdfToolId; label: string }[]> = {
  pdf: [
    { id: "merge", label: "Merge PDF" },
    { id: "split", label: "Split PDF" },
    { id: "compress", label: "Compress PDF" },
    { id: "edit", label: "Edit PDF" },
    { id: "protect", label: "Protect PDF" }
  ],
  docx: [{ id: "word-to-pdf", label: "Convert to PDF" }],
  pptx: [{ id: "ppt-to-pdf", label: "Convert to PDF" }],
  image: [{ id: "jpg-to-pdf", label: "Convert to PDF" }],
  unknown: []
};

function getFileKind(file: File): FileKind {
  const name = file.name.toLowerCase();
  const mime = file.type.toLowerCase();
  if (mime === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  if (
    mime ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
    name.endsWith(".pptx")
  ) {
    return "pptx";
  }
  if (mime.startsWith("image/") || name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png")) {
    return "image";
  }
  return "unknown";
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 100 ? 0 : value >= 10 ? 1 : 2)} ${units[i]}`;
}

interface UploadBoxProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  busy?: boolean;
  enableToolSelection?: boolean;
  headline?: string;
  subline?: string;
  ctaLabel?: string;
  variant?: "default" | "tool" | "hero";
  sourceFormatLabel?: string;
  targetFormatLabel?: string;
}

type FormatKind = "pdf" | "image" | "word" | "ppt" | "excel" | "generic";

function getFormatKind(label: string): FormatKind {
  const normalized = label.toLowerCase();
  if (normalized.includes("pdf")) return "pdf";
  if (["jpg", "jpeg", "png", "webp", "image"].some(x => normalized.includes(x))) return "image";
  if (["doc", "docx", "word"].some(x => normalized.includes(x))) return "word";
  if (["ppt", "pptx", "powerpoint"].some(x => normalized.includes(x))) return "ppt";
  if (["xls", "xlsx", "excel"].some(x => normalized.includes(x))) return "excel";
  return "generic";
}

function getFormatMeta(kind: FormatKind) {
  switch (kind) {
    case "pdf":
      return { Icon: FileText, iconClass: "text-red-500", chipClass: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" };
    case "image":
      return { Icon: FileImage, iconClass: "text-amber-500", chipClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" };
    case "word":
      return { Icon: FileType2, iconClass: "text-blue-600", chipClass: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" };
    case "ppt":
      return { Icon: Presentation, iconClass: "text-orange-500", chipClass: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" };
    case "excel":
      return { Icon: FileSpreadsheet, iconClass: "text-emerald-600", chipClass: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" };
    default:
      return { Icon: FileText, iconClass: "text-slate-500", chipClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" };
  }
}

export function UploadBox({
  onFilesSelected,
  accept,
  multiple = true,
  busy,
  enableToolSelection = false,
  headline,
  subline,
  ctaLabel,
  variant = "default",
  sourceFormatLabel,
  targetFormatLabel
}: UploadBoxProps) {
  const router = useRouter();
  const setUploadedFiles = useAppStore(s => s.setUploadedFiles);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const resolvedAccept = accept ?? (enableToolSelection ? defaultAccept : undefined);
  const resolvedMultiple = enableToolSelection ? false : multiple;

  const fileKind = useMemo(
    () => (selectedFile ? getFileKind(selectedFile) : "unknown"),
    [selectedFile]
  );
  const actions = useMemo(() => toolActions[fileKind], [fileKind]);
  const sourceKind = sourceFormatLabel ? getFormatKind(sourceFormatLabel) : null;
  const targetKind = targetFormatLabel ? getFormatKind(targetFormatLabel) : null;
  const sourceMeta = sourceKind ? getFormatMeta(sourceKind) : null;
  const targetMeta = targetKind ? getFormatMeta(targetKind) : null;
  const showCategoryVisual =
    variant === "tool" && !!sourceFormatLabel && !!targetFormatLabel && !!sourceMeta && !!targetMeta;

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedFile(null);
    }, 200);
  }, []);

  const openModal = useCallback(() => {
    setModalOpen(true);
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: { file: File }[]) => {
      if (fileRejections.length > 0) {
        toast.error(
          enableToolSelection
            ? "Upload PDF, DOCX, PPTX, JPG, or PNG files only."
            : "Invalid file type selected."
        );
      }
      if (!acceptedFiles.length) return;
      if (enableToolSelection) {
        const file = acceptedFiles[0];
        const kind = getFileKind(file);
        if (kind === "unknown") {
          setError("Unsupported file type. Please upload PDF, DOCX, PPTX, JPG, or PNG.");
          return;
        }
        setError(null);
        setSelectedFile(file);
        openModal();
        return;
      }
      if (!onFilesSelected) return;
      onFilesSelected(acceptedFiles);
    },
    [enableToolSelection, onFilesSelected, openModal]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: resolvedAccept,
    multiple: resolvedMultiple,
    disabled: busy
  });

  useEffect(() => {
    if (!fileRejections.length) return;
    const message = enableToolSelection
      ? "Only PDF, DOCX, PPTX, JPG, or PNG files are supported."
      : "Only supported file types are allowed for this tool.";
    toast.error(message);
  }, [enableToolSelection, fileRejections]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal, modalOpen]);

  const handleToolSelect = useCallback(
    (toolId: PdfToolId) => {
      if (!selectedFile) return;
      setUploadedFiles([selectedFile]);
      closeModal();
      router.push(`/tools/${toolId}`);
    },
    [closeModal, router, selectedFile, setUploadedFiles]
  );

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 hover:shadow-lg",
          variant === "tool" &&
            "rounded-3xl border-indigo-300 bg-white px-6 py-14 hover:-translate-y-0.5 hover:border-indigo-400 hover:shadow-sm dark:border-indigo-900 dark:bg-slate-900/50",
          variant === "hero" &&
            "rounded-[28px] border-slate-200 bg-white px-8 py-12 shadow-[0_20px_60px_-28px_rgba(15,23,42,0.35)] hover:-translate-y-0.5 hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_20px_60px_-28px_rgba(0,0,0,0.5)]",
          isDragActive && "shadow-soft",
          busy && "cursor-default opacity-70"
        )}
      >
        {(variant === "tool" || variant === "hero") && (
          <div className="pointer-events-none absolute inset-0">
            <div
              className={cn(
                "absolute inset-2 rounded-[24px] border border-dashed transition-all duration-300",
                variant === "tool"
                  ? "border-indigo-300/0 group-hover:border-indigo-300/80 dark:group-hover:border-indigo-900/80"
                  : "border-slate-200 group-hover:border-indigo-200 dark:border-slate-800 dark:group-hover:border-indigo-900"
              )}
            />
            <div className="absolute left-[-40%] top-0 h-[2px] w-1/3 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100 dark:via-indigo-500" />
            <span className="absolute left-4 top-4 h-2 w-2 rounded-full bg-indigo-300/0 transition-all duration-300 group-hover:bg-indigo-300/80 dark:group-hover:bg-indigo-900/80" />
            <span className="absolute bottom-4 right-4 h-2 w-2 rounded-full bg-violet-300/0 transition-all duration-300 group-hover:bg-violet-300/80 dark:group-hover:bg-violet-900/80" />
          </div>
        )}
        <input {...getInputProps()} />
        {showCategoryVisual ? (
          <div className="mb-6 flex items-center justify-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 transition-all duration-300 group-hover:bg-indigo-50/70 dark:bg-slate-800/50 dark:group-hover:bg-indigo-900/30">
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
              <sourceMeta.Icon className={cn("h-9 w-9", sourceMeta.iconClass)} />
              <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", sourceMeta.chipClass)}>
                {sourceFormatLabel}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 dark:text-slate-600" />
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-transform duration-300 group-hover:translate-y-0.5 dark:border-slate-800 dark:bg-slate-900">
              <targetMeta.Icon className={cn("h-9 w-9", targetMeta.iconClass)} />
              <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", targetMeta.chipClass)}>
                {targetFormatLabel}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "mb-3 flex h-12 w-12 items-center justify-center text-indigo-500",
              variant === "tool" && "mb-5 h-20 w-20 text-violet-500 dark:text-violet-400",
              variant === "hero" && "mb-6 h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            )}
          >
            <CloudUpload
              className={cn(
                "h-10 w-10 stroke-[2.2]",
                variant === "tool" && "h-16 w-16 stroke-[2.1]",
                variant === "hero" && "h-9 w-9 stroke-[2.2]"
              )}
            />
          </div>
        )}
        <p
          className={cn(
            "text-sm font-medium text-slate-900 dark:text-slate-100",
            variant === "tool" && "text-3xl",
            variant === "hero" && "text-[30px] font-semibold tracking-tight"
          )}
        >
          {busy ? "Processing files..." : headline || "Drag & drop your files here"}
        </p>
        <p
          className={cn(
            "mt-1 text-xs text-slate-500 dark:text-slate-400",
            variant === "tool" && "mt-3 text-base",
            variant === "hero" && "mt-3 text-base text-slate-600 dark:text-slate-400"
          )}
        >
          {subline || "or click to browse files from your device"}
        </p>
        <span
          className={cn(
            "mt-4 rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-all duration-300 dark:bg-slate-100 dark:text-slate-950",
            variant === "tool" && "mt-6 rounded-xl bg-indigo-600 px-7 py-3 text-sm group-hover:bg-indigo-700 dark:bg-indigo-500 dark:group-hover:bg-indigo-600 dark:text-white",
            variant === "hero" &&
              "mt-7 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-sm font-semibold shadow-md shadow-indigo-500/30 group-hover:from-indigo-700 group-hover:to-violet-700 dark:from-indigo-500 dark:to-violet-500 dark:group-hover:from-indigo-600 dark:group-hover:to-violet-600 dark:text-white"
          )}
        >
          {busy ? "Please wait..." : ctaLabel || "Select File"}
        </span>
        {error ? <p className="mt-3 text-xs font-medium text-rose-600">{error}</p> : null}
      </div>

      {enableToolSelection && modalOpen && selectedFile ? (
        <div className="fixed inset-0 z-50">
          <div
            className={cn(
              "absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-200",
              modalVisible ? "opacity-100" : "opacity-0"
            )}
            onClick={closeModal}
          />
          <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
            <div
              className={cn(
                "w-full max-w-xl rounded-3xl border border-white/60 bg-white/90 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl transition duration-200 dark:border-slate-800/60 dark:bg-slate-900/90 dark:ring-slate-800/40",
                modalVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
              )}
            >
              <div className="border-b border-slate-200/70 px-6 py-5 dark:border-slate-800/70">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Selected File
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900 dark:text-slate-100">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                  >
                    <ArrowRight className="h-5 w-5 rotate-45" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Choose an action
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleToolSelect(action.id)}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/30"
                    >
                      <span className="font-medium text-slate-700 transition group-hover:text-indigo-700 dark:text-slate-300 dark:group-hover:text-indigo-400">
                        {action.label}
                      </span>
                      <ArrowRight className="h-4 w-4 -rotate-45 text-slate-300 transition group-hover:rotate-0 group-hover:text-indigo-500 dark:text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
