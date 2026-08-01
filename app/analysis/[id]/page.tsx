"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMockAnalysis } from "@/lib/mockAnalysis";
import type { AnalysisResult } from "@/types/analysis";
import { RiskScore } from "@/components/analysis/RiskScore";
import { AIExplanation } from "@/components/analysis/AIExplanation";
import { RiskFactors } from "@/components/analysis/RiskFactors";
import { Recommendations } from "@/components/analysis/Recommadations";
import { RiskChart } from "@/components/analysis/RiskChart";

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const data = getMockAnalysis(`document-${params.id}.pdf`);
    setResult(data);
  }, [params.id]);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">Loading analysis...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-1 text-2xl font-bold text-white">
          Analysis Report
        </h1>
        <p className="mb-8 text-sm text-slate-400">{result.fileName}</p>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <RiskScore score={result.riskScore} level={result.riskLevel} />
          </div>

          <div className="space-y-6 lg:col-span-2">
            <AIExplanation summary={result.summary} />
            <RiskChart data={result.chartData} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RiskFactors factors={result.riskFactors} />
          <Recommendations items={result.recommendations} />
        </div>
      </div>
    </main>
  );
}