'use server'

import { db } from '@/db'
import { storeProductCollection, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const reorderCollectionsSchema = z.object({
  storeId: z.string().uuid(),
  collectionIds: z.array(z.string().uuid()).min(1),
})

export const reorderCollectionsAction = authActionClient
  .schema(reorderCollectionsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, collectionIds } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para reordenar coleções desta loja')
    }

    const collections = await db
      .select({ id: storeProductCollection.id })
      .from(storeProductCollection)
      .where(and(
        eq(storeProductCollection.storeId, storeId),
        inArray(storeProductCollection.id, collectionIds)
      ))

    if (collections.length !== collectionIds.length) {
      throw new Error('Algumas coleções não pertencem a esta loja')
    }

    for (let i = 0; i < collectionIds.length; i++) {
      await db
        .update(storeProductCollection)
        .set({
          position: i,
          updatedAt: new Date(),
        })
        .where(eq(storeProductCollection.id, collectionIds[i]))
    }

    revalidateTag('store-data')
    revalidateTag(`store-collections-${storeId}`)

    return { success: true }
  })
