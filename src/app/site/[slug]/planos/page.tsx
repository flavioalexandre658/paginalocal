import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/db'
import { store, storePricingPlan, testimonial, storePage, service } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import {
  IconArrowLeft,
  IconMapPin,
  IconStar,
  IconCheck,
  IconSparkles,
  IconBrandWhatsapp,
  IconExternalLink,
} from '@tabler/icons-react'
import {
  getContrastTextClass,
  getContrastMutedClass,
  getContrastBadgeClasses,
  isLightColor,
} from '@/lib/color-contrast'
import { getStoreHomeUrl } from '@/lib/utils'
import { getSectionConfig, getStoreSections } from '@/lib/store-sections'
import { cn } from '@/lib/utils'
import { TestimonialsSection } from '../_components/testimonials-section'
import { FAQSection } from '../_components/faq-section'
import { SiteFooter } from '../_components/site-footer'
import { FloatingContact } from '../_components/floating-contact'
import type { PricingInterval } from '@/db/schema'
import { getStoreGrammar } from '@/lib/store-terms'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getPlanosData(storeSlug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData[0]) return null

  const [plans, storeTestimonials, institutionalPages, services] = await Promise.all([
    db
      .select()
      .from(storePricingPlan)
      .where(and(
        eq(storePricingPlan.storeId, storeData[0].id),
        eq(storePricingPlan.isActive, true)
      ))
      .orderBy(asc(storePricingPlan.position)),

    db
      .select()
      .from(testimonial)
      .where(eq(testimonial.storeId, storeData[0].id))
      .orderBy(desc(testimonial.rating))
      .limit(6),

    db
      .select({ title: storePage.title, slug: storePage.slug })
      .from(storePage)
      .where(and(eq(storePage.storeId, storeData[0].id), eq(storePage.isActive, true))),

    db
      .select({ id: service.id, name: service.name, slug: service.slug, description: service.description, priceInCents: service.priceInCents })
      .from(service)
      .where(and(eq(service.storeId, storeData[0].id), eq(service.isActive, true)))
      .orderBy(asc(service.position)),
  ])

  return {
    store: storeData[0],
    plans,
    testimonials: storeTestimonials,
    institutionalPages,
    services,
  }
}

function getIntervalText(interval: PricingInterval): string {
  if (interval === 'MONTHLY') return '/mês'
  if (interval === 'YEARLY') return '/ano'
  return ''
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getPlanosData(slug)

  if (!data) {
    return { title: 'Página não encontrada' }
  }

  const { store: storeData } = data
  const sections = getStoreSections(storeData)
  const pricingConfig = getSectionConfig(sections, 'PRICING_PLANS')

  const title = pricingConfig?.seoTitle as string | undefined
    || `Planos e Preços — ${storeData.category} em ${storeData.city} | ${storeData.name}`
  const description = pricingConfig?.seoDescription as string | undefined
    || `Conheça os planos de ${storeData.category.toLowerCase()} ${getStoreGrammar(storeData.termGender, storeData.termNumber).da} ${storeData.name} em ${storeData.city}, ${storeData.state}. Escolha o plano ideal e entre em contato pelo WhatsApp.`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'
  const ogImage = storeData.coverUrl || storeData.logoUrl

  return {
    title: { absolute: title },
    description,
    icons: { icon: faviconUrl, apple: faviconUrl },
    robots: {
      index: storeData.isActive,
      follow: storeData.isActive,
      googleBot: { index: storeData.isActive, follow: storeData.isActive, 'max-image-preview': 'large' as const },
    },
    alternates: { canonical: `${baseUrl}/planos` },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: `${baseUrl}/planos`,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: `Planos e Preços — ${storeData.name} em ${storeData.city}` }] : [],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    other: {
      'geo.region': `BR-${storeData.state}`,
      'geo.placename': storeData.city,
      ...(storeData.latitude && storeData.longitude && {
        'geo.position': `${storeData.latitude};${storeData.longitude}`,
        'ICBM': `${storeData.latitude}, ${storeData.longitude}`,
      }),
    },
  }
}

