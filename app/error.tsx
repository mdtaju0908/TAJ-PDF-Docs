"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="max-w-md rounded-3xl border border-red-100 bg-white px-6 py-6 text-center shadow-soft">
          <h1 className="text-lg font-semibold text-slate-900">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            We were unable to load this view. The team has been notified.
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            {error.message || "Unexpected application error."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-xs font-medium text-white shadow-md hover:shadow-lg"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

