import { X } from "lucide-react";
import type { CooperativeNodeData } from "@/types/graph";

type NodeDetailsProps = {
  data: CooperativeNodeData;
  onClose: () => void;
};

export function NodeDetails({ data, onClose }: NodeDetailsProps) {
  return (
    <div className="absolute right-4 top-4 z-10 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-white">{data.label}</p>
        <button
          onClick={onClose}
          className="rounded-full p-1 text-slate-500 hover:bg-slate-800 hover:text-white"
          aria-label="Close details"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Region</span>
          <span className="text-slate-200">{data.region}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Members</span>
          <span className="text-slate-200">{data.memberCount}</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Health score</span>
          <span className="text-slate-200">{data.healthScore}</span>
        </div>
      </div>
    </div>
  );
}