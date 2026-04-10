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
  return (
    <Link href={`/tools/${tool.id}`} className="group block focus:outline-none">
      <div
        className={cn(
          "h-full cursor-pointer rounded-2xl p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-md",
          tool.cardBg ?? tool.cardColor
        )}
      >
        <div className="relative flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/40 p-2.5 backdrop-blur-sm group-hover:bg-white/60">
              <Icon className="h-6 w-6 text-slate-800" strokeWidth={1.5} />
            </div>
          </div>
          <h3 className="font-semibold text-slate-900">{tool.title}</h3>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2">{tool.description}</p>
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
