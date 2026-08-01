import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  ShieldCheck,
} from "lucide-react";

type Feature = {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: BrainCircuit,
    number: "01",
    title: "AI analysis",
    description:
      "Transform complex cooperative records into clear, practical priorities.",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Risk intelligence",
    description:
      "Detect weak signals early and focus attention where it has the most impact.",
  },
  {
    icon: ChartNoAxesCombined,
    number: "03",
    title: "Shared visibility",
    description:
      "Give every leader a decision-ready view of cooperative performance.",
  },
];

export function Features() {
  return (
    <section className="bg-slate-950 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Designed for momentum
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            One calm, powerful place to lead from.
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            Every tool in Sahakari Nexus is arranged around the decisions a
            cooperative team needs to make next.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-cyan-400/50"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    {feature.number}
                  </span>

                  <span className="grid size-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300 transition-colors group-hover:bg-cyan-400 group-hover:text-slate-950">
                    <Icon size={22} />
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}