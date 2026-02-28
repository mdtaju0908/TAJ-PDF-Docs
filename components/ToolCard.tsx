 "use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Combine,
  Crop,
  Eye,
  FileArchive,
  FileImage,
  FilePlus,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Hash,
  Layers,
  Lock,
  Minimize2,
  Presentation,
  RotateCw,
  Scissors,
  Search,
  ShieldOff,
  Unlock,
  Wrench
} from "lucide-react";
import { TOOL_DEFINITIONS, type PdfToolId } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const iconMap: Record<PdfToolId, LucideIcon> = {
  merge: Combine,
  split: Scissors,
  compress: Minimize2,
  "pdf-to-word": FileText,
  "pdf-to-ppt": FileText,
  "pdf-to-excel": FileSpreadsheet,
  "word-to-pdf": FileText,
  "ppt-to-pdf": Presentation,
  "excel-to-pdf": FileSpreadsheet,
  edit: FilePlus,
  "jpg-to-pdf": FileImage,
  "pdf-to-jpg": FileImage,
  sign: FileSignature,
  repair: Wrench,
  "page-numbers": Hash,
  scan: Camera,
  ocr: Search,
  compare: Eye,
  redact: ShieldOff,
  crop: Crop,
  watermark: Layers,
  rotate: RotateCw,
  "html-to-pdf": FileText,
  unlock: Unlock,
  protect: Lock,
  organize: Layers,
  "pdf-a": FileArchive
};

interface ToolCardProps {
  toolId: PdfToolId;
}

export function ToolCard({ toolId }: ToolCardProps) {
  const tool = TOOL_DEFINITIONS.find(t => t.id === toolId);
  if (!tool) return null;
  const Icon = iconMap[tool.id];
  if (!Icon) return null;
  const favorites = useAppStore(s => s.favorites);
  const addFavorite = useAppStore(s => s.addFavorite);
  const removeFavorite = useAppStore(s => s.removeFavorite);
  const isFav = favorites.includes(toolId);

  return (
    <Link href={`/tools/${tool.id}`} className="group block focus:outline-none">
      <div
        className={cn(
          "h-full cursor-pointer rounded-2xl p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md",
          tool.cardBg ?? tool.cardColor
        )}
      >
        <div className="relative flex flex-col">
          <button
            type="button"
            aria-label={isFav ? "Remove favorite" : "Add favorite"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isFav ? removeFavorite(toolId) : addFavorite(toolId);
            }}
            className={cn(
              "absolute right-2 top-2 rounded-full border px-2 py-1 text-xs transition",
              isFav ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600"
            )}
          >
            {isFav ? "★" : "☆"}
          </button>
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-xl",
              tool.iconBg ?? "",
              !tool.iconBg && tool.color
            )}
          >
            <Icon size={22} className={tool.iconColor} />
          </div>
          <h3 className="mt-4 font-semibold text-gray-800">{tool.title}</h3>
          <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}

interface ToolGridProps {
  limit?: number;
}

export function ToolGrid({ limit }: ToolGridProps) {
  const tools = limit ? TOOL_DEFINITIONS.slice(0, limit) : TOOL_DEFINITIONS;

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {tools.map(tool => (
        <ToolCard key={tool.id} toolId={tool.id} />
      ))}
    </div>
  );
}
