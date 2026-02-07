'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'

const deleteStoreAdminSchema = z.object({
  storeId: z.string().uuid(),
})

export const deleteStoreAdminAction = adminActionClient
  .schema(deleteStoreAdminSchema)
  .action(async ({ parsedInput }) => {
    const { storeId } = parsedInput

    const [result] = await db
      .delete(store)
      .where(eq(store.id, storeId))
      .returning()

    return result
  })
