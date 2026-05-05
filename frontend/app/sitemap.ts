import type { MetadataRoute } from "next";
import { TOOL_DEFINITIONS } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://taj-pdf-docs.vercel.app").replace(/\/+$/, "");
  const now = new Date();

  const staticPaths = [
    "/",
    "/about",
    "/disclaimer",
    "/features",
    "/help",
    "/legal",
    "/privacy",
    "/security",
    "/terms"
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changefreq: "weekly",
      priority: 0.7
    })),
    ...TOOL_DEFINITIONS.map((t) => ({
      url: `${base}/tools/${t.id}`,
      lastModified: now,
      changefreq: "weekly",
      priority: 0.8
    }))
  ];

  return entries;
}
