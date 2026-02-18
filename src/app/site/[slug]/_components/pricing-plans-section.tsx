import Link from 'next/link'
import { IconCheck, IconSparkles, IconBrandWhatsapp, IconExternalLink, IconArrowRight } from '@tabler/icons-react'
import { cn, getPlanosPageUrl } from '@/lib/utils'
import type { PricingInterval, PricingCtaMode } from '@/db/schema'
import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

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

interface PricingPlansSectionProps {
  plans: PricingPlan[]
  storeName: string
  storeSlug: string
  storeWhatsapp: string
  category: string
  city: string
  termGender?: TermGender
  termNumber?: TermNumber
}

export function PricingPlansSection({
  plans,
  storeName,
  storeSlug,
  storeWhatsapp,
  category,
  city,
  termGender,
  termNumber,
}: PricingPlansSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  if (plans.length === 0) return null

  function getPlanCtaUrl(plan: PricingPlan): string {
    if (plan.ctaMode === 'EXTERNAL_LINK' && plan.ctaExternalUrl) {
      return plan.ctaExternalUrl
    }

    const message = plan.ctaWhatsappMessage
      || `Olá! Tenho interesse no plano *${plan.name}* (R$ ${(plan.priceInCents / 100).toFixed(2)}${getIntervalText(plan.interval)})`

    return `https://wa.me/55${storeWhatsapp}?text=${encodeURIComponent(message)}`
  }

  function getIntervalText(interval: PricingInterval): string {
    if (interval === 'MONTHLY') return '/mês'
    if (interval === 'YEARLY') return '/ano'
    return ''
  }

  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Planos e Preços
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
              Planos de <span className="text-primary">{category}</span> {g.da} {storeName} em {city}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              {plans.length} {plans.length === 1 ? 'opção disponível' : 'opções disponíveis'} para você em {city}
            </p>
          </div>

          <div className={cn(
            'grid gap-8',
            plans.length === 1 && 'mx-auto max-w-md',
            plans.length === 2 && 'md:grid-cols-2',
            plans.length >= 3 && 'md:grid-cols-3'
          )}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border-2 bg-white p-8 shadow-sm transition-all duration-300',
                  plan.isHighlighted
                    ? 'border-primary/30 shadow-xl shadow-primary/10 md:-translate-y-4 md:scale-105'
                    : 'border-slate-100 hover:-translate-y-2 hover:border-primary/20 hover:shadow-lg'
                )}
              >
                {plan.isHighlighted && (
                  <div className="absolute right-6 top-0 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-lg">
                      <IconSparkles className="h-3.5 w-3.5" />
                      Mais Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                  {plan.description && (
                    <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">
                      R$ {(plan.priceInCents / 100).toFixed(2).replace('.', ',')}
                    </span>
                    {plan.interval !== 'ONE_TIME' && (
                      <span className="text-base font-medium text-slate-500">
                        {getIntervalText(plan.interval)}
                      </span>
                    )}
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <IconCheck className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href={getPlanCtaUrl(plan)}
                  target={plan.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined}
                  rel={plan.ctaMode === 'EXTERNAL_LINK' ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold transition-all',
                    plan.isHighlighted
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-xl hover:shadow-primary/40'
                      : 'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20'
                  )}
                >
                  {plan.ctaMode === 'WHATSAPP' ? (
                    <IconBrandWhatsapp className="h-5 w-5" />
                  ) : (
                    <IconExternalLink className="h-5 w-5" />
                  )}
                  {plan.ctaLabel || 'Assinar'}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href={getPlanosPageUrl(storeSlug)}>
              <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3">
                Ver todos os planos
                <IconArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
