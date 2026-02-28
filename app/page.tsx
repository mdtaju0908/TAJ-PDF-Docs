import { ToolGrid } from "@/components/ToolCard";
import { UploadBox } from "@/components/UploadBox";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="hero-gradient">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-12 pt-10 md:flex-row md:items-center md:px-6 lg:px-8 lg:pb-16 lg:pt-14">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-rose-600 shadow-soft">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Secure cloud-native PDF workflows</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              All-in-One PDF Tools Platform
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Merge, split, compress and convert PDFs in seconds. TAJ PDF Docs brings
              every essential document workflow into a single, secure workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#upload">
              <Button size="lg">Select PDF file</Button>
            </a>
            <p className="text-xs text-slate-500">
              No login or signup required — all tools enabled.
            </p>
          </div>
        </div>
        <div className="flex-1">
          <div
            id="upload"
            className="glass-panel rounded-3xl border border-slate-100 p-4 shadow-soft"
          >
            <UploadBox
              enableToolSelection
              multiple={false}
              accept={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                  ".docx"
                ],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
                  ".pptx"
                ],
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"]
              }}
              headline="Drag & drop PDF, DOCX, PPTX, JPG, PNG"
              subline="or click to browse from your device"
            />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <p className="font-medium text-slate-900">Designed for volume</p>
                <p>Handle multi-hundred-page documents without breaking your flow.</p>
              </div>
              <div>
                <p className="font-medium text-slate-900">Privacy-first</p>
                <p>Files stay encrypted in transit with strict retention policies.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 pb-12 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              Smart PDF tools for every workflow
            </h2>
            <p className="text-sm text-slate-500">
              Convert, protect and organize documents without leaving your browser.
            </p>
          </div>
        </div>
        <ToolGrid />
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-12 md:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              Built for security-first organizations
            </h2>
            <p className="text-sm text-slate-500">
              TAJ PDF Docs fits into your compliance story with transparent controls.
            </p>
          </div>
        </div>
        <FeatureGrid />
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16 md:px-6 lg:px-8">
        <div className="glass-panel flex flex-col gap-6 rounded-3xl border border-slate-100 p-6 shadow-soft md:flex-row md:items-center md:justify-between md:p-8">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
              Free, no-account PDF tools
            </h2>
            <p className="text-sm text-slate-500">
              Use every tool instantly. No login required — upload, process and download
              securely in your browser.
            </p>
            <ul className="grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
              <li>Unlimited merges, splits and conversions</li>
              <li>Direct anonymous processing with auto-deletion</li>
              <li>No pricing tiers or subscriptions</li>
              <li>Fast, reliable infrastructure</li>
            </ul>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              Free to use
            </p>
            <p className="text-xs text-slate-500">
              No login required. Start processing files now.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
