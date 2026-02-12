'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconCheck,
  IconSearch,
  IconBrandWhatsapp,
  IconPhoto,
  IconWorld,
  IconSparkles,
  IconFileText,
  IconRefresh,
  IconShieldCheck,
  IconCreditCard,
  IconRocket,
  IconX,
  IconArrowRight,
  IconBuildingStore,
  IconLock,
  IconCloud,
} from '@tabler/icons-react'

import { createCheckoutSession } from '@/actions/subscriptions/create-checkout-session.action'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import type { IPlan, BillingInterval } from '@/interfaces/subscription.interface'

interface TransferPlanContentProps {
  plan: IPlan
  planParam: string
  storeSlug?: string
}

const AGENCY_SITE_COST = 250000
const AGENCY_MONTHLY_COST = 30000
const HOSTING_SSL_COST = 15000

const benefits = [
  {
    icon: IconSearch,
    title: 'SEO otimizado para Google',
    description: 'Seu negócio aparece nas buscas locais automaticamente',
  },
  {
    icon: IconFileText,
    title: 'Página para cada serviço',
    description: 'Cada serviço tem sua própria página ranqueando no Google',
  },
  {
    icon: IconBrandWhatsapp,
    title: 'WhatsApp integrado',
    description: 'Botão de WhatsApp em todas as páginas, direto para você',
  },
  {
    icon: IconRefresh,
    title: 'Sincronizado com Google',
    description: 'Avaliações e dados do Google Meu Negócio atualizados',
  },
  {
    icon: IconPhoto,
    title: 'Galeria de fotos',
    description: 'Mostre seu trabalho com fotos de qualidade profissional',
  },
  {
    icon: IconSparkles,
    title: 'Conteúdo gerado por IA',
    description: 'Textos persuasivos criados automaticamente para você',
  },
  {
    icon: IconWorld,
    title: 'Páginas institucionais',
    description: 'Sobre Nós e Contato prontas e otimizadas para SEO',
  },
  {
    icon: IconBuildingStore,
    title: 'Painel administrativo',
    description: 'Edite seu site, serviços e informações quando quiser',
  },
]

