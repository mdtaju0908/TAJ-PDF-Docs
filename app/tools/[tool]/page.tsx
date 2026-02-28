import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PdfToolTemplate } from "@/components/PdfToolTemplate";
import { TOOL_DEFINITIONS, type PdfToolId } from "@/lib/tools";

interface ToolPageProps {
  params: {
    tool: PdfToolId;
  };
}

export function generateStaticParams() {
  return TOOL_DEFINITIONS.map(tool => ({ tool: tool.id }));
}

export function generateMetadata({ params }: ToolPageProps): Metadata {
  const tool = TOOL_DEFINITIONS.find(t => t.id === params.tool);
  if (!tool) {
    return {
      title: "PDF tool not found"
    };
  }

  return {
    title: `${tool.title} – TAJ PDF Docs`,
    description: tool.description
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  const tool = TOOL_DEFINITIONS.find(t => t.id === params.tool);
  if (!tool) {
    notFound();
  }

  return <PdfToolTemplate toolId={tool.id} />;
}

