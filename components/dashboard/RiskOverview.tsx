import { ArrowUpRight, ShieldAlert } from "lucide-react";
import type { RiskFactor } from "@/types/dashboard";

const riskFactors: RiskFactor[] = [
  {
    label: "Loan concentration",
    score: 72,
    level: "Watch",
  },
  {
    label: "Liquidity coverage",
    score: 86,
    level: "Low",
  },
  {
    label: "Portfolio quality",
    score: 58,
    level: "Watch",
  },
  {
    label: "Governance signals",
    score: 91,
    level: "Low",
  },
];

function getRiskColor(level: RiskFactor["level"]) {
  if (level === "Low") {
    return "bg-emerald-400";
  }

  if (level === "Watch") {
    return "bg-amber-400";
  }

  return "bg-rose-400";
}

function getRiskTextColor(level: RiskFactor["level"]) {
  if (level === "Low") {
    return "text-emerald-300";
  }

  if (level === "Watch") {
    return "text-amber-300";
  }

  return "text-rose-300";
}

export function RiskOverview() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={19} className="text-amber-300" />

            <h2 className="text-lg font-semibold text-white">Risk overview</h2>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Current signals across the cooperative network.
          </p>
        </div>

        <ArrowUpRight size={18} className="text-slate-500" />
      </div>

      <div className="mt-7 space-y-5">
        {riskFactors.map((factor) => (
          <div key={factor.label}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-300">{factor.label}</span>

              <span className={`font-medium ${getRiskTextColor(factor.level)}`}>
                {factor.level}
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full transition-all ${getRiskColor(
                  factor.level,
                )}`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-7 border-t border-slate-800 pt-5 text-sm leading-6 text-slate-400">
        Two cooperative signals need a closer review before the next lending
        cycle.
      </p>
    </section>
  );
}