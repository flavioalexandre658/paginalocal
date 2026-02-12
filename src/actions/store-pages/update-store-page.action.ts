'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storePage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const updateStorePageSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  content: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  isActive: z.boolean().optional(),
})

export const updateStorePageAction = authActionClient
  .schema(updateStorePageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, storeId, ...data } = parsedInput

    const [storeData] = await db
      .select({ id: store.id, slug: store.slug })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .update(storePage)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(storePage.id, id), eq(storePage.storeId, storeId)))
      .returning()

    revalidateStoreCache(storeData.slug)

    return result
  })
