import { MetadataRoute } from 'next'
import { db } from '@/db'
import {
  store,
  service,
  storePage,
  storeProduct,
  storeProductCollection,
} from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { getStoreSections, getActiveSections } from '@/lib/store-sections'

export const dynamic = 'force-dynamic'
export const revalidate = 60

interface SitemapParams {
  params: Promise<{ slug: string }>
}

export default async function sitemap({
  params,
}: SitemapParams): Promise<MetadataRoute.Sitemap> {
  const { slug } = await params

  const storeResult = await db
    .select()
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeResult[0]) {
    return []
  }

  const storeData = storeResult[0]
  const storeId = storeData.id
  const updatedAt = storeData.updatedAt

  const baseUrl = storeData.customDomain
    ? `https://${storeData.customDomain}`
    : `https://${slug}.decolou.com`

  const sections = getStoreSections(storeData)
  const activeSectionTypes = new Set(
    getActiveSections(sections).map((s) => s.type)
  )

  const [storeServices, storePages, products, collections] = await Promise.all([
    db
      .select({ slug: service.slug, updatedAt: service.updatedAt })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.isActive, true))),

    db
      .select({
        slug: storePage.slug,
        updatedAt: storePage.updatedAt,
        type: storePage.type,
      })
      .from(storePage)
      .where(
        and(eq(storePage.storeId, storeId), eq(storePage.isActive, true))
      ),

    db
      .select({ slug: storeProduct.slug, updatedAt: storeProduct.updatedAt })
      .from(storeProduct)
      .where(
        and(eq(storeProduct.storeId, storeId), eq(storeProduct.status, 'ACTIVE'))
      ),

    db
      .select({
        slug: storeProductCollection.slug,
        updatedAt: storeProductCollection.updatedAt,
      })
      .from(storeProductCollection)
      .where(
        and(
          eq(storeProductCollection.storeId, storeId),
          eq(storeProductCollection.isActive, true)
        )
      ),
  ])

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: updatedAt,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  if (activeSectionTypes.has('PRODUCTS') || products.length > 0) {
    entries.push({
      url: `${baseUrl}/catalogo`,
      lastModified: updatedAt,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  }

  if (activeSectionTypes.has('PRICING_PLANS')) {
    entries.push({
      url: `${baseUrl}/planos`,
      lastModified: updatedAt,
      changeFrequency: 'monthly',
      priority: 0.85,
    })
  }

  for (const p of storePages) {
    const path =
      p.type === 'ABOUT'
        ? '/sobre-nos'
        : p.type === 'CONTACT'
          ? '/contato'
          : `/${p.slug}`
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  for (const svc of storeServices) {
    if (!svc.slug) continue
    entries.push({
      url: `${baseUrl}/servicos/${svc.slug}`,
      lastModified: svc.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  for (const col of collections) {
    if (!col.slug) continue
    entries.push({
      url: `${baseUrl}/catalogo/${col.slug}`,
      lastModified: col.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const product of products) {
    if (!product.slug) continue
    entries.push({
      url: `${baseUrl}/produto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.65,
    })
  }

  return entries
}
