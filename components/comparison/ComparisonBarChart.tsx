"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { CooperativeMetrics } from "@/types/comparison";

type ComparisonBarChartProps = {
  cooperativeA: CooperativeMetrics;
  cooperativeB: CooperativeMetrics;
};

export function ComparisonBarChart({
  cooperativeA,
  cooperativeB,
}: ComparisonBarChartProps) {
  const data = [
    { name: cooperativeA.name, score: cooperativeA.overallScore },
    { name: cooperativeB.name, score: cooperativeB.overallScore },
  ];

  const colors = ["#22d3ee", "#f472b6"];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Overall Score
      </h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "0.75rem",
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}