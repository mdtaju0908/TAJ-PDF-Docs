 "use client";

import { ToolCard } from "@/components/ToolCard";
import { useAppStore } from "@/lib/store";

export default function DashboardHomePage() {
  const usage = useAppStore(s => s.usageStats);
  const favorites = useAppStore(s => s.favorites);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Workspace overview
        </h1>
        <p className="text-sm text-slate-600">
          Jump back into recent tools and keep your document workflows moving.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Documents today
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{usage.documentsToday}</p>
          <p className="mt-1 text-xs text-emerald-600">Live usage</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Active collaborators
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{usage.collaborators}</p>
          <p className="mt-1 text-xs text-slate-500">Across legal, finance and ops</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Success rate
          </p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{usage.successRate}%</p>
          <p className="mt-1 text-xs text-slate-500">For the last 30 days</p>
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900">Pinned tools</h2>
        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-soft">
            Star tools to pin them here.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {favorites.slice(0, 6).map(toolId => (
              <ToolCard key={toolId} toolId={toolId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
