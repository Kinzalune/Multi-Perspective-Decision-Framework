import { motion } from 'framer-motion'
import {
  ShieldAlert,
  TrendingUp,
  DollarSign,
  Lock,
  LineChart,
  Scale,
} from 'lucide-react'
import { type Agent } from '@/lib/mock-data'
import { type Accent, accentBg, accentText, accentStroke } from '@/lib/accents'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const icons: Record<string, typeof ShieldAlert> = {
  risk: ShieldAlert,
  optimist: TrendingUp,
  cost: DollarSign,
  security: Lock,
  market: LineChart,
  judge: Scale,
}

const statusMeta: Record<
  Agent['status'],
  { label: string; variant: 'default' | 'cyan' | 'purple' | 'success' | 'warning' | 'muted' }
> = {
  thinking: { label: 'Thinking', variant: 'warning' },
  responding: { label: 'Responding', variant: 'success' },
  waiting: { label: 'Waiting', variant: 'muted' },
  completed: { label: 'Completed', variant: 'cyan' },
}

export function AgentCard({ agent }: { agent: Agent }) {
  const Icon = icons[agent.id] ?? Scale
  const accent = agent.accent as Accent
  const status = statusMeta[agent.status]
  const isThinking = agent.status === 'thinking'
  const isResponding = agent.status === 'responding'

  const size = 44
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (agent.confidence / 100) * c

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'relative flex size-11 shrink-0 items-center justify-center rounded-xl',
            accentBg[accent],
            accentText[accent],
            isThinking && 'animate-pulse-ring',
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold">{agent.name}</h3>
            <Badge variant={status.variant}>
              {(isThinking || isResponding) && (
                <span className="size-1.5 rounded-full bg-current animate-pulse" />
              )}
              {status.label}
            </Badge>
          </div>
          <p className="truncate text-xs text-muted-foreground">{agent.role}</p>
        </div>

        <div className="relative shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={stroke} />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={accentStroke[accent]}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums">
            {agent.confidence}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Stance:</span>
        <span className={cn('font-medium', accentText[accent])}>{agent.stance}</span>
      </div>

      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
        {agent.latestArgument}
      </p>

      {(isThinking || isResponding) && (
        <div className="mt-2 flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={cn('size-1.5 rounded-full', accentBg[accent], accentText[accent])}
              style={{ backgroundColor: accentStroke[accent] }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
