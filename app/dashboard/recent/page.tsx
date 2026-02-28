 "use client";

import { useAppStore } from "@/lib/store";

export default function DashboardRecentPage() {
  const recent = useAppStore(s => s.recentFiles);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Recent files
        </h1>
        <p className="text-sm text-slate-600">
          Track the latest documents processed by your workspace.
        </p>
      </div>
      {recent.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-soft">
          Recent activity will appear here as your team starts processing PDFs.
        </div>
      ) : (
        <div className="grid gap-4">
          {recent.map((f, idx) => (
            <div
              key={`${f.name}-${idx}`}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-soft"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{f.name}</p>
                <p className="text-xs text-slate-500">
                  {(f.size / 1024 / 1024).toFixed(2)} MB • {f.type} •{" "}
                  {new Date(f.processedAt).toLocaleString()}
                </p>
              </div>
              <span className="text-xs text-slate-600">{f.toolId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
