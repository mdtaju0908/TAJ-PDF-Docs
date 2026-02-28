"use client";

import { useState } from "react";

export function RotatePanel() {
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [applyAll, setApplyAll] = useState(true);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Rotate pages</h2>
      <p className="mt-1 text-xs text-slate-500">Choose rotation direction and scope.</p>
      <div className="mt-4 flex gap-2 text-xs">
        <button
          type="button"
          onClick={() => setDirection("left")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            direction === "left"
              ? "border-purple-500 bg-purple-50 text-purple-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Rotate left
        </button>
        <button
          type="button"
          onClick={() => setDirection("right")}
          className={`flex-1 rounded-lg border px-3 py-2 ${
            direction === "right"
              ? "border-purple-500 bg-purple-50 text-purple-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Rotate right
        </button>
      </div>
      <label className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-700">
        <span>Apply to all pages</span>
        <button
          type="button"
          onClick={() => setApplyAll(!applyAll)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            applyAll ? "bg-purple-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              applyAll ? "translate-x-4" : "translate-x-1"
            }`}
          />
        </button>
      </label>
    </div>
  );
}

