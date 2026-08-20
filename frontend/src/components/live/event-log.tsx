import { motion } from 'framer-motion'
import { Info, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'
import { eventLog, type EventLog } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const meta: Record<
  EventLog['level'],
  { icon: typeof Info; color: string }
> = {
  info: { icon: Info, color: 'text-cyan' },
  success: { icon: CheckCircle2, color: 'text-success' },
  warning: { icon: AlertTriangle, color: 'text-warning' },
  agent: { icon: MessageSquare, color: 'text-primary' },
}

export function EventLogConsole() {
  return (
    <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border bg-background/50 p-3 font-mono text-xs">
      {eventLog.map((e, i) => {
        const m = meta[e.level]
        const Icon = m.icon
        return (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-start gap-2 rounded-md px-2 py-1 hover:bg-muted/40"
          >
            <span className="text-muted-foreground">{e.time}</span>
            <Icon className={cn('mt-0.5 size-3.5 shrink-0', m.color)} />
            <span className="text-foreground/90">{e.message}</span>
          </motion.div>
        )
      })}
      <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
        awaiting next event...
      </div>
    </div>
  )
}
