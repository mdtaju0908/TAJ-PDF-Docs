"use client";

import { useState } from "react";

export function EditPanel() {
  const [tool, setTool] = useState<"text" | "image" | "highlight" | "draw">("text");
  const [fontSize, setFontSize] = useState("14");

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">Edit tools</h2>
      <p className="mt-1 text-xs text-slate-500">Choose how you want to edit your PDF.</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setTool("text")}
          className={`rounded-lg border px-3 py-2 ${
            tool === "text" ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 text-slate-600"
          }`}
        >
          Add text
        </button>
        <button
          type="button"
          onClick={() => setTool("image")}
          className={`rounded-lg border px-3 py-2 ${
            tool === "image"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Add image
        </button>
        <button
          type="button"
          onClick={() => setTool("highlight")}
          className={`rounded-lg border px-3 py-2 ${
            tool === "highlight"
              ? "border-amber-500 bg-amber-50 text-amber-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Highlight
        </button>
        <button
          type="button"
          onClick={() => setTool("draw")}
          className={`rounded-lg border px-3 py-2 ${
            tool === "draw"
              ? "border-rose-500 bg-rose-50 text-rose-700"
              : "border-slate-200 text-slate-600"
          }`}
        >
          Draw
        </button>
      </div>
      <div className="mt-4 text-xs">
        <label className="mb-1 block text-slate-700">Font size</label>
        <select
          value={fontSize}
          onChange={e => setFontSize(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
        >
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16">16</option>
          <option value="18">18</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

