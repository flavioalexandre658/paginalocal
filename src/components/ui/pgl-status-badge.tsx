"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const statusBadgeVariants = cva(
  "inline-flex max-w-fit items-center gap-1.5 rounded-full border border-transparent px-2 py-px text-xs font-semibold",
  {
    variants: {
      status: {
        success: "bg-green-700/15 text-green-700",
        warning: "bg-amber-600/15 text-amber-600",
        error: "bg-red-600/15 text-red-600",
        neutral: "bg-black/5 text-black/55",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
)

const statusDotVariants = cva(
  "size-1.5 shrink-0 rounded-full",
  {
    variants: {
      status: {
        success: "bg-green-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        neutral: "bg-black/30",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
)

// ═══════════════════════════════════════════════
// COMPONENTE
// ═══════════════════════════════════════════════

export interface PglStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  dot?: boolean
}

const PglStatusBadge = React.forwardRef<HTMLDivElement, PglStatusBadgeProps>(
  ({ className, status, dot = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusBadgeVariants({ status, className }))}
        {...props}
      >
        {dot && <span className={cn(statusDotVariants({ status }))} />}
        <span>{children}</span>
      </div>
    )
  }
)
PglStatusBadge.displayName = "PglStatusBadge"

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  PglStatusBadge,
  statusBadgeVariants,
  statusDotVariants,
}
