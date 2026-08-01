import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RecentAnalysis } from "@/components/dashboard/RecentAnalysis";
import { RiskOverview } from "@/components/dashboard/RiskOverview";
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

        <div className="mt-7 grid gap-7 xl:grid-cols-2">
          <RecentAnalysis />
          <RiskOverview />
        </div>
      </main>
    </div>
  );
}