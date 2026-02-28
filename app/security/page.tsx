import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Understand how TAJ PDF Docs protects your documents with encryption and controls."
};

const items = [
  {
    title: "Encryption everywhere",
    description:
      "Uploads travel over TLS 1.2+ and are encrypted at rest with strong ciphers."
  },
  {
    title: "Short-lived processing",
    description:
      "Documents are retained only for the time needed to complete your operation."
  },
  {
    title: "Access controls",
    description:
      "Role-based permissions ensure only the right people can see sensitive files."
  },
  {
    title: "Compliance-ready",
    description:
      "Built with security best practices to support risk reviews and audits."
  }
];

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <div className="mb-6 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Security and privacy by default
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          TAJ PDF Docs is designed for teams that handle contracts, financial records and
          sensitive documents every day. Security is built into each feature.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(item => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

