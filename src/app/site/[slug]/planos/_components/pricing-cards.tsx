'use client'

import { useState } from 'react'
import {
  IconCheck,
  IconX,
  IconBrandWhatsapp,
  IconExternalLink,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import type { PricingInterval, PricingCtaMode } from '@/db/schema'

interface PricingPlan {
  id: string
  name: string
  description: string | null
  priceInCents: number
  interval: PricingInterval
  features: string[] | null
  isHighlighted: boolean
  ctaMode: PricingCtaMode
  ctaLabel: string | null
  ctaExternalUrl: string | null
  ctaWhatsappMessage: string | null
}

interface PricingCardsProps {
  plans: PricingPlan[]
  storeWhatsapp: string
  storeName: string
  storeHomeUrl: string
}

export function PricingCards({
  plans,
  storeWhatsapp,
  storeName,
  storeHomeUrl,
}: PricingCardsProps) {
  const monthlyPlans = plans.filter(
    (p) => p.interval === 'MONTHLY' || p.interval === 'ONE_TIME',
  )
  const yearlyPlans = plans.filter((p) => p.interval === 'YEARLY')
  const hasToggle = monthlyPlans.length > 0 && yearlyPlans.length > 0

  const [isYearly, setIsYearly] = useState(false)

  const displayPlans = hasToggle
    ? isYearly
      ? yearlyPlans
      : monthlyPlans
    : plans

  function getPlanCtaUrl(plan: PricingPlan): string {
    if (plan.ctaMode === 'EXTERNAL_LINK' && plan.ctaExternalUrl) {
      return plan.ctaExternalUrl
    }
    const message =
      plan.ctaWhatsappMessage ||
      `Olá! Tenho interesse no plano *${plan.name}* (R$ ${(plan.priceInCents / 100).toFixed(2)}${getIntervalLabel(plan.interval)})`
    return `https://wa.me/55${storeWhatsapp}?text=${encodeURIComponent(message)}`
  }

  function getIntervalLabel(interval: PricingInterval): string {
    if (interval === 'MONTHLY') return '/mês'
    if (interval === 'YEARLY') return '/ano'
    return ''
  }

  function formatPrice(priceInCents: number) {
    const [integer, decimal] = (priceInCents / 100).toFixed(2).split('.')
    return { integer, decimal }
  }

  function isExcludedFeature(feature: string) {
    return (
      feature.startsWith('✗') ||
      feature.startsWith('~') ||
      feature.startsWith('-')
    )
  }

  function cleanFeature(feature: string) {
    return feature.replace(/^[✗~\-]\s*/, '')
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Section header */}
      <div className="mb-12 text-center">
        <span className="text-sm font-bold uppercase tracking-widest text-primary">
          Conheça Nossos Planos
        </span>
        <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Escolha o melhor plano
        </h2>
        <p className="text-4xl font-extrabold tracking-tight text-slate-700 md:text-5xl">
          para {storeName}
        </p>

        {hasToggle && (
          <p className="mt-4 text-base text-slate-600">
            Economize até{' '}
            <span className="font-bold text-primary">10%</span> com plano
            anual!
          </p>
        )}

        {hasToggle && (
          <div className="mt-6 inline-flex rounded-full bg-white p-1 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                'rounded-full px-6 py-2.5 text-sm font-semibold transition-all',
                !isYearly
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Cobrança Mensal
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                'rounded-full px-6 py-2.5 text-sm font-semibold transition-all',
                isYearly
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Cobrança Anual
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div
        className={cn(
          'grid gap-6',
          displayPlans.length === 1 && 'mx-auto max-w-md',
          displayPlans.length === 2 && 'md:grid-cols-2',
          displayPlans.length >= 3 && 'md:grid-cols-3',
        )}
      >
        {displayPlans.map((plan) => {
          const features = (plan.features as string[] | null) || []
          const { integer, decimal } = formatPrice(plan.priceInCents)
          const intervalLabel =
            plan.interval === 'MONTHLY'
              ? 'mês'
              : plan.interval === 'YEARLY'
                ? 'ano'
                : null

          return (
            <div
              key={plan.id}
              className={cn(
                'relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300',
                plan.isHighlighted ? 'shadow-xl' : 'hover:shadow-xl',
              )}
            >
              {/* Card top section */}
              <div
                className={cn(
                  'relative px-8 pt-8 pb-6',
                  plan.isHighlighted && 'bg-[#1e2d4d]',
                )}
              >
                {/* "Mais escolhido" badge */}
                {plan.isHighlighted && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center rounded-full bg-primary px-5 py-1.5 text-xs font-bold text-white shadow-lg">
                      Mais escolhido
                    </span>
                  </div>
                )}

                {/* Plan name + interval */}
                <div className="flex items-baseline gap-2">
                  <h3
                    className={cn(
                      'text-lg font-extrabold uppercase tracking-wide',
                      plan.isHighlighted ? 'text-white' : 'text-slate-900',
                    )}
                  >
                    {plan.name}
                  </h3>
                  {intervalLabel && (
                    <span
                      className={cn(
                        'text-sm font-medium',
                        plan.isHighlighted ? 'text-white/50' : 'text-slate-400',
                      )}
                    >
                      / {intervalLabel}
                    </span>
                  )}
                </div>

                {/* Description */}
                {plan.description && (
                  <p
                    className={cn(
                      'mt-2 text-sm leading-relaxed',
                      plan.isHighlighted ? 'text-white/70' : 'text-slate-500',
                    )}
                  >
                    {plan.description}
                  </p>
                )}

                {/* Price */}
                <div className="mt-5 flex items-end gap-0.5">
                  <span
                    className={cn(
                      'mb-1 text-sm font-semibold',
                      plan.isHighlighted ? 'text-white/70' : 'text-slate-500',
                    )}
                  >
                    R$
                  </span>
                  <span
                    className={cn(
                      'mx-1 text-5xl font-black leading-none',
                      plan.isHighlighted ? 'text-white' : 'text-primary',
                    )}
                  >
                    {integer}
                  </span>
                  <div className="flex flex-col leading-none">
                    <span
                      className={cn(
                        'text-xl font-bold',
                        plan.isHighlighted ? 'text-white' : 'text-primary',
                      )}
                    >
                      ,{decimal}
                    </span>
                    {intervalLabel && (
                      <span
                        className={cn(
                          'mt-0.5 text-xs font-medium',
                          plan.isHighlighted
                            ? 'text-white/50'
                            : 'text-slate-400',
                        )}
                      >
                        /{intervalLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Features + CTA */}
              <div className="px-8 pt-6 pb-8">
                {features.length > 0 && (
                  <ul className="mb-8 space-y-3">
                    {features.map((feature, index) => {
                      const excluded = isExcludedFeature(feature)
                      return (
                        <li key={index} className="flex items-center gap-3">
                          {excluded ? (
                            <IconX className="h-4 w-4 shrink-0 text-slate-300" />
                          ) : (
                            <IconCheck
                              className="h-4 w-4 shrink-0 text-primary"
                              strokeWidth={2.5}
                            />
                          )}
                          <span
                            className={cn(
                              'text-sm',
                              excluded ? 'text-slate-400' : 'text-slate-700',
                            )}
                          >
                            {cleanFeature(feature)}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}

                <a
                  href={getPlanCtaUrl(plan)}
                  target={
                    plan.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined
                  }
                  rel={
                    plan.ctaMode === 'EXTERNAL_LINK'
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold transition-all',
                    plan.isHighlighted
                      ? 'bg-primary text-white shadow-lg hover:brightness-110'
                      : 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white',
                  )}
                >
                  {plan.ctaMode === 'WHATSAPP' ? (
                    <IconBrandWhatsapp className="h-4 w-4" />
                  ) : (
                    <IconExternalLink className="h-4 w-4" />
                  )}
                  {plan.ctaLabel || 'Assinar plano'}
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Notes */}
      <div className="mt-8 space-y-1 text-center">
        <p className="text-xs text-slate-400">
          *Entre em contato pelo WhatsApp para mais informações.
        </p>
        <p className="text-xs text-slate-400">
          Atendemos {storeName} e região.{' '}
          <a
            href={storeHomeUrl}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Saiba mais
          </a>
          .
        </p>
      </div>

      {/* "Está em dúvida" section */}
      <div className="mt-12 text-center">
        <p className="text-xl font-bold text-primary">
          Está em dúvida sobre qual plano escolher?
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Fale agora com{' '}
          <strong className="text-slate-800">{storeName}</strong> e tire todas
          as suas dúvidas pelo WhatsApp.
        </p>
        <a
          href={`https://wa.me/55${storeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white"
        >
          <IconBrandWhatsapp className="h-4 w-4" />
          Começar agora
        </a>
      </div>
    </div>
  )
}
