import { motion } from 'framer-motion'
import { CircularGauge } from '@/components/shared/circular-gauge'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Loader2, AlertTriangle } from 'lucide-react'

export function ConsensusPanel({
  score = 87,
  status = 'running',
}: {
  score?: number
  status?: 'running' | 'achieved' | 'stagnated'
}) {
  const meta = {
    running: { label: 'Debate Running', variant: 'warning' as const, icon: Loader2 },
    achieved: { label: 'Consensus Achieved', variant: 'success' as const, icon: CheckCircle2 },
    stagnated: { label: 'Arguments Stagnated', variant: 'destructive' as const, icon: AlertTriangle },
  }[status]
  const Icon = meta.icon

  return (
    <div className="flex flex-col items-center">
      <CircularGauge value={score} accent="primary" label="Consensus" sublabel="threshold 80%" />
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-4"
      >
        <Badge variant={meta.variant}>
          <Icon className={`size-3.5 ${status === 'running' ? 'animate-spin' : ''}`} />
          {meta.label}
        </Badge>
      </motion.div>

      <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="text-lg font-semibold tabular-nums">5</div>
          <div className="text-[11px] text-muted-foreground">Rounds</div>
        </div>
        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <div className="text-lg font-semibold tabular-nums">6</div>
          <div className="text-[11px] text-muted-foreground">Agents</div>
        </div>
      </div>
    </div>
  )
}
