"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const pglButtonVariants = cva(
  [
    // Layout
    "relative inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap font-medium",
    // Transition — matches reference: background + color + box-shadow
    "transition-[background-color,color,box-shadow,opacity] duration-150",
    // States
    "disabled:pointer-events-none disabled:opacity-40",
    // Focus ring
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    // SVG children — auto-size unclassed icons, prevent pointer events
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "[&_svg:not([class*='h-']):not([class*='w-']):not([class*='size-'])]:size-[18px]",
    // Smart padding: reduce side padding when icon is first/last direct child
    "has-[>svg:first-child]:pl-2 has-[>svg:last-child]:pr-2",
  ].join(" "),
  {
    variants: {
      variant: {
        // Gray — translucent light bg, subtle raised shadow
        default:
          "bg-black/5 text-black/55 shadow-button hover:bg-black/[0.08] hover:text-black/80 hover:shadow-button-hover " +
          "dark:bg-white/[0.08] dark:text-white/55 dark:hover:bg-white/[0.12] dark:hover:text-white/80",

        // Primary — emerald with inner highlight shadow
        primary:
          "bg-emerald-500 text-white/90 shadow-button-primary hover:bg-emerald-600 hover:text-white " +
          "dark:bg-emerald-500 dark:hover:bg-emerald-600",

        // Ghost — no bg, text only, subtle hover
        ghost:
          "text-black/45 hover:bg-black/5 hover:text-black/70 " +
          "dark:text-white/40 dark:hover:bg-white/[0.08] dark:hover:text-white/70",

        // Outline — border-based, same shadow as default
        outline:
          "border border-black/[0.09] bg-transparent text-black/55 shadow-button hover:bg-black/[0.04] hover:text-black/80 hover:shadow-button-hover " +
          "dark:border-white/[0.09] dark:text-white/55 dark:hover:bg-white/[0.05] dark:hover:text-white/80",

        // Dark — near-black bg, white text with opacity
        dark:
          "bg-black/80 text-white/75 shadow-button-dark hover:bg-black/90 hover:text-white " +
          "dark:bg-white/90 dark:text-black/75 dark:shadow-button dark:hover:bg-white dark:hover:text-black",

        // Danger — ghost with red hover (for destructive actions)
        danger:
          "text-black/45 hover:bg-red-50 hover:text-red-600 " +
          "dark:text-white/40 dark:hover:bg-red-950 dark:hover:text-red-400",
      },

      size: {
        xs:       "h-7 px-2 text-xs rounded-lg",
        sm:       "h-8 px-3 text-[13px] rounded-xl",
        md:       "h-9 px-4 text-sm rounded-xl",
        lg:       "h-10 px-5 text-sm rounded-xl",
        icon:     "h-9 w-9 p-0 rounded-xl has-[>svg:first-child]:pl-0 has-[>svg:last-child]:pr-0",
        "icon-sm":"h-8 w-8 p-0 rounded-xl has-[>svg:first-child]:pl-0 has-[>svg:last-child]:pr-0",
      },

      shape: {
        default: "",
        pill:    "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      shape: "default",
    },
  }
)

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface PglButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pglButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const PglButton = React.forwardRef<HTMLButtonElement, PglButtonProps>(
  ({ className, variant, size, shape, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(pglButtonVariants({ variant, size, shape, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <IconLoader2 className="size-[18px] animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
PglButton.displayName = "PglButton"

// ═══════════════════════════════════════════════
// SUBCOMPONENTES (compound slots)
// ═══════════════════════════════════════════════

/** Wrap an icon — ensures consistent sizing and no pointer events */
const PglButtonIcon = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn("shrink-0 [&>svg]:pointer-events-none [&>svg]:shrink-0 [&>svg:not([class*='h-']):not([class*='w-']):not([class*='size-'])]:size-[18px]", className)}>
      {children}
    </span>
  )
}
PglButtonIcon.displayName = "PglButtonIcon"

/** Wrap text content — truncates overflow */
const PglButtonText = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <span className={cn("truncate", className)}>{children}</span>
}
PglButtonText.displayName = "PglButtonText"

/** Badge / count indicator — small pill appended to the button */
const PglButtonBadge = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn("ml-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-black/10 px-1 text-[10px] font-semibold leading-none", className)}>
      {children}
    </span>
  )
}
PglButtonBadge.displayName = "PglButtonBadge"

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  PglButton,
  PglButtonIcon,
  PglButtonText,
  PglButtonBadge,
  pglButtonVariants,
}
