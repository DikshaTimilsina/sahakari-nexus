export type StatCardData = {
  label: string;
  value: string;
  change: string;
  trend: "positive" | "warning";
};

export type AnalysisStatus = "Stable" | "Watch" | "High risk";

export type RecentAnalysisData = {
  cooperativeName: string;
  score: number;
  status: AnalysisStatus;
  updatedAt: string;
};