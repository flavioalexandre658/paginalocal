'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const reorderServicesSchema = z.object({
  storeId: z.string().uuid(),
  items: z.array(z.object({
    id: z.string().uuid(),
    position: z.number().int(),
  })),
})

export const reorderServicesAction = authActionClient
  .schema(reorderServicesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const updates = parsedInput.items.map(item =>
      db
        .update(service)
        .set({ position: item.position, updatedAt: new Date() })
        .where(and(eq(service.id, item.id), eq(service.storeId, parsedInput.storeId)))
    )

    await Promise.all(updates)

    return { success: true }
  })
