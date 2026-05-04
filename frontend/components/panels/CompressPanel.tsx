"use client";

import { useState } from "react";

export function CompressPanel() {
  const [level, setLevel] = useState<"low" | "medium" | "high">("medium");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900 dark:border dark:border-slate-800">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Compression level</h2>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Balance between file size and visual quality.</p>
      <div className="mt-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setLevel("low")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "low"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
              : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
          }`}
        >
          Low
        </button>
        <button
          type="button"
          onClick={() => setLevel("medium")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "medium"
              ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
              : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
          }`}
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => setLevel("high")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "high"
              ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400"
              : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
          }`}
        >
          High
        </button>
      </div>
    </div>
  );
}