function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function TransferPlanContent({ plan, planParam, storeSlug }: TransferPlanContentProps) {
  const router = useRouter()
  const [interval, setInterval] = useState<BillingInterval>('MONTHLY')
  const { executeAsync, isExecuting } = useAction(createCheckoutSession)

  const price = interval === 'MONTHLY' ? plan.monthlyPriceInCents : plan.yearlyPriceInCents
  const monthlyEquivalent = interval === 'YEARLY' ? Math.round(plan.yearlyPriceInCents / 12) : plan.monthlyPriceInCents
  const yearlySavings = interval === 'YEARLY'
    ? Math.round(((plan.monthlyPriceInCents * 12 - plan.yearlyPriceInCents) / (plan.monthlyPriceInCents * 12)) * 100)
    : 0

  const totalAgencyCost = AGENCY_SITE_COST + AGENCY_MONTHLY_COST + HOSTING_SSL_COST
  const savingsVsAgency = Math.round(((totalAgencyCost - monthlyEquivalent) / totalAgencyCost) * 100)

  async function handleCheckout() {
    const slugQuery = storeSlug ? `&s=${storeSlug}` : ''
    const result = await executeAsync({
      planId: plan.id,
      billingInterval: interval,
      storeSlug: storeSlug || undefined,
      successUrl: '/cadastro/aguardando-transferencia',
      cancelUrl: `/cadastro/plano-transferencia?p=${planParam}${slugQuery}`,
    })

    if (result?.data?.checkoutUrl) {
      router.push(result.data.checkoutUrl)
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 md:py-16">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:px-4 sm:py-2 sm:text-sm">
              <IconRocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Falta pouco para seu site ficar pronto
            </div>

            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
              Seu site profissional está
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> quase pronto</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base md:text-lg dark:text-slate-300">
              Ative o plano {plan.name} e tenha acesso completo ao seu site otimizado para o Google, com tudo incluso.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-8 max-w-4xl sm:mt-10 md:mt-12"
          >
            <p className="mb-3 text-center text-xs font-medium text-slate-500 sm:text-sm dark:text-slate-400">
              Veja quanto você economiza
            </p>

            <div className="space-y-3 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0">
              <div className="rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-3 text-center sm:rounded-2xl sm:p-5 dark:border-red-900/40 dark:bg-red-950/20">
                <IconX className="mx-auto mb-1 h-4 w-4 text-red-500 sm:mb-2 sm:h-5 sm:w-5" />
                <p className="text-[10px] font-medium text-red-600 sm:text-xs dark:text-red-400">Agência de sites</p>
                <p className="mt-0.5 text-lg font-semibold text-red-700 line-through decoration-red-400 sm:mt-1 sm:text-2xl dark:text-red-300">
                  {formatPrice(AGENCY_SITE_COST)}
                </p>
                <p className="text-[10px] text-red-500 sm:text-xs">criação do site</p>
              </div>

              <div className="rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-3 text-center sm:rounded-2xl sm:p-5 dark:border-red-900/40 dark:bg-red-950/20">
                <IconX className="mx-auto mb-1 h-4 w-4 text-red-500 sm:mb-2 sm:h-5 sm:w-5" />
                <p className="text-[10px] font-medium text-red-600 sm:text-xs dark:text-red-400">Manutenção mensal</p>
                <p className="mt-0.5 text-lg font-semibold text-red-700 line-through decoration-red-400 sm:mt-1 sm:text-2xl dark:text-red-300">
                  {formatPrice(AGENCY_MONTHLY_COST)}<span className="text-xs sm:text-sm">/mês</span>
                </p>
                <p className="text-[10px] text-red-500 sm:text-xs">atualizações e suporte</p>
              </div>

              <div className="rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-3 text-center sm:rounded-2xl sm:p-5 dark:border-red-900/40 dark:bg-red-950/20">
                <IconX className="mx-auto mb-1 h-4 w-4 text-red-500 sm:mb-2 sm:h-5 sm:w-5" />
                <p className="text-[10px] font-medium text-red-600 sm:text-xs dark:text-red-400">Hospedagem + SSL</p>
                <p className="mt-0.5 text-lg font-semibold text-red-700 line-through decoration-red-400 sm:mt-1 sm:text-2xl dark:text-red-300">
                  {formatPrice(HOSTING_SSL_COST)}<span className="text-xs sm:text-sm">/mês</span>
                </p>
                <p className="text-[10px] text-red-500 sm:text-xs">servidor e certificado</p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-white to-primary/5 px-4 py-5 text-center shadow-xl shadow-primary/10 sm:mt-6 sm:p-6 dark:from-primary/10 dark:via-slate-900 dark:to-primary/10"
            >
              <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:mb-2 sm:gap-2 sm:px-3 sm:text-xs dark:bg-emerald-900/30 dark:text-emerald-400">
                <IconCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Economia de {savingsVsAgency}% comparado a agências
              </div>

              <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                Com o Página Local, tudo isso por apenas
              </p>

              <div className="mt-1.5 flex items-baseline justify-center gap-1 sm:mt-2">
                <span className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white">
                  {formatPrice(monthlyEquivalent)}
                </span>
                <span className="text-sm text-slate-500 sm:text-lg">/mês</span>
              </div>

              {interval === 'YEARLY' && (
                <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
                  {formatPrice(price)} cobrados anualmente
                </p>
              )}

              <p className="mt-1.5 text-[10px] text-slate-500 sm:mt-2 sm:text-xs dark:text-slate-400">
                Site + SEO + Hospedagem + SSL + Suporte. Tudo incluso, sem custos extras.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-10 max-w-3xl sm:mt-12"
          >
            <h2 className="mb-6 text-center text-xl font-semibold tracking-tight text-slate-900 sm:mb-8 sm:text-2xl dark:text-white">
              Tudo que está incluso no seu plano
            </h2>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="group rounded-xl border border-slate-200/60 bg-white/70 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl sm:p-5 dark:border-slate-700/60 dark:bg-slate-900/70"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 shadow-md shadow-primary/10 transition-transform duration-300 group-hover:scale-110 sm:mb-3 sm:h-10 sm:w-10 sm:rounded-xl sm:shadow-lg">
                      <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                    </div>
                    <h3 className="text-xs font-semibold text-slate-900 sm:text-sm dark:text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-0.5 text-[10px] leading-tight text-slate-500 sm:mt-1 sm:text-xs sm:leading-normal dark:text-slate-400">
                      {benefit.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-10 max-w-sm sm:mt-12 sm:max-w-md"
          >
            <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-6 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
              <h3 className="mb-4 text-center text-base font-semibold text-slate-900 sm:text-lg dark:text-white">
                Plano {plan.name}
              </h3>

              <div className="mb-5 flex items-center justify-center gap-1 sm:mb-6 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setInterval('MONTHLY')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${interval === 'MONTHLY'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setInterval('YEARLY')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${interval === 'YEARLY'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                    }`}
                >
                  Anual
                  {yearlySavings > 0 && interval !== 'YEARLY' && (
                    <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 sm:ml-1.5 sm:px-2 sm:text-xs dark:bg-emerald-900/30 dark:text-emerald-400">
                      -{yearlySavings}%
                    </span>
                  )}
                </button>
              </div>

              <div className="mb-5 text-center sm:mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                    {formatPrice(monthlyEquivalent)}
                  </span>
                  <span className="text-sm text-slate-500">/mês</span>
                </div>
                {interval === 'YEARLY' && (
                  <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
                    Economize {yearlySavings}% no plano anual
                  </p>
                )}
              </div>

              <ul className="mb-5 space-y-2.5 sm:mb-6 sm:space-y-3">
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{plan.features.maxStores} {plan.features.maxStores === 1 ? 'site' : 'sites'} profissional</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Até {plan.features.maxPhotosPerStore} fotos na galeria</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{plan.features.aiRewritesPerMonth === null ? 'Reescritas com IA ilimitadas' : `${plan.features.aiRewritesPerMonth} reescritas com IA/mês`}</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>SEO otimizado para Google</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Hospedagem + SSL incluso</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                  <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>Sincronização com Google Meu Negócio</span>
                </li>
                {plan.features.customDomain && (
                  <li className="flex items-center gap-2.5 text-xs text-slate-700 sm:gap-3 sm:text-sm dark:text-slate-300">
                    <IconCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>Domínio próprio personalizado</span>
                  </li>
                )}
              </ul>

              <EnhancedButton
                onClick={handleCheckout}
                loading={isExecuting}
                className="h-11 w-full gap-2 text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 sm:h-12 sm:text-base"
              >
                <IconCreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                Assinar Plano {plan.name}
                <IconArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </EnhancedButton>

              <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-slate-500 sm:mt-4 sm:gap-4 sm:text-xs dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <IconLock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Pagamento seguro
                </span>
                <span className="flex items-center gap-1">
                  <IconShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Cancele quando quiser
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-8 max-w-2xl sm:mt-10"
          >
            <div className="rounded-xl border border-slate-200/40 bg-white/50 px-4 py-4 text-center backdrop-blur-sm sm:rounded-2xl sm:p-6 dark:border-slate-700/40 dark:bg-slate-900/50">
              <div className="flex flex-col items-center gap-3 text-xs text-slate-500 sm:flex-row sm:justify-center sm:gap-6 sm:text-sm dark:text-slate-400">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconShieldCheck className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  <span>Sem multa de cancelamento</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconBrandWhatsapp className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                  <span>Suporte humano pelo WhatsApp</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <IconCloud className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                  <span>Hospedagem na nuvem inclusa</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
