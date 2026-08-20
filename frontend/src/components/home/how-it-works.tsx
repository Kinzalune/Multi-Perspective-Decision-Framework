import { motion } from 'framer-motion'
import { FileText, Users, MessagesSquare, Gauge, Scale } from 'lucide-react'

const steps = [
  { title: 'User submits prompt', desc: 'A decision or dilemma is posed to the platform.', icon: FileText },
  { title: 'Agents receive task', desc: 'Specialist agents are assigned the shared context.', icon: Users },
  { title: 'Agents debate asynchronously', desc: 'Each agent argues its position over the broker.', icon: MessagesSquare },
  { title: 'Consensus engine evaluates', desc: 'Convergence is scored across rounds in real time.', icon: Gauge },
  { title: 'Judge delivers verdict', desc: 'An impartial recommendation is finalized.', icon: Scale },
]

export function HowItWorks() {
  return (
    <div className="relative pl-2">
      <div className="absolute left-[1.375rem] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-cyan to-purple" />
      <div className="space-y-4">
        {steps.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="relative flex items-start gap-4"
            >
              <div className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-background text-primary">
                <Icon className="size-5" />
              </div>
              <div className="glass flex-1 rounded-2xl p-4">
                <span className="font-mono text-xs text-primary">
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
