'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { pageview } from '@/db/schema'
import { eq, and, gte } from 'drizzle-orm'

const trackPageviewSchema = z.object({
  storeId: z.string().uuid(),
  device: z.enum(['mobile', 'desktop']).optional(),
  referrer: z.string().optional(),
  location: z.string().optional(),
  userAgent: z.string().optional(),
  sessionId: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
})

export const trackPageviewAction = actionClient
  .schema(trackPageviewSchema)
  .action(async ({ parsedInput }) => {
    if (parsedInput.sessionId) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      
      const existingPageview = await db
        .select({ id: pageview.id })
        .from(pageview)
        .where(
          and(
            eq(pageview.storeId, parsedInput.storeId),
            eq(pageview.sessionId, parsedInput.sessionId),
            gte(pageview.createdAt, thirtyMinutesAgo)
          )
        )
        .limit(1)

      if (existingPageview.length > 0) {
        // Retorna o ID da pageview existente para rastreamento de conversão
        return { id: existingPageview[0].id, deduplicated: true }
      }
    }

    const [result] = await db
      .insert(pageview)
      .values({
        storeId: parsedInput.storeId,
        device: parsedInput.device,
        referrer: parsedInput.referrer,
        location: parsedInput.location,
        userAgent: parsedInput.userAgent,
        sessionId: parsedInput.sessionId,
        utmSource: parsedInput.utmSource,
        utmMedium: parsedInput.utmMedium,
        utmCampaign: parsedInput.utmCampaign,
        utmTerm: parsedInput.utmTerm,
        utmContent: parsedInput.utmContent,
      })
      .returning()

    return { id: result.id, deduplicated: false }
  })
