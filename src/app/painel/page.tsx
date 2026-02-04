"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconPlus,
  IconStar,
  IconMapPin,
  IconExternalLink,
  IconChartBar,
  IconLoader2,
  IconBuildingStore,
  IconRefresh,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { getUserStoresAction } from '@/actions/stores/get-user-stores.action'
import { LogoutButton } from '@/components/auth/logout-button'
import { syncStoreWithGoogleAction } from '@/actions/stores/sync-store-with-google.action'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { cn } from '@/lib/utils'
import { DeleteStoreModal } from './_components/delete-store-modal'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'

export default function PainelPage() {
  const router = useRouter()
  const [hasChecked, setHasChecked] = useState(false)
  const { executeAsync, result, isExecuting } = useAction(getUserStoresAction)

  useEffect(() => {
    executeAsync().then(() => setHasChecked(true))
  }, [executeAsync])

  const stores = result?.data || []

  useEffect(() => {
    if (hasChecked && stores.length === 0 && !isExecuting) {
      router.push('/onboarding')
    }
  }, [hasChecked, stores.length, isExecuting, router])

  function handleRefresh() {
    executeAsync()
  }

  if (isExecuting || !hasChecked) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center">
            <IconLoader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-slate-500 dark:text-slate-400">Carregando suas lojas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/painel" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
              <IconMapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Página Local
            </span>
          </Link>

          <LogoutButton />
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
                Minhas Lojas
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Gerencie seus negócios e acompanhe o desempenho
              </p>
            </div>
            <EnhancedButton
              asChild
              className="gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              <Link href="/onboarding">
                <IconPlus className="h-5 w-5" />
                Nova Loja
              </Link>
            </EnhancedButton>
          </div>
        </motion.div>

        {stores.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((storeItem, index) => (
              <StoreCard
                key={storeItem.id}
                store={storeItem}
                index={index}
                onSync={handleRefresh}
                onDelete={handleRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface Store {
  id: string
  name: string
  slug: string
  category: string | null
  city: string | null
  state: string | null
  coverUrl: string | null
  googleRating: string | null
  googleReviewsCount: number | null
  isActive: boolean | null
  createdAt: Date
}

function StoreCard({
  store,
  index,
  onSync,
  onDelete,
}: {
  store: Store
  index: number
  onSync: () => void
  onDelete: () => void
}) {
  const [isSyncing, setIsSyncing] = useState(false)
  const { executeAsync: syncStore } = useAction(syncStoreWithGoogleAction)
  const { handleActionError } = usePlanLimitRedirect()
  const rating = store.googleRating ? parseFloat(store.googleRating) : null

  async function handleSync() {
    setIsSyncing(true)
    const result = await syncStore({ storeId: store.id })
    setIsSyncing(false)

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) {
        toast.error(result.serverError)
      }
      return
    }

    if (result?.data) {
      toast.success(
        `Sincronizado! ${result.data.newReviewsAdded > 0 ? `${result.data.newReviewsAdded} novas avaliações.` : 'Dados atualizados.'}`
      )
      onSync()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5',
        'dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-primary/30'
      )}
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700">
        {store.coverUrl ? (
          <Image
            src={store.coverUrl}
            alt={store.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <IconBuildingStore className="h-16 w-16 text-slate-300 dark:text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {store.isActive ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            Online
          </div>
        ) : (
          <div className="absolute left-3 top-3 rounded-full bg-slate-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Rascunho
          </div>
        )}

        {rating && rating >= 4.0 && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <IconStar className="h-3.5 w-3.5 fill-current" />
            {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="truncate text-lg font-semibold text-slate-900 dark:text-white">
          {store.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          {store.city && store.state && (
            <>
              <IconMapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {store.city}, {store.state}
              </span>
            </>
          )}
        </div>

        {store.category && (
          <p className="mt-1 truncate text-sm text-slate-400 dark:text-slate-500">
            {store.category}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {store.googleReviewsCount != null && store.googleReviewsCount > 0
            ? `${store.googleReviewsCount} avaliações no Google`
            : 'Ainda não tem avaliações'}
        </p>

        <div className="mt-5 flex gap-2">
          <EnhancedButton
            asChild
            variant="default"
            className="flex-1 gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <Link href={`/painel/${store.slug}`}>
              <IconChartBar className="h-4 w-4" />
              Painel
            </Link>
          </EnhancedButton>
          <EnhancedButton
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleSync}
            loading={isSyncing}
            title="Sincronizar com Google"
          >
            {!isSyncing && <IconRefresh className="h-4 w-4" />}
          </EnhancedButton>
          <EnhancedButton
            asChild
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Link
              href={`/site/${store.slug}`}
              target="_blank"
              title="Ver site"
            >
              <IconExternalLink className="h-4 w-4" />
            </Link>
          </EnhancedButton>
          <DeleteStoreModal
            storeId={store.id}
            storeName={store.name}
            storeSlug={store.slug}
            onSuccess={onDelete}
          />
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="mx-auto max-w-md"
    >
      <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-10 text-center shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
          <IconBuildingStore className="h-10 w-10 text-primary" />
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Nenhuma loja cadastrada
        </h2>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Crie sua primeira loja e comece a receber clientes pelo Google em poucos minutos.
        </p>

        <EnhancedButton
          asChild
          size="lg"
          className="mt-8 gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Link href="/onboarding">
            <IconPlus className="h-5 w-5" />
            Cadastrar minha primeira loja
          </Link>
        </EnhancedButton>

        <p className="mt-6 text-sm text-slate-400">
          Mais de <span className="font-semibold text-primary">2.000 negócios</span> já estão online
        </p>
      </div>
    </motion.div>
  )
}
