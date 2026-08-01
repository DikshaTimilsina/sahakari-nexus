import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;

  title: string;

  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  children,
}: SectionHeadingProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-400">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>

      {/* Only render this area when the parent supplies children. */}
      {children ? (
        <div className="mt-4 text-base leading-7 text-slate-300">{children}</div>
      ) : null}
    </section>
  );
}