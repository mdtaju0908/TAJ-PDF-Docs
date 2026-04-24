import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FileLock2,
  FolderArchive,
  Minimize2,
  Search,
  Scissors,
  Shuffle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Help center",
  description:
    "Get answers to common questions about using TAJ PDF Docs in your team."
};

const categories = [
  {
    title: "Merge",
    description:
      "Combine multiple files into one polished PDF in the right order.",
    icon: FolderArchive
  },
  {
    title: "Split",
    description:
      "Extract pages or break one PDF into smaller documents quickly.",
    icon: Scissors
  },
  {
    title: "Compress",
    description:
      "Reduce PDF size while maintaining readability and quality.",
    icon: Minimize2
  },
  {
    title: "Convert",
    description:
      "Switch between PDF, Word, Excel, PowerPoint, and image formats.",
    icon: Shuffle
  },
  {
    title: "Security",
    description:
      "Protect, unlock, and safely process documents with privacy controls.",
    icon: FileLock2
  }
];

const articles = [
  {
    title: "How to merge PDF files in the correct order",
    excerpt: "Upload multiple PDFs, drag to reorder, and export one final file.",
    category: "Merge",
    icon: FolderArchive
  },
  {
    title: "Split one PDF into multiple documents",
    excerpt: "Use page ranges or specific pages to generate separate files.",
    category: "Split",
    icon: Scissors
  },
  {
    title: "Best compression level for readable results",
    excerpt: "Choose low, medium, or high compression based on your use case.",
    category: "Compress",
    icon: Minimize2
  },
  {
    title: "Convert PDF to DOCX, XLSX, and JPG formats",
    excerpt: "Select your target format and get export-ready output in seconds.",
    category: "Convert",
    icon: Shuffle
  },
  {
    title: "How TAJ PDF Docs protects your uploaded files",
    excerpt: "Learn about secure transfer, processing controls, and retention.",
    category: "Security",
    icon: FileLock2
  },
  {
    title: "Fix failed conversions or unsupported files",
    excerpt: "Check format compatibility and troubleshoot common upload issues.",
    category: "General",
    icon: Search
  }
];

const faqs = [
  {
    question: "Do I need to create an account to use TAJ PDF Docs?",
    answer:
      "No. Most tools work instantly without signup, so you can upload and process files quickly."
  },
  {
    question: "Which file formats are supported for conversion?",
    answer:
      "TAJ PDF Docs supports popular formats including PDF, DOCX, XLSX, PPTX, JPG, and PNG depending on the selected tool."
  },
  {
    question: "Is there a file size limit?",
    answer:
      "File size limits vary by tool and browser capability. If a file is too large, split or compress it before retrying."
  },
  {
    question: "How secure is my uploaded data?",
    answer:
      "Files are processed through secure channels, and temporary data is removed according to platform cleanup policies."
  }
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 lg:px-8">
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm md:p-8 dark:border-indigo-900/50 dark:from-indigo-950/50 dark:via-slate-900 dark:to-cyan-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Help Center
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
          How can we help you?
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base dark:text-slate-400">
          Find guides, troubleshooting tips, and best practices for every PDF workflow.
        </p>
        <div className="mt-6">
          <label
            htmlFor="help-search"
            className="sr-only"
          >
            Search help
          </label>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            <input
              id="help-search"
              type="text"
              placeholder="How can we help you?"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Browse by category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map(item => (
            <Card key={item.title} className="h-full">
              <CardHeader className="pb-2">
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
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Popular articles
          </h2>
          <Link
            href="/#tools"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Explore all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(article => (
            <Card key={article.title} className="h-full">
              <CardHeader className="pb-2">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300">
                    {article.category}
                  </span>
                  <article.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <CardTitle className="text-base leading-6">{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {article.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Frequently asked questions
        </h2>
        <div className="space-y-3">
          {faqs.map(faq => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition open:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:open:border-indigo-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {faq.question}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180 dark:text-slate-500" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/tools/merge"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50"
        >
          Merge PDF now
        </Link>
        <Link
          href="/tools/compress"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
        >
          Compress documents
        </Link>
        <Link
          href="/tools/pdf-to-word"
          className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
        >
          Convert PDF to Word
        </Link>
        <Link
          href="/security"
          className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-900/50 dark:bg-cyan-950/30 dark:text-cyan-300 dark:hover:bg-cyan-950/50"
        >
          Security overview
        </Link>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Still need help?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Contact our support team for troubleshooting, enterprise setup guidance, and workflow assistance.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/help"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Contact Support
            </Link>
            <Link
              href="/about"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              About TAJ PDF Docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
