type RiskScoreProps = {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
};

const levelStyles: Record<string, string> = {
  low: "text-emerald-300 border-emerald-500/40",
  moderate: "text-amber-300 border-amber-500/40",
  high: "text-orange-300 border-orange-500/40",
  critical: "text-red-400 border-red-500/40",
};

export function RiskScore({ score, level }: RiskScoreProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70 p-8">
      <div
        className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${levelStyles[level]}`}
      >
        <span className="text-4xl font-bold">{score}</span>
      </div>

      <p className="mt-4 text-sm uppercase tracking-wide text-slate-400">
        Risk Level
      </p>
      <p className={`text-lg font-semibold capitalize ${levelStyles[level].split(" ")[0]}`}>
        {level}
      </p>
    </div>
  );
}