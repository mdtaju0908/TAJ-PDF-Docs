"use client";

import { useState } from "react";

export function CompressPanel() {
  const [level, setLevel] = useState<"low" | "medium" | "high">("medium");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Compression level</h2>
      <p className="mt-1 text-xs text-slate-500">Balance between file size and visual quality.</p>
      <div className="mt-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setLevel("low")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "low"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Low
        </button>
        <button
          type="button"
          onClick={() => setLevel("medium")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "medium"
              ? "border-amber-500 bg-amber-50 text-amber-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Medium
        </button>
        <button
          type="button"
          onClick={() => setLevel("high")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            level === "high"
              ? "border-rose-500 bg-rose-50 text-rose-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          High
        </button>
      </div>
    </div>
  );
}

