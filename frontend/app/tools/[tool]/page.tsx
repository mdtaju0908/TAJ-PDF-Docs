import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PdfToolTemplate } from "@/components/PdfToolTemplate";
import { TOOL_DEFINITIONS, type PdfToolId } from "@/lib/tools";

interface ToolPageProps {
  params: Promise<{
    tool: PdfToolId;
  }>;
}

export function generateStaticParams() {
  return TOOL_DEFINITIONS.map(tool => ({ tool: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = TOOL_DEFINITIONS.find(t => t.id === toolId);
  if (!tool) {
    return {
      title: "PDF tool not found"
    };
  }

  return {
    title: `${tool.title} – TAJ PDF Docs`,
    description: tool.description,
    alternates: {
      canonical: `/tools/${tool.id}`
    },
    openGraph: {
      title: `${tool.title} – TAJ PDF Docs`,
      description: tool.description,
      url: `/tools/${tool.id}`,
      type: "website"
    }
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  const tool = TOOL_DEFINITIONS.find(t => t.id === toolId);
  if (!tool) {
    notFound();
  }

  return <PdfToolTemplate toolId={tool.id} />;
}
