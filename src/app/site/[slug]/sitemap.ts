import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface SitemapParams {
  params: Promise<{ slug: string }>
}

export default async function sitemap({ params }: SitemapParams): Promise<MetadataRoute.Sitemap> {
  const { slug } = await params

  const storeResult = await db
    .select({ customDomain: store.customDomain, updatedAt: store.updatedAt })
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
    .select({ id: service.id, updatedAt: service.updatedAt })
    .from(service)
    .innerJoin(store, eq(service.storeId, store.id))
    .where(eq(store.slug, slug))

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: storeResult[0].updatedAt,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/servicos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  storeServices.forEach(svc => {
    sitemap.push({
      url: `${baseUrl}/servicos/${svc.id}`,
      lastModified: svc.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    })
  })

  return sitemap
}
