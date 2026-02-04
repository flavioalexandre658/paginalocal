'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const updateServiceSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priceInCents: z.number().int().positive().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export const updateServiceAction = authActionClient
  .schema(updateServiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, storeId, ...data } = parsedInput

    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .update(service)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(service.id, id), eq(service.storeId, storeId)))
      .returning()

    return result
  })
