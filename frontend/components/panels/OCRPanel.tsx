"use client";

interface OCRPanelProps {
  language: string;
  searchable: boolean;
  onLanguageChange: (language: string) => void;
  onSearchableChange: (searchable: boolean) => void;
}

export function OCRPanel({ language, searchable, onLanguageChange, onSearchableChange }: OCRPanelProps) {

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-900">OCR options</h2>
      <p className="mt-1 text-xs text-slate-500">Choose language and output type.</p>
      <div className="mt-4 space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-slate-700">Language</label>
          <select
            value={language}
            onChange={e => onLanguageChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200"
          >
            <option value="eng">English</option>
            <option value="hin">Hindi</option>
            <option value="spa">Spanish</option>
            <option value="fra">French</option>
            <option value="deu">German</option>
          </select>
        </div>
        <label className="flex items-center justify-between gap-2">
          <span>Make output searchable PDF</span>
          <button
            type="button"
            onClick={() => onSearchableChange(!searchable)}
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

