'use server'

import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, asc } from 'drizzle-orm'

const getProductsSchema = z.object({
  storeId: z.string().uuid(),
  collectionId: z.string().uuid().optional(),
  includeInactive: z.boolean().default(false),
})

export const getProductsAction = authActionClient
  .schema(getProductsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, collectionId, includeInactive } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para acessar esta loja')
    }

    const conditions = [eq(storeProduct.storeId, storeId)]
    
    if (collectionId) {
      conditions.push(eq(storeProduct.collectionId, collectionId))
    }
    
    if (!includeInactive) {
      conditions.push(eq(storeProduct.status, 'ACTIVE'))
    }

    const products = await db
      .select()
      .from(storeProduct)
      .where(and(...conditions))
      .orderBy(asc(storeProduct.position), asc(storeProduct.createdAt))

    return products
  })
