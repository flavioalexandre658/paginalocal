"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen overflow-hidden",
        "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        "dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface PageHeaderProps {
  children: React.ReactNode
  className?: string
  backHref?: string
  backLabel?: string
}

export function PageHeader({ children, className, backHref, backLabel }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 space-y-4", className)}>
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
        >
          <IconArrowLeft className="h-4 w-4" />
          {backLabel || "Voltar"}
        </Link>
      )}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        {children}
      </div>
    </div>
  )
}

interface PageHeaderContentProps {
  children: React.ReactNode
  className?: string
}

export function PageHeaderContent({ children, className }: PageHeaderContentProps) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

interface PageHeaderActionsProps {
  children: React.ReactNode
  className?: string
}

export function PageHeaderActions({ children, className }: PageHeaderActionsProps) {
  return (
    <div className={cn("flex items-center gap-2 mt-4 sm:mt-0", className)}>
      {children}
    </div>
  )
}

interface PageTitleProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function PageTitle({ children, className, icon }: PageTitleProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
          {icon}
        </div>
      )}
      <h1
        className={cn(
          "text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl",
          className
        )}
      >
        {children}
      </h1>
    </div>
  )
}

interface PageDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function PageDescription({ children, className }: PageDescriptionProps) {
  return (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>
      {children}
    </p>
  )
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>
}

interface ContentSectionProps {
  children: React.ReactNode
  className?: string
}

export function ContentSection({ children, className }: ContentSectionProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/40 bg-white/70 p-4 sm:p-6",
        "shadow-xl shadow-slate-200/50 backdrop-blur-xl",
        "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
        className
      )}
    >
      {children}
    </div>
  )
}

interface ContentSectionHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ContentSectionHeader({ children, className }: ContentSectionHeaderProps) {
  return (
    <div className={cn("mb-4 flex items-center justify-between gap-4", className)}>
      {children}
    </div>
  )
}

interface ContentSectionTitleProps {
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
  description?: string
}

export function ContentSectionTitle({
  children,
  className,
  icon,
  description,
}: ContentSectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
          {icon}
        </div>
      )}
      <div>
        <h2
          className={cn(
            "text-lg font-semibold text-slate-900 dark:text-white",
            className
          )}
        >
          {children}
        </h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

interface ContentSectionActionsProps {
  children: React.ReactNode
  className?: string
}

export function ContentSectionActions({ children, className }: ContentSectionActionsProps) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>
}

interface EmptyStateProps {
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  children,
  className,
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  if (children) {
    return (
      <div
        className={cn(
          "flex h-80 items-center justify-center rounded-2xl",
          "border border-slate-200/40 bg-slate-50/50",
          "dark:border-slate-700/40 dark:bg-slate-800/30",
          className
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
          {icon}
        </div>
      )}
      {title && (
        <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
          {title}
        </p>
      )}
      {description && (
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

interface StatsRowProps {
  children: React.ReactNode
  className?: string
}

export function StatsRow({ children, className }: StatsRowProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/40 bg-white/70 p-4",
        "shadow-xl shadow-slate-200/50 backdrop-blur-xl",
        "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
        {value}
      </p>
      {trend && (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend.isPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          )}
        >
          {trend.isPositive ? "+" : ""}
          {trend.value}% vs período anterior
        </p>
      )}
    </div>
  )
}

interface StatsRowSkeletonProps {
  count?: number
  className?: string
}

export function StatsRowSkeleton({ count = 5, className }: StatsRowSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/40 bg-white/70 p-4",
        "shadow-xl shadow-slate-200/50 backdrop-blur-xl",
        "dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
        "animate-pulse"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="mt-3 h-7 w-16 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
