import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download, FileJson, FileText } from 'lucide-react'
import { agents, transcript as mockTranscript } from '@/lib/mock-data'
import { type Accent, accentBg, accentText } from '@/lib/accents'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { TranscriptRound } from '@/lib/types'

const agentMap = Object.fromEntries(agents.map((a) => [a.id, a]))

export function Transcript({ rounds = mockTranscript }: { rounds?: TranscriptRound[] }) {
  const [open, setOpen] = useState<number | null>(1)

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <Button variant="outline" size="sm">
          <Download className="size-3.5" />
          Download Transcript
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="size-3.5" />
          Export PDF
        </Button>
        <Button variant="outline" size="sm">
          <FileJson className="size-3.5" />
          Export JSON
        </Button>
      </div>

      <div className="space-y-2">
        {rounds.map((round) => {
          const isOpen = open === round.round
          return (
            <div key={round.round} className="overflow-hidden rounded-2xl border border-border bg-card/40">
              <button
                onClick={() => setOpen(isOpen ? null : round.round)}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary">
                    Round {round.round}
                  </span>
                  {round.entries.length} arguments
                </span>
                <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', isOpen && 'rotate-180')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="space-y-2 px-4 pb-4">
                      {round.entries.map((e, i) => {
                        const agent = agentMap[e.agentId]
                        const accent = (agent?.accent ?? 'primary') as Accent
                        return (
                          <div key={i} className="flex gap-3">
                            <span
                              className={cn(
                                'flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold',
                                accentBg[accent],
                                accentText[accent],
                              )}
                            >
                              {agent?.name
                                .split(' ')
                                .map((w) => w[0])
                                .join('')
                                .slice(0, 2)}
                            </span>
                            <div>
                              <span className="text-xs font-medium">{agent?.name}</span>
                              <p className="text-xs text-muted-foreground">{e.text}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
