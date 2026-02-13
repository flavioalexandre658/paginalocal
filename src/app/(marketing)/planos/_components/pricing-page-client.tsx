"use client"

import { useState } from 'react'
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
} from '@tabler/icons-react'
import { createCheckoutSession } from '@/actions/subscriptions/create-checkout-session.action'
import type { IPlan, BillingInterval } from '@/interfaces/subscription.interface'

interface PricingPageClientProps {
  plans: IPlan[]
  isLoggedIn?: boolean
}

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

export function PricingPageClient({ plans, isLoggedIn = false }: PricingPageClientProps) {
  const searchParams = useSearchParams()
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const { executeAsync: createCheckout, isExecuting: isCreatingCheckout } = useAction(createCheckoutSession)

  const limitReached = searchParams.get('limite') === '1'
  const subscriptionCanceled = searchParams.get('subscription') === 'canceled'

  async function handleSelectPlan(planId: string, interval: BillingInterval) {
    if (!isLoggedIn) {
      window.location.href = `/cadastro?plan=${planId}&interval=${interval}`
      return
    }

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

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <EnhancedButton asChild variant="ghost" size="sm">
            <Link href={isLoggedIn ? "/painel" : "/"}>
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </EnhancedButton>
        </div>

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {limitReached ? 'Desbloqueie todo o potencial' : 'Planos e Preços'}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            {limitReached
              ? 'Escolha o plano ideal e tenha acesso a lojas ilimitadas, IA para reescrita, sincronização com Google e muito mais.'
              : 'Escolha o plano ideal para o seu negócio local. Todos os planos incluem recursos essenciais para você começar a atrair mais clientes.'}
          </p>
        </motion.div>

        <PricingPlans
          plans={plans}
          selectedPlanId={selectedPlanId || undefined}
          onSelectPlan={handleSelectPlan}
          isLoading={isCreatingCheckout}
          showDescription
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
              Incluído em todos os planos
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
              Recursos essenciais para seu negócio local crescer online
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 dark:border-slate-700/60 dark:bg-slate-900/70 dark:hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:to-transparent" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-sm transition-all group-hover:shadow-md group-hover:shadow-primary/10">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-gradient-to-br from-primary/5 via-white to-white p-8 shadow-xl shadow-slate-200/50 dark:border-slate-700/60 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900 dark:shadow-slate-900/50 md:p-12">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

            <div className="relative flex flex-col items-center gap-8 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <IconShieldCheck className="h-4 w-4" />
                  Garantia de 7 dias
                </div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                  Comece sem riscos
                </h3>
                <p className="mt-3 max-w-md text-slate-600 dark:text-slate-400">
                  Se não gostar, devolvemos seu dinheiro. Sem perguntas, sem burocracia.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <EnhancedButton asChild size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <a
                    href={`https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Tenho dúvidas sobre os planos do Página Local.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pagamento seguro via Stripe. Cancele a qualquer momento.
          </p>
        </motion.div>
      </div>
    </PageContainer>
  )
}
