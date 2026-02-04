import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="sm" href="/" />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/planos"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:block"
          >
            Planos
          </Link>
          <Link
            href="/entrar"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:px-4"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 sm:px-4"
          >
            Começar
          </Link>
        </nav>
      </div>
    </header>
  )
}
