import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

interface AuthCardProps {
  title: string
  description: string
  footer?: {
    text: string
    linkText: string
    linkHref: string
  }
  children: React.ReactNode
}

export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <div className="w-full">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <Logo size="md" href="/" />
      </div>

      {/* Heading */}
      <h1 className="text-center font-heading text-[28px] leading-[34px] text-black/80">
        {title}
      </h1>
      <p className="mt-2 text-center text-sm text-black/50">
        {description}
      </p>

      {/* Content */}
      <div className="mt-8">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <p className="mt-8 text-center text-sm text-black/50">
          {footer.text}{' '}
          <Link
            href={footer.linkHref}
            className="font-medium text-black/80 underline decoration-black/20 underline-offset-2 transition-[color,text-decoration-color] duration-150 hover:text-black hover:decoration-black/40"
          >
            {footer.linkText}
          </Link>
        </p>
      )}
    </div>
  )
}
