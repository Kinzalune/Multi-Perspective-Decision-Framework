import { createFileRoute } from "@tanstack/react-router"
import { Hero } from "@/components/home/hero"
import { FeatureCards } from "@/components/home/feature-cards"
import { HowItWorks } from "@/components/home/how-it-works"
import { Reveal } from "@/components/shared/reveal"
import { KpiGrid } from "@/components/analytics/kpi-grid"

export const Route = createFileRoute("/")({ component: Index })

function Index() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:px-6 md:py-10">
      <Hero />
      <section>
        <Reveal>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Platform metrics</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live KPIs across the Multi-Perspective Decision Framework platform.</p>
          </div>
        </Reveal>
        <KpiGrid />
      </section>
      <section>
        <Reveal>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Platform capabilities</h2>
            <p className="mt-1 text-sm text-muted-foreground">Everything you need for transparent, explainable AI decision making.</p>
          </div>
        </Reveal>
        <FeatureCards />
      </section>
      <section>
        <Reveal>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <p className="mt-1 text-sm text-muted-foreground">From prompt to verdict in five transparent stages.</p>
          </div>
        </Reveal>
        <HowItWorks />
      </section>
    </div>
  )
}
