 "use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Combine,
  Crop,
  Eraser,
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
import { cardTopGradients } from "@/lib/tool-card-gradients";
import { cn } from "@/lib/utils";

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
  "markdown-convert": FileText,
  unlock: Unlock,
  protect: Lock,
  organize: Layers,
  "pdf-a": FileArchive,
  "bg-remover": Eraser
};

interface ToolCardProps {
  toolId: PdfToolId;
}

export function ToolCard({ toolId }: ToolCardProps) {
  const tool = TOOL_DEFINITIONS.find(t => t.id === toolId);
  if (!tool) return null;
  const Icon = iconMap[tool.id];
  if (!Icon) return null;
  const topLineGradient = cardTopGradients[tool.id] ?? "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)";
  return (
    <Link href={`/tools/${tool.id}`} className="group block w-full focus:outline-none">
      <div
        className={cn(
          "h-full min-h-[170px] w-full cursor-pointer overflow-hidden rounded-2xl border p-4 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.35)] transition-all duration-300 ease-out sm:p-5",
          "hover:-translate-y-1 hover:shadow-[0_16px_40px_-18px_rgba(79,70,229,0.35)]",
          "focus-visible:ring-2 focus-visible:ring-indigo-400/50",
          tool.borderColor ?? "border-slate-200",
          tool.bgLight ?? "bg-white",
          "dark:border-slate-800 dark:bg-slate-900",
          "dark:border-opacity-20 dark:hover:border-opacity-40"
        )}
      >
        <div
          className="mb-3 h-1.5 w-full rounded-full sm:mb-4"
          style={{ backgroundImage: topLineGradient }}
        />
        <div className="relative flex h-full flex-col">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div
              className={cn(
                "rounded-xl border border-slate-200/80 p-2 shadow-sm backdrop-blur-sm transition-all sm:p-2.5",
                "ring-1 ring-white/70 group-hover:scale-105 dark:ring-slate-800/50",
                tool.iconBg ?? "bg-white/80",
                "dark:bg-slate-800/80"
              )}
            >
              <Icon className={cn("h-5 w-5 sm:h-6 sm:w-6", tool.iconColor ?? "text-slate-800 dark:text-slate-200")} strokeWidth={2.3} />
            </div>
          </div>
          <h3 className="text-base font-semibold tracking-tight text-slate-900 sm:text-xl dark:text-slate-100">{tool.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}

interface ToolGridProps {
  limit?: number;
  searchTerm?: string;
  onSearchTermChange?: (value: string) => void;
  showSearch?: boolean;
}

export function ToolGrid({ limit, searchTerm, onSearchTermChange, showSearch = true }: ToolGridProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  const tools = limit ? TOOL_DEFINITIONS.slice(0, limit) : TOOL_DEFINITIONS;
  const effectiveSearchTerm = searchTerm ?? internalSearchTerm;

  const filteredTools = useMemo(() => {
    const query = effectiveSearchTerm.trim().toLowerCase();
    if (!query) return tools;
    return tools.filter(tool => {
      const haystack = `${tool.title} ${tool.description} ${tool.id}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [effectiveSearchTerm, tools]);

  const handleSearchChange = (value: string) => {
    if (onSearchTermChange) {
      onSearchTermChange(value);
      return;
    }
    setInternalSearchTerm(value);
  };

  return (
    <div className="space-y-4">
      {showSearch && (
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={effectiveSearchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search tools and features..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-700 dark:focus:ring-indigo-800"
          />
        </div>
      )}
      {filteredTools.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          No tools found for "{effectiveSearchTerm}".
        </div>
      ) : (
        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} toolId={tool.id} />
          ))}
        </div>
      )}
    </div>
  );
}
