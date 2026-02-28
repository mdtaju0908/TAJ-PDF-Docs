import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why TAJ PDF Docs was built and how it supports modern document teams."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Built for the teams that live in PDFs
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          TAJ PDF Docs was created for legal, finance and operations teams who process
          documents all day. Instead of juggling desktop tools and ad‑hoc scripts, you
          get a single, dependable workspace for every PDF workflow.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Focused on reliability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              The platform is optimized for large contracts, reports and multi‑year
              archives so you can trust every operation, every time.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Opinionated about security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Encryption, access controls and short‑lived processing are treated as
              defaults, not add‑ons.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ready to integrate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              A clean API layer and event‑driven design make it simple to plug TAJ PDF
              Docs into your existing systems.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

