"use client";

import { useState, useCallback } from "react";
import type { UploadFile } from "@/types/upload";

export function useFileUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const mapped: UploadFile[] = Array.from(newFiles).map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "idle",
    }));

    setFiles((prev) => [...prev, ...mapped]);
    mapped.forEach((f) => simulateUpload(f.id));
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const simulateUpload = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "uploading" } : f))
    );

    const interval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => {
          if (f.id !== id) return f;
          const nextProgress = Math.min(f.progress + 10, 100);
          return {
            ...f,
            progress: nextProgress,
            status: nextProgress === 100 ? "success" : "uploading",
          };
        })
      );
    }, 200);

    setTimeout(() => clearInterval(interval), 2200);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  return {
    files,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}