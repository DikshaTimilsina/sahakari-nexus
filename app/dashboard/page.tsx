import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar />

      <main className="min-h-screen px-6 py-10 lg:pl-80 lg:pr-10">
        <DashboardHeader />

        <section className="mt-8 rounded-2xl border border-dashed border-slate-700 p-6">
          <p className="text-sm text-slate-400">
            Dashboard content will appear here in the next lessons.
          </p>
        </section>
      </main>
    </div>
  );
}