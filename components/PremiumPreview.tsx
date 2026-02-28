"use client";

interface PremiumPreviewProps {
  file: File;
  extensionLabel: string;
  iconBg: string;
  iconColor: string;
}

export function PremiumPreview({ file, extensionLabel, iconBg, iconColor }: PremiumPreviewProps) {
  return (
    <div className="w-56 rounded-2xl bg-white p-6 shadow-md">
      <div className="relative flex h-40 items-center justify-center rounded-xl bg-gray-50">
        <div className="text-5xl font-bold text-gray-300">{extensionLabel}</div>
        <div
          className={`${iconBg} ${iconColor} absolute left-3 top-3 rounded-md px-2 py-1 text-xs font-semibold`}
        >
          {extensionLabel}
        </div>
      </div>
      <p className="mt-3 truncate text-sm text-gray-700">{file.name}</p>
      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
    </div>
  );
}

