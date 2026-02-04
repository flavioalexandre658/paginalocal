'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'

const createServiceSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  priceInCents: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
})

export const createServiceAction = authActionClient
  .schema(createServiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [maxPosition] = await db
      .select({ max: sql<number>`COALESCE(MAX(${service.position}), 0)` })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    const [result] = await db
      .insert(service)
      .values({
        ...parsedInput,
        position: (maxPosition?.max || 0) + 1,
      })
      .returning()

    return result
  })
