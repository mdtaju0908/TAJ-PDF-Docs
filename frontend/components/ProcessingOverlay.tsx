"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ProcessingOverlay() {
  const { 
    isProcessing, 
    progress, 
    currentFileIndex, 
    totalFiles, 
    fileName, 
    fileSize, 
    uploadSpeed, 
    timeLeft 
  } = useAppStore(s => s.processingState);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

  if (!visible) return null;

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatSpeed = (bytesPerSecond?: number) => {
    if (!bytesPerSecond) return "0 KB/S";
    const k = 1024;
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    const sizes = ["B", "KB", "MB", "GB"];
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(0)) + " " + sizes[i] + "/S";
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-slate-50/90 backdrop-blur-sm transition-opacity duration-300 dark:bg-slate-950/90",
      isProcessing ? "opacity-100" : "opacity-0"
    )}>
      <div className="w-full max-w-2xl px-6 py-12 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
          {progress >= 100 ? "Processing files..." : `Uploading file ${currentFileIndex || 1} of ${totalFiles || 1}`}
        </h2>
        <p className="mt-4 text-lg font-bold text-slate-500 tracking-tight dark:text-slate-400">
          {progress >= 100 ? "Please wait while we handle your documents" : `${fileName || "Preparing upload..."} ${fileSize ? `(${formatSize(fileSize)})` : ""}`}
        </p>
        
        {progress < 100 && (
          <div className="mt-12 flex justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span>Time left</span>
            <span className="text-slate-700 font-bold dark:text-slate-200">{timeLeft !== undefined ? Math.max(0, Math.round(timeLeft)) : 0} SECONDS</span>
            <span className="mx-2 opacity-30">-</span>
            <span>Upload speed</span>
            <span className="text-slate-700 font-bold dark:text-slate-200">{formatSpeed(uploadSpeed)}</span>
          </div>
        )}

        <div className="mt-8 h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div 
            className={cn(
              "h-full transition-all duration-300 ease-out",
              progress >= 100 ? "bg-emerald-500 animate-pulse" : "bg-red-600 dark:bg-red-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-10 flex flex-col items-center">
          <span className="text-7xl font-black text-slate-900 md:text-8xl dark:text-slate-100">{Math.round(progress)}%</span>
          <span className="mt-2 text-2xl font-black text-slate-400 uppercase tracking-[0.2em] dark:text-slate-500">
            {progress >= 100 ? "Finalizing" : "Uploaded"}
          </span>
        </div>
      </div>
    </div>
  );
}
