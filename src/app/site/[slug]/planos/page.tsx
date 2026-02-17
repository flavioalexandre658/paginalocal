import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { store, storePricingPlan } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { IconArrowRight, IconCheck, IconSparkles, IconBrandWhatsapp, IconExternalLink } from '@tabler/icons-react'
import { getSectionConfig, getStoreSections } from '@/lib/store-sections'
import { cn } from '@/lib/utils'
import type { PricingInterval, PricingCtaMode } from '@/db/schema'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    return { title: 'Página não encontrada' }
  }

  const sections = getStoreSections(storeData[0])
  const pricingConfig = getSectionConfig(sections, 'PRICING_PLANS')

  const title = pricingConfig?.seoTitle as string | undefined || `Planos e Preços | ${storeData[0].name}`
  const description = pricingConfig?.seoDescription as string | undefined || `Conheça nossos planos e escolha o ideal para você. ${storeData[0].name} em ${storeData[0].city}.`

  const baseUrl = `https://${slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${baseUrl}/planos`,
    },
  }
}

export default async function PlanosPage({ params }: PageProps) {
  const { slug } = await params

  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) {
    notFound()
  }

  const plans = await db
    .select()
    .from(storePricingPlan)
    .where(and(
      eq(storePricingPlan.storeId, storeData[0].id),
      eq(storePricingPlan.isActive, true)
    ))
    .orderBy(asc(storePricingPlan.position))

  const sections = getStoreSections(storeData[0])
  const pricingConfig = getSectionConfig(sections, 'PRICING_PLANS')

  function getPlanCtaUrl(plan: typeof plans[0]): string {
    if (plan.ctaMode === 'EXTERNAL_LINK' && plan.ctaExternalUrl) {
      return plan.ctaExternalUrl
    }

    const message = plan.ctaWhatsappMessage
      || `Olá! Tenho interesse no plano *${plan.name}* (R$ ${(plan.priceInCents / 100).toFixed(2)}${getIntervalText(plan.interval)})`

    return `https://wa.me/55${storeData[0].whatsapp}?text=${encodeURIComponent(message)}`
  }

  function getIntervalText(interval: PricingInterval): string {
    if (interval === 'MONTHLY') return '/mês'
    if (interval === 'YEARLY') return '/ano'
    return ''
  }

  const pricingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Planos ${storeData[0].name}`,
    offers: plans.map(plan => ({
      '@type': 'Offer',
      name: plan.name,
      price: (plan.priceInCents / 100).toFixed(2),
      priceCurrency: 'BRL',
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
      />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 py-20 md:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <Link
                href={`/site/${slug}`}
                className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-primary"
              >
                <IconArrowRight className="h-4 w-4 rotate-180" />
                Voltar para home
              </Link>

              <div className="mb-16 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                  {(pricingConfig?.pageTitle as string) || 'Planos e Preços'}
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                  Escolha o plano ideal para suas necessidades
                </p>
              </div>

              {plans.length > 0 ? (
                <div className={cn(
                  'grid gap-8',
                  plans.length === 1 && 'mx-auto max-w-md',
                  plans.length === 2 && 'md:grid-cols-2',
                  plans.length >= 3 && 'md:grid-cols-3'
                )}>
                  {plans.map((plan) => {
                    const features = (plan.features as string[] | null) || []

                    return (
                      <div
                        key={plan.id}
                        className={cn(
                          'group relative overflow-hidden rounded-3xl border-2 bg-white p-8 shadow-sm transition-all duration-300',
                          plan.isHighlighted
                            ? 'border-primary/30 shadow-2xl shadow-primary/10 md:-translate-y-4 md:scale-105'
                            : 'border-slate-100 hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl'
                        )}
                      >
                        {plan.isHighlighted && (
                          <div className="absolute right-8 top-0 -translate-y-1/2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary/90 px-5 py-2 text-xs font-bold text-white shadow-lg">
                              <IconSparkles className="h-4 w-4" />
                              Mais Popular
                            </span>
                          </div>
                        )}

                        <div className="mb-8 border-b border-slate-100 pb-8">
                          <h2 className="text-2xl font-bold text-slate-900">
                            {plan.name}
                          </h2>
                          {plan.description && (
                            <p className="mt-2 text-sm text-slate-500">
                              {plan.description}
                            </p>
                          )}
                        </div>

                        <div className="mb-8">
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900">
                              R$ {(plan.priceInCents / 100).toFixed(2).replace('.', ',')}
                            </span>
                            {plan.interval !== 'ONE_TIME' && (
                              <span className="text-lg font-medium text-slate-500">
                                {getIntervalText(plan.interval)}
                              </span>
                            )}
                          </div>
                        </div>

                        {features.length > 0 && (
                          <ul className="mb-10 space-y-4">
                            {features.map((feature, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <IconCheck className="h-4 w-4 text-primary" />
                                </div>
                                <span className="text-sm font-medium text-slate-700">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <a
                          href={getPlanCtaUrl(plan)}
                          target={plan.ctaMode === 'EXTERNAL_LINK' ? '_blank' : undefined}
                          rel={plan.ctaMode === 'EXTERNAL_LINK' ? 'noopener noreferrer' : undefined}
                          className={cn(
                            'inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all',
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
                          {plan.ctaLabel || 'Assinar plano'}
                        </a>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                    <IconSparkles className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Planos em breve
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Entre em contato para saber mais sobre nossos serviços
                  </p>
                  <a
                    href={`https://wa.me/55${storeData[0].whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                  >
                    <IconBrandWhatsapp className="h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
