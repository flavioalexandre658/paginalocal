'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead } from '@/db/schema'

const captureBlockedLeadSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(2, 'Nome é obrigatório'),
  phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido'),
  source: z.enum(['whatsapp', 'phone']),
})

export const captureBlockedLeadAction = actionClient
  .schema(captureBlockedLeadSchema)
  .action(async ({ parsedInput }) => {
    const blockedSource = `blocked_${parsedInput.source}` as const

    const [newLead] = await db
      .insert(lead)
      .values({
        storeId: parsedInput.storeId,
        name: parsedInput.name,
        phone: parsedInput.phone,
        source: blockedSource,
        isFromBlockedSite: true,
        isViewed: false,
      })
      .returning()

    return newLead
  })
