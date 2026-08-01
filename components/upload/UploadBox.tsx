"use client";

import { useRef } from "react";
import { UploadCloud } from "lucide-react";

type UploadBoxProps = {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onFilesSelected: (files: FileList) => void;
};

export function UploadBox({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilesSelected,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors duration-200 ${
        isDragging
          ? "border-cyan-400 bg-slate-800/60"
          : "border-slate-700 bg-slate-900/40 hover:bg-slate-900/70"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onFilesSelected(e.target.files);
        }}
      />

      <UploadCloud className="mb-4 h-12 w-12 text-cyan-300" />

      <p className="text-lg font-semibold text-white">
        Drag & drop your files here
      </p>
      <p className="mt-1 text-sm text-slate-400">
        or <span className="text-cyan-300 underline">click to browse</span>
      </p>
    </div>
  );
}