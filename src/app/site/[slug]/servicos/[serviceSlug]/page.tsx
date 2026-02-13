import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/db'
import { store, service, testimonial, storePage } from '@/db/schema'
import { eq, and, asc, desc } from 'drizzle-orm'
import { ServiceDetailContent } from './_components/service-detail-content'
import { SiteFooter } from '../../_components/site-footer'
import { FloatingContact } from '../../_components/floating-contact'

interface PageProps {
  params: Promise<{ slug: string; serviceSlug: string }>
}

async function getServiceData(storeSlug: string, serviceSlug: string) {
  const storeData = await db
    .select()
    .from(store)
    .where(eq(store.slug, storeSlug))
    .limit(1)

  if (!storeData[0]) return null

  const serviceData = await db
    .select()
    .from(service)
    .where(
      and(
        eq(service.storeId, storeData[0].id),
        eq(service.slug, serviceSlug),
        eq(service.isActive, true)
      )
    )
    .limit(1)

  if (!serviceData[0]) return null

  const otherServices = await db
    .select({
      id: service.id,
      name: service.name,
      slug: service.slug,
      description: service.description,
      priceInCents: service.priceInCents,
    })
    .from(service)
    .where(
      and(
        eq(service.storeId, storeData[0].id),
        eq(service.isActive, true)
      )
    )
    .orderBy(asc(service.position))

  const storeTestimonials = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.storeId, storeData[0].id))
    .orderBy(desc(testimonial.rating))
    .limit(6)

  const institutionalPages = await db
    .select({ title: storePage.title, slug: storePage.slug })
    .from(storePage)
    .where(and(eq(storePage.storeId, storeData[0].id), eq(storePage.isActive, true)))

  return {
    store: storeData[0],
    service: serviceData[0],
    otherServices: otherServices.filter(s => s.id !== serviceData[0].id),
    testimonials: storeTestimonials,
    institutionalPages,
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, serviceSlug } = await params
  const data = await getServiceData(slug, serviceSlug)

  if (!data) {
    return { title: 'Serviço não encontrado' }
  }

  const { store: storeData, service: serviceData } = data

  const title = serviceData.seoTitle
    || `${serviceData.name} em ${storeData.city} | ${storeData.name}`
  const description = serviceData.seoDescription
    || serviceData.description
    || `${serviceData.name} na ${storeData.name}, ${storeData.category.toLowerCase()} em ${storeData.city}, ${storeData.state}. Entre em contato pelo WhatsApp!`

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const pageUrl = `${baseUrl}/servicos/${serviceSlug}`
  const ogImage = serviceData.heroImageUrl || serviceData.imageUrl || storeData.coverUrl || storeData.logoUrl
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
      index: storeData.isActive,
      follow: storeData.isActive,
      googleBot: {
        index: storeData.isActive,
        follow: storeData.isActive,
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
        alt: `${serviceData.name} - ${storeData.name}`,
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

export default async function ServicePage({ params }: PageProps) {
  const { slug, serviceSlug } = await params
  const data = await getServiceData(slug, serviceSlug)

  if (!data) {
    notFound()
  }

  const { store: storeData, service: serviceData, otherServices, testimonials, institutionalPages } = data

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${storeData.slug}.${process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'paginalocal.com.br'}`

  const pageUrl = `${baseUrl}/servicos/${serviceSlug}`

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceData.name,
    description: serviceData.longDescription || serviceData.description || `${serviceData.name} na ${storeData.name}`,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#business`,
      name: storeData.name,
      telephone: storeData.phone ? `+55${storeData.phone.replace(/\D/g, '')}` : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: storeData.address,
        addressLocality: storeData.city,
        addressRegion: storeData.state,
        addressCountry: 'BR',
      },
      ...(storeData.googleRating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: storeData.googleRating,
          reviewCount: storeData.googleReviewsCount || 0,
        },
      }),
    },
    areaServed: {
      '@type': 'City',
      name: storeData.city,
    },
    url: pageUrl,
    ...(serviceData.priceInCents && {
      offers: {
        '@type': 'Offer',
        price: (serviceData.priceInCents / 100).toFixed(2),
        priceCurrency: 'BRL',
        availability: 'https://schema.org/InStock',
      },
    }),
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
        name: 'Serviços',
        item: `${baseUrl}/servicos`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceData.name,
        item: pageUrl,
      },
    ],
  }

  const faqJsonLd = storeData.faq && Array.isArray(storeData.faq) && (storeData.faq as Array<{ question: string; answer: string }>).length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: (storeData.faq as Array<{ question: string; answer: string }>)
          .filter(f => f.question.toLowerCase().includes(serviceData.name.toLowerCase()) || f.question.toLowerCase().includes(storeData.category.toLowerCase()))
          .slice(0, 3)
          .map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && faqJsonLd.mainEntity.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <ServiceDetailContent
        store={{
          id: storeData.id,
          name: storeData.name,
          slug: storeData.slug,
          category: storeData.category,
          city: storeData.city,
          state: storeData.state,
          phone: storeData.phone,
          whatsapp: storeData.whatsapp,
          whatsappDefaultMessage: storeData.whatsappDefaultMessage,
          logoUrl: storeData.logoUrl,
          primaryColor: storeData.primaryColor,
          heroBackgroundColor: storeData.heroBackgroundColor,
          buttonColor: storeData.buttonColor,
          isActive: storeData.isActive,
          showWhatsappButton: storeData.showWhatsappButton,
          showCallButton: storeData.showCallButton,
          googleRating: storeData.googleRating,
          googleReviewsCount: storeData.googleReviewsCount,
        }}
        service={{
          name: serviceData.name,
          slug: serviceData.slug,
          description: serviceData.description,
          longDescription: serviceData.longDescription,
          priceInCents: serviceData.priceInCents,
          imageUrl: serviceData.imageUrl,
          heroImageUrl: serviceData.heroImageUrl,
        }}
        otherServices={otherServices}
        testimonials={testimonials}
        faq={Array.isArray(storeData.faq) ? (storeData.faq as { question: string; answer: string }[]) : []}
      />

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
        services={otherServices.map(s => ({ name: s.name, slug: s.slug || '' }))}
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
