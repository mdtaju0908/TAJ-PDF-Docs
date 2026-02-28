"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
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
}

export function UploadBox({
  onFilesSelected,
  accept,
  multiple = true,
  busy,
  enableToolSelection = false,
  headline,
  subline
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
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all hover:shadow-lg",
          isDragActive && "shadow-soft",
          busy && "cursor-default opacity-70"
        )}
      >
        <input {...getInputProps()} />
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-red-500 to-orange-400 text-white shadow-md">
          <span className="text-xl">⬆</span>
        </div>
        <p className="text-sm font-medium text-slate-900">
          {busy ? "Processing files..." : headline || "Drag & drop your files here"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {subline || "or click to browse files from your device"}
        </p>
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
                "w-full max-w-xl rounded-3xl border border-white/60 bg-white/90 shadow-2xl ring-1 ring-white/40 backdrop-blur-xl transition duration-200",
                modalVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
              )}
            >
              <div className="border-b border-slate-200/70 px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Selected File
                    </p>
                    <p className="mt-1 truncate text-base font-semibold text-slate-900">
                      {selectedFile.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatBytes(selectedFile.size)}
                    </p>
                  </div>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                    {fileKind === "pdf"
                      ? "PDF"
                      : fileKind === "docx"
                        ? "DOCX"
                        : fileKind === "pptx"
                          ? "PPTX"
                          : fileKind === "image"
                            ? "IMAGE"
                            : "FILE"}
                  </span>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Available actions
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {actions.map(action => (
                    <button
                      key={action.id}
                      onClick={() => handleToolSelect(action.id)}
                      className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-900 shadow-sm transition hover:border-rose-200 hover:bg-rose-50/60"
                    >
                      <span>{action.label}</span>
                      <span className="text-slate-400 transition group-hover:text-rose-500">→</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-200/70 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
