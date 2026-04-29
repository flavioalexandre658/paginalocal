import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface RobotsParams {
  params: Promise<{ slug: string }>
}

const SOCIAL_AND_SEARCH_CRAWLERS = [
  'facebookexternalhit',
  'Facebot',
  'WhatsApp',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'Slackbot-LinkExpanding',
  'TelegramBot',
  'Discordbot',
  'Pinterestbot',
  'Applebot',
  'Iframely',
  'Embedly',
  'SkypeUriPreview',
  'Redditbot',
  'Tumblr',
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'AdsBot-Google',
  'bingbot',
  'DuckDuckBot',
  'YandexBot',
]

export default async function robots({ params }: RobotsParams): Promise<MetadataRoute.Robots> {
  const { slug } = await params

  const storeResult = await db
    .select({ customDomain: store.customDomain, isActive: store.isActive })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  const baseUrl = storeResult[0]?.customDomain
    ? `https://${storeResult[0].customDomain}`
    : `https://${slug}.decolou.com`

  return {
    rules: [
      {
        userAgent: SOCIAL_AND_SEARCH_CRAWLERS,
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
