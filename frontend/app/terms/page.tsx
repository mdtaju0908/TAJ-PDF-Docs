import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions for using TAJ PDF Docs."
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By using TAJ PDF Docs, you agree to these terms and applicable laws."
  },
  {
    title: "Use of Services",
    content:
      "You agree to use the platform responsibly and not upload unlawful, harmful, or unauthorized content."
  },
  {
    title: "Account and Access",
    content:
      "Some features may require account access. You are responsible for maintaining account security."
  },
  {
    title: "Intellectual Property",
    content:
      "All branding, software, and content on this platform are protected by intellectual property laws."
  },
  {
    title: "Limitation of Liability",
    content:
      "TAJ PDF Docs is provided as is. We are not liable for indirect or consequential damages arising from use."
  },
  {
    title: "Updates to Terms",
    content:
      "We may revise these terms from time to time. Continued use means acceptance of updated terms."
  }
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Terms & Conditions
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Last updated: April 24, 2026
        </p>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {sections.map(section => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {section.title}
            </h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
              {section.content}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
