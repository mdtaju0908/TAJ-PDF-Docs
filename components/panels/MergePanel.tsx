"use client";

import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface MergePanelProps {
  files: File[];
  mergeAll: boolean;
  onMergeAllChange: (value: boolean) => void;
}

export function MergePanel({ files, mergeAll, onMergeAllChange }: MergePanelProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Merge settings</h2>
      <p className="mt-1 text-xs text-slate-500">Reorder files and choose how to merge them.</p>
      <div className="mt-4 space-y-2">
        {files.map(file => (
          <div
            key={file.name}
            className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700"
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-3 w-3 text-slate-400" />
              <span className="truncate">{file.name}</span>
            </div>
            <span className="ml-3 shrink-0 text-[11px] text-slate-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        ))}
        {files.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-xs text-slate-400">
            Add files to configure merge options.
          </div>
        )}
      </div>
      <label className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-700">
        <span>Merge all files into a single PDF</span>
        <button
          type="button"
          onClick={() => onMergeAllChange(!mergeAll)}
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
            mergeAll ? "bg-emerald-500" : "bg-slate-300"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              mergeAll ? "translate-x-4" : "translate-x-1"
            )}
          />
        </button>
      </label>
    </div>
  );
}

