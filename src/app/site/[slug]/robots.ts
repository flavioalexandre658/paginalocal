import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface RobotsParams {
  params: Promise<{ slug: string }>
}

export default async function robots({ params }: RobotsParams): Promise<MetadataRoute.Robots> {
  const { slug } = await params

  const storeResult = await db
    .select({ customDomain: store.customDomain, isActive: store.isActive })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeResult[0] || !storeResult[0].isActive) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  const baseUrl = storeResult[0].customDomain
    ? `https://${storeResult[0].customDomain}`
    : `https://${slug}.paginalocal.com.br`

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
