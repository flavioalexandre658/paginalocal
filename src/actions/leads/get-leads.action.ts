'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead, store } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'

const getLeadsSchema = z.object({
  storeId: z.string().uuid(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  limit: z.number().int().positive().optional().default(100),
})

export const getLeadsAction = authActionClient
  .schema(getLeadsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const result = await db
      .select()
      .from(lead)
      .where(eq(lead.storeId, parsedInput.storeId))
      .orderBy(desc(lead.createdAt))
      .limit(parsedInput.limit)

    return result
  })
