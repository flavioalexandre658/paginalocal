'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const deleteServiceSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
})

export const deleteServiceAction = authActionClient
  .schema(deleteServiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id, slug: store.slug })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .delete(service)
      .where(and(eq(service.id, parsedInput.id), eq(service.storeId, parsedInput.storeId)))
      .returning()

    revalidateStoreCache(storeResult.slug)

    return result
  })
