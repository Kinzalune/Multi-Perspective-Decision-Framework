import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Search, ArrowUpRight, FileJson, FileText } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { debateHistory } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const categories = ['All', 'Tech Stack', 'Investment', 'Hiring', 'Healthcare', 'Business Strategy']
const statuses = ['All', 'Consensus', 'Stagnated', 'Running']

const statusVariant: Record<string, 'success' | 'destructive' | 'warning'> = {
  Consensus: 'success',
  Stagnated: 'destructive',
  Running: 'warning',
}

export const Route = createFileRoute('/history')({ component: HistoryPage })

function exportJSON(rows: any[]) {
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'debate-history.json'
  a.click()
  URL.revokeObjectURL(url)
}

function exportPDF(rows: any[]) {
  const w = window.open('', '_blank')
  if (!w) return
  const html = `<html><head><title>Debate History</title><style>body{font-family:system-ui;padding:24px;color:#111}h1{font-size:20px}table{border-collapse:collapse;width:100%;font-size:12px}td,th{border:1px solid #ddd;padding:6px;text-align:left}</style></head><body><h1>Debate History</h1><table><thead><tr><th>Title</th><th>Date</th><th>Category</th><th>Agents</th><th>Consensus</th><th>Decision</th><th>Status</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.title}</td><td>${r.date}</td><td>${r.category}</td><td>${r.agents}</td><td>${r.consensus}%</td><td>${r.decision}</td><td>${r.status}</td></tr>`).join('')}</tbody></table><script>window.print()</script></body></html>`
  w.document.write(html)
  w.document.close()
}

function HistoryPage() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [status, setStatus] = useState('All')

  const rows = useMemo(() => {
    return debateHistory.filter((d) => {
      const matchQuery =
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.decision.toLowerCase().includes(query.toLowerCase())
      const matchCat = cat === 'All' || d.category === cat
      const matchStatus = status === 'All' || d.status === status
      return matchQuery && matchCat && matchStatus
    })
  }, [query, cat, status])

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <PageHeader
        title="Debate History"
        breadcrumb="Debate History"
        description="Browse past debates, decisions, and consensus outcomes across the organization."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => exportJSON(rows)}>
              <FileJson className="size-3.5" />Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportPDF(rows)}>
              <FileText className="size-3.5" />Export PDF
            </Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or decision..."
              className="h-10 w-full rounded-xl border border-input bg-muted/30 pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <FilterGroup label="Category" options={categories} value={cat} onChange={setCat} />
            <FilterGroup label="Status" options={statuses} value={status} onChange={setStatus} />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Debate Title</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Agents</th>
                <th className="px-4 py-3 font-medium">Consensus</th>
                <th className="px-4 py-3 font-medium">Final Decision</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border/50 transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{d.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-4 py-3">
                    <Badge variant="cyan">{d.category}</Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{d.agents}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-full rounded-full',
                            d.consensus >= 70 ? 'bg-success' : 'bg-warning',
                          )}
                          style={{ width: `${d.consensus}%` }}
                        />
                      </div>
                      <span className="tabular-nums">{d.consensus}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{d.decision}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[d.status]}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">
                      View
                      <ArrowUpRight className="size-3.5" />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No debates match your filters.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              'rounded-lg border px-2.5 py-1 text-xs transition-colors',
              value === o
                ? 'border-primary/40 bg-primary/15 text-primary'
                : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground',
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}
