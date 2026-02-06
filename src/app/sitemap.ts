import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { eq, ne, and } from 'drizzle-orm'
import { generateCitySlug } from '@/lib/utils'

// Garante que o sitemap seja sempre gerado dinamicamente
export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://paginalocal.com.br'

const STATIC_PAGES = [
  {
    path: '',
    changeFrequency: 'weekly' as const,
    priority: 1,
  },
  {
    path: '/planos',
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  },
  {
    path: '/sobre-nos',
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
  {
    path: '/contato',
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  },
  {
    path: '/politica-de-privacidade',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
  {
    path: '/termos-de-uso',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
  {
    path: '/lgpd',
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))

  const [activeStores, categories, categoryCityCombinations] = await Promise.all([
    db
      .select({
        slug: store.slug,
        customDomain: store.customDomain,
        updatedAt: store.updatedAt,
      })
      .from(store)
      .where(eq(store.isActive, true)),
    
    db
      .select({
        slug: category.slug,
      })
      .from(category)
      .where(ne(category.slug, 'outro')),
    
    db
      .selectDistinct({
        categorySlug: category.slug,
        city: store.city,
      })
      .from(store)
      .innerJoin(category, eq(store.category, category.name))
      .where(and(eq(store.isActive, true), ne(category.slug, 'outro'))),
  ])

  const storePages: MetadataRoute.Sitemap = activeStores.map((s) => {
    const storeUrl = s.customDomain
      ? `https://${s.customDomain}`
      : `https://${s.slug}.paginalocal.com.br`

    return {
      url: storeUrl,
      lastModified: s.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryCityPages: MetadataRoute.Sitemap = categoryCityCombinations.map((cc) => ({
    url: `${BASE_URL}/${cc.categorySlug}/${generateCitySlug(cc.city)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...categoryCityPages, ...storePages]
}
