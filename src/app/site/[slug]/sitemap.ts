import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

interface SitemapParams {
  params: Promise<{ slug: string }>
}

export default async function sitemap({ params }: SitemapParams): Promise<MetadataRoute.Sitemap> {
  const { slug } = await params

  const storeResult = await db
    .select({ id: store.id, customDomain: store.customDomain, updatedAt: store.updatedAt })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeResult[0]) {
    return []
  }

  const baseUrl = storeResult[0].customDomain
    ? `https://${storeResult[0].customDomain}`
    : `https://${slug}.paginalocal.com.br`

  const storeServices = await db
    .select({ slug: service.slug, updatedAt: service.updatedAt })
    .from(service)
    .where(and(eq(service.storeId, storeResult[0].id), eq(service.isActive, true)))

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: storeResult[0].updatedAt,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  for (const svc of storeServices) {
    if (!svc.slug) continue
    entries.push({
      url: `${baseUrl}/servicos/${svc.slug}`,
      lastModified: svc.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  return entries
}
