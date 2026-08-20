import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts"
import { Card } from "@/components/ui/card"

const tooltipStyle = {
  backgroundColor: "oklch(0.16 0.02 265)",
  border: "1px solid oklch(0.28 0.02 265)",
  borderRadius: "0.5rem",
  color: "oklch(0.98 0 0)",
  fontSize: "0.75rem",
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-72 w-full">{children}</div>
    </Card>
  )
}

const radarData = [
  { metric: "Confidence", Risk: 82, Optimist: 91, Cost: 74, Security: 88, Market: 79 },
  { metric: "Response Time", Risk: 70, Optimist: 88, Cost: 62, Security: 74, Market: 80 },
  { metric: "Convergence", Risk: 76, Optimist: 92, Cost: 68, Security: 84, Market: 72 },
  { metric: "Reasoning Depth", Risk: 89, Optimist: 74, Cost: 82, Security: 90, Market: 76 },
  { metric: "Consistency", Risk: 84, Optimist: 79, Cost: 88, Security: 86, Market: 72 },
]

export function RadarChartCard() {
  return (
    <ChartCard title="Agent Skill Radar" subtitle="Multi-dimensional performance profile per agent">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData} outerRadius={90}>
          <PolarGrid stroke="oklch(0.28 0.02 265)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "oklch(0.7 0.02 260)", fontSize: 11 }} />
          <PolarRadiusAxis stroke="oklch(0.28 0.02 265)" tick={{ fill: "oklch(0.55 0.02 260)", fontSize: 10 }} />
          <Radar name="Risk" dataKey="Risk" stroke="var(--destructive)" fill="var(--destructive)" fillOpacity={0.2} />
          <Radar name="Optimist" dataKey="Optimist" stroke="var(--success)" fill="var(--success)" fillOpacity={0.2} />
          <Radar name="Security" dataKey="Security" stroke="var(--cyan)" fill="var(--cyan)" fillOpacity={0.2} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

const consensusDist = [
  { name: "Consensus", value: 68, fill: "var(--success)" },
  { name: "Partial", value: 22, fill: "var(--warning)" },
  { name: "Stagnated", value: 10, fill: "var(--destructive)" },
]
export function ConsensusDistributionCard() {
  return (
    <ChartCard title="Consensus Outcome Distribution" subtitle="Share of debates by final outcome">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={consensusDist} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3} stroke="oklch(0.14 0.02 265)" strokeWidth={2} label={(e) => `${e.name} ${e.value}%`}>
            {consensusDist.map((c, i) => <Cell key={i} fill={c.fill} />)}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

const perf = [
  { agent: "Risk", wins: 82, losses: 18 },
  { agent: "Optimist", wins: 74, losses: 26 },
  { agent: "Cost", wins: 69, losses: 31 },
  { agent: "Security", wins: 88, losses: 12 },
  { agent: "Market", wins: 71, losses: 29 },
  { agent: "Judge", wins: 95, losses: 5 },
]
export function AgentPerformanceCard() {
  return (
    <ChartCard title="Agent Performance" subtitle="Stance adoption vs. rejected rate per agent">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={perf} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 265)" vertical={false} />
          <XAxis dataKey="agent" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="wins" stackId="a" fill="var(--success)" radius={[0,0,0,0]} />
          <Bar dataKey="losses" stackId="a" fill="var(--destructive)" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
const hours = ["9a","11a","1p","3p","5p","7p"]
function heatValue(d: number, h: number) { return Math.round(20 + Math.sin(d + h/2) * 30 + Math.random() * 40) }
const heatData = days.map((_, d) => hours.map((_, h) => heatValue(d, h)))

export function HeatmapCard() {
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h3 className="text-sm font-medium">Debate Activity Heatmap</h3>
        <p className="text-xs text-muted-foreground">Debates launched by day-of-week and hour</p>
      </div>
      <div className="grid grid-cols-[auto_repeat(6,1fr)] gap-1 text-[11px]">
        <div />
        {hours.map((h) => <div key={h} className="text-center text-muted-foreground">{h}</div>)}
        {days.map((d, di) => (
          <div key={d} className="contents">
            <div className="pr-2 text-right text-muted-foreground">{d}</div>
            {hours.map((_, hi) => {
              const v = heatData[di][hi]
              const alpha = Math.min(100, Math.max(6, v)) / 100
              return (
                <div key={hi} className="aspect-square rounded-md border border-border/50 flex items-center justify-center text-[10px] font-mono"
                     style={{ background: `color-mix(in oklch, var(--primary) ${alpha * 90}%, transparent)` }}>
                  {v}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Card>
  )
}
