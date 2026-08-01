import { CircleCheck } from "lucide-react";
import type { Recommendation } from "@/types/analysis";

type RecommendationsProps = {
  items: Recommendation[];
};

const priorityStyles: Record<string, string> = {
  high: "text-orange-300",
  medium: "text-amber-300",
  low: "text-emerald-300",
};

export function Recommendations({ items }: RecommendationsProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Recommendations
      </h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <CircleCheck
              className={`mt-0.5 h-5 w-5 flex-shrink-0 ${priorityStyles[item.priority]}`}
            />
            <div>
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}