import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Download,
  FileLock2,
  Files,
  HardDriveDownload,
  Lock,
  ServerCog,
  ShieldCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Understand how TAJ PDF Docs protects your documents with encryption and controls."
};

interface SecurityItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

const items: SecurityItem[] = [
  {
    title: "End-to-End Encryption",
    description:
      "Your files are encrypted during upload and processing using HTTPS/SSL.",
    icon: Lock
  },
  {
    title: "Automatic File Deletion",
    description:
      "Uploaded files are removed automatically after a short time, such as 1 hour.",
    icon: FileLock2
  },
  {
    title: "No File Storage Policy",
    description:
      "We do not permanently store your files on our servers.",
    icon: Files
  },
  {
    title: "Secure Processing",
    description:
      "Files are handled in isolated environments to keep processing safe.",
    icon: ServerCog
  },
  {
    title: "Privacy First",
    description:
      "No personal data is collected without your clear consent.",
    icon: ShieldCheck
  },
  {
    title: "Safe Downloads",
    description:
      "Processed files are delivered safely and checked for clean output.",
    icon: Download
  },
  {
    title: "HTTPS Protection",
    description:
      "The complete platform runs on secure HTTPS for trusted communication.",
    icon: HardDriveDownload
  }
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm md:p-8 dark:border-emerald-900/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-cyan-950/30">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          Security & Privacy
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
          Security and privacy by default
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-400">
          TAJ PDF Docs is built to keep your documents safe with clear and transparent privacy practices.
          Every upload and download is protected so you can work confidently.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          <BadgeCheck className="h-4 w-4" />
          <span>Your files are private and secure</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <Card key={item.title} className="h-full border-slate-200/90 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
            <CardHeader className="pb-3">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                <item.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Want more details about data handling?
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Read our privacy policy for full transparency.
          </p>
        </div>
        <Link
          href="/privacy"
          className="inline-flex w-max items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Learn More
        </Link>
      </section>
    </div>
  );
}

