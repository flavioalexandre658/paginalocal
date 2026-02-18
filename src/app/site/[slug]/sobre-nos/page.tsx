import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { store, storePage, service } from '@/db/schema'
import { eq, and, asc } from 'drizzle-orm'
import { buildStoreUrl } from '@/lib/google-indexing'
import { HeroSection } from '../_components/hero-section'
import { SiteFooter } from '../_components/site-footer'
import { getStoreGrammar } from '@/lib/store-terms'

const FloatingContact = dynamic(() => import('../_components/floating-contact').then(m => m.FloatingContact))
const FAQSection = dynamic(() => import('../_components/faq-section').then(m => m.FAQSection))

import { getCopy } from "@/lib/local-copy"
import { renderTokens } from "@/lib/local-copy/render"
import type { LocalPageCtx } from "@/lib/local-copy/types"


interface PageProps {
  params: Promise<{ slug: string }>
}

async function getAboutPageData(slug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(and(eq(store.slug, slug), eq(store.isActive, true)))
    .limit(1)

  if (!storeData[0]) return null

  const [pageData, services, activePages] = await Promise.all([
    db
      .select()
      .from(storePage)
      .where(
        and(
          eq(storePage.storeId, storeData[0].id),
          eq(storePage.type, 'ABOUT'),
          eq(storePage.isActive, true)
        )
      )
      .limit(1),
    db
      .select()
      .from(service)
      .where(eq(service.storeId, storeData[0].id))
      .orderBy(asc(service.position)),
    db
      .select()
      .from(storePage)
      .where(
        and(
          eq(storePage.storeId, storeData[0].id),
          eq(storePage.isActive, true)
        )
      ),
  ])

  if (!pageData[0]) return null

  return {
    store: storeData[0],
    page: pageData[0],
    services: services.filter(s => s.isActive),
    institutionalPages: activePages,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getAboutPageData(slug)

  if (!data) {
    return { title: 'Página não encontrada' }
  }

  const { store: storeData, page } = data

  const title = page.seoTitle || `Sobre | ${storeData.name}`
  const _g0 = getStoreGrammar(storeData.termGender, storeData.termNumber)
  const description = page.seoDescription || `Conheça ${_g0.art} ${storeData.name} - ${storeData.category} em ${storeData.city}, ${storeData.state}. Nossa história, serviços e compromisso com a qualidade. Visite-nos!`
  const pageUrl = buildStoreUrl(storeData.slug, storeData.customDomain) + '/sobre-nos'
  const ogImage = storeData.coverUrl || storeData.logoUrl
  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'

  return {
    title: { absolute: title },
    description,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    authors: [{ name: storeData.name }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: pageUrl,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${storeData.name} - ${storeData.category} em ${storeData.city}`,
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
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

export default async function SobreNosPage({ params }: PageProps) {
  const { slug } = await params
  const data = await getAboutPageData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, page, services, institutionalPages: activePages } = data
  const g = getStoreGrammar(storeData.termGender, storeData.termNumber)

  const ctx: LocalPageCtx = {
    id: storeData.id,
    slug: storeData.slug,
    mode: storeData.mode,
    name: storeData.name,
    category: storeData.category,
    city: storeData.city,
    state: storeData.state,
    servicesCount: services.length,
  }


  const baseUrl = buildStoreUrl(storeData.slug, storeData.customDomain)
  const pageUrl = `${baseUrl}/sobre-nos`

  const sameAsLinks = [
    storeData.instagramUrl,
    storeData.facebookUrl,
    storeData.googleBusinessUrl,
  ].filter(Boolean) as string[]

  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: page.title,
    description: page.seoDescription || page.content?.substring(0, 200),
    url: pageUrl,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
      description: storeData.description,
      url: baseUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: storeData.address,
        addressLocality: storeData.city,
        addressRegion: storeData.state,
        addressCountry: 'BR',
      },
      ...(storeData.phone && {
        telephone: `+55${storeData.phone.replace(/\D/g, '')}`,
      }),
      ...(storeData.googleRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: storeData.googleRating,
          reviewCount: storeData.googleReviewsCount,
        },
      }),
      ...(sameAsLinks.length > 0 && { sameAs: sameAsLinks }),
      ...(services.length > 0 && {
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `Serviços ${g.da} ${storeData.name}`,
          itemListElement: services.slice(0, 10).map(s => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.name,
              description: s.description,
            },
          })),
        },
      }),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: storeData.name,
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.title,
        item: pageUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <HeroSection
        store={storeData}
        pageTitle={page.title}
        pageSubtitle={`${storeData.category} em ${storeData.city}, ${storeData.state}`}
        compact
        showBackLink
      />

      <main className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7] dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-14 animate-fade-in-up">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                {renderTokens(getCopy(ctx, "aboutPage.kicker"))}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
                {renderTokens(getCopy(ctx, "aboutPage.heading"))}
              </h2>

              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                {renderTokens(getCopy(ctx, "aboutPage.intro"))
                }
              </p>
            </div>


            {page.content && (
              <div className="animate-fade-in-up animation-delay-200 rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 md:p-10 shadow-lg dark:border-slate-800 dark:border-l-primary dark:bg-slate-900">
                <div className="space-y-4">
                  {page.content.split('\n').filter(Boolean).map((paragraph, i) => (
                    <p key={i} className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Services section — internal linking */}
            {services.length > 0 && (
              <div className="mt-8 animate-fade-in-up animation-delay-250">
                <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
                  {renderTokens(getCopy(ctx, "aboutPage.servicesTitle"))}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => (
                    <a
                      key={s.id}
                      href={s.slug ? `/site/${storeData.slug}/servicos/${s.slug}` : `#`}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-primary/30 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* CTA block */}
            <div className="mt-8 animate-fade-in-up animation-delay-300 overflow-hidden rounded-2xl bg-primary p-8 shadow-lg md:p-10">
              <h3 className="mb-2 text-xl font-extrabold text-white">
                {renderTokens(getCopy(ctx, "aboutPage.ctaTitle"))}
              </h3>
              <p className="mb-6 text-white/90">
                {renderTokens(getCopy(ctx, "aboutPage.ctaLead"))}
              </p>
              <a
                href={`https://wa.me/55${storeData.whatsapp}?text=${encodeURIComponent(`Olá! Vi o site ${g.da} ${storeData.name} e gostaria de saber mais sobre seus serviços.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                {renderTokens(getCopy(ctx, "aboutPage.ctaButton"))}
              </a>
            </div>
          </div>
        </div>
      </main>

      {Array.isArray(storeData.faq) && (storeData.faq as { question: string; answer: string }[]).length > 0 && (
        <FAQSection faq={storeData.faq as { question: string; answer: string }[]} storeName={storeData.name} city={storeData.city} category={storeData.category} termGender={storeData.termGender} termNumber={storeData.termNumber} mode={storeData.mode} id={storeData.id} />
      )}

      <SiteFooter
        storeName={storeData.name}
        city={storeData.city}
        state={storeData.state}
        category={storeData.category}
        categorySlug={storeData.category.toLowerCase().replace(/\s+/g, '-')}
        storeSlug={storeData.slug}
        highlightText={storeData.highlightText}
        instagramUrl={storeData.instagramUrl}
        facebookUrl={storeData.facebookUrl}
        googleBusinessUrl={storeData.googleBusinessUrl}
        services={services.map(s => ({ name: s.name, slug: s.slug || '' }))}
        institutionalPages={activePages.map(p => ({ title: p.title, slug: p.slug }))}
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