export default async function PlanosPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getPlanosData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, plans, testimonials, institutionalPages, services } = data
  const g = getStoreGrammar(storeData.termGender, storeData.termNumber)

  const sections = getStoreSections(storeData)
  const pricingConfig = getSectionConfig(sections, 'PRICING_PLANS')

  const heroBg = storeData.heroBackgroundColor || '#1e293b'
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)
  const isLight = isLightColor(heroBg)

  const rating = storeData.googleRating ? parseFloat(storeData.googleRating) : 0
  const showRating = rating >= 4.0 && storeData.googleReviewsCount && storeData.googleReviewsCount > 0

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  function getPlanCtaUrl(plan: typeof plans[0]): string {
    if (plan.ctaMode === 'EXTERNAL_LINK' && plan.ctaExternalUrl) {
      return plan.ctaExternalUrl
    }
    const message = plan.ctaWhatsappMessage
      || `Olá! Tenho interesse no plano *${plan.name}* (R$ ${(plan.priceInCents / 100).toFixed(2)}${getIntervalText(plan.interval)})`
    return `https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(message)}`
  }

  const pricingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Planos e Preços — ${storeData.name} em ${storeData.city}`,
    description: `${plans.length} planos de ${storeData.category.toLowerCase()} disponíveis ${g.na} ${storeData.name} em ${storeData.city}, ${storeData.state}`,
    url: `${baseUrl}/planos`,
    numberOfItems: plans.length,
    itemListElement: plans.map((plan, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Offer',
        name: plan.name,
        description: plan.description || plan.name,
        price: (plan.priceInCents / 100).toFixed(2),
        priceCurrency: 'BRL',
        url: `${baseUrl}/planos`,
        seller: {
          '@type': 'LocalBusiness',
          '@id': `${baseUrl}/#business`,
          name: storeData.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: storeData.city,
            addressRegion: storeData.state,
            addressCountry: 'BR',
          },
        },
      },
    })),
  }

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    name: storeData.name,
    url: baseUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: storeData.city,
      addressRegion: storeData.state,
      addressCountry: 'BR',
    },
    ...(storeData.googleRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: storeData.googleRating,
        reviewCount: storeData.googleReviewsCount,
      },
    }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: storeData.name, item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Planos', item: `${baseUrl}/planos` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="w-full max-w-full overflow-x-clip">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
          <div className="absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

          <div className={`container relative z-10 mx-auto px-4 ${textClass}`}>
            <div className="mx-auto max-w-5xl">
              <Link
                href={getStoreHomeUrl(storeData.slug)}
                className={`mb-8 mr-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all ${badgeClasses} ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
              >
                <IconArrowLeft className="h-4 w-4 shrink-0" />
                <span className="truncate">Voltar para {storeData.name}</span>
              </Link>

              <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md ${badgeClasses}`}>
                <IconMapPin className="h-4 w-4" />
                {storeData.city}, {storeData.state}
              </div>

              <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                {(pricingConfig?.pageTitle as string) || 'Planos e Preços'}
              </h1>

              <p className={`mb-6 text-lg leading-relaxed ${mutedClass}`}>
                {storeData.category} em {storeData.city}, {storeData.state} · {plans.length} {plans.length === 1 ? 'plano disponível' : 'planos disponíveis'}
              </p>

              {showRating && (
                <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                  <IconStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{storeData.googleRating}</span>
                  <span className={mutedClass}>({storeData.googleReviewsCount} avaliações)</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="bg-[#f3f5f7] py-20 md:py-28 dark:bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
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
                          <h2 className="text-2xl font-bold text-slate-900">{plan.name}</h2>
                          {plan.description && (
                            <p className="mt-2 text-sm text-slate-500">{plan.description}</p>
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
                                <span className="text-sm font-medium text-slate-700">{feature}</span>
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
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    <IconSparkles className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Planos em breve</h3>
                  <p className="mt-2 text-sm text-slate-500">Entre em contato para saber mais sobre nossos serviços</p>
                  <a
                    href={`https://wa.me/55${storeData.whatsapp}`}
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

        {/* SEO descriptive content */}
        {plans.length > 0 && (
          <section className="bg-white py-16 md:py-20 dark:bg-slate-900">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-5xl space-y-8">
                <div className="rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 shadow-lg dark:border-slate-800 dark:border-l-primary dark:bg-slate-900">
                  <h2 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white">
                    Planos e Preços de {storeData.category} em{' '}
                    <span className="text-primary">{storeData.city}, {storeData.state}</span>
                  </h2>
                  <div className="space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    <p>
                      A <strong>{storeData.name}</strong>, {storeData.category.toLowerCase()} em {storeData.city}, {storeData.state},
                      oferece {plans.length} {plans.length === 1 ? 'plano' : 'planos'} para atender suas necessidades:{' '}
                      {plans.map(p => p.name).join(', ')}.
                    </p>
                    {plans.map((plan) => {
                      const features = (plan.features as string[] | null) || []
                      return (
                        <p key={plan.id}>
                          <strong>{plan.name}</strong>
                          {plan.description ? ` — ${plan.description}` : ''}.
                          {features.length > 0 && ` Inclui: ${features.slice(0, 3).join(', ')}${features.length > 3 ? ' e mais' : ''}.`}
                        </p>
                      )
                    })}
                    <p>
                      Para contratar {storeData.category.toLowerCase()} em {storeData.city} perto de mim,{' '}
                      entre em contato com a {storeData.name} pelo WhatsApp. Atendemos {storeData.city} e região.
                    </p>
                  </div>
                </div>

                {/* CTA card */}
                <div className="overflow-hidden rounded-2xl bg-primary p-8 shadow-lg md:p-10">
                  <h3 className="mb-2 text-xl font-extrabold text-white">
                    Escolha seu plano {g.na} {storeData.name}
                  </h3>
                  <p className="mb-6 text-white/90">
                    Fale agora com {g.art} {storeData.name} em {storeData.city} e tire suas dúvidas sobre {g.nossa}s planos de {storeData.category.toLowerCase()}.
                  </p>
                  <a
                    href={`https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(`Olá! Quero saber mais sobre os planos ${g.da} ${storeData.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <IconBrandWhatsapp className="h-5 w-5" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
            termGender={storeData.termGender}
            termNumber={storeData.termNumber}
          />
        )}

        {/* FAQ */}
        {Array.isArray(storeData.faq) && (storeData.faq as { question: string; answer: string }[]).length > 0 && (
          <FAQSection
            faq={storeData.faq as { question: string; answer: string }[]}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
            termGender={storeData.termGender}
            termNumber={storeData.termNumber}
          />
        )}
      </main>

      <SiteFooter
        storeName={storeData.name}
        city={storeData.city}
        state={storeData.state}
        category={storeData.category}
        instagramUrl={storeData.instagramUrl}
        facebookUrl={storeData.facebookUrl}
        googleBusinessUrl={storeData.googleBusinessUrl}
        highlightText={storeData.highlightText}
        storeSlug={storeData.slug}
        services={services.map(s => ({ name: s.name, slug: s.slug || '' }))}
        institutionalPages={institutionalPages}
        logoUrl={storeData.logoUrl}
      />

      <FloatingContact
        store={{
          id: storeData.id,
          name: storeData.name,
          slug: storeData.slug,
          whatsapp: storeData.whatsapp,
          phone: storeData.phone,
          whatsappDefaultMessage: storeData.whatsappDefaultMessage,
          isActive: storeData.isActive,
          showWhatsappButton: storeData.showWhatsappButton,
          showCallButton: storeData.showCallButton,
          buttonColor: storeData.buttonColor,
        }}
      />
    </>
  )
}