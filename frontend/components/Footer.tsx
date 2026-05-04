import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TOOL_DEFINITIONS } from "@/lib/tools";

export function Footer() {
  const topTools = TOOL_DEFINITIONS.slice(0, 6);
  const mobileTopTools = topTools.slice(0, 3);

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-slate-700 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="pointer-events-none absolute -left-24 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-8 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[1380px] px-4 py-8 md:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/logo.svg" alt="TAJ PDF Docs" className="h-9 w-auto invert" />
            </Link>
            <p className="max-w-md text-sm leading-6 text-slate-200">
              TAJ PDF DOCS provides fast, reliable and secure PDF tools for everyday workflows.
              Merge, split, compress and convert documents in seconds.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
                No Login Required
              </span>
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
                Secure Processing
              </span>
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                Fast Downloads
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-100">Quick Links</h4>
            <div className="mt-2 flex flex-col gap-2 text-sm text-slate-300">
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
              <Link href="/#tools" className="transition hover:text-white">
                All Tools
              </Link>
              <Link href="/security" className="transition hover:text-white">
                Security
              </Link>
              <Link href="/features" className="transition hover:text-white">
                Features
              </Link>
              <Link href="/legal" className="transition hover:text-white">
                Legal
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold tracking-wide text-slate-100">Top Tools</h4>
            <div className="mt-2 hidden grid-cols-1 gap-2 sm:grid sm:grid-cols-2">
              {topTools.map((tool, index) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                >
                  <span className="min-w-0 truncate">
                    <span className="mr-2 text-xs text-slate-400 group-hover:text-violet-200">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    {tool.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-violet-200" />
                </Link>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:hidden">
              {mobileTopTools.map((tool, index) => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-700 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
                >
                  <span className="min-w-0 truncate">
                    <span className="mr-2 text-xs text-slate-400 group-hover:text-violet-200">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    {tool.title}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-violet-200" />
                </Link>
              ))}
              <Link
                href="/#tools"
                className="rounded-xl border border-slate-600 bg-white/5 px-3 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:border-violet-400/40 hover:text-white"
              >
                View All Tools
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-600 bg-white/10 p-4 text-xs text-slate-200 shadow-sm backdrop-blur-sm md:flex md:items-center md:justify-between">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} TAJ PDF Docs. All rights reserved.</p>
            <p className="text-slate-300">Developed by: Er. MD TAJU</p>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 md:mt-0 md:justify-end">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link href="/help" className="transition hover:text-white">
              Help Center
            </Link>
            <Link href="/#tools" className="transition hover:text-white">
              Explore Tools
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="transition hover:text-white">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
