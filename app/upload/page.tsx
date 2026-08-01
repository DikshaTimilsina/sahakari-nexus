"use client";

import { useFileUpload } from "@/hooks/useFileUpload";
import { UploadBox } from "@/components/upload/UploadBox";
import { FilePreview } from "@/components/upload/FilePreview";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
  const {
    files,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useFileUpload();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-white">
          Upload Cooperative Documents
        </h1>
        <p className="mb-8 text-slate-400">
          Upload financial statements or reports for AI-powered risk analysis.
        </p>

        <UploadBox
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onFilesSelected={addFiles}
        />

        {files.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Files ({files.length})
            </h2>

            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <FilePreview file={file} onRemove={removeFile} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}