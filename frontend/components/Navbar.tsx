"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { TOOL_DEFINITIONS } from "@/lib/tools";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const primaryLinks = [
  { href: "/tools/merge", label: "MERGE PDF" },
  { href: "/tools/split", label: "SPLIT PDF" },
  { href: "/tools/compress", label: "COMPRESS PDF" }
];

const mobileLinks = [
  { href: "/tools/merge", label: "Merge PDF" },
  { href: "/tools/split", label: "Split PDF" },
  { href: "/tools/compress", label: "Compress PDF" },
  { href: "/security", label: "Security" },
  { href: "/features", label: "Features" },
  { href: "/legal", label: "Legal" },
  { href: "/#tools", label: "All PDF Tools" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"convert" | "all" | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);

  const convertTools = useMemo(
    () => TOOL_DEFINITIONS.filter(tool => tool.id.includes("-to-") || tool.id === "html-to-pdf"),
    []
  );

  const allTools = useMemo(() => TOOL_DEFINITIONS, []);

  useEffect(() => {
    const onOutsideClick = (event: MouseEvent) => {
      if (!desktopNavRef.current) return;
      if (!desktopNavRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="TAJ PDF Docs" className="h-9 w-auto sm:h-10 dark:invert" />
        </Link>

        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-7 text-sm font-semibold tracking-wide text-slate-900 md:flex"
        >
          {primaryLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-1 transition-all hover:border-slate-900/40 dark:hover:border-slate-100/40",
                pathname === link.href && "border-slate-900 dark:border-slate-100"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(v => (v === "convert" ? null : "convert"))}
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-1 transition-all hover:border-slate-900/40 dark:hover:border-slate-100/40",
                activeMenu === "convert" && "border-slate-900 dark:border-slate-100"
              )}
            >
              CONVERT PDF
              <ChevronDown className={cn("h-4 w-4 transition", activeMenu === "convert" && "rotate-180")} />
            </button>
            {activeMenu === "convert" && (
              <div className="absolute left-0 top-full mt-3 w-[300px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Convert Tools
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {convertTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      onClick={() => setActiveMenu(null)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveMenu(v => (v === "all" ? null : "all"))}
              className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent py-1 transition-all hover:border-slate-900/40 dark:hover:border-slate-100/40",
                activeMenu === "all" && "border-slate-900 dark:border-slate-100"
              )}
            >
              ALL PDF TOOLS
              <ChevronDown className={cn("h-4 w-4 transition", activeMenu === "all" && "rotate-180")} />
            </button>
            {activeMenu === "all" && (
              <div className="absolute right-0 top-full mt-3 w-[360px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  All Tools
                </p>
                <div className="grid max-h-[340px] grid-cols-2 gap-1 overflow-y-auto pr-1">
                  {allTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      onClick={() => setActiveMenu(null)}
                      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      {tool.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <ThemeToggle />
        </nav>

        <div className="hidden items-center gap-3 md:flex"></div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-4 rounded-full bg-slate-900 dark:bg-slate-100" />
            <span className="block h-0.5 w-4 rounded-full bg-slate-900 dark:bg-slate-100" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm md:px-6 lg:px-8">
            {mobileLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900",
                  pathname === link.href && "bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100"
                )}
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
