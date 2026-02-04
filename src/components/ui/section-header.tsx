import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  children: React.ReactNode
  className?: string
  centered?: boolean
}

export function SectionHeader({ children, className, centered = true }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      {children}
    </div>
  )
}

interface SectionBadgeProps {
  children: React.ReactNode
  className?: string
}

export function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        'mb-4 inline-flex items-center gap-2 rounded-full',
        'bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary',
        className
      )}
    >
      {children}
    </span>
  )
}

interface SectionTitleProps {
  children: React.ReactNode
  className?: string
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2
      className={cn(
        'text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl lg:text-4xl',
        'dark:text-white',
        className
      )}
    >
      {children}
    </h2>
  )
}

interface SectionDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function SectionDescription({ children, className }: SectionDescriptionProps) {
  return (
    <p
      className={cn(
        'mx-auto mt-4 max-w-2xl text-base text-slate-500 md:text-lg',
        'dark:text-slate-400',
        className
      )}
    >
      {children}
    </p>
  )
}
