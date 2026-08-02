import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950">
            <BrainCircuit size={22} />
          </span>

          <span>
            <span className="block text-base font-bold">Sahakari Nexus</span>
            <span className="block text-xs text-slate-400">
              COOPERATIVE INTELLIGENCE
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <Link href="#platform" className="transition-colors hover:text-cyan-300">
            Platform
          </Link>

          <Link href="#insights" className="transition-colors hover:text-cyan-300">
            Insights
          </Link>

          <Link href="#about" className="transition-colors hover:text-cyan-300">
            About
          </Link>

          <Link href="/backend" className="transition-colors hover:text-cyan-300">
            Backend check
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Open dashboard
          </Link>
          <Link
            href="/backend"
            className="rounded-lg border border-cyan-400 px-4 py-2 text-sm font-semibold text-cyan-400 transition-colors hover:bg-cyan-950/70"
          >
            Backend check
          </Link>
        </div>
      </nav>
    </header>
  );
}