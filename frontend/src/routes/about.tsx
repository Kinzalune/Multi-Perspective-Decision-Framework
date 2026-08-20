import { createFileRoute } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NetworkBg } from "@/components/shared/network-bg"
import { Reveal } from "@/components/shared/reveal"
import { Sparkles, Users, Zap, Gauge, Scale, Layers, Server, Cpu, Cloud, Rocket } from "lucide-react"

export const Route = createFileRoute("/about")({ component: AboutPage })

const stack = {
  Frontend: ["React", "TanStack Start", "Tailwind CSS", "Framer Motion"],
  Backend: ["Message Queue", "Distributed AI Agents", "Consensus Engine", "Judge Agent"],
  Infra: ["Cloudflare Workers", "Postgres", "Vector Store", "Observability"],
}

const team = [
  { name: "Kinzal Singh", role: "Team Member", initials: "KS" },
  { name: "Ronak Singh", role: "Team Member", initials: "RS" },
  { name: "Kirti Tiwari", role: "Team Member", initials: "KT" },
  { name: "Saumya Yadav", role: "Team Member", initials: "SY" },
  { name: "Riya Sharma", role: "Team Member", initials: "RSh" },
]

const features = [
  { icon: Users, title: "Multi-Agent Debate", desc: "Specialist agents argue opposing positions." },
  { icon: Zap, title: "Event-Driven", desc: "Async messaging over a durable broker." },
  { icon: Gauge, title: "Consensus Scoring", desc: "Real-time convergence quantification." },
  { icon: Scale, title: "Impartial Judge", desc: "Weighs arguments into a final verdict." },
]

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-8 md:px-6 md:py-10">
      <section className="relative overflow-hidden rounded-3xl border border-border glass">
        <NetworkBg className="absolute inset-0 h-full w-full opacity-60" />
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-purple/20 blur-3xl" />
        <div className="relative px-8 py-16 sm:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
            <Badge variant="purple" className="mb-4"><Sparkles className="size-3.5" />About the Framework</Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              A transparent way for <span className="text-gradient">AI to decide</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Multi-Perspective Decision Framework is a distributed multi-agent debate platform designed for enterprises that need auditable, explainable AI decisions — not a single opaque model output.
            </p>
          </motion.div>
        </div>
      </section>

      <Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Project Overview</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The framework orchestrates a panel of specialist AI agents that debate a decision, converge on a consensus, and produce a judge-arbitrated recommendation with a full reasoning trail.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Problem Statement</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enterprises are increasingly asked to defend automated decisions. Single-model outputs are hard to audit and often obscure trade-offs, risks, and rationale.
            </p>
          </Card>
          <Card className="p-6 md:col-span-2">
            <h2 className="text-lg font-semibold">Proposed Solution</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Split the decision across role-specialized agents — risk, optimism, cost, security, market — let them argue on a message bus, score convergence in real time, and finalize with an impartial judge agent. Every argument is captured for audit.
            </p>
          </Card>
        </div>
      </Reveal>

      <Reveal>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Key Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <Card key={f.title} className="p-5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary"><Icon className="size-5" /></div>
                  <div className="mt-3 text-sm font-semibold">{f.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Technology Stack</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(stack).map(([k, v], i) => (
              <Card key={k} className="p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  {[Layers, Server, Cloud][i] && (() => { const I = [Layers, Server, Cloud][i]; return <I className="size-4 text-cyan" /> })()}
                  {k}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {v.map((t) => <li key={t} className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" />{t}</li>)}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Deployment Architecture</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The platform runs on serverless edge workers with a durable message broker for agent communication. Postgres holds structured debate metadata and a vector store powers retrieval-augmented reasoning for agents. Observability is wired into every stage so operators can audit any debate end-to-end.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="cyan"><Cpu className="size-3" />Edge Workers</Badge>
            <Badge variant="purple"><Server className="size-3" />Message Broker</Badge>
            <Badge variant="success"><Cloud className="size-3" />Managed Postgres</Badge>
            <Badge variant="warning"><Gauge className="size-3" />Realtime Metrics</Badge>
          </div>
        </Card>
      </Reveal>

      <Reveal>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Meet the Team</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((m) => (
              <Card key={m.name} className="p-5 text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple text-lg font-semibold text-primary-foreground">{m.initials}</div>
                <div className="mt-3 text-sm font-semibold">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.role}</div>
              </Card>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <Card className="p-6">
          <div className="flex items-center gap-2 text-lg font-semibold"><Rocket className="size-5 text-cyan" />Future Scope</div>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li>· Custom agent authoring SDK for enterprise domains</li>
            <li>· Human-in-the-loop veto and steer</li>
            <li>· Federated debates across organizations</li>
            <li>· Enterprise SSO and audit exports</li>
            <li>· Fine-tuned judge models per industry</li>
            <li>· Debate replays with counterfactual analysis</li>
          </ul>
        </Card>
      </Reveal>
    </div>
  )
}
