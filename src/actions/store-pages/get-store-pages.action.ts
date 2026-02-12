'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storePage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const getStorePagesSchema = z.object({
  storeId: z.string().uuid(),
})

export const getStorePagesAction = authActionClient
  .schema(getStorePagesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId } = parsedInput

    const [storeData] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const pages = await db
      .select()
      .from(storePage)
      .where(eq(storePage.storeId, storeId))

    return pages
  })
