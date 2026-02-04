import Link from 'next/link'
import { cn } from '@/lib/utils'
import Image from 'next/image'
const sizeVariants = {
  sm: {
    container: 'h-9 w-9 rounded-xl',
    icon: 'h-5 w-5',
    text: 'text-lg',
  },
  md: {
    container: 'h-10 w-10 rounded-xl',
    icon: 'h-5 w-5',
    text: 'text-xl',
  },
  lg: {
    container: 'h-12 w-12 rounded-2xl',
    icon: 'h-6 w-6',
    text: 'text-2xl',
  },
}

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
  className?: string
}

export function Logo({ size = 'md', showText = true, href = '/', className }: LogoProps) {
  const variant = sizeVariants[size]

  const content = (
    <div className={cn('flex items-center gap-2', size === 'lg' && 'gap-3', className)}>

      <Image src="/assets/images/icon/favicon.ico" alt="Página Local" width={36} height={36} />
      {showText && (
        <span
          className={cn(
            'font-semibold tracking-tight text-slate-900 dark:text-white',
            variant.text
          )}
        >
          Página Local
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {content}
      </Link>
    )
  }

  return content
}
