import { Menu, Search, Bell, Sun, Moon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const [dark, setDark] = useState(true)
  function toggleTheme() {
    const root = document.documentElement
    const next = !dark
    setDark(next)
    root.classList.toggle("dark", next)
    root.classList.toggle("light", !next)
  }
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Open sidebar">
        <Menu className="size-5" />
      </Button>
      <div className="relative hidden max-w-md flex-1 items-center sm:flex">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input type="search" placeholder="Search debates, agents, decisions..."
          className="h-9 w-full rounded-xl border border-input bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30" />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {dark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
      </div>
    </header>
  )
}
