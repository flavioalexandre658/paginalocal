"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const pillSwitcherVariants = cva(
  "inline-flex items-center gap-0.5 p-[3px]",
  {
    variants: {
      shape: {
        pill: "rounded-full",
        rounded: "rounded-xl",
      },
      border: {
        default: "border border-black/[0.06]",
        none: "",
      },
    },
    defaultVariants: {
      shape: "pill",
      border: "default",
    },
  }
)

const pillSwitcherItemVariants = cva(
  "flex items-center gap-1.5 text-sm font-medium transition-[background,color] duration-150 outline-none",
  {
    variants: {
      shape: {
        pill: "rounded-full",
        rounded: "rounded-xl",
      },
      size: {
        sm: "px-3 py-1",
        md: "px-3 py-1.5",
      },
      active: {
        true: "bg-black/5 text-black/80",
        false: "text-black/55 hover:bg-black/5 hover:text-black/80",
      },
    },
    defaultVariants: {
      shape: "pill",
      size: "md",
      active: false,
    },
  }
)

// ═══════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════

const PillSwitcherContext = React.createContext<{
  shape: "pill" | "rounded"
}>({ shape: "pill" })

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface PglPillSwitcherProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillSwitcherVariants> {}

const PglPillSwitcher = React.forwardRef<HTMLDivElement, PglPillSwitcherProps>(
  ({ className, shape = "pill", border, children, ...props }, ref) => {
    return (
      <PillSwitcherContext.Provider value={{ shape: shape ?? "pill" }}>
        <div
          ref={ref}
          className={cn(pillSwitcherVariants({ shape, border, className }))}
          {...props}
        >
          {children}
        </div>
      </PillSwitcherContext.Provider>
    )
  }
)
PglPillSwitcher.displayName = "PglPillSwitcher"

// ═══════════════════════════════════════════════
// SUBCOMPONENTE — ITEM
// ═══════════════════════════════════════════════

export interface PglPillSwitcherItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">,
    Omit<VariantProps<typeof pillSwitcherItemVariants>, "shape"> {
  icon?: React.ReactNode
  className?: string
}

const PglPillSwitcherItem = ({
  icon,
  active,
  size,
  children,
  className,
  ...props
}: PglPillSwitcherItemProps) => {
  const { shape } = React.useContext(PillSwitcherContext)

  return (
    <button
      className={cn(pillSwitcherItemVariants({ shape, size, active, className }))}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:size-5">{icon}</span>}
      {children}
    </button>
  )
}

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  PglPillSwitcher,
  PglPillSwitcherItem,
  pillSwitcherVariants,
  pillSwitcherItemVariants,
}
