"use client"

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { PageContainer } from '@/components/ui/page-container'
import { PricingPlans } from '@/components/shared/pricing-plans'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import {
  IconArrowLeft,
  IconAlertCircle,
  IconBrandWhatsapp,
  IconPhone,
  IconSearch,
  IconChartBar,
  IconDeviceMobile,
  IconHeadset,
  IconShieldCheck,
  IconRocket,
  IconX,
  IconCheck,
} from '@tabler/icons-react'
import { trackWhatsAppClick } from '@/lib/tracking'
import { createCheckoutSession } from '@/actions/subscriptions/create-checkout-session.action'
import type { IPlan, BillingInterval } from '@/interfaces/subscription.interface'

interface PricingPageClientProps {
  plans: IPlan[]
  isLoggedIn?: boolean
}

const AGENCY_SITE_COST = 250000
const AGENCY_MONTHLY_COST = 30000
const HOSTING_SSL_COST = 15000

const allFeatures = [
  {
    icon: IconChartBar,
    title: 'Cliques e Leads Ilimitados',
    description: 'Receba quantos contatos quiser, sem limites',
  },
  {
    icon: IconSearch,
    title: 'SEO Otimizado',
    description: 'Página preparada para aparecer no Google',
  },
  {
    icon: IconBrandWhatsapp,
    title: 'Botão WhatsApp',
    description: 'Clientes entram em contato com um toque',
  },
  {
    icon: IconPhone,
    title: 'Clique para Ligar',
    description: 'Ligação direta do celular do cliente',
  },
  {
    icon: IconDeviceMobile,
    title: '100% Responsivo',
    description: 'Funciona perfeitamente em qualquer dispositivo',
  },
  {
    icon: IconHeadset,
    title: 'Suporte Dedicado',
    description: 'Atendimento por email e WhatsApp',
  },
]

