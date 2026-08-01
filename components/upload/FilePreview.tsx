"use client";

import { FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import type { UploadFile } from "@/types/upload";
import { ProgressBar } from "./ProgressBar";

type FilePreviewProps = {
  file: UploadFile;
  onRemove: (id: string) => void;
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
      <FileText className="h-8 w-8 flex-shrink-0 text-slate-500" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-white">
            {file.name}
          </p>

          {file.status === "success" && (
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-400" />
          )}
          {file.status === "error" && (
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
          )}
        </div>

        <p className="mb-2 text-xs text-slate-500">
          {formatFileSize(file.size)}
        </p>

        {file.status === "uploading" && (
          <ProgressBar progress={file.progress} />
        )}
      </div>

      <button
        onClick={() => onRemove(file.id)}
        className="flex-shrink-0 rounded-full p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}