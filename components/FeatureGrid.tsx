import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "Enterprise-grade security",
    description:
      "Files are processed over encrypted connections with strict access controls.",
    accent: "bg-emerald-500"
  },
  {
    title: "Cloud-native performance",
    description:
      "Optimized for large documents with parallel processing and smart queuing.",
    accent: "bg-sky-500"
  },
  {
    title: "Team-ready workspace",
    description:
      "Built for product teams, legal ops and finance to collaborate securely.",
    accent: "bg-violet-500"
  },
  {
    title: "Global availability",
    description:
      "Low-latency edge delivery so your tools feel instant from any region.",
    accent: "bg-orange-500"
  }
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {features.map(feature => (
        <Card key={feature.title}>
          <CardHeader>
            <div className="flex gap-3">
              <div
                className={`mt-1 h-9 w-9 rounded-2xl ${feature.accent} shadow-md`}
              />
              <div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

