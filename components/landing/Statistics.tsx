const statistics = [
  {
    value: "76.8",
    suffix: "/100",
    label: "Average cooperative health score",
    description: "A clear, comparable measure of overall financial strength.",
  },
  {
    value: "18",
    suffix: " hrs",
    label: "Saved per reporting cycle",
    description: "Less manual analysis and more time for meaningful decisions.",
  },
  {
    value: "3.4×",
    suffix: "",
    label: "Faster insight cycles",
    description: "Move from raw records to practical recommendations quickly.",
  },
];

export function Statistics() {
  return (
    <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Intelligence with impact
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              See progress. Share confidence.
            </h2>
          </div>

          <p className="max-w-md leading-7 text-slate-400">
            Sahakari Nexus makes financial intelligence easier to understand,
            communicate, and act upon.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {statistics.map((statistic) => (
            <article
              key={statistic.label}
              className="rounded-2xl border border-slate-800 bg-slate-950 p-6"
            >
              <p className="text-4xl font-bold tracking-tight text-cyan-300">
                {statistic.value}
                <span className="text-xl text-slate-500">
                  {statistic.suffix}
                </span>
              </p>

              <h3 className="mt-5 font-semibold text-white">
                {statistic.label}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                {statistic.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}