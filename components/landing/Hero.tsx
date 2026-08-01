import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="platform"
      className="relative overflow-hidden bg-slate-950 px-6 py-20 sm:py-28"
    >
      {/* Decorative background glow. It does not contain meaningful content. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 -z-0 size-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
          <Sparkles size={16} />
          AI-powered cooperative intelligence
        </div>

        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Know what matters.
          <span className="block text-cyan-300">Move with confidence.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300">
          Sahakari Nexus turns cooperative data into risk signals, practical
          recommendations, and a shared view of financial health.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Explore the platform
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="#insights"
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition-colors hover:border-cyan-300 hover:text-cyan-200"
          >
            See AI insights
          </Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl gap-4 border-t border-slate-800 pt-8 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-bold text-white">24</p>
            <p className="mt-1 text-sm text-slate-400">
              Cooperatives monitored
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-white">94.2%</p>
            <p className="mt-1 text-sm text-slate-400">
              AI decision confidence
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-white">3.4×</p>
            <p className="mt-1 text-sm text-slate-400">
              Faster insight cycles
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}