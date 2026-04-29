import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { store, service, testimonial, storeImage, storePage, storeProduct, storePricingPlan } from '@/db/schema'
import { eq, asc, desc, and } from 'drizzle-orm'
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd } from '@/lib/local-seo'
import { auth } from '@/lib/auth'
import { getStoreSections, getActiveSections } from '@/lib/store-sections'
import { generateFAQJsonLd } from '@/lib/faq-json-ld'
import type { SiteBlueprint } from '@/types/ai-generation'
import { SiteV2Renderer } from './_components/site-v2-renderer'
import { UnpublishedSiteCover } from './_components/unpublished-site-cover'
import { buildStoreMetadata, buildWebPageJsonLd, buildSameAsArray } from '@/lib/site-metadata'

const PageviewTracker = dynamic(() => import('./_components/pageview-tracker').then(m => m.PageviewTracker))
const DraftInterceptor = dynamic(() => import('./_components/draft-interceptor').then(m => m.DraftInterceptor))

interface FAQItem {
  question: string
  answer: string
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function fetchStoreData(slug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeData[0]) return null

  const [services, testimonials, galleryImages, heroImage, products, pricingPlans] = await Promise.all([
    db
      .select()
      .from(service)
      .where(eq(service.storeId, storeData[0].id))
      .orderBy(asc(service.position)),
    db
      .select()
      .from(testimonial)
      .where(eq(testimonial.storeId, storeData[0].id))
      .orderBy(desc(testimonial.rating))
      .limit(30),
    db
      .select({
        id: storeImage.id,
        url: storeImage.url,
        alt: storeImage.alt,
        width: storeImage.width,
        height: storeImage.height,
      })
      .from(storeImage)
      .where(and(eq(storeImage.storeId, storeData[0].id), eq(storeImage.role, 'gallery')))
      .orderBy(asc(storeImage.order)),
    db
      .select({
        url: storeImage.url,
        alt: storeImage.alt,
      })
      .from(storeImage)
      .where(and(eq(storeImage.storeId, storeData[0].id), eq(storeImage.role, 'hero')))
      .limit(1),
    db
      .select()
      .from(storeProduct)
      .where(and(eq(storeProduct.storeId, storeData[0].id), eq(storeProduct.status, 'ACTIVE')))
      .orderBy(asc(storeProduct.position))
      .limit(12),
    db
      .select()
      .from(storePricingPlan)
      .where(and(eq(storePricingPlan.storeId, storeData[0].id), eq(storePricingPlan.isActive, true)))
      .orderBy(asc(storePricingPlan.position)),
  ])

  const institutionalPages = await db
    .select({ title: storePage.title, slug: storePage.slug })
    .from(storePage)
    .where(and(eq(storePage.storeId, storeData[0].id), eq(storePage.isActive, true)))

  return {
    store: storeData[0],
    services: services.filter(s => s.isActive),
    testimonials,
    galleryImages,
    heroImage: heroImage[0] || null,
    institutionalPages,
    products,
    pricingPlans,
  }
}

