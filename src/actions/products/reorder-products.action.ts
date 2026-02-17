'use server'

import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const reorderProductsSchema = z.object({
  storeId: z.string().uuid(),
  productIds: z.array(z.string().uuid()).min(1),
})

export const reorderProductsAction = authActionClient
  .schema(reorderProductsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, productIds } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para reordenar produtos desta loja')
    }

    const products = await db
      .select({ id: storeProduct.id })
      .from(storeProduct)
      .where(and(eq(storeProduct.storeId, storeId), inArray(storeProduct.id, productIds)))

    if (products.length !== productIds.length) {
      throw new Error('Alguns produtos não pertencem a esta loja')
    }

    for (let i = 0; i < productIds.length; i++) {
      await db
        .update(storeProduct)
        .set({
          position: i,
          updatedAt: new Date(),
        })
        .where(eq(storeProduct.id, productIds[i]))
    }

    revalidateTag('store-data')
    revalidateTag(`store-products-${storeId}`)

    return { success: true }
  })
