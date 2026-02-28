"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Tools" },
  { href: "/security", label: "Security" },
  { href: "/features", label: "Features" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 via-red-500 to-orange-400 text-white shadow-md">
            <span className="text-lg font-semibold">T</span>
          </div>
          <div>
            <Link href="/" className="block text-sm font-semibold tracking-tight">
              TAJ PDF Docs
            </Link>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {mainLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-slate-900",
                pathname === link.href && "text-slate-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex"></div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-4 rounded-full bg-slate-900" />
            <span className="block h-0.5 w-4 rounded-full bg-slate-900" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm md:px-6 lg:px-8">
            {mainLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-3 py-2 text-slate-700 hover:bg-slate-50",
                  pathname === link.href && "bg-slate-50 text-slate-900"
                )}
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3"></div>
          </div>
        </div>
      )}
    </header>
  );
}
