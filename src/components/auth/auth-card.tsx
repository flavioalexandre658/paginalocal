import Link from 'next/link'

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
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
        {children}
      </div>

      {footer && (
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {footer.text}{' '}
          <Link
            href={footer.linkHref}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            {footer.linkText}
          </Link>
        </p>
      )}
    </div>
  )
}
