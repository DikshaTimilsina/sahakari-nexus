"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { CooperativeMetrics } from "@/types/comparison";

type ComparisonRadarChartProps = {
  cooperativeA: CooperativeMetrics;
  cooperativeB: CooperativeMetrics;
};

export function ComparisonRadarChart({
  cooperativeA,
  cooperativeB,
}: ComparisonRadarChartProps) {
  const data = [
    {
      category: "Liquidity",
      [cooperativeA.name]: cooperativeA.categories.liquidity,
      [cooperativeB.name]: cooperativeB.categories.liquidity,
    },
    {
      category: "Repayment",
      [cooperativeA.name]: cooperativeA.categories.repayment,
      [cooperativeB.name]: cooperativeB.categories.repayment,
    },
    {
      category: "Reserves",
      [cooperativeA.name]: cooperativeA.categories.reserves,
      [cooperativeB.name]: cooperativeB.categories.reserves,
    },
    {
      category: "Growth",
      [cooperativeA.name]: cooperativeA.categories.growth,
      [cooperativeB.name]: cooperativeB.categories.growth,
    },
    {
      category: "Governance",
      [cooperativeA.name]: cooperativeA.categories.governance,
      [cooperativeB.name]: cooperativeB.categories.governance,
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Category Comparison
      </h2>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="category" stroke="#64748b" fontSize={12} />
            <PolarRadiusAxis domain={[0, 100]} stroke="#334155" fontSize={10} />
            <Radar
              name={cooperativeA.name}
              dataKey={cooperativeA.name}
              stroke="#22d3ee"
              fill="#22d3ee"
              fillOpacity={0.25}
            />
            <Radar
              name={cooperativeB.name}
              dataKey={cooperativeB.name}
              stroke="#f472b6"
              fill="#f472b6"
              fillOpacity={0.25}
            />
            <Legend />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "0.75rem",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}