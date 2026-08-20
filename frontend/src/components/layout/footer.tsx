
import { Github, Mail, ShieldCheck, BrainCircuit } from "lucide-react"


export function Footer() {
  return (
    <footer className="mt-8 border-t border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary glow-primary">
            <BrainCircuit className="size-5" />
          </span>
          <div>
            <div className="text-sm font-semibold">Multi-Perspective Decision Framework</div>
            <div className="text-[11px] text-muted-foreground">Enterprise multi-agent reasoning platform</div>
          </div>
        </div>
        {/* <nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
          {links.map((l) => {
            const Icon = l.icon
            const cls = "flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            return l.external ? (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={cls}>
                <Icon className="size-3.5" />{l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href} className={cls}>
                <Icon className="size-3.5" />{l.label}
              </Link>
            )
          })}
        </nav> */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
