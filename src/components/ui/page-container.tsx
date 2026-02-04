import { cn } from '@/lib/utils'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  centered?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
}

export function PageContainer({
  children,
  className,
  centered = false,
  maxWidth,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen overflow-hidden',
        'bg-gradient-to-br from-slate-50 via-white to-slate-100',
        'dark:from-slate-950 dark:via-slate-900 dark:to-slate-950',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div
        className={cn(
          'relative z-10',
          centered && 'flex min-h-screen flex-col items-center justify-center',
          maxWidth && 'mx-auto px-4',
          maxWidth && maxWidthClasses[maxWidth]
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface PageHeaderProps {
  children: React.ReactNode
  className?: string
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8 text-center', className)}>
      {children}
    </div>
  )
}

interface PageTitleProps {
  children: React.ReactNode
  className?: string
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1
      className={cn(
        'text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl',
        'dark:text-white',
        className
      )}
    >
      {children}
    </h1>
  )
}

interface PageDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function PageDescription({ children, className }: PageDescriptionProps) {
  return (
    <p
      className={cn(
        'mt-3 text-base text-slate-500 md:text-lg',
        'dark:text-slate-400',
        className
      )}
    >
      {children}
    </p>
  )
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn('py-8 md:py-12', className)}>
      {children}
    </div>
  )
}
