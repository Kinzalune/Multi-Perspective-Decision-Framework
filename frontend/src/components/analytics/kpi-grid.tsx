import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { kpis } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="p-4">
          <p className="text-xs text-muted-foreground">{kpi.label}</p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
            {kpi.value}
          </p>
          <div
            className={`mt-1.5 inline-flex items-center gap-1 text-xs ${
              kpi.trend === "up" ? "text-success" : "text-warning"
            }`}
          >
            {kpi.trend === "up" ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            <span>{kpi.delta}</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
