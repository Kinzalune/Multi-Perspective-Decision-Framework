import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Sparkles, Play, RotateCcw, Users, Target } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { submitDebate } from '@/lib/api'
import type { DebateResult } from '@/lib/types'

import { AgentCard } from '@/components/live/agent-card'
import { DebateTimeline } from '@/components/live/debate-timeline'
import { ConsensusChart } from '@/components/live/consensus-chart'
import { JudgePanel } from '@/components/live/judge-panel'
import { Transcript } from '@/components/live/transcript'

export const Route = createFileRoute('/start')({ component: StartDebatePage })

const categories = ['Tech Stack', 'Investment', 'Hiring', 'Healthcare', 'Business Strategy', 'General']

const examples = [
  'Should we migrate our core ledger to a new platform?',
  'Allocate our Series B: growth vs. runway?',
  'Adopt on-prem inference for PHI-sensitive workloads?',
]

function StartDebatePage() {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('Tech Stack')
  const [numAgents, setNumAgents] = useState(6)
  const [threshold, setThreshold] = useState(80)

  // useMutation (from @tanstack/react-query, already wired up in __root.tsx)
  // gives us isPending / isError / data / error for free — no manual useState juggling.
  const debateMutation = useMutation({
    mutationFn: () => submitDebate({ prompt, category, numAgents, threshold }),
  })

  const result: DebateResult | undefined = debateMutation.data

  if (result) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
        <PageHeader
          title="Debate Result"
          breadcrumb="Start Debate"
          description={result.prompt}
          actions={
            <Button variant="outline" size="sm" onClick={() => debateMutation.reset()}>
              <RotateCcw className="size-3.5" />
              New debate
            </Button>
          }
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {result.agents.map((a) => (
            <AgentCard key={a.id} agent={a} />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Debate Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <DebateTimeline messages={result.timeline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consensus Evolution</CardTitle>
          </CardHeader>
          <CardContent>
            <ConsensusChart data={result.consensusEvolution} />
          </CardContent>
        </Card>

        <JudgePanel verdict={result.verdict} />

        <Card>
          <CardHeader>
            <CardTitle>Debate Transcript</CardTitle>
          </CardHeader>
          <CardContent>
            <Transcript rounds={result.transcript} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6 md:py-10">
      <PageHeader
        title="Start a Debate"
        breadcrumb="Start Debate"
        description="Configure a decision, choose your agent panel, and let the platform reason it out."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            Decision prompt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the decision you want the AI agents to debate..."
            rows={6}
            className="w-full resize-none rounded-xl border border-input bg-muted/30 p-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
          />

          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {ex}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Decision category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    category === c
                      ? 'border-primary/40 bg-primary/15 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <SliderField
              label="Number of Agents"
              icon={<Users className="size-4 text-cyan" />}
              value={numAgents}
              min={3}
              max={10}
              onChange={setNumAgents}
              suffix=" agents"
            />
            <SliderField
              label="Consensus Threshold"
              icon={<Target className="size-4 text-purple" />}
              value={threshold}
              min={50}
              max={100}
              onChange={setThreshold}
              suffix="%"
            />
          </div>

          {debateMutation.isError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {(debateMutation.error as Error).message}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              className="glow-primary"
              disabled={!prompt.trim() || debateMutation.isPending}
              onClick={() => debateMutation.mutate()}
            >
              {debateMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Debating...
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Start Debate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPrompt('')
                setCategory('Tech Stack')
                setNumAgents(6)
                setThreshold(80)
              }}
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SliderField({
  label,
  icon,
  value,
  min,
  max,
  onChange,
  suffix = '',
}: {
  label: string
  icon?: React.ReactNode
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  suffix?: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium">
          {icon}
          {label}
        </label>
        <span className="font-mono text-sm text-primary">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--primary)]"
        style={{ background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)` }}
      />
    </div>
  )
}
