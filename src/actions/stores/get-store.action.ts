'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const getStoreSchema = z.object({
  id: z.string().uuid(),
})

export const getStoreAction = authActionClient
  .schema(getStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [result] = await db
      .select()
      .from(store)
      .where(and(eq(store.id, parsedInput.id), eq(store.userId, ctx.userId)))
      .limit(1)

    return result || null
  })
