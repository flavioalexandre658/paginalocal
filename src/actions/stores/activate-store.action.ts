'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const activateStoreSchema = z.object({
  storeId: z.string().uuid(),
})

export const activateStoreAction = authActionClient
  .schema(activateStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeData] = await db
      .select()
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (storeData.isActive) {
      return { success: true, alreadyActive: true }
    }

    await db
      .update(store)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))

    return { success: true, alreadyActive: false }
  })
