import { Handle, Position, type NodeProps } from "reactflow";
import type { CooperativeNodeData } from "@/types/graph";

function healthColor(score: number): string {
  if (score >= 75) return "border-emerald-500/50 text-emerald-300";
  if (score >= 60) return "border-amber-500/50 text-amber-300";
  return "border-red-500/50 text-red-400";
}

export function CooperativeNode({ data }: NodeProps<CooperativeNodeData>) {
  return (
    <div
      className={`w-56 rounded-xl border-2 bg-slate-900 px-4 py-3 shadow-lg ${healthColor(
        data.healthScore
      )}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-slate-600" />

      <p className="truncate text-sm font-semibold text-white">
        {data.label}
      </p>
      <p className="mt-1 text-xs text-slate-400">{data.region}</p>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">{data.memberCount} members</span>
        <span className={`font-bold ${healthColor(data.healthScore)}`}>
          {data.healthScore}
        </span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-600" />
    </div>
  );
}