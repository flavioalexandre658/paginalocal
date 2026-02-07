'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

const toggleStoreStatusSchema = z.object({
  storeId: z.string().uuid(),
  isActive: z.boolean(),
})

export const toggleStoreStatusAction = adminActionClient
  .schema(toggleStoreStatusSchema)
  .action(async ({ parsedInput }) => {
    const { storeId, isActive } = parsedInput

    const [result] = await db
      .update(store)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    return result
  })
