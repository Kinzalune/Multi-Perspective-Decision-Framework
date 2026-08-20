import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { consensusEvolution as mockEvolution } from '@/lib/mock-data'
import type { ConsensusPoint } from '@/lib/types'

export function ConsensusChart({ data = mockEvolution }: { data?: ConsensusPoint[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="consensusFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="round" tickFormatter={(v) => `R${v}`} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis domain={[0, 100]} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            contentStyle={{
              background: 'var(--popover)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontSize: 12,
              color: 'var(--popover-foreground)',
            }}
            labelFormatter={(v) => `Round ${v}`}
            formatter={(v) => [`${v}%`, 'Consensus']}
          />
          <Area
            type="monotone"
            dataKey="consensus"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#consensusFill)"
            dot={{ r: 3, fill: 'var(--primary)' }}
            activeDot={{ r: 5 }}
            isAnimationActive
            animationDuration={1400}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
