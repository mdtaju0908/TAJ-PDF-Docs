"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { apiClient } from "@/lib/api-config";
import { useAppStore } from "@/lib/store";

const DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1 MB
const DEFAULT_RETRY_COUNT = 3;
const PROGRESS_THROTTLE_MS = 100;

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

type UploadProcessResponse = {
  success?: boolean;
  message?: string;
  download_url?: string;
  fileUrl?: string;
  file_url?: string;
  url?: string;
  file_id?: string;
};

interface StartChunkedUploadInput {
  files: File[];
  toolId: string;
  options?: Record<string, string | number | boolean>;
  chunkSize?: number;
  retryCount?: number;
}

export function useChunkedUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const setProcessing = useAppStore(s => s.setProcessing);
  const clearUploadRequests = useAppStore(s => s.clearUploadRequests);

  const pausedRef = useRef(false);
  const cancelledRef = useRef(false);
  const activeControllerRef = useRef<AbortController | null>(null);
  const uploadedIdsRef = useRef<string[]>([]);
  const timingRef = useRef({
    startedAt: 0,
    uploadedBytesCommitted: 0,
    lastPaintAt: 0,
  });

  const pause = useCallback(() => {
    pausedRef.current = true;
    activeControllerRef.current?.abort();
    setProcessing(true, { isPaused: true });
  }, [setProcessing]);

  const resume = useCallback(() => {
    pausedRef.current = false;
    setProcessing(true, { isPaused: false });
  }, [setProcessing]);

  const cancel = useCallback(async () => {
    cancelledRef.current = true;
    activeControllerRef.current?.abort();
    const ids = [...uploadedIdsRef.current];
    for (const uploadId of ids) {
      try {
        const formData = new FormData();
        formData.append("upload_id", uploadId);
        await apiClient.post("/upload/cancel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch {
        // Best effort cleanup.
      }
    }
    setProcessing(false, { progress: 0, phase: "uploading", isPaused: false });
  }, [setProcessing]);

  const waitIfPaused = useCallback(async () => {
    while (pausedRef.current && !cancelledRef.current) {
      const controls = useAppStore.getState().uploadControls;
      if (controls.cancelRequested) {
        clearUploadRequests();
        await cancel();
        throw new Error("Upload cancelled");
      }
      if (controls.resumeRequested) {
        clearUploadRequests();
        resume();
      }
      await wait(150);
    }
  }, [cancel, clearUploadRequests, resume]);

  const syncControlRequests = useCallback(async () => {
    const controls = useAppStore.getState().uploadControls;
    if (controls.cancelRequested) {
      clearUploadRequests();
      await cancel();
      throw new Error("Upload cancelled");
    }
    if (controls.pauseRequested && !pausedRef.current) {
      clearUploadRequests();
      pause();
    }
    if (controls.resumeRequested && pausedRef.current) {
      clearUploadRequests();
      resume();
    }
  }, [cancel, clearUploadRequests, pause, resume]);

  const updateProgress = useCallback(
    (
      totalBytes: number,
      displayedUploadedBytes: number,
      currentFile: File,
      currentFileIndex: number,
      totalFiles: number
    ) => {
      const now = performance.now();
      if (now - timingRef.current.lastPaintAt < PROGRESS_THROTTLE_MS) return;
      timingRef.current.lastPaintAt = now;

      const elapsedSec = Math.max((Date.now() - timingRef.current.startedAt) / 1000, 0.001);
      const speed = displayedUploadedBytes / elapsedSec;
      const remaining = Math.max(totalBytes - displayedUploadedBytes, 0);
      const eta = speed > 0 ? remaining / speed : 0;
      const progress = Math.min((displayedUploadedBytes / Math.max(totalBytes, 1)) * 100, 100);

      setProcessing(true, {
        progress,
        phase: "uploading",
        currentFileIndex,
        totalFiles,
        fileName: currentFile.name,
        fileSize: currentFile.size,
        uploadSpeed: speed,
        timeLeft: eta,
        queueCompletedFiles: Math.max(currentFileIndex - 1, 0),
        queueTotalFiles: totalFiles,
      });
    },
    [setProcessing]
  );

  const startChunkedUpload = useCallback(
    async ({
      files,
      toolId,
      options = {},
      chunkSize = DEFAULT_CHUNK_SIZE,
      retryCount = DEFAULT_RETRY_COUNT,
    }: StartChunkedUploadInput): Promise<UploadProcessResponse> => {
      if (!files.length) throw new Error("No files selected");

      cancelledRef.current = false;
      pausedRef.current = false;
      uploadedIdsRef.current = [];
      clearUploadRequests();
      timingRef.current = {
        startedAt: Date.now(),
        uploadedBytesCommitted: 0,
        lastPaintAt: 0,
      };

      setIsUploading(true);
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

      setProcessing(true, {
        progress: 0,
        phase: "uploading",
        currentFileIndex: 1,
        totalFiles: files.length,
        fileName: files[0]?.name,
        fileSize: files[0]?.size,
        uploadSpeed: 0,
        timeLeft: 0,
        queueCompletedFiles: 0,
        queueTotalFiles: files.length,
        isPaused: false,
      });

      try {
        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
          const file = files[fileIndex];
          const chunks = Math.max(1, Math.ceil(file.size / chunkSize));

          await syncControlRequests();
          await waitIfPaused();
          if (cancelledRef.current) throw new Error("Upload cancelled");

          const initRes = await apiClient.post("/upload/init", {
            file_name: file.name,
            file_size: file.size,
            mime_type: file.type,
            total_chunks: chunks,
          });

          const uploadId: string | undefined = initRes.data?.upload_id;
          if (!uploadId) throw new Error("Failed to initialize upload session");
          uploadedIdsRef.current.push(uploadId);

          for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
            await syncControlRequests();
            await waitIfPaused();
            if (cancelledRef.current) throw new Error("Upload cancelled");

            const chunkBlob = file.slice(chunkIndex * chunkSize, Math.min(file.size, (chunkIndex + 1) * chunkSize));
            let attempt = 0;
            let uploadedChunk = false;

            while (!uploadedChunk && attempt < retryCount) {
              attempt += 1;
              try {
                const formData = new FormData();
                formData.append("upload_id", uploadId);
                formData.append("chunk_index", String(chunkIndex));
                formData.append("total_chunks", String(chunks));
                formData.append("chunk", chunkBlob, `${file.name}.part${chunkIndex}`);

                const controller = new AbortController();
                activeControllerRef.current = controller;

                await apiClient.post("/upload/chunk", formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                  signal: controller.signal,
                  onUploadProgress: event => {
                    const loaded = Math.min(event.loaded ?? 0, chunkBlob.size);
                    const displayed = timingRef.current.uploadedBytesCommitted + loaded;
                    updateProgress(totalBytes, displayed, file, fileIndex + 1, files.length);
                  },
                });

                timingRef.current.uploadedBytesCommitted += chunkBlob.size;
                uploadedChunk = true;
              } catch (error) {
                if (cancelledRef.current) throw new Error("Upload cancelled");
                if (pausedRef.current) break;
                if (attempt >= retryCount) {
                  throw new Error(getErrorMessage(error, "Chunk upload failed after retries"));
                }
                await wait(250 * attempt);
              } finally {
                activeControllerRef.current = null;
              }
            }
          }

          const completeForm = new FormData();
          completeForm.append("upload_id", uploadId);
          await apiClient.post("/upload/complete", completeForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          setProcessing(true, {
            queueCompletedFiles: fileIndex + 1,
            currentFileIndex: Math.min(fileIndex + 2, files.length),
            fileName: files[Math.min(fileIndex + 1, files.length - 1)]?.name,
            fileSize: files[Math.min(fileIndex + 1, files.length - 1)]?.size,
          });
        }

        setProcessing(true, {
          progress: 100,
          phase: "processing",
          uploadSpeed: 0,
          timeLeft: 0,
        });

        const processRes = await apiClient.post("/upload/process", {
          tool: toolId,
          upload_ids: uploadedIdsRef.current,
          options,
        });

        setProcessing(true, {
          phase: "finalizing",
          progress: 100,
          uploadSpeed: 0,
          timeLeft: 0,
          isPaused: false,
        });

        return processRes.data ?? {};
      } finally {
        setIsUploading(false);
        uploadedIdsRef.current = [];
        clearUploadRequests();
      }
    },
    [clearUploadRequests, setProcessing, syncControlRequests, updateProgress, waitIfPaused]
  );

  return useMemo(
    () => ({
      isUploading,
      pause,
      resume,
      cancel,
      startChunkedUpload,
    }),
    [cancel, isUploading, pause, resume, startChunkedUpload]
  );
}
