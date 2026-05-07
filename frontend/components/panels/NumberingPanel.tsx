"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";

export function NumberingPanel() {
  const setToolOption = useAppStore(s => s.setToolOption);
  const [position, setPosition] = useState("bottom-right");
  const [start, setStart] = useState("1");
  const [fontSize, setFontSize] = useState("12");
  const [format, setFormat] = useState<"1" | "i">("1");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Page numbering</h2>
      <p className="mt-1 text-xs text-slate-500">Configure how page numbers should appear.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Position</label>
          <select
            value={position}
            onChange={e => {
              const value = e.target.value;
              setPosition(value);
              setToolOption("page-numbers", "position", value);
            }}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
          >
            <option value="top-left">Top left</option>
            <option value="top-right">Top right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="bottom-right">Bottom right</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-slate-700">Start number</label>
            <input
              type="number"
              min={1}
              value={start}
              onChange={e => {
                const value = e.target.value;
                setStart(value);
                if (value) setToolOption("page-numbers", "start", Number(value));
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
            />
          </div>
          <div>
            <label className="mb-1 block text-slate-700">Font size</label>
            <input
              type="number"
              min={8}
              value={fontSize}
              onChange={e => {
                const value = e.target.value;
                setFontSize(value);
                if (value) setToolOption("page-numbers", "font_size", Number(value));
              }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-slate-700">Format</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormat("1")}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                format === "1"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              1, 2, 3
            </button>
            <button
              type="button"
              onClick={() => setFormat("i")}
              className={`flex-1 rounded-lg border px-3 py-2 ${
                format === "i"
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              i, ii, iii
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

