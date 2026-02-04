'use server'

import { db } from '@/db'
import { store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const validateStoreOwnershipSchema = z.object({
  slug: z.string().min(1),
})

export const validateStoreOwnershipAction = authActionClient
  .schema(validateStoreOwnershipSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { slug } = parsedInput

    const storeData = await db
      .select({
        id: store.id,
        name: store.name,
        slug: store.slug,
        userId: store.userId,
      })
      .from(store)
      .where(and(eq(store.slug, slug), eq(store.userId, userId)))
      .limit(1)

    if (!storeData[0]) {
      return { authorized: false, store: null }
    }

    return { authorized: true, store: storeData[0] }
  })
