'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { IconRefresh, IconBrandGoogle } from '@tabler/icons-react'
import toast from 'react-hot-toast'

import { syncStoreWithGoogleAction } from '@/actions/stores/sync-store-with-google.action'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'

interface SyncGoogleButtonProps {
  storeId: string
}

export function SyncGoogleButton({ storeId }: SyncGoogleButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const { executeAsync } = useAction(syncStoreWithGoogleAction)
  const { handleActionError } = usePlanLimitRedirect()

  async function handleSync() {
    setIsSyncing(true)
    const result = await executeAsync({ storeId })
    setIsSyncing(false)

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) {
        toast.error(result.serverError)
      }
      return
    }

    if (result?.data) {
      const { rating, reviewsCount, newReviewsAdded, imagesProcessed } = result.data
      const parts: string[] = []

      if (newReviewsAdded > 0) {
        parts.push(`${newReviewsAdded} novas avaliações`)
      }

      if (imagesProcessed > 0) {
        parts.push(`${imagesProcessed} novas fotos`)
      }

      let message = parts.length > 0
        ? `Sincronizado: ${parts.join(', ')}`
        : 'Dados atualizados!'

      if (rating) {
        message += ` | ${parseFloat(rating).toFixed(1)}⭐`
      }

      toast.success(message)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleSync}
      disabled={isSyncing}
      className="gap-2 border-slate-200/60 bg-white/70 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:bg-slate-800"
    >
      <IconRefresh className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
      {isSyncing ? 'Sincronizando...' : 'Sincronizar Google'}
    </Button>
  )
}
