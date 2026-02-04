import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/40 bg-white/70 p-6',
        'shadow-xl shadow-slate-200/50 backdrop-blur-xl',
        'dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50',
        hover && [
          'transition-all duration-300',
          'hover:-translate-y-0.5 hover:border-primary/30',
          'hover:bg-white hover:shadow-lg hover:shadow-primary/5',
          'dark:hover:bg-slate-900',
        ],
        className
      )}
    >
      {children}
    </div>
  )
}

interface GlassCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function GlassCardHeader({ children, className }: GlassCardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  )
}

interface GlassCardTitleProps {
  children: React.ReactNode
  className?: string
}

export function GlassCardTitle({ children, className }: GlassCardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-slate-900 dark:text-white', className)}>
      {children}
    </h3>
  )
}

interface GlassCardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function GlassCardDescription({ children, className }: GlassCardDescriptionProps) {
  return (
    <p className={cn('mt-1 text-sm text-slate-500 dark:text-slate-400', className)}>
      {children}
    </p>
  )
}

interface GlassCardContentProps {
  children: React.ReactNode
  className?: string
}

export function GlassCardContent({ children, className }: GlassCardContentProps) {
  return <div className={cn('', className)}>{children}</div>
}

interface GlassCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function GlassCardFooter({ children, className }: GlassCardFooterProps) {
  return (
    <div className={cn('mt-6 flex items-center gap-3', className)}>
      {children}
    </div>
  )
}
