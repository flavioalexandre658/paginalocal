'use server'

import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq } from 'drizzle-orm'

const getProductSchema = z.object({
  productId: z.string().uuid(),
})

export const getProductAction = authActionClient
  .schema(getProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { productId } = parsedInput

    const productWithStore = await db
      .select({
        product: storeProduct,
        userId: store.userId,
      })
      .from(storeProduct)
      .innerJoin(store, eq(storeProduct.storeId, store.id))
      .where(eq(storeProduct.id, productId))
      .limit(1)

    if (!productWithStore[0] || productWithStore[0].userId !== userId) {
      throw new Error('Produto não encontrado ou você não tem permissão para acessá-lo')
    }

    return productWithStore[0].product
  })
