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
import { HeroSection } from './_components/hero-section'
import { AboutSection } from './_components/about-section'
import { ServicesSection } from './_components/services-section'
import { ContactSection } from './_components/contact-section'
import { SiteFooter } from './_components/site-footer'
import { ProductsSection } from './_components/products-section'
import { PricingPlansSection } from './_components/pricing-plans-section'
import { generateFAQJsonLd } from '@/lib/faq-json-ld'

const StatsSection = dynamic(() => import('./_components/stats-section').then(m => m.StatsSection))
const TestimonialsSection = dynamic(() => import('./_components/testimonials-section').then(m => m.TestimonialsSection))
const FloatingContact = dynamic(() => import('./_components/floating-contact').then(m => m.FloatingContact))
const FAQSection = dynamic(() => import('./_components/faq-section').then(m => m.FAQSection))
const AreasSection = dynamic(() => import('./_components/areas-section').then(m => m.AreasSection))
const GallerySection = dynamic(() => import('./_components/gallery-section').then(m => m.GallerySection))
const PageviewTracker = dynamic(() => import('./_components/pageview-tracker').then(m => m.PageviewTracker))

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
    return { title: 'Página não encontrada' }
  }

  const { store: storeData } = data

  const title = storeData.seoTitle || `${storeData.category} em ${storeData.city} | ${storeData.name}`
  const description = storeData.seoDescription || storeData.description || `${storeData.name} - ${storeData.category} em ${storeData.city}, ${storeData.state}. Entre em contato pelo WhatsApp!`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const ogImage = storeData.coverUrl || storeData.logoUrl

  const faviconUrl = storeData.faviconUrl || storeData.logoUrl || '/assets/images/icon/favicon.ico'

  return {
    title: {
      absolute: title,
    },
    description,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    authors: [{ name: storeData.name }],
    creator: storeData.name,
    publisher: storeData.name,
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
      canonical: baseUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: baseUrl,
      siteName: storeData.name,
      title,
      description,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${storeData.name} - ${storeData.category} em ${storeData.city}`,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
    category: storeData.category,
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

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params
  const data = await getStoreData(slug)

  if (!data) {
    notFound()
  }

  const { store: storeData, services, testimonials, galleryImages, heroImage, institutionalPages, products, pricingPlans } = data

  const session = await auth.api.getSession({ headers: await headers() })
  const isOwner = session?.user?.id === storeData.userId

  if (!storeData.isActive && !isOwner) {
    const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'
    const signupUrl = `https://${mainDomain}/cadastro`
    const plansUrl = `https://${mainDomain}/planos`

    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent" />

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <div className="mx-auto w-full max-w-md space-y-4">

            {/* Draft notice card */}
            <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/5 shadow-lg shadow-amber-400/10">
                <span className="text-3xl leading-none">🚧</span>
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Site em fase de publicação
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Esta página foi criada como prévia e ainda não está ativa publicamente.
              </p>

              <div className="my-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-left">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Se você é o proprietário, ative agora para
                </p>
                <ul className="space-y-2">
                  {[
                    'Liberar acesso público ao site',
                    'Começar a aparecer no Google',
                    'Remover o selo de prévia',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={plansUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/40"
              >
                Ativar agora
              </a>
            </div>

            {/* Promo card — Página Local brand */}
            <div className="overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-center shadow-xl shadow-emerald-600/20">
              <div className="mb-4 flex items-center justify-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/icon/favicon.ico"
                  alt="Página Local"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="text-base font-semibold tracking-tight text-white">
                  Página Local
                </span>
              </div>

              <h2 className="text-lg font-semibold tracking-tight text-white">
                Quer ter seu próprio site profissional?
              </h2>
              <p className="mt-1.5 text-sm text-emerald-100">
                Crie agora em poucos minutos e comece a divulgar sua empresa online.
              </p>

              <a
                href={signupUrl}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 shadow-md shadow-black/10 transition-all hover:scale-[1.02] hover:bg-emerald-50 hover:shadow-lg"
              >
                🚀 Criar meu site agora
              </a>
            </div>

          </div>
        </div>
      </div>
    )
  }

  const faq = (storeData.faq as FAQItem[] | null) || []
  const neighborhoods = (storeData.neighborhoods as string[] | null) || []

  // V3: Get sections (usa fallback para lojas antigas)
  const sections = getStoreSections(storeData)
  const activeSections = getActiveSections(sections)

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const reviewsForSchema = testimonials
    .filter(t => t.content && t.content.length > 20)
    .slice(0, 5)
    .map(t => ({
      authorName: t.authorName,
      rating: t.rating,
      content: t.content,
      createdAt: t.createdAt,
    }))

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

      <PageviewTracker storeId={storeData.id} />

      {/*<DraftModal storeName={storeData.name} isOwner={isOwner} />*/}

      <main className={''}>
        {activeSections.map((section) => {
          switch (section.type) {
            case 'HERO':
              return (
                <HeroSection
                  key="hero"
                  store={{
                    ...storeData,
                    heroTitle: storeData.heroTitle || undefined,
                    heroSubtitle: storeData.heroSubtitle || undefined,
                    coverUrl: heroImage?.url || storeData.coverUrl,
                    showWhatsappButton: storeData.showWhatsappButton,
                    showCallButton: storeData.showCallButton,
                  }}
                  heroImageAlt={heroImage?.alt}
                  isOwner={isOwner}
                />
              )

            case 'STATS':
              return (
                <StatsSection
                  key="stats"
                  stats={storeData.stats as import('@/db/schema/stores.schema').StoreStat[] | null}
                  category={storeData.category}
                />
              )

            case 'ABOUT':
              return (
                <AboutSection
                  key="about"
                  name={storeData.name}
                  category={storeData.category}
                  city={storeData.city}
                  state={storeData.state}
                  description={storeData.description}
                  neighborhoods={neighborhoods}
                  openingHours={storeData.openingHours as Record<string, string> | null}
                  serviceNames={services.map(s => s.name)}
                  termGender={storeData.termGender}
                  termNumber={storeData.termNumber}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              )

            case 'SERVICES':
              return services.length > 0 ? (
                <ServicesSection
                  key="services"
                  services={services}
                  storeName={storeData.name}
                  storeSlug={storeData.slug}
                  category={storeData.category}
                  city={storeData.city}
                  termGender={storeData.termGender}
                  termNumber={storeData.termNumber}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'PRODUCTS':
              return products.length > 0 ? (
                <ProductsSection
                  key="products"
                  products={products}
                  storeName={storeData.name}
                  storeSlug={storeData.slug}
                  category={storeData.category}
                  city={storeData.city}
                  state={storeData.state}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'PRICING_PLANS':
              return pricingPlans.length > 0 ? (
                <PricingPlansSection
                  key="pricing-plans"
                  plans={pricingPlans}
                  storeName={storeData.name}
                  storeSlug={storeData.slug}
                  storeWhatsapp={storeData.whatsapp}
                  category={storeData.category}
                  city={storeData.city}
                  state={storeData.state}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'GALLERY':
              return galleryImages.length > 0 ? (
                <GallerySection
                  key="gallery"
                  images={galleryImages}
                  storeName={storeData.name}
                  city={storeData.city}
                  category={storeData.category}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'AREAS':
              return neighborhoods.length > 0 ? (
                <AreasSection
                  key="areas"
                  neighborhoods={neighborhoods}
                  city={storeData.city}
                  state={storeData.state}
                  category={storeData.category}
                  storeName={storeData.name}
                  termGender={storeData.termGender}
                  termNumber={storeData.termNumber}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'TESTIMONIALS':
              return testimonials.length > 0 ? (
                <TestimonialsSection
                  key="testimonials"
                  testimonials={testimonials}
                  storeName={storeData.name}
                  city={storeData.city}
                  state={storeData.state}
                  category={storeData.category}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}

                />
              ) : null

            case 'FAQ':
              return faq.length > 0 ? (
                <FAQSection
                  key="faq"
                  faq={faq}
                  storeName={storeData.name}
                  city={storeData.city}
                  category={storeData.category}
                  termGender={storeData.termGender}
                  termNumber={storeData.termNumber}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              ) : null

            case 'CONTACT':
              return (
                <ContactSection
                  key="contact"
                  store={{
                    ...storeData,
                    openingHours: storeData.openingHours as Record<string, string> | null,
                  }}
                  mode={storeData.mode}
                  id={storeData.id}
                  slug={storeData.slug}
                />
              )

            default:
              return null
          }
        })}

        {/* AEO: Conteúdo otimizado para respostas de IA e "perto de mim" */}
        <section className="sr-only" aria-hidden="false">
          <h2>{storeData.category} perto de mim em {storeData.city}</h2>
          <p>
            Procurando por {storeData.category.toLowerCase()} perto de você em {storeData.city}, {storeData.state}?
            {storeData.termGender === 'MASCULINE' ? 'O' : 'A'} {storeData.name} é {storeData.category.toLowerCase()} em {storeData.city} que oferece
            {services.length > 0
              ? ` ${services.slice(0, 4).map(s => s.name.toLowerCase()).join(', ')}`
              : ` serviços profissionais`
            } com atendimento pelo WhatsApp.
            {storeData.googleRating && parseFloat(storeData.googleRating) >= 4.0
              ? ` Nota ${storeData.googleRating} no Google com ${storeData.googleReviewsCount} avaliações de clientes.`
              : ''
            }
          </p>
          <p>
            Melhor {storeData.category.toLowerCase()} em {storeData.city} para
            {services.length > 0
              ? ` ${services.slice(0, 3).map(s => s.name.toLowerCase()).join(', ')}`
              : ` a região`
            }.
            {neighborhoods.length > 0
              ? ` Atende os bairros ${neighborhoods.slice(0, 5).join(', ')} e região de ${storeData.city}.`
              : ` Atende ${storeData.city} e região.`
            }
          </p>
          <p>
            {storeData.name} é a melhor opção de {storeData.category.toLowerCase()} perto de mim em {storeData.city}, {storeData.state}.
            Entre em contato pelo WhatsApp para orçamento gratuito.
          </p>
        </section>
      </main>

      <SiteFooter
        storeName={storeData.name}
        city={storeData.city}
        state={storeData.state}
        category={storeData.category}
        categorySlug={storeData.category.toLowerCase().replace(/\s+/g, '-')}
        hasServices={services.length > 0}
        hasFaq={faq.length > 0}
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
        isOwner={isOwner}
      />
    </>
  )
}
