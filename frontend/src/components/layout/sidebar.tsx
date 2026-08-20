import { Link, useRouterState } from "@tanstack/react-router"
import {
  LayoutDashboard, PlayCircle, Radio, History,
  Settings as SettingsIcon, Info, X, BrainCircuit,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Start Debate", href: "/start", icon: PlayCircle },
  { label: "Live Debate", href: "/live", icon: Radio },
  { label: "Debate History", href: "/history", icon: History },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
  { label: "About", href: "/about", icon: Info },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-5">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary glow-primary">
              <BrainCircuit className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">Multi-Perspective Decision Framework</span>
              <span className="text-[11px] text-muted-foreground">Enterprise Reasoning</span>
            </span>
          </Link>
          <button className="rounded-md p-1 text-muted-foreground hover:text-foreground lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                )}
              >
                <Icon className={cn("size-[18px] transition-transform group-hover:scale-110", active && "text-primary")} />
                {item.label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-primary animate-pulse" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="glass rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              All systems operational
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Event broker latency 42ms</p>
          </div>
        </div>
      </aside>
    </>
  )
}
