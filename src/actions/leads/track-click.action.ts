'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead, LeadTouchpoint } from '@/db/schema'

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
})

export const trackClickAction = actionClient
  .schema(trackClickSchema)
  .action(async ({ parsedInput }) => {
    const [result] = await db
      .insert(lead)
      .values({
        storeId: parsedInput.storeId,
        source: parsedInput.source,
        device: parsedInput.device,
        referrer: parsedInput.referrer,
        location: parsedInput.location,
        touchpoint: parsedInput.touchpoint as LeadTouchpoint,
      })
      .returning()

    return result
  })
