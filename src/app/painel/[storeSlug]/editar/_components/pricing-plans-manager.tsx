'use client'

import { useState, useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconPlus, IconPencil, IconTrash, IconCreditCard, IconSparkles } from '@tabler/icons-react'
import { Badge } from '@/components/ui/badge'
import { getPricingPlansAction } from '@/actions/pricing-plans/get-pricing-plans.action'
import { deletePricingPlanAction } from '@/actions/pricing-plans/delete-pricing-plan.action'
import { PricingPlanFormModal } from './pricing-plan-form-modal'

interface PricingPlansManagerProps {
  storeId: string
}

interface PricingPlan {
  id: string
  name: string
  description: string | null
  priceInCents: number
  interval: string
  features: string[] | null
  isHighlighted: boolean
  isActive: boolean
  ctaMode: string
  ctaExternalUrl: string | null
}

export function PricingPlansManager({ storeId }: PricingPlansManagerProps) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { executeAsync: getPlans } = useAction(getPricingPlansAction)
  const { executeAsync: deletePlan } = useAction(deletePricingPlanAction)

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    setIsLoading(true)
    const result = await getPlans({ storeId, includeInactive: true })
    if (result?.data) {
      setPlans(result.data as PricingPlan[])
    }
    setIsLoading(false)
  }

  function handleAdd() {
    setEditingPlan(null)
    setModalOpen(true)
  }

  function handleEdit(plan: PricingPlan) {
    setEditingPlan(plan)
    setModalOpen(true)
  }

  function handleCreated() {
    loadPlans()
  }

  function handleUpdated() {
    loadPlans()
  }

  async function handleDelete(planId: string) {
    if (!confirm('Excluir este plano?')) return

    setDeletingId(planId)
    const result = await deletePlan({ planId })

    if (result?.data) {
      toast.success('Plano excluído!')
      loadPlans()
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
    setDeletingId(null)
  }

  function formatPrice(priceInCents: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100)
  }

  function getIntervalLabel(interval: string) {
    if (interval === 'MONTHLY') return '/mês'
    if (interval === 'YEARLY') return '/ano'
    return ''
  }

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : plans.length > 0 ? (
        <>
          {plans.map((plan) => {
            const features = plan.features || []
            return (
              <div
                key={plan.id}
                className="group flex items-start gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 transition-all hover:border-primary/30 hover:bg-white dark:border-slate-700/60 dark:bg-slate-800/30 dark:hover:bg-slate-800/50"
              >
                <button
                  type="button"
                  onClick={() => handleEdit(plan)}
                  className="flex flex-1 cursor-pointer text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {plan.name}
                      </p>
                      {plan.isHighlighted && (
                        <Badge className="text-xs bg-primary/10 text-primary border-0">
                          <IconSparkles className="mr-1 h-3 w-3" />
                          Destaque
                        </Badge>
                      )}
                      {!plan.isActive && (
                        <Badge variant="secondary" className="text-xs">Inativo</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {formatPrice(plan.priceInCents)}
                      <span className="text-xs text-slate-400">{getIntervalLabel(plan.interval)}</span>
                    </p>
                    {features.length > 0 && (
                      <p className="mt-1 text-xs text-slate-500">
                        {features.length} {features.length === 1 ? 'recurso' : 'recursos'}
                      </p>
                    )}
                  </div>
                  <span className="ml-2 mt-1 text-slate-400 transition-colors group-hover:text-primary">
                    <IconPencil className="h-4 w-4" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(plan.id)}
                  disabled={deletingId === plan.id}
                  className="rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100 dark:hover:bg-red-950"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
            <IconCreditCard className="h-6 w-6 text-slate-400" />
          </div>
          <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
            Nenhum plano cadastrado
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adicione planos de preços para exibir no site
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-slate-700"
      >
        <IconPlus className="h-4 w-4" />
        Adicionar plano
      </button>

      <PricingPlanFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        storeId={storeId}
        plan={editingPlan}
        onCreated={handleCreated}
        onUpdated={handleUpdated}
      />
    </div>
  )
}
