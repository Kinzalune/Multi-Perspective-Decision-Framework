import { motion } from 'framer-motion'
import { Scale, ThumbsUp, ThumbsDown, TriangleAlert, Gavel } from 'lucide-react'
import { judgeRecommendation as mockVerdict } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import type { JudgeVerdict } from '@/lib/types'

export function JudgePanel({ verdict = mockVerdict }: { verdict?: JudgeVerdict }) {
  const j = verdict
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass relative overflow-hidden rounded-3xl p-6"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary glow-primary">
          <Scale className="size-8" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Judge Recommendation
            </span>
            <Badge variant="success">{j.confidence}% confidence</Badge>
          </div>
          <h2 className="mt-1 text-xl font-semibold text-balance">{j.recommendation}</h2>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">{j.summary}</p>

      <div className="relative mt-5 grid gap-3 md:grid-cols-3">
        <Column title="Pros" icon={<ThumbsUp className="size-4 text-success" />} items={j.pros} />
        <Column title="Cons" icon={<ThumbsDown className="size-4 text-warning" />} items={j.cons} />
        <Column title="Potential Risks" icon={<TriangleAlert className="size-4 text-destructive" />} items={j.risks} />
      </div>

      <div className="relative mt-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
        <Gavel className="mt-0.5 size-5 shrink-0 text-primary" />
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-primary">Final Verdict</div>
          <p className="mt-0.5 text-sm font-medium">{j.verdict}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Column({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {title}
      </div>
      <ul className="mt-2 space-y-1.5">
        {items.map((it) => (
          <li key={it} className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
            <span className="mt-1 size-1 shrink-0 rounded-full bg-current" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
