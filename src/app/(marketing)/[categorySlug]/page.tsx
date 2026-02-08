import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { getCategoryBySlug } from '@/actions/categories/get-category-by-slug.action'
import { getStoresByCategory, getCategoryStats } from '@/actions/categories/get-stores-by-category.action'
import { getCategoryCities } from '@/actions/categories/get-category-cities.action'
import { CategoryPageClient } from './category-page-client'

async function getUserHasSubscription(userId: string): Promise<boolean> {
  const [userSubscription] = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(
      and(
        eq(subscription.userId, userId),
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
    )
    .limit(1)

  return !!userSubscription
}

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params
  const category = await getCategoryBySlug(categorySlug)

  if (!category || category.slug === 'outro') {
    return {
      title: 'Categoria não encontrada',
    }
  }

  const title = category.seoTitle || `${category.name} - Encontre os Melhores | Página Local`
  const description = category.seoDescription || `Encontre os melhores ${category.name.toLowerCase()} da sua região. Veja avaliações, endereços e entre em contato pelo WhatsApp.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Página Local',
      url: `https://paginalocal.com.br/${categorySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://paginalocal.com.br/${categorySlug}`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params
  
  if (categorySlug === 'outro') {
    notFound()
  }

  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  const session = await auth.api.getSession({ headers: await headers() })
  const isLoggedIn = !!session?.user?.id
  const hasSubscription = isLoggedIn ? await getUserHasSubscription(session.user.id) : false

  const [storesData, stats, cities] = await Promise.all([
    getStoresByCategory(categorySlug, 12),
    getCategoryStats(category.name),
    getCategoryCities(categorySlug, 50),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: category.heroTitle || `${category.name} - Página Local`,
    description: category.seoDescription || category.description,
    numberOfItems: stats.totalStores,
    itemListElement: storesData.stores.map((store, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: store.name,
        description: store.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: store.city,
          addressRegion: store.state,
          streetAddress: store.address,
        },
        ...(store.googleRating && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: store.googleRating,
            reviewCount: store.googleReviewsCount || 1,
          },
        }),
        url: `https://${store.slug}.paginalocal.com.br`,
      },
    })),
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: category.name,
    description: category.longDescription || category.description,
    provider: {
      '@type': 'Organization',
      name: 'Página Local',
      url: 'https://paginalocal.com.br',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brasil',
    },
    ...(category.suggestedServices && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `Serviços de ${category.name}`,
        itemListElement: category.suggestedServices.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service,
          },
        })),
      },
    }),
  }

  const faqJsonLd = category.faqs && category.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: category.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  const categoryIntro = category.seoDescription
    || `Encontre os melhores profissionais de ${category.name.toLowerCase()} da sua região. Compare avaliações, preços e entre em contato direto pelo WhatsApp.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <section className="sr-only" aria-hidden="false">
        <h1>{category.heroTitle || `${category.name} - Página Local`}</h1>
        <p>{categoryIntro}</p>
        {category.longDescription && <p>{category.longDescription}</p>}
        {stats.totalStores > 0 && (
          <p>
            {stats.totalStores} {category.name.toLowerCase()} cadastrados em {stats.totalCities} cidades,
            com avaliação média de {stats.avgRating} estrelas.
          </p>
        )}
      </section>

      <CategoryPageClient
        category={{
          name: category.name,
          slug: category.slug,
          description: category.description,
          heroTitle: category.heroTitle,
          heroSubtitle: category.heroSubtitle,
          longDescription: category.longDescription,
          seoDescription: category.seoDescription,
          suggestedServices: category.suggestedServices,
          faqs: category.faqs,
        }}
        stores={storesData.stores}
        stats={stats}
        cities={cities}
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
      />
    </>
  )
}
