'use server'

import { db } from '@/db'
import { storeProductCollection, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, asc } from 'drizzle-orm'

const getCollectionsSchema = z.object({
  storeId: z.string().uuid(),
  includeInactive: z.boolean().default(false),
})

export const getCollectionsAction = authActionClient
  .schema(getCollectionsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, includeInactive } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para acessar esta loja')
    }

    const conditions = [eq(storeProductCollection.storeId, storeId)]
    
    if (!includeInactive) {
      conditions.push(eq(storeProductCollection.isActive, true))
    }

    const collections = await db
      .select()
      .from(storeProductCollection)
      .where(and(...conditions))
      .orderBy(asc(storeProductCollection.position), asc(storeProductCollection.createdAt))

    return collections
  })
