import { motion } from 'framer-motion'
import {
  Users,
  Zap,
  Gauge,
  Scale,
  Activity,
  Lightbulb,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { type Accent, accentBg, accentText } from '@/lib/accents'

const features: {
  title: string
  desc: string
  icon: typeof Users
  accent: Accent
}[] = [
  {
    title: 'Multi-Agent Debate',
    desc: 'Specialist agents argue opposing positions to surface blind spots and stress-test decisions.',
    icon: Users,
    accent: 'primary',
  },
  {
    title: 'Event-Driven Architecture',
    desc: 'Agents communicate asynchronously over a message broker for scalable, resilient reasoning.',
    icon: Zap,
    accent: 'cyan',
  },
  {
    title: 'Consensus Scoring',
    desc: 'A convergence engine quantifies agreement in real time and detects stagnation early.',
    icon: Gauge,
    accent: 'purple',
  },
  {
    title: 'Judge Agent',
    desc: 'An impartial arbiter weighs every argument and delivers a final, defensible verdict.',
    icon: Scale,
    accent: 'success',
  },
  {
    title: 'Real-Time Monitoring',
    desc: 'Live dashboards track agent status, arguments, and consensus as the debate unfolds.',
    icon: Activity,
    accent: 'warning',
  },
  {
    title: 'Explainable AI',
    desc: 'Every recommendation ships with a transparent trail of pros, cons, and reasoning.',
    icon: Lightbulb,
    accent: 'destructive',
  },
]

export function FeatureCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => {
        const Icon = f.icon
        return (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <Card className="group h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:glow-primary">
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${accentBg[f.accent]} ${accentText[f.accent]} transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
