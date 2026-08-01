"use client";

import { useState } from "react";

export function InsightPreview() {
  // `false` means the detailed AI message is initially hidden.
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-6">
      <p className="text-sm font-semibold text-emerald-300">
        Nexus AI preview
      </p>

      <h3 className="mt-2 text-xl font-bold text-white">
        Your network health is improving.
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-300">
        Three cooperatives show stronger liquidity this month.
      </p>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-5 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        {isExpanded ? "Show less" : "See AI preview"}
      </button>

      {/* This content appears only after the button is clicked. */}
      {isExpanded && (
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
          Janajyoti, Himal Savings, and Aadarsha Cooperative improved their
          liquidity coverage. Nexus recommends reviewing loan concentration
          before the next lending cycle.
        </div>
      )}
    </section>
  );
}