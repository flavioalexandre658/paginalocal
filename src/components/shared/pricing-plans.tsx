"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { GlassCard } from '@/components/ui/glass-card'
import {
  IconStar,
  IconBuildingStore,
  IconPhoto,
  IconSparkles,
  IconWorld,
  IconRefresh,
  IconLayoutDashboard,
} from '@tabler/icons-react'
import type { IPlan, BillingInterval } from '@/interfaces/subscription.interface'

interface PricingPlansProps {
  plans: IPlan[]
  selectedPlanId?: string
  selectedInterval?: BillingInterval
  onSelectPlan?: (planId: string, interval: BillingInterval) => void
  isLoading?: boolean
  showDescription?: boolean
  className?: string
}

export function PricingPlans({
  plans,
  selectedPlanId,
  selectedInterval: externalInterval,
  onSelectPlan,
  isLoading,
  showDescription = true,
  className,
}: PricingPlansProps) {
  const [internalInterval, setInternalInterval] = useState<BillingInterval>('MONTHLY')
  const interval = externalInterval || internalInterval

  const handleIntervalChange = (newInterval: BillingInterval) => {
    setInternalInterval(newInterval)
  }

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const getYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    const yearlyIfMonthly = monthlyPrice * 12
    const savings = yearlyIfMonthly - yearlyPrice
    const savingsPercentage = Math.round((savings / yearlyIfMonthly) * 100)
    return { savings, savingsPercentage }
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-slate-200/60 bg-white/50 p-1 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => handleIntervalChange('MONTHLY')}
            className={cn(
              'rounded-full px-6 py-2 text-sm font-medium transition-all',
              interval === 'MONTHLY'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => handleIntervalChange('YEARLY')}
            className={cn(
              'relative rounded-full px-6 py-2 text-sm font-medium transition-all',
              interval === 'YEARLY'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
          >
            Anual
            <span className="ml-2 rounded-full bg-green-500 px-2 py-0.5 text-xs text-white">
              Economize
            </span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const isHighlighted = plan.isHighlighted
          const isSelected = selectedPlanId === plan.id
          const price = interval === 'MONTHLY'
            ? plan.monthlyPriceInCents
            : plan.yearlyPriceInCents
          const { savings, savingsPercentage } = getYearlySavings(
            plan.monthlyPriceInCents,
            plan.yearlyPriceInCents
          )

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className={cn(
                  'relative flex h-full flex-col transition-all duration-300',
                  isHighlighted && 'border-primary/50 ring-2 ring-primary/20',
                  isSelected && 'border-primary ring-2 ring-primary/40',
                  !isHighlighted && !isSelected && 'hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 px-4 py-1 text-white shadow-lg shadow-primary/30">
                      <IconStar className="mr-1 h-3 w-3" />
                      Mais Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  {showDescription && plan.description && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {formatPrice(price)}
                    </span>
                    <span className="ml-2 text-slate-500 dark:text-slate-400">
                      /{interval === 'MONTHLY' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  {interval === 'YEARLY' && savings > 0 && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Economia de {formatPrice(savings)} ({savingsPercentage}% off)
                    </p>
                  )}
                </div>

                <div className="mb-6 flex-1 space-y-4">
                  <PlanFeatureItem
                    icon={<IconBuildingStore className="h-4 w-4" />}
                    label="Negócios (Stores)"
                    value={plan.features.maxStores === 1 ? '1 Loja' : `Até ${plan.features.maxStores} Lojas`}
                  />
                  <PlanFeatureItem
                    icon={<IconWorld className="h-4 w-4" />}
                    label="Domínio"
                    value={plan.features.customDomain ? 'Domínio Próprio' : 'Subdomínio PGL'}
                    highlight={plan.features.customDomain}
                  />
                  <PlanFeatureItem
                    icon={<IconPhoto className="h-4 w-4" />}
                    label="Galeria de Fotos"
                    value={`Até ${plan.features.maxPhotosPerStore} fotos`}
                  />
                  <PlanFeatureItem
                    icon={<IconSparkles className="h-4 w-4" />}
                    label="IA (Reescrita)"
                    value={plan.features.aiRewritesPerMonth === null ? 'Ilimitado' : `${plan.features.aiRewritesPerMonth}x /mês`}
                    highlight={plan.features.aiRewritesPerMonth === null}
                  />
                  <PlanFeatureItem
                    icon={<IconRefresh className="h-4 w-4" />}
                    label="GMB Sync"
                    value={
                      plan.features.gmbAutoUpdate
                        ? 'Sim + Atualização Auto'
                        : plan.features.gmbSync
                          ? 'Sim'
                          : 'Não'
                    }
                    enabled={plan.features.gmbSync}
                  />
                  {plan.features.unifiedDashboard && (
                    <PlanFeatureItem
                      icon={<IconLayoutDashboard className="h-4 w-4" />}
                      label="Dashboard Unificado"
                      value="Sim"
                      highlight
                    />
                  )}
                </div>

                <EnhancedButton
                  onClick={() => onSelectPlan?.(plan.id, interval)}
                  loading={isLoading && isSelected}
                  loadingText="Processando..."
                  className={cn(
                    'w-full',
                    isHighlighted
                      ? 'bg-gradient-to-r from-primary to-primary/90 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                      : ''
                  )}
                  variant={isHighlighted ? 'default' : 'outline'}
                  size="lg"
                >
                  Assinar Agora
                </EnhancedButton>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

interface PlanFeatureItemProps {
  icon: React.ReactNode
  label: string
  value: string
  enabled?: boolean
  highlight?: boolean
}

function PlanFeatureItem({ icon, label, value, enabled = true, highlight }: PlanFeatureItemProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
        {icon}
        <span>{label}</span>
      </div>
      <span
        className={cn(
          'font-medium',
          highlight
            ? 'text-primary'
            : enabled
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 dark:text-slate-500'
        )}
      >
        {value}
      </span>
    </div>
  )
}

interface PricingPlansSkeletonProps {
  className?: string
}

export function PricingPlansSkeleton({ className }: PricingPlansSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="mb-8 flex justify-center">
        <div className="h-12 w-64 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 dark:border-slate-700/40 dark:bg-slate-900/70"
          >
            <div className="mb-6 space-y-2">
              <div className="h-6 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="mb-6">
              <div className="h-10 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="mb-6 space-y-3">
              {[1, 2, 3, 4, 5].map((j) => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
            <div className="h-10 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  )
}
