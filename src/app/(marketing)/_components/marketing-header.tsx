import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { Logo } from '@/components/shared/logo'
import { IconRocket, IconLayoutDashboard } from '@tabler/icons-react'

async function getUserHasSubscription(userId: string): Promise<boolean> {
  const [userSubscription] = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(
      and(
        eq(subscription.userId, userId),
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
    )
    .limit(1)

  return !!userSubscription
}

export async function MarketingHeader() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="sm" href="/" />
        <nav className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              {/* Usuário logado */}
              {!hasSubscription ? (
                // Sem assinatura: botão chamativo "Publicar Loja"
                <Link
                  href="/planos"
                  className="group relative flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary/90 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 sm:px-4"
                >
                  <IconRocket className="h-4 w-4" />
                  <span>Publicar Loja</span>
                  {/* Badge animada */}
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500"></span>
                  </span>
                </Link>
              ) : (
                // Com assinatura: link simples para planos
                <Link
                  href="/planos"
                  className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:block"
                >
                  Planos
                </Link>
              )}
              <Link
                href="/painel"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700 sm:px-4"
              >
                <IconLayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Painel</span>
              </Link>
            </>
          ) : (
            <>
              {/* Usuário não logado */}
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
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
