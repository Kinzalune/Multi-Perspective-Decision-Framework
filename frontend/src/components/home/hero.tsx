import { Link } from "@tanstack/react-router"
import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NetworkBg } from "@/components/shared/network-bg"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border glass">
      <NetworkBg className="absolute inset-0 h-full w-full opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-purple/15 blur-3xl" />
      <div className="relative px-6 py-16 sm:px-10 sm:py-20 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <Badge variant="cyan" className="mb-5">
            <Sparkles className="size-3.5" />
            Enterprise Multi-Agent Reasoning
          </Badge>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Distributed <span className="text-gradient">Multi-Agent</span> Debate Platform
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
            Enterprise-grade AI decision making through transparent multi-agent reasoning. Watch specialist agents debate, converge, and deliver explainable recommendations in real time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/start" className={cn(buttonVariants({ size: "lg" }), "h-11 px-5 text-sm glow-primary")}>
              Start New Debate<ArrowRight className="size-4" />
            </Link>
            <Link to="/live" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5 text-sm")}>
              <Play className="size-4" />View Demo
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm">
            {[{k:"1,284",v:"Debates run"},{k:"92.7%",v:"Consensus rate"},{k:"6",v:"Specialist agents"}].map((s) => (
              <div key={s.v} className="flex flex-col">
                <span className="text-2xl font-semibold tabular-nums">{s.k}</span>
                <span className="text-xs text-muted-foreground">{s.v}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
