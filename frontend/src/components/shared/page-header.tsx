import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"

export function PageHeader({ title, description, breadcrumb, actions }: { title: string; description?: string; breadcrumb?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{breadcrumb ?? title}</span>
        </nav>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground text-pretty">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
