import type { AnalysisResult } from "@/types/analysis";

export function getMockAnalysis(fileName: string): AnalysisResult {
  return {
    id: crypto.randomUUID(),
    fileName,
    riskScore: 68,
    riskLevel: "moderate",
    summary:
      "This cooperative shows stable membership growth but declining loan repayment consistency over the last two quarters. Liquidity remains within safe limits, though reserve funds have not grown proportionally to lending activity.",
    riskFactors: [
      {
        id: "rf-1",
        title: "Declining repayment rate",
        description:
          "Loan repayment consistency dropped by 9% compared to the previous quarter.",
        impact: "high",
      },
      {
        id: "rf-2",
        title: "Reserve fund growth lagging",
        description:
          "Reserve funds grew slower than total lending volume, reducing the safety margin.",
        impact: "moderate",
      },
      {
        id: "rf-3",
        title: "Stable membership base",
        description:
          "Active membership grew 4% with low churn, supporting long-term stability.",
        impact: "low",
      },
    ],
    recommendations: [
      {
        id: "rec-1",
        title: "Tighten loan approval criteria",
        description:
          "Introduce stricter credit checks for new loans to reduce future default risk.",
        priority: "high",
      },
      {
        id: "rec-2",
        title: "Increase reserve contributions",
        description:
          "Raise the mandatory reserve contribution rate to rebuild the safety margin.",
        priority: "medium",
      },
      {
        id: "rec-3",
        title: "Continue membership outreach",
        description:
          "Current membership growth strategy is working well and should continue.",
        priority: "low",
      },
    ],
    chartData: [
      { category: "Liquidity", score: 78 },
      { category: "Repayment", score: 54 },
      { category: "Reserves", score: 61 },
      { category: "Growth", score: 82 },
      { category: "Governance", score: 70 },
    ],
    createdAt: new Date().toISOString(),
  };
}
 