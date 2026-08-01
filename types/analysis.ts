export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface RiskFactor {
  id: string;
  title: string;
  description: string;
  impact: RiskLevel;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
}

export interface ChartPoint {
  category: string;
  score: number;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  riskFactors: RiskFactor[];
  recommendations: Recommendation[];
  chartData: ChartPoint[];
  createdAt: string;
}