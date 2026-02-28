"use client";

import { useState } from "react";

export function OCRPanel() {
  const [language, setLanguage] = useState("en");
  const [searchable, setSearchable] = useState(true);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">OCR options</h2>
      <p className="mt-1 text-xs text-slate-500">Choose language and output type.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Language</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <label className="flex items-center justify-between gap-2">
          <span>Make output searchable PDF</span>
          <button
            type="button"
            onClick={() => setSearchable(!searchable)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              searchable ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                searchable ? "translate-x-4" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}

