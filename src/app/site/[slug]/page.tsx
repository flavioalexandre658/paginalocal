import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { unstable_cache } from 'next/cache'
import dynamic from 'next/dynamic'
import { db } from '@/db'
import { store, service, testimonial, storeImage, storePage } from '@/db/schema'
import { eq, asc, desc, and } from 'drizzle-orm'
import { generateLocalBusinessJsonLd, generateBreadcrumbJsonLd } from '@/lib/local-seo'
import { auth } from '@/lib/auth'
import { HeroSection } from './_components/hero-section'
import { AboutSection } from './_components/about-section'
import { ServicesSection } from './_components/services-section'
import { ContactSection } from './_components/contact-section'
import { SiteFooter } from './_components/site-footer'
import { generateFAQJsonLd } from '@/lib/faq-json-ld'

const TestimonialsSection = dynamic(() => import('./_components/testimonials-section').then(m => m.TestimonialsSection))
const FloatingContact = dynamic(() => import('./_components/floating-contact').then(m => m.FloatingContact))
const FAQSection = dynamic(() => import('./_components/faq-section').then(m => m.FAQSection))
const AreasSection = dynamic(() => import('./_components/areas-section').then(m => m.AreasSection))
const GallerySection = dynamic(() => import('./_components/gallery-section').then(m => m.GallerySection))
const DraftBanner = dynamic(() => import('@/components/site/draft-banner').then(m => m.DraftBanner))
const DraftModal = dynamic(() => import('@/components/site/draft-modal').then(m => m.DraftModal))
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

  const [services, testimonials, galleryImages, heroImage] = await Promise.all([
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

  const { store: storeData, services, testimonials, galleryImages, heroImage, institutionalPages } = data

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const isOwner = session?.user?.id === storeData.userId
  const isDraft = !storeData.isActive

  const faq = (storeData.faq as FAQItem[] | null) || []
  const neighborhoods = (storeData.neighborhoods as string[] | null) || []

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
        description: svc.description || `${svc.name} na ${storeData.name}`,
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

      {isDraft && (
        <>
          <DraftBanner isOwner={isOwner} />
          <DraftModal storeName={storeData.name} isOwner={isOwner} />
        </>
      )}

      <main className={isDraft ? 'pt-12' : ''}>
        <HeroSection
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

        <AboutSection
          name={storeData.name}
          category={storeData.category}
          city={storeData.city}
          state={storeData.state}
          description={storeData.description}
          neighborhoods={neighborhoods}
          openingHours={storeData.openingHours as Record<string, string> | null}
          servicesCount={services.length}
          serviceNames={services.map(s => s.name)}
        />

        {services.length > 0 && (
          <ServicesSection
            services={services}
            storeName={storeData.name}
            storeSlug={storeData.slug}
            category={storeData.category}
            city={storeData.city}
          />
        )}

        {galleryImages.length > 0 && (
          <GallerySection
            images={galleryImages}
            storeName={storeData.name}
            city={storeData.city}
            category={storeData.category}
          />
        )}

        {neighborhoods.length > 0 && (
          <AreasSection
            neighborhoods={neighborhoods}
            city={storeData.city}
            state={storeData.state}
            category={storeData.category}
          />
        )}

        {testimonials.length > 0 && (
          <TestimonialsSection
            testimonials={testimonials}
            storeName={storeData.name}
          />
        )}

        {faq.length > 0 && <FAQSection faq={faq} storeName={storeData.name} />}

        <ContactSection
          store={{
            ...storeData,
            openingHours: storeData.openingHours as Record<string, string> | null,
          }}
          isOwner={isOwner}
        />

        {/* AEO: Conteúdo otimizado para respostas de IA e "perto de mim" */}
        <section className="sr-only" aria-hidden="false">
          <h2>{storeData.category} perto de mim em {storeData.city}</h2>
          <p>
            Procurando por {storeData.category.toLowerCase()} perto de você em {storeData.city}, {storeData.state}?
            A {storeData.name} é {storeData.category.toLowerCase()} em {storeData.city} que oferece
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
