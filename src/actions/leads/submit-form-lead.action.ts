'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead } from '@/db/schema'

const submitFormLeadSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1).max(255),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  sessionId: z.string().optional(),
  pageviewId: z.string().uuid().optional(),
  device: z.enum(['mobile', 'desktop']).optional(),
  referrer: z.string().optional(),
})

export const submitFormLeadAction = actionClient
  .schema(submitFormLeadSchema)
  .action(async ({ parsedInput }) => {
    const [newLead] = await db
      .insert(lead)
      .values({
        storeId: parsedInput.storeId,
        name: parsedInput.name,
        email: parsedInput.email || null,
        phone: parsedInput.phone || null,
        message: parsedInput.message || null,
        source: 'form',
        sessionId: parsedInput.sessionId || null,
        pageviewId: parsedInput.pageviewId || null,
        device: parsedInput.device || null,
        referrer: parsedInput.referrer || null,
        isFromBlockedSite: false,
        isViewed: false,
      })
      .returning()

    return newLead
  })
