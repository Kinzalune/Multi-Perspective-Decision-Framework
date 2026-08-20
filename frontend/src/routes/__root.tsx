import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Outlet, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router"
import { useEffect, type ReactNode } from "react"
import appCss from "../styles.css?url"
import { reportLovableError } from "../lib/lovable-error-reporting"
import { AppShell } from "@/components/layout/app-shell"
import { Link } from "@tanstack/react-router"

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6"><Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go home</Link></div>
      </div>
    </div>
  )
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }) }, [error])
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6"><button onClick={() => { router.invalidate(); reset() }} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button></div>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Multi-Perspective Decision Framework — Enterprise Multi-Agent Reasoning" },
      { name: "description", content: "Enterprise-grade AI decision making through transparent multi-agent reasoning, consensus scoring, and explainable AI." },
      { property: "og:title", content: "Multi-Perspective Decision Framework — Enterprise Multi-Agent Reasoning" },
      { property: "og:description", content: "Enterprise-grade AI decision making through transparent multi-agent reasoning." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }, { rel: "icon", href: "/favicon.ico", type: "image/x-icon" }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="antialiased bg-background text-foreground">{children}<Scripts /></body>
    </html>
  )
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext()
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell><Outlet /></AppShell>
    </QueryClientProvider>
  )
}