const getStoreData = unstable_cache(
  fetchStoreData,
  ['store-page-data'],
  { revalidate: 3600, tags: ['store-data'] }
)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getStoreData(slug)

  if (!data) {
    return { title: 'Página não encontrada', robots: { index: false, follow: false } }
  }

  const { store: storeData } = data

  return buildStoreMetadata({
    name: storeData.name,
    slug: storeData.slug,
    category: storeData.category,
    city: storeData.city,
    state: storeData.state,
    description: storeData.description,
    seoTitle: storeData.seoTitle,
    seoDescription: storeData.seoDescription,
    customDomain: storeData.customDomain,
    faviconUrl: storeData.faviconUrl,
    logoUrl: storeData.logoUrl,
    coverUrl: storeData.coverUrl,
    primaryColor: storeData.primaryColor,
    whatsapp: storeData.whatsapp,
    phone: storeData.phone,
    instagramUrl: storeData.instagramUrl,
    facebookUrl: storeData.facebookUrl,
    googleBusinessUrl: storeData.googleBusinessUrl,
    website: storeData.website,
    address: storeData.address,
    latitude: storeData.latitude,
    longitude: storeData.longitude,
    neighborhoods: (storeData.neighborhoods as string[] | null) ?? null,
    services: data.services.map((s) => s.name),
    siteBlueprintV2: storeData.siteBlueprintV2 as SiteBlueprint | null,
  })
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params

  // Must be called before unstable_cache to ensure Next.js treats this page
  // as dynamic and headers() returns actual request headers (not empty/static).
  const requestHeaders = await headers()

  const data = await getStoreData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, services, testimonials, galleryImages, heroImage, institutionalPages, products, pricingPlans } = data

  const session = await auth.api.getSession({ headers: requestHeaders })
  const isOwner = session?.user?.id === storeData.userId
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin'

  // Site não publicado + visitante público → tela "Em construção".
  // Dono e admin enxergam o site normalmente para preview.
  if (!storeData.isActive && !isOwner && !isAdmin) {
    return (
      <UnpublishedSiteCover
        storeName={storeData.name}
        category={storeData.category}
        city={storeData.city}
        primaryColor={storeData.primaryColor || undefined}
      />
    )
  }

  const faq = (storeData.faq as FAQItem[] | null) || []
  const neighborhoods = (storeData.neighborhoods as string[] | null) || []

  // V3: Get sections (usa fallback para lojas antigas)
  const sections = getStoreSections(storeData)
  const activeSections = getActiveSections(sections)

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'decolou.com'}`

  const reviewsForSchema = testimonials
    .filter(t => t.content && t.content.length > 20)
    .slice(0, 5)
    .map(t => ({
      authorName: t.authorName,
      rating: t.rating,
      content: t.content,
      createdAt: t.createdAt,
    }))

  const sameAs = buildSameAsArray({
    name: storeData.name,
    slug: storeData.slug,
    category: storeData.category,
    city: storeData.city,
    state: storeData.state,
    instagramUrl: storeData.instagramUrl,
    facebookUrl: storeData.facebookUrl,
    googleBusinessUrl: storeData.googleBusinessUrl,
    website: storeData.website,
  })

  const localBusinessJsonLd = generateLocalBusinessJsonLd({
    name: storeData.name,
    slug: storeData.slug,
    customDomain: storeData.customDomain || undefined,
    description: storeData.description || undefined,
    category: storeData.category,
    phone: storeData.phone,
    address: storeData.address,
    city: storeData.city,
    state: storeData.state,
    zipCode: storeData.zipCode || undefined,
    latitude: storeData.latitude || undefined,
    longitude: storeData.longitude || undefined,
    openingHours: storeData.openingHours as Record<string, string> | undefined,
    imageUrl: storeData.coverUrl || storeData.logoUrl || undefined,
    rating: storeData.googleRating || undefined,
    reviewCount: storeData.googleReviewsCount || undefined,
    reviews: reviewsForSchema,
    neighborhoods: neighborhoods.length > 0 ? neighborhoods : undefined,
    email: storeData.email || undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    knowsAbout: services.slice(0, 8).map((s) => s.name),
  })

  const webPageJsonLd = buildWebPageJsonLd({
    name: storeData.name,
    description:
      storeData.seoDescription ||
      `${storeData.name} — ${storeData.category} em ${storeData.city}, ${storeData.state}`,
    url: baseUrl,
    imageUrl: storeData.coverUrl || storeData.logoUrl || undefined,
    businessId: `${baseUrl}/#business`,
    breadcrumbId: `${baseUrl}/#breadcrumb`,
  })

  const breadcrumbJsonLd = generateBreadcrumbJsonLd({
    name: storeData.name,
    city: storeData.city,
    category: storeData.category,
    url: baseUrl,
  })

  const faqJsonLd = faq.length > 0 ? generateFAQJsonLd(faq) : null

  const servicesJsonLd = services.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: `Serviços de ${storeData.category} - ${storeData.name}`,
    itemListElement: services.map((svc) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: svc.name,
        description: svc.description || `${svc.name} ${storeData.termGender === 'MASCULINE' ? 'no' : 'na'} ${storeData.name}`,
        provider: {
          '@type': 'LocalBusiness',
          '@id': `${baseUrl}/#business`,
          name: storeData.name,
        },
        areaServed: {
          '@type': 'City',
          name: storeData.city,
        },
        ...(svc.slug && { url: `${baseUrl}/servicos/${svc.slug}` }),
      },
      ...(svc.priceInCents && {
        price: (svc.priceInCents / 100).toFixed(2),
        priceCurrency: 'BRL',
      }),
    })),
  } : null

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: storeData.name,
    url: baseUrl,
    description: storeData.seoDescription || `${storeData.category} em ${storeData.city}. ${storeData.name}`,
    publisher: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
    },
    inLanguage: 'pt-BR',
    ...(storeData.latitude && storeData.longitude && {
      contentLocation: {
        '@type': 'Place',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: parseFloat(storeData.latitude),
          longitude: parseFloat(storeData.longitude),
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: storeData.city,
          addressRegion: storeData.state,
          addressCountry: 'BR',
        },
      },
    }),
  }

  const serviceAreaJsonLd = neighborhoods.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#business`,
    areaServed: [
      {
        '@type': 'City',
        name: storeData.city,
        containedInPlace: {
          '@type': 'State',
          name: storeData.state,
        },
      },
      ...neighborhoods.map((n) => ({
        '@type': 'Place',
        name: `${n}, ${storeData.city}`,
      })),
    ],
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {servicesJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
        />
      )}
      {serviceAreaJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceAreaJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <PageviewTracker storeId={storeData.id} />

      <DraftInterceptor isDraft={!storeData.isActive} />

      {/* SEMPRE V2 — nunca renderizar V1 */}
      {storeData.siteBlueprintV2 ? (
        <SiteV2Renderer blueprint={storeData.siteBlueprintV2 as unknown as SiteBlueprint} storeId={storeData.id} />
      ) : (
        /* Blueprint V2 ainda nao gerado — mostrar placeholder */
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fafaf9" }}>
          <div className="text-center px-6 py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black/5 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "rgba(0,0,0,0.4)" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
            <h1 style={{ fontFamily: "system-ui", fontSize: 24, fontWeight: 500, color: "rgba(0,0,0,0.8)", margin: "0 0 8px" }}>
              Gerando seu site...
            </h1>
            <p style={{ fontFamily: "system-ui", fontSize: 16, color: "rgba(0,0,0,0.45)", margin: 0 }}>
              Estamos criando o design do seu site com IA. Isso pode levar alguns segundos.
            </p>
          </div>
        </main>
      )}
    </>
  )
}
