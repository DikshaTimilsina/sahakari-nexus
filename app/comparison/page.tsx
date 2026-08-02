"use client";

import { useState, useMemo } from "react";
import { cooperativeOptions, getComparison } from "@/lib/mockComparison";
import { CooperativeDropdown } from "@/components/comparison/CooperativeDropDown";
import { ComparisonRadarChart } from "@/components/comparison/ComparisonRadarChart";
import { ComparisonBarChart } from "@/components/comparison/ComparisonBarChart";
import { WinnerCard } from "@/components/comparison/WinnerCard";

export default function ComparisonPage() {
  const [idA, setIdA] = useState<string>("coop-1");
  const [idB, setIdB] = useState<string>("coop-4");

  // useMemo recalculates the comparison only when idA or idB actually change,
  // instead of on every single render of this page.
  const comparison = useMemo(() => getComparison(idA, idB), [idA, idB]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-2 text-2xl font-bold text-white">
          Compare Cooperatives
        </h1>
        <p className="mb-8 text-sm text-slate-400">
          Select two cooperatives to compare their performance side by side.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <CooperativeDropdown
            label="Cooperative A"
            options={cooperativeOptions}
            value={idA}
            onChange={setIdA}
            disabledId={idB}
          />
          <CooperativeDropdown
            label="Cooperative B"
            options={cooperativeOptions}
            value={idB}
            onChange={setIdB}
            disabledId={idA}
          />
        </div>

        <div className="mt-6">
          <WinnerCard
            cooperativeA={comparison.cooperativeA}
            cooperativeB={comparison.cooperativeB}
            winnerId={comparison.winnerId}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ComparisonRadarChart
            cooperativeA={comparison.cooperativeA}
            cooperativeB={comparison.cooperativeB}
          />
          <ComparisonBarChart
            cooperativeA={comparison.cooperativeA}
            cooperativeB={comparison.cooperativeB}
          />
        </div>
      </div>
    </main>
  );
}