import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-slate-800 bg-slate-950"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2">
        <div>
          <p className="text-lg font-bold text-white">Sahakari Nexus</p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            AI-powered intelligence for stronger, more confident cooperative
            decisions.
          </p>
        </div>

        <div className="md:justify-self-end">
          <p className="text-sm font-semibold text-white">Explore</p>

          <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
            <Link
              href="#platform"
              className="transition-colors hover:text-cyan-300"
            >
              Platform
            </Link>

            <Link
              href="#insights"
              className="transition-colors hover:text-cyan-300"
            >
              AI insights
            </Link>

            <Link
              href="/dashboard"
              className="transition-colors hover:text-cyan-300"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Sahakari Nexus. Built for cooperative progress.</p>

          <p>Secure insights. Shared confidence.</p>
        </div>
      </div>
    </footer>
  );
}