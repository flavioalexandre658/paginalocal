"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "./scroll-reveal"

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      default: "pt-24 md:pt-32",
      tight: "pt-16 md:pt-24",
      none: "",
    },
    background: {
      default: "",
      subtle: "bg-black/[0.02]",
    },
  },
  defaultVariants: {
    spacing: "default",
    background: "default",
  },
})

// ---------------------------------------------------------------------------
// SectionShell
// ---------------------------------------------------------------------------

export interface SectionShellProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: keyof React.JSX.IntrinsicElements
}

export const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  ({ as: Tag = "section", spacing, background, className, children, ...rest }, ref) => {
    const Component = Tag as React.ElementType
    return (
      <Component
        ref={ref}
        className={cn(sectionVariants({ spacing, background }), className)}
        {...rest}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
          {children}
        </div>
      </Component>
    )
  }
)

SectionShell.displayName = "SectionShell"

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------

export interface SectionHeaderProps {
  className?: string
  children?: React.ReactNode
}

export function SectionHeader({ className, children }: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className={cn("mb-16 text-center", className)}>{children}</div>
    </ScrollReveal>
  )
}

SectionHeader.displayName = "SectionHeader"

// ---------------------------------------------------------------------------
// SectionKicker
// ---------------------------------------------------------------------------

export interface SectionKickerProps {
  className?: string
  children?: React.ReactNode
}

export function SectionKicker({ className, children }: SectionKickerProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium",
        className
      )}
    >
      {children}
    </span>
  )
}

SectionKicker.displayName = "SectionKicker"

// ---------------------------------------------------------------------------
// SectionTitle
// ---------------------------------------------------------------------------

export interface SectionTitleProps {
  className?: string
  children?: React.ReactNode
}

export function SectionTitle({ className, children }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        "text-[32px] leading-[40px] font-heading text-black/80",
        className
      )}
    >
      {children}
    </h2>
  )
}

SectionTitle.displayName = "SectionTitle"

// ---------------------------------------------------------------------------
// SectionDescription
// ---------------------------------------------------------------------------

export interface SectionDescriptionProps {
  className?: string
  children?: React.ReactNode
}

export function SectionDescription({
  className,
  children,
}: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        "mx-auto mt-4 max-w-2xl text-base text-black/55 md:text-lg",
        className
      )}
    >
      {children}
    </p>
  )
}

SectionDescription.displayName = "SectionDescription"
