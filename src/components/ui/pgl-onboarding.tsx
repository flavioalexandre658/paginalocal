"use client"

import * as React from "react"
import { IconCheck, IconLoader2 } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// SHELL — full-page wrapper
// ═══════════════════════════════════════════════

const OnboardingShell = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "relative flex min-h-screen w-full flex-col bg-[#fafaf9]",
      className,
    )}
  >
    {children}
  </div>
)
OnboardingShell.displayName = "OnboardingShell"

// ═══════════════════════════════════════════════
// CARD — transparent content container (centered)
// ═══════════════════════════════════════════════

const OnboardingCard = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={cn(
      "w-full max-w-2xl p-4",
      className,
    )}
  >
    {children}
  </div>
)
OnboardingCard.displayName = "OnboardingCard"

// ═══════════════════════════════════════════════
// PROGRESS — step dots
// ═══════════════════════════════════════════════

const OnboardingProgress = ({
  current,
  total,
  className,
}: {
  current: number
  total: number
  className?: string
}) => (
  <div className={cn("flex items-center justify-center gap-2", className)}>
    {Array.from({ length: total }).map((_, i) => (
      <span
        key={i}
        className={cn(
          "h-2 rounded-full transition-[width,background-color] duration-300",
          i === current
            ? "w-6 bg-black/30"
            : "w-2 bg-black/10",
        )}
      />
    ))}
  </div>
)
OnboardingProgress.displayName = "OnboardingProgress"

// ═══════════════════════════════════════════════
// HEADER — icon + title + subtitle
// ═══════════════════════════════════════════════

const OnboardingHeader = ({
  title,
  subtitle,
  className,
}: {
  title: string
  subtitle?: string
  className?: string
}) => (
  <div className={cn("mb-6", className)}>
    <p className="text-xl font-medium text-black/80 md:text-2xl">{title}</p>
    {subtitle && <p className="mt-1.5 text-sm text-black/40">{subtitle}</p>}
  </div>
)
OnboardingHeader.displayName = "OnboardingHeader"

// ═══════════════════════════════════════════════
// BODY — content area
// ═══════════════════════════════════════════════

const OnboardingBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn(className)}>{children}</div>
)
OnboardingBody.displayName = "OnboardingBody"

// ═══════════════════════════════════════════════
// FOOTER — actions row
// ═══════════════════════════════════════════════

const OnboardingFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn("mt-4", className)}>
    {children}
  </div>
)
OnboardingFooter.displayName = "OnboardingFooter"

// ═══════════════════════════════════════════════
// OPTION CARD — selectable
// ═══════════════════════════════════════════════

const OnboardingOptionCard = ({
  selected,
  onClick,
  children,
  className,
}: {
  selected?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "inline-flex w-full cursor-pointer items-center justify-center rounded-2xl px-6 py-4 text-center font-medium outline-none",
      "transition-[background,color] duration-150",
      selected
        ? "bg-black/80 text-white"
        : "bg-black/5 text-black/80 hover:bg-black/10",
      className,
    )}
  >
    {children}
  </button>
)
OnboardingOptionCard.displayName = "OnboardingOptionCard"

// ═══════════════════════════════════════════════
// CREATING ITEM — progress list row
// ═══════════════════════════════════════════════

const OnboardingCreatingItem = ({
  icon: Icon,
  label,
  status,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  status: "done" | "active" | "pending"
  className?: string
}) => (
  <div className={cn("flex items-center gap-3", className)}>
    <div
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-full",
        status === "done" && "bg-emerald-50 text-emerald-500",
        status === "active" && "bg-black/5 text-black/80",
        status === "pending" && "border border-black/10 text-black/20",
      )}
    >
      {status === "done" ? (
        <IconCheck className="size-3.5" />
      ) : status === "active" ? (
        <IconLoader2 className="size-3.5 animate-spin" />
      ) : (
        <Icon className="size-3.5" />
      )}
    </div>
    <span
      className={cn(
        "text-sm",
        status === "done" && "text-black/80",
        status === "active" && "font-medium text-black/80",
        status === "pending" && "text-black/30",
      )}
    >
      {label}
    </span>
  </div>
)
OnboardingCreatingItem.displayName = "OnboardingCreatingItem"

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  OnboardingShell,
  OnboardingCard,
  OnboardingProgress,
  OnboardingHeader,
  OnboardingBody,
  OnboardingFooter,
  OnboardingOptionCard,
  OnboardingCreatingItem,
}
