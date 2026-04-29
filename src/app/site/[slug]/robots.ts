import { MetadataRoute } from 'next'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface RobotsParams {
  params: Promise<{ slug: string }>
}

const SOCIAL_CRAWLERS = [
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
]

export default async function robots({ params }: RobotsParams): Promise<MetadataRoute.Robots> {
  const { slug } = await params

  const storeResult = await db
    .select({ customDomain: store.customDomain, isActive: store.isActive })
    .from(store)
    .where(eq(store.slug, slug))
    .limit(1)

  if (!storeResult[0]) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }

  const baseUrl = storeResult[0].customDomain
    ? `https://${storeResult[0].customDomain}`
    : `https://${slug}.decolou.com`

  if (!storeResult[0].isActive) {
    return {
      rules: [
        {
          userAgent: SOCIAL_CRAWLERS,
          allow: '/',
        },
        {
          userAgent: '*',
          disallow: '/',
        },
      ],
    }
  }

  return {
    rules: [
      {
        userAgent: SOCIAL_CRAWLERS,
        allow: '/',
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
