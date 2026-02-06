import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { subscription } from '@/db/schema'
import { eq, and, or } from 'drizzle-orm'
import { getCategoryBySlug } from '@/actions/categories/get-category-by-slug.action'
import { getStoresByCategoryCity } from '@/actions/categories/get-stores-by-category-city.action'
import { getCategoryCities } from '@/actions/categories/get-category-cities.action'
import { formatCityFromSlug } from '@/lib/utils'
import { CategoryCityPageClient } from './category-city-page-client'

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

interface CategoryCityPageProps {
  params: Promise<{ categorySlug: string; citySlug: string }>
}

export async function generateMetadata({ params }: CategoryCityPageProps): Promise<Metadata> {
  const { categorySlug, citySlug } = await params
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category || category.slug === 'outro') {
    return {
      title: 'Página não encontrada',
    }
  }

  const cityName = formatCityFromSlug(citySlug)
  const title = `${category.name} em ${cityName} | Página Local`
  const description = `Encontre as melhores ${category.name.toLowerCase()} em ${cityName}. Veja avaliações, endereços e entre em contato pelo WhatsApp. Profissionais verificados!`

  return {
    title,
    description,
    keywords: `${category.name.toLowerCase()}, ${category.name.toLowerCase()} ${cityName.toLowerCase()}, ${cityName.toLowerCase()}, ${category.seoKeywords?.slice(0, 5).join(', ') || ''}`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'Página Local',
      url: `https://paginalocal.com.br/${categorySlug}/${citySlug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://paginalocal.com.br/${categorySlug}/${citySlug}`,
    },
  }
}

export default async function CategoryCityPage({ params }: CategoryCityPageProps) {
  const { categorySlug, citySlug } = await params

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

  const [storesData, cities] = await Promise.all([
    getStoresByCategoryCity(categorySlug, citySlug, 50),
    getCategoryCities(categorySlug, 50),
  ])

  if (!storesData.cityName) {
    notFound()
  }

  const stats = {
    totalStores: storesData.total,
    totalCities: 1,
    avgRating: storesData.stores.length > 0
      ? (storesData.stores.reduce((acc, s) => acc + (Number(s.googleRating) || 0), 0) / storesData.stores.length).toFixed(1)
      : '0',
    totalReviews: storesData.stores.reduce((acc, s) => acc + (s.googleReviewsCount || 0), 0),
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${category.name} em ${storesData.cityName}`,
    description: `Lista de ${category.name.toLowerCase()} em ${storesData.cityName}`,
    numberOfItems: storesData.total,
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
        ...(store.latitude && store.longitude && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: store.latitude,
            longitude: store.longitude,
          },
        }),
        url: `https://${store.slug}.paginalocal.com.br`,
      },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Página Local',
        item: 'https://paginalocal.com.br',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: `https://paginalocal.com.br/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${category.name} em ${storesData.cityName}`,
        item: `https://paginalocal.com.br/${categorySlug}/${citySlug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <CategoryCityPageClient
        category={{
          name: category.name,
          slug: category.slug,
          faqs: category.faqs,
        }}
        stores={storesData.stores}
        stats={stats}
        cities={cities}
        cityName={storesData.cityName}
        citySlug={citySlug}
        isLoggedIn={isLoggedIn}
        hasSubscription={hasSubscription}
      />
    </>
  )
}
