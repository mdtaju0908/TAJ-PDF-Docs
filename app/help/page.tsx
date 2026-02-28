import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help center",
  description:
    "Get answers to common questions about using TAJ PDF Docs in your team."
};

const topics = [
  {
    title: "Getting started",
    description:
      "Learn how to upload documents, run your first tools and invite teammates."
  },
  {
    title: "Working with tools",
    description:
      "Understand how merges, splits, conversions and security tools behave."
  },
  {
    title: "Billing and plans",
    description:
      "Find details on subscriptions, invoices and how to change plans."
  },
  {
    title: "Security and privacy",
    description:
      "Review how we protect your data and what controls you can configure."
  }
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Help center
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Browse the topics below or reach out to your TAJ PDF Docs contact for
          implementation support.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {topics.map(topic => (
          <Card key={topic.title}>
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

