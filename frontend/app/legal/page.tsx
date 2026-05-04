import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Legal",
  description:
    "Review the Privacy Policy, Terms & Conditions, and Disclaimer for TAJ PDF Docs."
};

const legalItems = [
  {
    title: "Privacy Policy",
    description: "Learn how your data is handled, protected, and processed.",
    href: "/privacy",
    icon: Shield
  },
  {
    title: "Terms & Conditions",
    description: "Understand the rules and responsibilities while using the platform.",
    href: "/terms",
    icon: FileCheck2
  },
  {
    title: "Disclaimer",
    description: "Read important limitations and informational notices.",
    href: "/disclaimer",
    icon: FileText
  }
];

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-6 shadow-sm md:p-8 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
          Legal Information
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-400">
          Please review our legal documents for clear information on privacy, terms of use, and disclaimers.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {legalItems.map(item => (
          <Link key={item.title} href={item.href} className="group block">
            <Card className="h-full border-slate-200/90 bg-white/90 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90">
              <CardHeader className="pb-3">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <item.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
