"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import {
  IconCrown,
  IconCalendar,
  IconSparkles,
  IconExternalLink,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { useUserSubscription } from '@/hooks/queries/use-user-subscription'
import { useAction } from 'next-safe-action/hooks'
import { createCustomerPortalSession } from '@/actions/subscriptions/create-customer-portal-session.action'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

interface SubscriptionStatusCardProps {
  className?: string
  compact?: boolean
}

export function SubscriptionStatusCard({ className, compact = false }: SubscriptionStatusCardProps) {
  const { data: subscription, isLoading } = useUserSubscription()
  const { executeAsync: openPortal, isExecuting: isOpeningPortal } = useAction(createCustomerPortalSession)

  async function handleManageSubscription() {
    const result = await openPortal({})

    if (result?.data?.portalUrl) {
      window.open(result.data.portalUrl, '_blank')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    } else {
      toast.error('Erro ao abrir portal de assinatura')
    }
  }

  if (isLoading) {
    return (
      <GlassCard className={cn('animate-pulse', className)}>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </GlassCard>
    )
  }

  if (!subscription) {
    return (
      <GlassCard className={cn('border-amber-200/50 dark:border-amber-900/50', className)}>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <IconAlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Sem assinatura ativa
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ative um plano para publicar seu site
            </p>
          </div>
        </div>
      </GlassCard>
    )
  }

  const isCanceling = !!subscription.cancelAtPeriodEnd
  const periodEnd = subscription.currentPeriodEnd
    ? dayjs(subscription.currentPeriodEnd).format('DD [de] MMMM [de] YYYY')
    : null

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <IconCrown className="mr-1 h-3 w-3" />
          {subscription.plan.name}
        </Badge>
        {isCanceling && (
          <Badge variant="outline" className="text-amber-600">
            Cancela em {dayjs(subscription.cancelAtPeriodEnd).format('DD/MM')}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassCard className={cn(isCanceling && 'border-amber-200/50 dark:border-amber-900/50', className)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              isCanceling
                ? 'bg-amber-100 dark:bg-amber-900/30'
                : 'bg-gradient-to-br from-primary/20 to-primary/5'
            )}>
              <IconCrown className={cn(
                'h-6 w-6',
                isCanceling ? 'text-amber-600 dark:text-amber-400' : 'text-primary'
              )} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Plano {subscription.plan.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {subscription.billingInterval === 'MONTHLY' ? 'Mensal' : 'Anual'}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <IconCalendar className="h-4 w-4" />
                {isCanceling ? (
                  <span className="text-amber-600 dark:text-amber-400">
                    Acesso até {periodEnd}
                  </span>
                ) : (
                  <span>Renova em {periodEnd}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <EnhancedButton
              variant="outline"
              size="sm"
              onClick={handleManageSubscription}
              loading={isOpeningPortal}
              loadingText="Gerenciar"
            >
              <IconExternalLink className="h-4 w-4" />
              Gerenciar
            </EnhancedButton>
          </div>
        </div>

        {subscription.plan.features.aiRewritesPerMonth !== null && (
          <div className="mt-4 border-t border-slate-200/50 pt-4 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <IconSparkles className="h-4 w-4" />
                <span>Reescritas com IA</span>
              </div>
              <span className="font-medium text-slate-900 dark:text-white">
                {subscription.aiRewritesUsedThisMonth} / {subscription.plan.features.aiRewritesPerMonth} usadas
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, (subscription.aiRewritesUsedThisMonth / subscription.plan.features.aiRewritesPerMonth) * 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}
