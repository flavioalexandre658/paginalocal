"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ─── Variants ────────────────────────────────────────────────────────────────

export const featureCardVariants = cva(
  "flex overflow-hidden rounded-3xl transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-black/[0.03] hover:bg-black/[0.05]",
        outline: "border border-black/[0.06] bg-white hover:border-black/10",
      },
      layout: {
        vertical: "flex-col",
        horizontal: "flex-col xl:flex-row",
      },
    },
    defaultVariants: {
      variant: "default",
      layout: "vertical",
    },
  }
)

// ─── FeatureCard ─────────────────────────────────────────────────────────────

export interface FeatureCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof featureCardVariants> {}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, variant, layout, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(featureCardVariants({ variant, layout }), className)}
        {...props}
      />
    )
  }
)
FeatureCard.displayName = "FeatureCard"

// ─── FeatureCardContent ───────────────────────────────────────────────────────

export interface FeatureCardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function FeatureCardContent({
  children,
  className,
  ...props
}: FeatureCardContentProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col gap-2 px-8 py-10 max-md:px-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── FeatureCardTitle ─────────────────────────────────────────────────────────

export interface FeatureCardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
  className?: string
}

export function FeatureCardTitle({
  children,
  className,
  ...props
}: FeatureCardTitleProps) {
  return (
    <h3
      className={cn(
        "text-xl font-heading text-black/80 md:text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

// ─── FeatureCardDescription ───────────────────────────────────────────────────

export interface FeatureCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
  className?: string
}

export function FeatureCardDescription({
  children,
  className,
  ...props
}: FeatureCardDescriptionProps) {
  return (
    <p
      className={cn("text-base text-black/55", className)}
      {...props}
    >
      {children}
    </p>
  )
}

// ─── FeatureCardVisual ────────────────────────────────────────────────────────

export interface FeatureCardVisualProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function FeatureCardVisual({
  children,
  className,
  ...props
}: FeatureCardVisualProps) {
  return (
    <div className={cn("overflow-hidden", className)} {...props}>
      {children}
    </div>
  )
}

// ─── FeatureCardIcon ──────────────────────────────────────────────────────────

export interface FeatureCardIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function FeatureCardIcon({
  children,
  className,
  ...props
}: FeatureCardIconProps) {
  return (
    <div
      className={cn(
        "mb-4 flex size-12 items-center justify-center rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
