import { cn } from '@/lib/utils'

type IconBoxVariant = 'primary' | 'success' | 'warning' | 'danger' | 'muted'
type IconBoxSize = 'sm' | 'md' | 'lg' | 'xl'

interface IconBoxProps {
  children: React.ReactNode
  variant?: IconBoxVariant
  size?: IconBoxSize
  className?: string
  animate?: boolean
}

const variantClasses: Record<IconBoxVariant, string> = {
  primary: cn(
    'bg-gradient-to-br from-primary/20 to-primary/5',
    'text-primary',
    'shadow-lg shadow-primary/10'
  ),
  success: cn(
    'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5',
    'text-emerald-500',
    'shadow-lg shadow-emerald-500/10'
  ),
  warning: cn(
    'bg-gradient-to-br from-amber-500/20 to-amber-500/5',
    'text-amber-500',
    'shadow-lg shadow-amber-500/10'
  ),
  danger: cn(
    'bg-gradient-to-br from-red-500/20 to-red-500/5',
    'text-red-500',
    'shadow-lg shadow-red-500/10'
  ),
  muted: cn(
    'bg-slate-100 dark:bg-slate-800',
    'text-slate-500 dark:text-slate-400'
  ),
}

const sizeClasses: Record<IconBoxSize, string> = {
  sm: 'h-10 w-10 rounded-xl',
  md: 'h-14 w-14 rounded-2xl',
  lg: 'h-20 w-20 rounded-3xl',
  xl: 'h-24 w-24 rounded-3xl',
}

const iconSizeClasses: Record<IconBoxSize, string> = {
  sm: '[&>svg]:h-5 [&>svg]:w-5',
  md: '[&>svg]:h-7 [&>svg]:w-7',
  lg: '[&>svg]:h-10 [&>svg]:w-10',
  xl: '[&>svg]:h-12 [&>svg]:w-12',
}

export function IconBox({
  children,
  variant = 'primary',
  size = 'md',
  className,
  animate = false,
}: IconBoxProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        variantClasses[variant],
        sizeClasses[size],
        iconSizeClasses[size],
        animate && 'transition-transform duration-300 hover:scale-110',
        className
      )}
    >
      {children}
    </div>
  )
}
