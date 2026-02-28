"use client";

import { useState } from "react";

export function SplitPanel() {
  const [range, setRange] = useState("");
  const [pageCount, setPageCount] = useState("");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Split settings</h2>
      <p className="mt-1 text-xs text-slate-500">Choose how to split your PDF pages.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Page ranges</label>
          <input
            value={range}
            onChange={e => setRange(e.target.value)}
            placeholder="e.g. 1-3,5,8-10"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Split by page count</label>
          <input
            type="number"
            min={1}
            value={pageCount}
            onChange={e => setPageCount(e.target.value)}
            placeholder="Every N pages"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
          />
        </div>
      </div>
    </div>
  );
}

