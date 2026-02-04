'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconCrown,
  IconCheck,
  IconCalendar,
  IconAlertCircle,
  IconLoader2,
  IconSparkles,
  IconRocket,
} from '@tabler/icons-react'
import { useUserSubscription } from '@/hooks/queries/use-user-subscription'
import { usePlans } from '@/hooks/queries/use-plans'
import { PricingPlans, PricingPlansSkeleton } from '@/components/shared/pricing-plans'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { createCheckoutSession } from '@/actions/subscriptions/create-checkout-session.action'
import { cancelSubscription } from '@/actions/subscriptions/cancel-subscription.action'
import type { BillingInterval } from '@/interfaces/subscription.interface'

interface BillingTabProps {
  storeSlug: string
}

export function BillingTab({ storeSlug }: BillingTabProps) {
  const { data: subscription, isLoading: isLoadingSubscription } = useUserSubscription()
  const { data: plans, isLoading: isLoadingPlans } = usePlans()

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const { executeAsync: createCheckout, isExecuting: isCreatingCheckout } = useAction(createCheckoutSession)
  const { executeAsync: cancelSub, isExecuting: isCanceling } = useAction(cancelSubscription)

  async function handleSelectPlan(planId: string, interval: BillingInterval) {
    setSelectedPlanId(planId)

    const result = await createCheckout({
      planId,
      billingInterval: interval,
    })

    if (result?.data?.checkoutUrl) {
      window.location.href = result.data.checkoutUrl
    } else if (result?.serverError) {
      toast.error(result.serverError)
      setSelectedPlanId(null)
    } else {
      toast.error('Erro ao criar sessão de pagamento. Tente novamente.')
      setSelectedPlanId(null)
    }
  }

  async function handleCancelSubscription() {
    if (!subscription?.id) return

    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar sua assinatura? Seu site ficará offline após o período pago.'
    )

    if (!confirmed) return

    const result = await cancelSub()

    if (result?.data?.success) {
      toast.success('Assinatura cancelada. Seu acesso continua até o fim do período pago.')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  if (isLoadingSubscription || isLoadingPlans) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Assinatura
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Gerencie seu plano
          </p>
        </div>
        <div className="flex min-h-[200px] items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const hasSubscription = !!subscription

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Assinatura
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie seu plano
        </p>
      </div>

      {hasSubscription ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-emerald-900/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg shadow-emerald-500/10">
                  <IconCrown className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                      Plano {subscription.plan?.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      <IconCheck className="h-3 w-3" />
                      Ativo
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                    R$ {((subscription.plan?.monthlyPriceInCents || 0) / 100).toFixed(2).replace('.', ',')}/mês
                  </p>
                </div>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex items-center gap-2 rounded-xl bg-white/50 px-4 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <IconCalendar className="h-4 w-4" />
                  Renova em {new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR')}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                <IconRocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Fazer upgrade
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Desbloqueie mais recursos para seu negócio
                </p>
              </div>
            </div>

            {plans && plans.length > 0 ? (
              <PricingPlans
                plans={plans.filter(p => p.id !== subscription.planId)}
                selectedPlanId={selectedPlanId || undefined}
                onSelectPlan={handleSelectPlan}
                isLoading={isCreatingCheckout}
                showDescription={false}
              />
            ) : (
              <p className="text-center text-sm text-slate-500 py-8">
                Você já está no melhor plano disponível.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-red-200/60 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <IconAlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  Cancelar assinatura
                </h4>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Ao cancelar, seu site continuará ativo até o fim do período pago. Depois disso, ficará offline.
                </p>
                <EnhancedButton
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSubscription}
                  loading={isCanceling}
                  className="mt-3 text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950 dark:hover:text-red-300"
                >
                  Cancelar minha assinatura
                </EnhancedButton>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-primary/5 via-white to-white p-8 dark:border-slate-700/60 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
                <IconSparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                Você ainda não tem uma assinatura
              </h3>
              <p className="mt-2 max-w-md text-slate-600 dark:text-slate-400">
                Assine um plano para ativar seu site e começar a receber clientes pelo Google.
              </p>
            </div>
          </div>

          <div>
            <div className="mb-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Escolha seu plano
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Cancele a qualquer momento. Garantia de 7 dias.
              </p>
            </div>

            {isLoadingPlans ? (
              <PricingPlansSkeleton />
            ) : plans && plans.length > 0 ? (
              <PricingPlans
                plans={plans}
                selectedPlanId={selectedPlanId || undefined}
                onSelectPlan={handleSelectPlan}
                isLoading={isCreatingCheckout}
                showDescription
              />
            ) : (
              <p className="text-center text-sm text-slate-500 py-8">
                Nenhum plano disponível no momento.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Importante:</strong> Seu site está em modo rascunho e não aparece no Google.
              Assine um plano para publicá-lo.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
