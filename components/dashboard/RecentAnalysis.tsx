import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { RecentAnalysisData } from "@/types/dashboard";

const recentAnalyses: RecentAnalysisData[] = [
  {
    cooperativeName: "Janajyoti Cooperative",
    score: 72,
    status: "Watch",
    updatedAt: "Updated 18 minutes ago",
  },
  {
    cooperativeName: "Himal Savings Cooperative",
    score: 88,
    status: "Stable",
    updatedAt: "Updated 2 hours ago",
  },
  {
    cooperativeName: "Aadarsha Women Cooperative",
    score: 54,
    status: "High risk",
    updatedAt: "Updated yesterday",
  },
];

function getStatusClasses(status: RecentAnalysisData["status"]) {
  if (status === "Stable") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (status === "Watch") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-rose-400/10 text-rose-300";
}

export function RecentAnalysis() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent analysis</h2>
          <p className="mt-1 text-sm text-slate-400">
            Latest AI-generated cooperative assessments.
          </p>
        </div>

        <Link
          href="/analysis"
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200"
        >
          View all
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {recentAnalyses.map((analysis) => (
          <article
            key={analysis.cooperativeName}
            className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium text-white">
                {analysis.cooperativeName}
              </h3>

              <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Clock3 size={14} />
                {analysis.updatedAt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  analysis.status,
                )}`}
              >
                {analysis.status}
              </span>

              <span className="text-lg font-bold text-white">
                {analysis.score}
                <span className="text-sm font-medium text-slate-500">/100</span>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}