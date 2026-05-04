import type { Metadata } from "next";
import Link from "next/link";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn why TAJ PDF Docs was built and how it supports modern document teams."
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 shadow-sm md:p-8 dark:border-indigo-900/50 dark:from-indigo-950/50 dark:via-slate-900 dark:to-cyan-950/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          About Us
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl dark:text-slate-100">
          About TAJ PDF Docs
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 md:text-base dark:text-slate-400">
          TAJ PDF Docs is a fast, secure, and easy-to-use platform designed to simplify
          everyday document workflows. From merging and compressing to converting PDFs, we
          bring all essential tools into one seamless experience. Built with a focus on
          performance and privacy, our goal is to make document management effortless for
          everyone without complexity or signups.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="mb-2">
              <img
                src="https://mdtaju.tech/profile.svg"
                alt="Er. Md Taju Portfolio"
                className="h-14 w-14 rounded-full border border-indigo-200 bg-white p-1 shadow-sm dark:border-indigo-800 dark:bg-slate-900"
              />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
              Founder & Developer
            </p>
            <CardTitle className="text-2xl">Er. Md Taju</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              Er. Md Taju is a B.Tech student specializing in Artificial
              Intelligence and Machine Learning at Vivekananda Global University (VGU),
              Jaipur. Originally from Samastipur, Bihar, he is an aspiring software
              engineer and passionate tech enthusiast.
            </p>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              He has hands-on experience in AI/ML, cloud computing (AWS), and modern web
              development. Through projects like TAJ PDF Docs, he aims to build practical,
              user-friendly tools that solve real-world problems. He also actively shares
              his learning journey and insights with the tech community.
            </p>
            <div className="flex flex-wrap gap-2">
              {["AI/ML", "AWS", "App & Web Development", "Problem Solving"].map(skill => (
                <span
                  key={skill}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
            <Link
              href="https://mdtaju.tech"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
            >
              <Globe className="h-4 w-4" />
              <span>Visit Portfolio</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-b from-emerald-50 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-slate-900">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Built by a Passionate Developer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              Crafted with dedication and continuous learning, TAJ PDF Docs reflects a
              mission to deliver simple yet powerful tools for everyone.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
