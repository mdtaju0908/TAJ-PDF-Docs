 "use client";

import { useAppStore } from "@/lib/store";
import { ToolCard } from "@/components/ToolCard";

export default function DashboardFavoritesPage() {
  const favorites = useAppStore(s => s.favorites);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Favorites
        </h1>
        <p className="text-sm text-slate-600">
          Pin your most-used tools and documents for one-click access.
        </p>
      </div>
      {favorites.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-soft">
          You have not starred any items yet. Mark tools and documents as favorite to see
          them here.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map(toolId => (
            <ToolCard key={toolId} toolId={toolId} />
          ))}
        </div>
      )}
    </div>
  );
}
