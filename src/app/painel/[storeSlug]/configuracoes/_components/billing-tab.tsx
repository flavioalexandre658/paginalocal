'use client'

import Link from 'next/link'
import {
  IconCreditCard,
  IconCheck,
  IconRocket,
  IconCalendar,
  IconAlertCircle,
} from '@tabler/icons-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'

interface BillingTabProps {
  storeSlug: string
}

export function BillingTab({ storeSlug }: BillingTabProps) {
  const currentPlan = {
    name: 'Básico',
    priceInCents: 5990,
    status: 'active',
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      priceInCents: 5990,
      features: [
        'Landing page completa',
        'Integração com WhatsApp',
        'Até 10 fotos na galeria',
        'SEO otimizado',
        'Subdomínio paginalocal.com.br',
      ],
      current: true,
    },
    {
      id: 'pro',
      name: 'Profissional',
      priceInCents: 9990,
      features: [
        'Tudo do plano Básico',
        'Domínio próprio',
        'Fotos ilimitadas',
        'Remoção da marca PGL',
        'Suporte prioritário',
        'Relatórios avançados',
      ],
      current: false,
      recommended: true,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Assinatura
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Gerencie seu plano e pagamentos
        </p>
      </div>

      <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-emerald-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <IconCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">
                Plano {currentPlan.name} - Ativo
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                R$ {(currentPlan.priceInCents / 100).toFixed(2).replace('.', ',')}/mês
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
            <IconCalendar className="h-4 w-4" />
            Renova em {currentPlan.nextBillingDate.toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border p-6 ${plan.recommended
                ? 'border-primary/50 bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900/50'
              }`}
          >
            {plan.recommended && (
              <div className="absolute -top-3 left-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Recomendado
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {plan.name}
              </h3>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  R$ {(plan.priceInCents / 100).toFixed(0)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">/mês</span>
              </div>
            </div>

            <ul className="mb-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="rounded-lg bg-slate-100 py-2 text-center text-sm font-medium text-slate-500 dark:bg-slate-800">
                Plano atual
              </div>
            ) : (
              <EnhancedButton className="w-full" variant="default">
                <IconRocket className="mr-2 h-4 w-4" />
                Fazer upgrade
              </EnhancedButton>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <IconCreditCard className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Método de pagamento
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              •••• •••• •••• 4242 · Expira 12/28
            </p>
          </div>
          <button className="ml-auto text-sm font-medium text-primary hover:underline">
            Alterar
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
        <div className="flex items-start gap-3 rounded-xl border border-red-200/60 bg-red-50/50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
          <IconAlertCircle className="mt-0.5 h-5 w-5 text-red-500" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">
              Cancelar assinatura
            </p>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              Ao cancelar, seu site continuará ativo até o fim do período pago. Depois disso, ficará offline.
            </p>
            <button className="mt-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400">
              Cancelar minha assinatura
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
