"use client";

import { useEffect, useMemo } from "react";
import { FileText, FileImage, FileSpreadsheet } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  const fileType = file.type || "";
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const isImage = fileType.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = fileType === "application/pdf" || ext === "pdf";
  const isSpreadsheet =
    fileType.includes("spreadsheet") ||
    ["xls", "xlsx", "csv"].includes(ext) ||
    fileType === "application/vnd.ms-excel" ||
    fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const isWord =
    fileType.includes("word") ||
    ["doc", "docx"].includes(ext) ||
    fileType === "application/msword" ||
    fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isPpt =
    fileType.includes("presentation") ||
    ["ppt", "pptx"].includes(ext) ||
    fileType === "application/vnd.ms-powerpoint" ||
    fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation";

  const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  return (
    <div className="relative rounded-xl bg-white p-4 shadow">
      {isImage && (
        <img src={previewUrl} alt={file.name} className="h-32 w-full rounded-lg object-cover" />
      )}

      {!isImage && isPdf && (
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100">
          <FileText size={40} />
        </div>
      )}

      {!isImage && isSpreadsheet && (
        <div className="flex h-32 items-center justify-center rounded-lg bg-green-50">
          <FileSpreadsheet size={40} className="text-green-600" />
        </div>
      )}

      {!isImage && isWord && (
        <div className="flex h-32 items-center justify-center rounded-lg bg-blue-50">
          <FileText size={40} className="text-blue-600" />
        </div>
      )}

      {!isImage && isPpt && (
        <div className="flex h-32 items-center justify-center rounded-lg bg-orange-50">
          <FileText size={40} className="text-orange-600" />
        </div>
      )}

      {!isImage && !isPdf && !isSpreadsheet && !isWord && !isPpt && (
        <div className="flex h-32 items-center justify-center rounded-lg bg-gray-100">
          <FileText size={40} />
        </div>
      )}

      <p className="mt-2 truncate text-sm">{file.name}</p>
      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

      <button onClick={onRemove} className="absolute right-2 top-2 rounded-md px-2 py-1 text-red-600">
        ✕
      </button>
    </div>
  );
}
