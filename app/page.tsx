import { CallToAction } from "@/components/landing/CallToAction";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Statistics } from "@/components/landing/Statistics";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/Navbar";
import { InsightPreview } from "@/components/ui/InsightPreview";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.1}>
        <Features />
      </Reveal>

      <Reveal delay={0.15}>
        <Statistics />
      </Reveal>

      <main className="bg-slate-950 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <Reveal delay={0.1}>
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
          </Reveal>
        </div>
      </main>

      <Reveal delay={0.1}>
        <CallToAction />
      </Reveal>

      <Footer />
    </>
  );
}