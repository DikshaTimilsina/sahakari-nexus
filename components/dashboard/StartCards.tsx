import {
  AlertTriangle,
  FileText,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { StatCardData } from "@/types/dashboard";

type StatCardProps = {
  data: StatCardData;
  icon: LucideIcon;
};

const statistics: Array<StatCardProps> = [
  {
    data: {
      label: "Cooperatives monitored",
      value: "24",
      change: "+3 this month",
      trend: "positive",
    },
    icon: Users,
  },
  {
    data: {
      label: "Average health score",
      value: "76.8",
      change: "+4.2 points",
      trend: "positive",
    },
    icon: ShieldCheck,
  },
  {
    data: {
      label: "High-risk alerts",
      value: "03",
      change: "Needs attention",
      trend: "warning",
    },
    icon: AlertTriangle,
  },
  {
    data: {
      label: "Reports generated",
      value: "128",
      change: "+18 this week",
      trend: "positive",
    },
    icon: FileText,
  },
];

function StatCard({ data, icon: Icon }: StatCardProps) {
  const changeColor =
    data.trend === "positive" ? "text-emerald-300" : "text-amber-300";

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-slate-400">{data.label}</p>

        <span className="grid size-9 place-items-center rounded-lg bg-slate-800 text-cyan-300">
          <Icon size={18} />
        </span>
      </div>

      <p className="mt-5 text-3xl font-bold tracking-tight text-white">
        {data.value}
      </p>

      <p className={`mt-2 text-sm font-medium ${changeColor}`}>
        {data.change}
      </p>
    </article>
  );
}

export function StatCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map((statistic) => (
        <StatCard
          key={statistic.data.label}
          data={statistic.data}
          icon={statistic.icon}
        />
      ))}
    </section>
  );
}