import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { InsightPreview } from "@/components/ui/InsightPreview";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <Hero />

      <main className="bg-slate-950 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <SectionHeading
              eyebrow="Built for clarity"
              title="Turn cooperative data into confident decisions"
            >
              Sahakari Nexus brings analysis, risk insights, comparisons, and
              relationships into one clear intelligence platform.
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