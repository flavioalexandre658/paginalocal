'use server'

import { db } from '@/db'
import { storeProductCollection, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const deleteCollectionSchema = z.object({
  collectionId: z.string().uuid(),
})

export const deleteCollectionAction = authActionClient
  .schema(deleteCollectionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { collectionId } = parsedInput

    const collectionWithStore = await db
      .select({
        collectionId: storeProductCollection.id,
        storeId: storeProductCollection.storeId,
        userId: store.userId,
      })
      .from(storeProductCollection)
      .innerJoin(store, eq(storeProductCollection.storeId, store.id))
      .where(eq(storeProductCollection.id, collectionId))
      .limit(1)

    if (!collectionWithStore[0] || collectionWithStore[0].userId !== userId) {
      throw new Error('Coleção não encontrada ou você não tem permissão para excluí-la')
    }

    await db.delete(storeProductCollection).where(eq(storeProductCollection.id, collectionId))

    revalidateTag('store-data')
    revalidateTag(`store-collections-${collectionWithStore[0].storeId}`)

    return { success: true }
  })
