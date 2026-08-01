export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  error?: string;
}