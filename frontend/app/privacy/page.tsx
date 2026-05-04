import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how TAJ PDF Docs collects, uses, and protects your data."
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "We only collect the minimum information needed to provide and improve our services, such as basic usage data and files you choose to process."
  },
  {
    title: "How We Use Information",
    content:
      "Data is used to run PDF tools, improve performance, and support users. We do not sell your personal information."
  },
  {
    title: "File Handling and Retention",
    content:
      "Uploaded files are processed securely and automatically removed after a short retention period."
  },
  {
    title: "Security Practices",
    content:
      "We use secure HTTPS connections and industry-standard safeguards to protect data in transit and during processing."
  },
  {
    title: "Your Rights",
    content:
      "You may request information, updates, or deletion related to your personal data where applicable by law."
  }
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6 lg:px-8">
      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Privacy Policy
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
