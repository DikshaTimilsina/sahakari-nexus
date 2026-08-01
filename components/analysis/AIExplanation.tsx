import { Sparkles } from "lucide-react";

type AIExplanationProps = {
  summary: string;
};

export function AIExplanation({ summary }: AIExplanationProps) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-cyan-300" />
        <h2 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
          AI Explanation
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-slate-300">{summary}</p>
    </div>
  );
}