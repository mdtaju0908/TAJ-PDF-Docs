export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <p className="text-sm font-medium text-slate-600">
          Preparing your TAJ PDF Docs workspace…
        </p>
      </div>
    </div>
  );
}

