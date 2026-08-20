"use client"

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  agentParticipation,
  confidenceDistribution,
  consensusTrend,
  debatesPerCategory,
  responseTime,
} from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

const tooltipStyle = {
  backgroundColor: "oklch(0.16 0.02 265)",
  border: "1px solid oklch(0.28 0.02 265)",
  borderRadius: "0.5rem",
  color: "oklch(0.98 0 0)",
  fontSize: "0.75rem",
}

function ChartCard({
  title,
  subtitle,
  className,
  children,
}: {
  title: string
  subtitle: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <Card className={className ? `p-5 ${className}` : "p-5"}>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="h-64 w-full">{children}</div>
    </Card>
  )
}

export function AnalyticsCharts() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ChartCard title="Consensus Trend" subtitle="Average consensus score by month">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={consensusTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="oklch(0.72 0.16 195)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 265)" vertical={false} />
            <XAxis dataKey="month" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(0.4 0.02 265)" }} />
            <Area
              type="monotone"
              dataKey="consensus"
              stroke="oklch(0.72 0.16 195)"
              strokeWidth={2}
              fill="url(#consGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Agent Participation" subtitle="Debates each agent has taken part in">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={agentParticipation} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 265)" vertical={false} />
            <XAxis dataKey="agent" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.24 0.02 265 / 0.4)" }} />
            <Bar dataKey="debates" radius={[4, 4, 0, 0]} fill="oklch(0.66 0.19 265)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Debates by Category" subtitle="Distribution across decision domains">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={debatesPerCategory}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              stroke="oklch(0.14 0.02 265)"
              strokeWidth={2}
            >
              {debatesPerCategory.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Confidence Distribution" subtitle="Final confidence scores across all debates">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={confidenceDistribution} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 265)" vertical={false} />
            <XAxis dataKey="bucket" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(0.24 0.02 265 / 0.4)" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="oklch(0.7 0.17 145)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Avg Response Time per Round"
        subtitle="How quickly agents respond as debates progress"
        className="lg:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={responseTime} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.24 0.02 265)" vertical={false} />
            <XAxis dataKey="round" stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.6 0.02 265)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "oklch(0.4 0.02 265)" }} />
            <Line
              type="monotone"
              dataKey="ms"
              stroke="oklch(0.78 0.15 85)"
              strokeWidth={2}
              dot={{ r: 3, fill: "oklch(0.78 0.15 85)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
