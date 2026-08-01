import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { StatCards } from "@/components/dashboard/StatCards";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <main className="min-h-screen px-6 py-10 lg:pl-80 lg:pr-10">
        <DashboardHeader />

        <div className="mt-6">
          <SearchBar />
        </div>

        <div className="mt-7">
          <StatCards />
        </div>

        <section className="mt-7 rounded-2xl border border-dashed border-slate-700 p-6">
          <p className="text-sm text-slate-400">
            Recent analysis and risk overview will appear here next.
          </p>
        </section>
      </main>
    </div>
  );
}