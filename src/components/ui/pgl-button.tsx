"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const pglButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default:
          "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
        primary:
          "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600",
        ghost:
          "text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300",
        outline:
          "border border-slate-200/60 text-slate-700 bg-transparent hover:bg-slate-100 dark:border-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-800",
        danger:
          "text-slate-500 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400",
        dark:
          "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
      },
      size: {
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-3 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
      shape: {
        default: "rounded-xl",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      shape: "default",
    },
  }
)

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
            <IconLoader2 className="h-4 w-4 animate-spin" />
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

const PglButtonIcon = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <span className={cn("shrink-0 [&>svg]:h-4 [&>svg]:w-4", className)}>{children}</span>
}

const PglButtonText = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <span className={cn("truncate", className)}>{children}</span>
}

export {
  PglButton,
  PglButtonIcon,
  PglButtonText,
  pglButtonVariants,
}
