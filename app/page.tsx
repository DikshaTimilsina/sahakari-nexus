import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <main className="min-h-screen px-6 py-10 lg:pl-80 lg:pr-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Cooperative overview
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-slate-400">
          This is the private Sahakari Nexus workspace. In the next phase, we
          will fill it with search, statistic cards, recent analysis, and risk
          intelligence.
        </p>
      </main>
    </div>
  );
}