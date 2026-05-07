"use client";

import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ProcessingOverlay() {
  const {
    isProcessing,
    progress,
    phase,
    currentFileIndex,
    totalFiles,
    fileName,
    fileSize,
    uploadSpeed,
    timeLeft,
    queueCompletedFiles,
    queueTotalFiles,
    isPaused,
  } = useAppStore(s => s.processingState);
  const requestPauseUpload = useAppStore(s => s.requestPauseUpload);
  const requestResumeUpload = useAppStore(s => s.requestResumeUpload);
  const requestCancelUpload = useAppStore(s => s.requestCancelUpload);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isProcessing) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isProcessing]);

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

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isProcessing ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center bg-slate-100/80 px-4 backdrop-blur-md dark:bg-slate-950/80"
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl border border-white/60 bg-white/80 px-6 py-8 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl md:px-10 md:py-10 dark:border-slate-800/60 dark:bg-slate-900/80 dark:ring-white/5"
        >
          <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl dark:text-slate-100">
            {phase === "finalizing"
              ? "Finalizing Taj PDF Docs output"
              : phase === "processing"
              ? "AI is processing your files"
              : `Uploading file ${currentFileIndex || 1} of ${totalFiles || 1}`}
          </h2>
          <p className="mt-3 text-center text-sm font-medium text-slate-500 md:text-base dark:text-slate-400">
            {phase === "finalizing"
              ? "Preparing your secure download package..."
              : phase === "processing"
              ? "Upload complete. Processing speed depends on current server load."
              : `${fileName || "Preparing upload..."} ${fileSize ? `(${formatSize(fileSize)})` : ""}`}
          </p>

          <div className="mt-8 h-4 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80">
            <motion.div
              className={cn(
                "h-full rounded-full",
                phase === "processing" || phase === "finalizing" ? "bg-emerald-500" : "bg-red-600"
              )}
              animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              transition={{ ease: "easeOut", duration: 0.22 }}
            />
          </div>

          <div className="mt-8 text-center">
            <motion.span
              key={Math.round(progress)}
              initial={{ opacity: 0.65, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16 }}
              className="inline-block text-7xl font-black tracking-tight text-slate-900 md:text-8xl dark:text-slate-100"
            >
              {Math.round(progress)}%
            </motion.span>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              {phase === "finalizing" ? "Finalizing" : phase === "processing" ? "Processing" : isPaused ? "Paused" : "Uploading"}
            </p>
          </div>

          <div className="mt-7 grid gap-3 text-sm text-slate-600 md:grid-cols-3 dark:text-slate-300">
            <div className="rounded-xl bg-slate-50/90 px-4 py-3 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Upload Speed</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">{formatSpeed(uploadSpeed)}</p>
            </div>
            <div className="rounded-xl bg-slate-50/90 px-4 py-3 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Estimated Time</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {timeLeft !== undefined ? Math.max(0, Math.round(timeLeft)) : 0} sec
              </p>
            </div>
            <div className="rounded-xl bg-slate-50/90 px-4 py-3 dark:bg-slate-800/70">
              <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Queue</p>
              <p className="mt-1 font-semibold text-slate-800 dark:text-slate-100">
                {queueCompletedFiles ?? 0}/{queueTotalFiles ?? totalFiles ?? 1} files
              </p>
            </div>
          </div>

          {(phase === "processing" || phase === "finalizing") && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{phase === "finalizing" ? "Finalizing output..." : "Processing on server..."}</span>
            </div>
          )}

          {phase === "uploading" && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => (isPaused ? requestResumeUpload() : requestPauseUpload())}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {isPaused ? "Resume Upload" : "Pause Upload"}
              </button>
              <button
                type="button"
                onClick={requestCancelUpload}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Cancel Upload
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
