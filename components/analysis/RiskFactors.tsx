import type { RiskFactor } from "@/types/analysis";

type RiskFactorsProps = {
  factors: RiskFactor[];
};

const impactStyles: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-300",
  moderate: "bg-amber-500/10 text-amber-300",
  high: "bg-orange-500/10 text-orange-300",
  critical: "bg-red-500/10 text-red-400",
};

export function RiskFactors({ factors }: RiskFactorsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Risk Factors
      </h2>

      <div className="space-y-3">
        {factors.map((factor) => (
          <div
            key={factor.id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-white">{factor.title}</p>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${impactStyles[factor.impact]}`}
              >
                {factor.impact}
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {factor.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}