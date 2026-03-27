"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const dashboardCardVariants = cva(
  "flex flex-col rounded-2xl",
  {
    variants: {
      variant: {
        default: "bg-black/[0.03]",
        outline: "border border-black/[0.08]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface PglDashboardCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dashboardCardVariants> {}

const PglDashboardCard = React.forwardRef<HTMLDivElement, PglDashboardCardProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(dashboardCardVariants({ variant, className }))}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PglDashboardCard.displayName = "PglDashboardCard"

// ═══════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════

const PglDashboardCardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex items-center justify-between gap-2 px-6 py-3 flex-wrap", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// HEADER LEFT (icon + title group)
// ═══════════════════════════════════════════════

const PglDashboardCardHeaderLeft = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex items-center gap-2 min-w-0", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// HEADER RIGHT (actions)
// ═══════════════════════════════════════════════

const PglDashboardCardHeaderRight = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// TITLE
// ═══════════════════════════════════════════════

const PglDashboardCardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p className={cn("text-sm font-semibold text-black/80 truncate", className)}>
      {children}
    </p>
  )
}

// ═══════════════════════════════════════════════
// ICON
// ═══════════════════════════════════════════════

const PglDashboardCardIcon = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn("shrink-0 text-black/55 [&>svg]:size-5", className)}>
      {children}
    </span>
  )
}

// ═══════════════════════════════════════════════
// BODY
// ═══════════════════════════════════════════════

const PglDashboardCardBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("flex-1", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// LIST ITEM
// ═══════════════════════════════════════════════

const PglDashboardCardListItem = ({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) => {
  const Comp = onClick ? "button" : "div"
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left",
        onClick && "transition-[background,color] duration-150 hover:bg-black/5",
        className
      )}
    >
      {children}
    </Comp>
  )
}

// ═══════════════════════════════════════════════
// EMPTY STATE (with optional CTA)
// ═══════════════════════════════════════════════

const PglDashboardCardEmpty = ({
  icon,
  text,
  ctaLabel,
  onCtaClick,
  className,
}: {
  icon?: React.ReactNode
  text: string
  ctaLabel?: string
  onCtaClick?: () => void
  className?: string
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-8", className)}>
      {icon && <span className="text-black/20 [&>svg]:size-5">{icon}</span>}
      <p className="text-[13px] text-black/30">{text}</p>
      {ctaLabel && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="rounded-xl bg-black/5 px-3.5 py-1.5 text-[13px] font-medium text-black/55 transition-[background,color] duration-150 hover:bg-black/10 hover:text-black/80"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════

const PglDashboardCardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={cn("border-t border-black/[0.06] px-5 py-3", className)}>
      {children}
    </div>
  )
}

// ═══════════════════════════════════════════════
// SKELETON LOADING
// ═══════════════════════════════════════════════

const PglDashboardCardSkeleton = ({
  rows = 3,
  className,
}: {
  rows?: number
  className?: string
}) => {
  return (
    <div className={cn("space-y-2 px-3 py-1", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl bg-[#f5f5f4]" />
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  PglDashboardCard,
  PglDashboardCardHeader,
  PglDashboardCardHeaderLeft,
  PglDashboardCardHeaderRight,
  PglDashboardCardTitle,
  PglDashboardCardIcon,
  PglDashboardCardBody,
  PglDashboardCardListItem,
  PglDashboardCardEmpty,
  PglDashboardCardFooter,
  PglDashboardCardSkeleton,
  dashboardCardVariants,
}
