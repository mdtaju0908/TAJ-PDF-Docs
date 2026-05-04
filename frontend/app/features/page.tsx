import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Bot,
  FileArchive,
  FileStack,
  Gauge,
  Layers3,
  MonitorSmartphone,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the end-to-end PDF automation features included with TAJ PDF Docs."
};

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: "Popular" | "Best";
}

const features: FeatureItem[] = [
  {
    title: "All-in-One PDF Toolkit",
    description: "Merge, split, compress, and convert PDFs from one simple workspace.",
    icon: FileStack,
    badge: "Popular"
  },
  {
    title: "Fast Processing",
    description: "Complete document tasks in seconds so your workflow keeps moving.",
    icon: Gauge,
    badge: "Best"
  },
  {
    title: "High-Quality Output",
    description: "Keep text, images, and layout clear during compression and conversion.",
    icon: Sparkles
  },
  {
    title: "Easy Drag & Drop",
    description: "Upload files quickly with a smooth drag-and-drop experience.",
    icon: MousePointer2
  },
  {
    title: "Multiple Format Support",
    description: "Work with PDF, DOCX, PPTX, JPG, PNG, and more in one flow.",
    icon: Layers3
  },
  {
    title: "Secure & Private",
    description: "Files are auto-deleted and never kept as permanent storage.",
    icon: ShieldCheck,
    badge: "Popular"
  },
  {
    title: "No Installation Required",
    description: "Use every tool directly in your browser without setup.",
    icon: Wand2
  },
  {
    title: "Batch Processing",
    description: "Handle multiple files together to save time on repetitive tasks.",
    icon: FileArchive
  },
  {
    title: "Cross-Device Compatibility",
    description: "Works smoothly on mobile, tablet, laptop, and desktop.",
    icon: MonitorSmartphone
  },
  {
    title: "Clean & Simple UI",
    description: "Enjoy a modern interface with fewer clicks and clearer steps.",
    icon: Bot
  }
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm md:p-8 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-cyan-950/30">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Features
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
          A complete workspace for PDF workflows
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-400">
          TAJ PDF Docs brings speed, simplicity, and security into one clean platform for everyday document work.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300">
          <BadgeCheck className="h-4 w-4" />
          <span>Built for fast, secure, and simple file workflows</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(feature => (
          <Card
            key={feature.title}
            className="group h-full border-slate-200/90 bg-white/90 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
          >
            <CardHeader className="pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <feature.icon className="h-5 w-5" />
                </div>
                {feature.badge ? (
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {feature.badge}
                  </span>
                ) : null}
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
