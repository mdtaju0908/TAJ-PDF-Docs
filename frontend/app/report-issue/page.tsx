import { IssueReportModal } from "@/components/IssueReportModal";

export default function ReportIssuePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-14 text-center md:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">Report an Issue</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        The report form opens in a popup. Click the button below to submit your issue.
      </p>
      <div className="mt-6">
        <IssueReportModal
          triggerLabel="Open Report Form"
          triggerClassName="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700"
        />
      </div>
    </div>
  );
}
