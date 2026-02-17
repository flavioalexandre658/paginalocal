'use server'

import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const deleteProductSchema = z.object({
  productId: z.string().uuid(),
})

export const deleteProductAction = authActionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { productId } = parsedInput

    const productWithStore = await db
      .select({
        productId: storeProduct.id,
        storeId: storeProduct.storeId,
        userId: store.userId,
      })
      .from(storeProduct)
      .innerJoin(store, eq(storeProduct.storeId, store.id))
      .where(eq(storeProduct.id, productId))
      .limit(1)

    if (!productWithStore[0] || productWithStore[0].userId !== userId) {
      throw new Error('Produto não encontrado ou você não tem permissão para excluí-lo')
    }

    await db.delete(storeProduct).where(eq(storeProduct.id, productId))

    revalidateTag('store-data')
    revalidateTag(`store-products-${productWithStore[0].storeId}`)

    return { success: true }
  })
