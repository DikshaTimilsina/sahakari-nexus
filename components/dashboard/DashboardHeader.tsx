import { Bell, CalendarDays } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-6 border-b border-slate-800 pb-7 pt-12 sm:flex-row sm:items-end sm:justify-between lg:pt-0">
      <div>
        <div className="flex items-center gap-2 text-sm text-cyan-300">
          <CalendarDays size={16} />
          Friday, 1 August 2026
        </div>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white">
          Good morning, Anisha.
        </h1>

        <p className="mt-2 text-slate-400">
          Your cooperative network is looking steady today.
        </p>
      </div>

      <button
        type="button"
        aria-label="View notifications"
        className="grid size-11 place-items-center self-start rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-300 hover:text-cyan-200 sm:self-auto"
      >
        <Bell size={19} />
      </button>
    </header>
  );
}