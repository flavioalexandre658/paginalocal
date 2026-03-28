import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const sizeVariants = {
  sm: {
    icon: 28,
    text: 'text-xl',
    gap: 'gap-1.5',
  },
  md: {
    icon: 32,
    text: 'text-2xl',
    gap: 'gap-1.5',
  },
  lg: {
    icon: 34,
    text: 'text-3xl',
    gap: 'gap-2',
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
    <div className={cn('flex items-center', variant.gap, className)}>
      <Image
        src="/assets/images/icon/icon.svg"
        alt="Decolou"
        width={variant.icon}
        height={variant.icon}
        className="shrink-0"
        priority
      />
      {showText && (
        <span
          className={cn('font-semibold tracking-tight text-black/80', variant.text)}
          style={{ fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}
        >
          decolou
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
