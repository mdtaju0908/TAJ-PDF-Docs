import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Read the disclaimer regarding use of TAJ PDF Docs and related services."
};

const points = [
  "TAJ PDF Docs provides document tools for general informational and productivity purposes.",
  "While we strive for accuracy and reliability, we do not guarantee error-free results in every case.",
  "You are responsible for reviewing output files before official, legal, or business use.",
  "We are not liable for losses resulting from misuse, service interruptions, or third-party dependencies.",
  "External links or references are provided for convenience and do not imply endorsement."
];

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Disclaimer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Last updated: April 24, 2026
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <ul className="space-y-3">
          {points.map(point => (
            <li key={point} className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
