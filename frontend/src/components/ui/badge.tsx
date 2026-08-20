import type { HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium [&_svg]:size-3.5",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/15 text-primary",
        cyan: "border-cyan/30 bg-cyan/15 text-cyan",
        purple: "border-purple/30 bg-purple/15 text-purple",
        success: "border-success/30 bg-success/15 text-success",
        warning: "border-warning/30 bg-warning/15 text-warning",
        destructive: "border-destructive/30 bg-destructive/15 text-destructive",
        muted: "border-border bg-muted/40 text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
)

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
