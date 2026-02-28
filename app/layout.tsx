import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "TAJ PDF Docs – Modern PDF Tools for Teams",
    template: "%s · TAJ PDF Docs"
  },
  description:
    "TAJ PDF Docs is a modern SaaS platform for merging, splitting, compressing and converting PDFs with enterprise-grade security.",
  metadataBase: new URL("https://taj-pdf-docs.example.com"),
  openGraph: {
    title: "TAJ PDF Docs – All-in-One PDF Tools Platform",
    description:
      "Merge, split, compress and convert PDFs in seconds. Built for product, legal and finance teams.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Navbar />
        <main className="min-h-[70vh]">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

