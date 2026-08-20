import { useState, type ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { Footer } from "./footer"

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-64 flex min-h-screen flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="grid-bg flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
