import type { Metadata } from "next";
import { FeatureGrid } from "@/components/FeatureGrid";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore the end-to-end PDF automation features included with TAJ PDF Docs."
};

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          A complete workspace for PDF workflows
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          TAJ PDF Docs replaces scattered desktop utilities with a single, secure browser
          experience that your whole team can rely on.
        </p>
      </div>
      <FeatureGrid />
    </div>
  );
}

