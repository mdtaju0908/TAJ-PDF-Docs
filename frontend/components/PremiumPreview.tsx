"use client";

import { useEffect, useMemo } from "react";
import { FileText, X } from "lucide-react";

interface PremiumPreviewProps {
  file: File;
  extensionLabel: string;
  iconBg: string;
  iconColor: string;
  onRemove?: () => void;
}

export function PremiumPreview({ file, extensionLabel, iconBg, iconColor, onRemove }: PremiumPreviewProps) {
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isPdf = file.type === "application/pdf" || ext === "pdf";
  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-md dark:border-slate-800 dark:bg-slate-900">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-rose-600 dark:bg-slate-900/95 dark:text-slate-300 dark:ring-slate-700 dark:hover:text-rose-400"
          aria-label={`Remove ${file.name}`}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="relative overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/70">
        <div
          className={`${iconBg} ${iconColor} absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold`}
        >
          {extensionLabel}
        </div>
        {isPdf ? (
          <iframe
            src={`${previewUrl}#page=1&view=FitH`}
            title={`preview-${file.name}`}
            className="h-44 w-full border-0"
          />
        ) : (
          <div className="flex h-44 items-center justify-center">
            <div className="text-4xl font-bold text-slate-300 dark:text-slate-600">{extensionLabel}</div>
          </div>
        )}
        {!isPdf && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <FileText className="h-8 w-8 text-slate-300/70 dark:text-slate-600/70" />
          </div>
        )}
      </div>
      <p className="mt-3 truncate text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
    </div>
  );
}

