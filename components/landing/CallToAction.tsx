import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CallToAction() {
  return (
    <section className="bg-slate-950 px-6 pb-20 sm:px-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-cyan-400 px-6 py-14 text-center text-slate-950 sm:px-12">
        <Sparkles className="mx-auto" size={28} />

        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Better cooperative decisions start here.
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-800">
          Bring your financial data, risk signals, and next actions into one
          intelligent workspace.
        </p>

        <Link
          href="/dashboard"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white transition-colors hover:bg-slate-800"
        >
          Open Sahakari Nexus
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}