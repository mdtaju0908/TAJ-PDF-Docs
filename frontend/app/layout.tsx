import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://taj-pdf-docs.vercel.app").replace(/\/+$/, "");

export const metadata: Metadata = {
  title: {
    default: "TAJ PDF Docs – Modern PDF Tools for Teams",
    template: "%s · TAJ PDF Docs"
  },
  description:
    "TAJ PDF Docs is a modern SaaS platform for merging, splitting, compressing and converting PDFs with enterprise-grade security.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  openGraph: {
    title: "TAJ PDF Docs – All-in-One PDF Tools Platform",
    description:
      "Merge, split, compress and convert PDFs in seconds. Built for product, legal and finance teams.",
    url: siteUrl,
    siteName: "TAJ PDF Docs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.svg",
        width: 240,
        height: 60,
        alt: "TAJ PDF Docs Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TAJ PDF Docs – All-in-One PDF Tools Platform",
    description:
      "Merge, split, compress and convert PDFs in seconds. Built for product, legal and finance teams.",
    images: ["/logo.svg"]
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-64x64.png", type: "image/png", sizes: "64x64" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
          <ProcessingOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}

