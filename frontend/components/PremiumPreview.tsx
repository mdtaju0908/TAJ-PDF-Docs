"use client";

interface PremiumPreviewProps {
  file: File;
  extensionLabel: string;
  iconBg: string;
  iconColor: string;
}

export function PremiumPreview({ file, extensionLabel, iconBg, iconColor }: PremiumPreviewProps) {
  return (
    <div className="w-56 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="relative flex h-40 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/70">
        <div className="text-5xl font-bold text-slate-300 dark:text-slate-600">{extensionLabel}</div>
        <div
          className={`${iconBg} ${iconColor} absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold`}
        >
          {extensionLabel}
        </div>
      </div>
      <p className="mt-3 truncate text-sm text-slate-700 dark:text-slate-200">{file.name}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
    </div>
  );
}

