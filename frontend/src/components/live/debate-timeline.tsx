import { motion } from 'framer-motion'
import { agents, debateTimeline as mockTimeline } from '@/lib/mock-data'
import { type Accent, accentBg, accentText, accentBorder } from '@/lib/accents'
import { cn } from '@/lib/utils'
import type { TimelineMessage } from '@/lib/types'

const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]))

export function DebateTimeline({ messages = mockTimeline }: { messages?: TimelineMessage[] }) {
  return (
    <div className="space-y-3">
      {messages.map((m, i) => {
        const agent = agentMap[m.agentId]
        const accent = (agent?.accent ?? 'primary') as Accent
        return (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex gap-3"
          >
            <div
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold',
                accentBg[accent],
                accentText[accent],
              )}
            >
              {agent?.name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className={cn('flex-1 rounded-2xl border bg-card/40 p-3', accentBorder[accent])}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{agent?.name}</span>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', accentBg[accent], accentText[accent])}>
                  Round {m.round}
                </span>
                <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                  {m.timestamp}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{m.text}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
