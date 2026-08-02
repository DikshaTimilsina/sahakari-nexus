import { Trophy } from "lucide-react";
import type { CooperativeMetrics } from "@/types/comparison";

type WinnerCardProps = {
  cooperativeA: CooperativeMetrics;
  cooperativeB: CooperativeMetrics;
  winnerId: string;
};

export function WinnerCard({
  cooperativeA,
  cooperativeB,
  winnerId,
}: WinnerCardProps) {
  const winner = winnerId === cooperativeA.id ? cooperativeA : cooperativeB;
  const runnerUp = winnerId === cooperativeA.id ? cooperativeB : cooperativeA;
  const gap = winner.overallScore - runnerUp.overallScore;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber-300" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-300">
          Stronger Performer
        </h2>
      </div>

      <p className="mt-3 text-xl font-bold text-white">{winner.name}</p>

      <p className="mt-1 text-sm text-slate-400">
        Scored {gap} point{gap === 1 ? "" : "s"} higher overall than{" "}
        {runnerUp.name}, with an overall score of {winner.overallScore}.
      </p>
    </div>
  );
}