function formatPrice(priceInCents: number) {
  return (priceInCents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function PricingPageClient({ plans, isLoggedIn = false }: PricingPageClientProps) {
  const searchParams = useSearchParams()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const { executeAsync: createCheckout, isExecuting: isCreatingCheckout } = useAction(createCheckoutSession)

  const limitReached = searchParams.get('limite') === '1'
  const subscriptionCanceled = searchParams.get('subscription') === 'canceled'
  const planQuery = searchParams.get('plan')
  const storeSlug = searchParams.get('store')

  // Filtra plano específico se houver query param
  const filteredPlans = useMemo(() => {
    if (!planQuery) return plans

    // Normaliza o nome do plano (remove acentos, lowercase)
    const normalizedQuery = planQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    return plans.filter(plan => {
      const normalizedPlanName = plan.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      return normalizedPlanName === normalizedQuery
    })
  }, [plans, planQuery])

  const showSinglePlan = filteredPlans.length === 1
  const singlePlan = showSinglePlan ? filteredPlans[0] : null

  // Calcula economia baseado no plano mensal do primeiro plano filtrado
  const totalAgencyCost = AGENCY_SITE_COST + AGENCY_MONTHLY_COST + HOSTING_SSL_COST
  const savingsVsAgency = singlePlan
    ? Math.round(((totalAgencyCost - singlePlan.monthlyPriceInCents) / totalAgencyCost) * 100)
    : 0

  async function handleSelectPlan(planId: string, interval: BillingInterval) {
    if (!isLoggedIn) {
      const storeParam = storeSlug ? `&store=${storeSlug}` : ''
      window.location.href = `/cadastro?plan=${planId}&interval=${interval}${storeParam}`
      return
    }

    setSelectedPlanId(planId)

    const result = await createCheckout({
      planId,
      billingInterval: interval,
      storeSlug: storeSlug || undefined,
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

  return (
    <PageContainer>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 md:py-16 lg:px-8">
          {/* <div className="mb-6 sm:mb-8">
            <EnhancedButton asChild variant="ghost" size="sm">
              <Link href={isLoggedIn ? "/painel" : "/"}>
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Link>
            </EnhancedButton>
          </div> */}

          {limitReached && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mb-8 flex max-w-2xl items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30"
            >
              <IconAlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Você atingiu o limite do plano gratuito. Assine um plano para desbloquear mais funcionalidades.
              </p>
            </motion.div>
          )}

          {subscriptionCanceled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mb-8 flex max-w-2xl items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/30"
            >
              <IconAlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                O pagamento foi cancelado. Você pode tentar novamente quando quiser.
              </p>
            </motion.div>
          )}

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
          >
            {showSinglePlan && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary sm:px-4 sm:py-2 sm:text-sm">
                <IconRocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Falta pouco para seu site ficar pronto
              </div>
            )}

            <h1 className="mb-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white">
              {showSinglePlan ? (
                <>
                  Seu site profissional está
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> quase pronto</span>
                </>
              ) : limitReached ? (
                'Desbloqueie todo o potencial'
              ) : (
                'Planos e Preços'
              )}
            </h1>

            <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-base md:text-lg dark:text-slate-400">
              {showSinglePlan
                ? `Ative o plano ${singlePlan?.name || ''} e tenha acesso completo ao seu site otimizado para o Google, com tudo incluso.`
                : limitReached
                  ? 'Escolha o plano ideal e tenha acesso a lojas ilimitadas, IA para reescrita, sincronização com Google e muito mais.'
                  : 'Escolha o plano ideal para o seu negócio local. Todos os planos incluem recursos essenciais para você começar a atrair mais clientes.'}
            </p>
          </motion.div>

          {/* Comparativo de Preços - Apenas para single plan */}
          {showSinglePlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-12 max-w-4xl sm:mb-16"
            >
              <p className="mb-3 text-center text-xs font-medium text-slate-500 sm:mb-4 sm:text-sm dark:text-slate-400">
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
                    {formatPrice(singlePlan?.monthlyPriceInCents || 0)}
                  </span>
                  <span className="text-sm text-slate-500 sm:text-lg">/mês</span>
                </div>

                <p className="mt-1.5 text-[10px] text-slate-500 sm:mt-2 sm:text-xs dark:text-slate-400">
                  Site + SEO + Hospedagem + SSL + Suporte. Tudo incluso, sem custos extras.
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Pricing Plans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showSinglePlan ? 0.3 : 0.1 }}
          >
            <PricingPlans
              plans={filteredPlans}
              selectedPlanId={selectedPlanId || undefined}
              onSelectPlan={handleSelectPlan}
              isLoading={isCreatingCheckout}
              showDescription
            />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showSinglePlan ? 0.4 : 0.2 }}
            className="mt-16 sm:mt-20"
          >
            <div className="mb-8 text-center sm:mb-10">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                {showSinglePlan ? 'Tudo que está incluso no seu plano' : 'Incluído em todos os planos'}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base dark:text-slate-400">
                Recursos essenciais para seu negócio local crescer online
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {allFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (showSinglePlan ? 0.45 : 0.25) + index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl border border-slate-200/60 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 sm:rounded-2xl sm:p-5 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-primary/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />
                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/10 sm:h-11 sm:w-11 sm:rounded-xl">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="mt-0.5 text-xs leading-tight text-slate-500 sm:mt-1 sm:text-sm sm:leading-normal dark:text-slate-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Garantia CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: showSinglePlan ? 0.6 : 0.4 }}
            className="mt-16 sm:mt-20"
          >
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-primary/5 via-white to-white p-6 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:p-8 md:p-12 dark:border-slate-700/60 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900 dark:shadow-slate-900/50">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-between">
                <div className="text-center md:text-left">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:mb-4 sm:px-4 sm:text-sm">
                    <IconShieldCheck className="h-4 w-4" />
                    Garantia de 7 dias
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl md:text-3xl dark:text-white">
                    Comece sem riscos
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-slate-600 sm:mt-3 sm:text-base dark:text-slate-400">
                    Se não gostar, devolvemos seu dinheiro. Sem perguntas, sem burocracia.
                  </p>
                </div>

                {/*<div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
                  <EnhancedButton asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">

                    <a href={`https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Tenho dúvidas sobre os planos do Página Local.')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackWhatsAppClick('planos_whatsapp')}
                    >
                      <IconBrandWhatsapp className="h-5 w-5" />
                      Falar no WhatsApp
                    </a>
                  </EnhancedButton>
                  <EnhancedButton asChild variant="outline" size="lg">
                    <a href="mailto:contato@paginalocal.com.br">
                      Enviar email
                    </a>
                  </EnhancedButton>
                </div>*/}
              </div>
            </div>
          </motion.div>

          {/* Footer Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: showSinglePlan ? 0.7 : 0.5 }}
            className="mt-8 text-center sm:mt-12"
          >
            <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Pagamento seguro via Stripe. Cancele a qualquer momento.
            </p>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  )
}