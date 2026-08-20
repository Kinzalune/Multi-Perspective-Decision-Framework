import { motion } from 'framer-motion'
import { type Accent, accentStroke } from '@/lib/accents'

export function CircularGauge({
  value,
  size = 160,
  stroke = 12,
  accent = 'primary',
  label,
  sublabel,
}: {
  value: number
  size?: number
  stroke?: number
  accent?: Accent
  label?: string
  sublabel?: string
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accentStroke[accent]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${accentStroke[accent]})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums">{value}%</span>
        {label && <span className="mt-0.5 text-xs font-medium text-muted-foreground">{label}</span>}
        {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
      </div>
    </div>
  )
}
