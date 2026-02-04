import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

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

  const activeStores = await db
    .select({
      slug: store.slug,
      customDomain: store.customDomain,
      updatedAt: store.updatedAt,
    })
    .from(store)
    .where(eq(store.isActive, true))

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

  return [...staticPages, ...storePages]
}
