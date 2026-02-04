import { ReactNode } from 'react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { IconMapPin, IconSettings, IconExternalLink, IconArrowLeft } from '@tabler/icons-react'
import { LogoutButton } from '@/components/auth/logout-button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStoreUrl } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ storeSlug: string }>
}

export default async function DashboardLayout({ children, params }: LayoutProps) {
  const { storeSlug } = await params

  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) {
    redirect('/entrar')
  }

  const storeData = await db
    .select({ id: store.id, name: store.name })
    .from(store)
    .where(and(eq(store.slug, storeSlug), eq(store.userId, session.user.id)))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  const siteUrl = getStoreUrl(storeSlug)

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
            <Link
              href="/painel"
              className="flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <IconArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Minhas Lojas</span>
            </Link>
            <div className="hidden h-6 w-px shrink-0 bg-slate-200 dark:bg-slate-700 sm:block" />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
                <IconMapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="min-w-0 truncate text-sm font-semibold text-slate-900 dark:text-white">
                {storeData[0].name}
              </span>
            </div>
          </div>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href={siteUrl}
              target="_blank"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <IconExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Ver site</span>
            </Link>
            <Link
              href={`/painel/${storeSlug}/configuracoes`}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <IconSettings className="h-4 w-4" />
              <span className="hidden sm:inline">Configurações</span>
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <div className="relative z-10">{children}</div>
    </div>
  )
}
