import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { accentStroke, type Accent } from '@/lib/accents'

type GNode = { id: string; label: string; x: number; y: number; accent: Accent }

const nodes: GNode[] = [
  { id: 'user', label: 'User', x: 50, y: 200, accent: 'cyan' },
  { id: 'risk', label: 'Risk', x: 200, y: 60, accent: 'destructive' },
  { id: 'optimist', label: 'Optimist', x: 200, y: 150, accent: 'success' },
  { id: 'cost', label: 'Cost', x: 200, y: 250, accent: 'warning' },
  { id: 'security', label: 'Security', x: 200, y: 340, accent: 'cyan' },
  { id: 'market', label: 'Market', x: 330, y: 110, accent: 'purple' },
  { id: 'engine', label: 'Consensus', x: 420, y: 200, accent: 'primary' },
  { id: 'judge', label: 'Judge', x: 540, y: 200, accent: 'primary' },
]

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

const edges: [string, string][] = [
  ['user', 'risk'],
  ['user', 'optimist'],
  ['user', 'cost'],
  ['user', 'security'],
  ['risk', 'market'],
  ['optimist', 'engine'],
  ['cost', 'engine'],
  ['security', 'engine'],
  ['market', 'engine'],
  ['risk', 'engine'],
  ['engine', 'judge'],
]

const speakOrder = ['risk', 'optimist', 'cost', 'security', 'market', 'engine', 'judge']

export function InteractionGraph() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % speakOrder.length), 1400)
    return () => clearInterval(t)
  }, [])

  const activeId = speakOrder[active]

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox="0 0 600 400" className="h-72 w-full min-w-[560px]">
        {edges.map(([from, to], i) => {
          const a = nodeMap[from]
          const b = nodeMap[to]
          const isActive = from === activeId || to === activeId
          return (
            <g key={i}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isActive ? accentStroke[a.accent] : 'var(--border)'}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.35}
              />
              {isActive && (
                <motion.circle
                  r={3}
                  fill={accentStroke[a.accent]}
                  initial={{ cx: a.x, cy: a.y }}
                  animate={{ cx: b.x, cy: b.y }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ filter: `drop-shadow(0 0 4px ${accentStroke[a.accent]})` }}
                />
              )}
            </g>
          )
        })}

        {nodes.map((n) => {
          const isActive = n.id === activeId
          return (
            <g key={n.id}>
              {isActive && (
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={22}
                  fill="none"
                  stroke={accentStroke[n.accent]}
                  strokeWidth={1.5}
                  initial={{ opacity: 0.8, r: 18 }}
                  animate={{ opacity: 0, r: 34 }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={16}
                fill="var(--card)"
                stroke={accentStroke[n.accent]}
                strokeWidth={isActive ? 2.5 : 1.5}
                style={isActive ? { filter: `drop-shadow(0 0 8px ${accentStroke[n.accent]})` } : undefined}
              />
              <text
                x={n.x}
                y={n.y + 32}
                textAnchor="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
                fontWeight={isActive ? 600 : 400}
              >
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
