import { createFileRoute } from '@tanstack/react-router'
import { Radio, Pause, Play, Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { agents } from '@/lib/mock-data'
import { AgentCard } from '@/components/live/agent-card'
import { DebateTimeline } from '@/components/live/debate-timeline'
import { ConsensusPanel } from '@/components/live/consensus-panel'
import { ConsensusChart } from '@/components/live/consensus-chart'
import { InteractionGraph } from '@/components/live/interaction-graph'
import { EventLogConsole } from '@/components/live/event-log'
import { JudgePanel } from '@/components/live/judge-panel'
import { Transcript } from '@/components/live/transcript'

export const Route = createFileRoute('/live')({ component: LiveDebatePage })

function LiveDebatePage() {
  const [paused, setPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [round, setRound] = useState(3)
  const [confidence, setConfidence] = useState(87)
  const totalRounds = 5

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => {
      setElapsed((e) => e + 1)
      setConfidence((c) => Math.min(99, c + (Math.random() > 0.6 ? 1 : 0)))
    }, 1000)
    return () => clearInterval(t)
  }, [paused])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setRound((r) => (r < totalRounds ? r + 1 : r)), 15000)
    return () => clearInterval(t)
  }, [paused])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <PageHeader
        title="Live Debate"
        breadcrumb="Live Debate"
        description="Migrate core ledger to a new platform — 6 agents debating in real time."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="muted" className="h-8 px-3 font-mono">
              <Timer className="size-3.5" />{mm}:{ss}
            </Badge>
            <Badge variant={paused ? 'warning' : 'destructive'} className="h-8 px-3">
              <span className={`size-2 rounded-full bg-current ${paused ? '' : 'animate-pulse'}`} />
              <Radio className="size-3.5" />
              {paused ? 'PAUSED' : 'LIVE'}
            </Badge>
            <Button size="sm" variant="outline" onClick={() => setPaused((p) => !p)}>
              {paused ? <><Play className="size-3.5" />Resume</> : <><Pause className="size-3.5" />Pause</>}
            </Button>
          </div>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            <span className="text-muted-foreground">Round progress</span>{' '}
            <span className="font-semibold">{round}/{totalRounds}</span>
          </div>
          <div className="flex flex-1 items-center gap-3 sm:ml-6">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-primary via-cyan to-purple transition-all duration-700" style={{ width: `${(round / totalRounds) * 100}%` }} />
            </div>
            <span className="w-14 text-right font-mono text-xs text-primary tabular-nums">{Math.round((round / totalRounds) * 100)}%</span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-12">
        {/* Left: Agent status */}
        <div className="space-y-3 xl:col-span-4">
          <h2 className="text-sm font-medium text-muted-foreground">Agent Status</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {agents.map((a) => (
              <AgentCard key={a.id} agent={a} />
            ))}
          </div>
        </div>

        {/* Center: Timeline */}
        <div className="space-y-6 xl:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle>Debate Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <DebateTimeline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Interaction Graph</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractionGraph />
            </CardContent>
          </Card>
        </div>

        {/* Right: Consensus */}
        <div className="space-y-6 xl:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Consensus</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsensusPanel score={confidence} status={paused ? 'stagnated' : 'running'} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consensus Evolution</CardTitle>
            </CardHeader>
            <CardContent>
              <ConsensusChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Event Log</CardTitle>
            </CardHeader>
            <CardContent>
              <EventLogConsole />
            </CardContent>
          </Card>
        </div>
      </div>

      <JudgePanel />

      <Card>
        <CardHeader>
          <CardTitle>Debate Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <Transcript />
        </CardContent>
      </Card>
    </div>
  )
}
