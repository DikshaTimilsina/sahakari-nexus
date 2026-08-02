const legendItems: { type: string; label: string; color: string }[] = [
  { type: "lending", label: "Lending relationship", color: "#22d3ee" },
  { type: "shared-members", label: "Shared members", color: "#f472b6" },
  { type: "regional", label: "Regional connection", color: "#a3e635" },
];

export function GraphLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-xl border border-slate-800 bg-slate-900/90 p-4 backdrop-blur">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Relationship Types
      </p>

      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.type} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}