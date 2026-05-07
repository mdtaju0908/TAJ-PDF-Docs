 "use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ToolGrid } from "@/components/ToolCard";
import { UploadBox } from "@/components/UploadBox";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="hero-gradient">
      <section className="flex w-full flex-col gap-12 px-4 pb-14 pt-12 md:flex-row md:items-center md:px-6 lg:px-10 lg:pb-20 lg:pt-16">
        <div className="flex-1 space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-rose-600 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <span className="rounded-full border border-violet-300 bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:border-violet-400/40 dark:bg-violet-500/10 dark:text-violet-200">
                No Login Required
              </span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Developed by: Er. MD TAJU</span>
          </div>
          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-slate-50">
              <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-cyan-400">
                For Fast Document Workflows
              </span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
              Merge, split, compress, and convert documents in seconds. TAJ PDF Docs gives
              you a clean, secure workspace for everyday file management.
            </p>
            <div className="relative max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tools and features..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-700 dark:focus:ring-indigo-800"
              />
            </div>
          </div>
        </div>
        <div className="hidden md:block md:flex-1">
          <div
            id="upload"
            className="rounded-[30px] border border-slate-200 bg-white/95 p-5 shadow-[0_28px_70px_-32px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-[0_28px_70px_-32px_rgba(0,0,0,0.5)]"
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
              headline="Drag and drop your document"
              subline="PDF, DOCX, PPTX, JPG, PNG supported"
              ctaLabel="Choose File"
              variant="hero"
            />
            <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Designed for scale</p>
                <p>Handle long documents without slowing down your workflow.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100">Privacy-first</p>
                <p>Encrypted in transit with strict retention and cleanup controls.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tools" className="w-full space-y-5 px-4 pb-12 md:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl dark:text-slate-100">
              Smart PDF tools for every workflow
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Convert, protect and organize documents without leaving your browser.
            </p>
          </div>
        </div>
        <ToolGrid searchTerm={searchTerm} onSearchTermChange={setSearchTerm} showSearch={false} />
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16 md:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-soft dark:border-indigo-900/50 dark:from-indigo-950/50 dark:via-slate-900 dark:to-slate-950">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-200/40 blur-2xl dark:bg-indigo-900/20" />
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">New Card</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              TAJ PDF DOCS
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Free Online PDF Tools for Fast and Easy Document Management
            </p>
            <div className="mt-4 inline-flex rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-slate-900 dark:text-indigo-300">
              No signup needed
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-6 shadow-soft dark:border-emerald-900/50 dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-950">
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-emerald-200/40 blur-2xl dark:bg-emerald-900/20" />
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Trust Card</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              The PDF software trusted by millions of users
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Secure processing, fast performance and reliable output for every document workflow.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                Secure
              </span>
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                Fast
              </span>
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
                Trusted
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-12 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 p-6 shadow-soft md:p-8 dark:border-sky-900/50 dark:from-sky-950/40 dark:via-slate-900 dark:to-indigo-950/40">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sky-200/40 blur-2xl dark:bg-sky-900/20" />
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400">
            Productivity Card
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl dark:text-slate-100">
            Work faster with one smart PDF workspace
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            Upload, convert, merge, split and download in minutes. TAJ PDF DOCS keeps
            your document flow simple so teams can focus on work, not tools.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2 dark:text-slate-300">
            <div className="rounded-xl border border-sky-100 bg-white px-3 py-2 dark:border-sky-900/50 dark:bg-slate-900">One-click tool switching</div>
            <div className="rounded-xl border border-sky-100 bg-white px-3 py-2 dark:border-sky-900/50 dark:bg-slate-900">Consistent high-quality output</div>
            <div className="rounded-xl border border-sky-100 bg-white px-3 py-2 dark:border-sky-900/50 dark:bg-slate-900">Browser-based workflow</div>
            <div className="rounded-xl border border-sky-100 bg-white px-3 py-2 dark:border-sky-900/50 dark:bg-slate-900">Great for students, teams and businesses</div>
          </div>
        </div>
      </section>
    </div>
  );
}
