import Link from 'next/link'
import { Logo } from '@/components/shared/logo'

export function MarketingFooter() {
  return (
    <footer className="relative border-t border-slate-200/40 bg-slate-50/50 py-12 dark:border-slate-700/40 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo size="sm" href="/" />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Sites profissionais otimizados para aparecer no Google. Feitos para negócios locais.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Produto
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/planos" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Planos
              </Link>
              <Link href="/#como-funciona" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Como funciona
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Empresa
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/sobre-nos" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Sobre nós
              </Link>
              <Link href="/contato" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Contato
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Legal
            </h4>
            <nav className="flex flex-col gap-3">
              <Link href="/termos-de-uso" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Termos de Uso
              </Link>
              <Link href="/politica-de-privacidade" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                Política de Privacidade
              </Link>
              <Link href="/lgpd" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                LGPD
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/40 pt-8 dark:border-slate-700/40 md:flex-row">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Página Local. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/entrar" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Entrar
            </Link>
            <Link href="/cadastro" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
