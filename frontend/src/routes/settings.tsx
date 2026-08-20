import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Wifi, Activity, Database as DbIcon, Bell, Palette, Zap } from "lucide-react"

export const Route = createFileRoute("/settings")({ component: SettingsPage })

const defaults = {
  theme: true, animations: true, notifications: true,
  agents: 6, threshold: 80, mode: "Automatic" as "Automatic" | "Manual",
  maxRounds: 8, autoStop: true,
  endpoint: "https://api.consensusai.io/v1",
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-border/60 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-primary" : "bg-muted"}`}>
      <span className={`absolute top-0.5 size-5 rounded-full bg-background shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
    </button>
  )
}

function Segmented<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-xl border border-border bg-muted/30 p-1">
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={`rounded-lg px-3 py-1 text-xs transition-colors ${value === o ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          {o}
        </button>
      ))}
    </div>
  )
}

function Slider({ value, min, max, onChange, suffix }: { value: number; min: number; max: number; onChange: (n: number) => void; suffix?: string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex w-full items-center gap-3 sm:w-64">
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_var(--primary)]"
        style={{ background: `linear-gradient(to right, var(--primary) ${pct}%, var(--muted) ${pct}%)` }} />
      <span className="w-12 text-right font-mono text-sm text-primary tabular-nums">{value}{suffix}</span>
    </div>
  )
}

function SettingsPage() {
  const [s, setS] = useState(defaults)
  const update = <K extends keyof typeof defaults>(k: K, v: (typeof defaults)[K]) => setS((p) => ({ ...p, [k]: v }))

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 md:px-6 md:py-10">
      <PageHeader title="Settings" breadcrumb="Settings" description="Configure debate defaults, notifications, and system endpoints." />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="size-4 text-primary" />General</CardTitle></CardHeader>
          <CardContent>
            <Row label="Dark theme" hint="Use dark palette across the app"><Toggle value={s.theme} onChange={(v) => update("theme", v)} /></Row>
            <Row label="Animations" hint="Enable Framer Motion transitions"><Toggle value={s.animations} onChange={(v) => update("animations", v)} /></Row>
            <Row label="Notifications" hint="Get alerts when debates complete"><Toggle value={s.notifications} onChange={(v) => update("notifications", v)} /></Row>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="size-4 text-cyan" />Debate</CardTitle></CardHeader>
          <CardContent>
            <Row label="Default number of agents"><Slider value={s.agents} min={3} max={10} onChange={(n) => update("agents", n)} suffix="" /></Row>
            <Row label="Consensus threshold"><Slider value={s.threshold} min={50} max={100} onChange={(n) => update("threshold", n)} suffix="%" /></Row>
            <Row label="Debate mode"><Segmented options={["Automatic", "Manual"]} value={s.mode} onChange={(v) => update("mode", v)} /></Row>
            <Row label="Maximum debate rounds"><Slider value={s.maxRounds} min={2} max={20} onChange={(n) => update("maxRounds", n)} suffix="" /></Row>
            <Row label="Auto-stop on convergence" hint="Halt when threshold is reached"><Toggle value={s.autoStop} onChange={(v) => update("autoStop", v)} /></Row>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="size-4 text-purple" />System</CardTitle></CardHeader>
          <CardContent>
            <Row label="API endpoint">
              <input value={s.endpoint} onChange={(e) => update("endpoint", e.target.value)}
                className="h-9 w-full min-w-[16rem] rounded-lg border border-input bg-muted/30 px-3 font-mono text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" />
            </Row>
            <Row label="WebSocket status"><Badge variant="success"><Wifi className="size-3" />Connected · 42ms</Badge></Row>
            <Row label="System health"><Badge variant="success"><Activity className="size-3" />All services green</Badge></Row>
            <Row label="Cache status"><Badge variant="cyan"><DbIcon className="size-3" />Warm · 128MB</Badge></Row>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex flex-wrap gap-3">
        <Button className="glow-primary"><Save className="size-4" />Save Changes</Button>
        <Button variant="outline" onClick={() => setS(defaults)}><RotateCcw className="size-4" />Reset Defaults</Button>
      </div>
    </div>
  )
}
