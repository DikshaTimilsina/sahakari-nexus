import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { InsightPreview } from "@/components/ui/InsightPreview";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main id="platform" className="min-h-screen px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              AI Powered Cooperative Intelligence
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Sahakari Nexus
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A smarter way for cooperatives to understand financial health,
              manage risk, and make confident decisions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Built for clarity"
              title="Turn cooperative data into confident decisions"
            >
              Sahakari Nexus will bring analysis, risk insights, comparisons,
              and relationships into one clear intelligence platform.
            </SectionHeading>

            <div id="insights">
              <InsightPreview />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}