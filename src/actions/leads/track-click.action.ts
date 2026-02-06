'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead, pageview, LeadTouchpoint } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

const trackClickSchema = z.object({
  storeId: z.string().uuid(),
  source: z.enum(['whatsapp', 'call', 'form', 'map']),
  device: z.enum(['mobile', 'desktop']).optional(),
  referrer: z.string().optional(),
  location: z.string().optional(),
  touchpoint: z.enum([
    'hero_whatsapp',
    'hero_call',
    'floating_whatsapp',
    'contact_call',
    'floating_bar_whatsapp',
    'floating_bar_call',
  ]).optional(),
  sessionId: z.string().optional(),
  pageviewId: z.string().uuid().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
})

export const trackClickAction = actionClient
  .schema(trackClickSchema)
  .action(async ({ parsedInput }) => {
    let pageviewsBeforeConversion: number | null = null

    if (parsedInput.sessionId) {
      const pageviewCount = await db
        .select({ count: count() })
        .from(pageview)
        .where(
          and(
            eq(pageview.storeId, parsedInput.storeId),
            eq(pageview.sessionId, parsedInput.sessionId)
          )
        )

      pageviewsBeforeConversion = pageviewCount[0]?.count || 0
    }

    const [result] = await db
      .insert(lead)
      .values({
        storeId: parsedInput.storeId,
        pageviewId: parsedInput.pageviewId,
        source: parsedInput.source,
        device: parsedInput.device,
        referrer: parsedInput.referrer,
        location: parsedInput.location,
        touchpoint: parsedInput.touchpoint as LeadTouchpoint,
        sessionId: parsedInput.sessionId,
        utmSource: parsedInput.utmSource,
        utmMedium: parsedInput.utmMedium,
        utmCampaign: parsedInput.utmCampaign,
        utmTerm: parsedInput.utmTerm,
        utmContent: parsedInput.utmContent,
        pageviewsBeforeConversion,
      })
      .returning()

    return result
  })
