'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const changeStoreCategorySchema = z.object({
  storeId: z.string().uuid(),
  categoryId: z.string().uuid(),
})

export const changeStoreCategoryAction = adminActionClient
  .schema(changeStoreCategorySchema)
  .action(async ({ parsedInput }) => {
    const { storeId, categoryId } = parsedInput

    const [categoryData] = await db
      .select({ id: category.id, name: category.name })
      .from(category)
      .where(eq(category.id, categoryId))
      .limit(1)

    if (!categoryData) {
      throw new Error('Categoria não encontrada')
    }

    const [storeData] = await db
      .select({ id: store.id, slug: store.slug })
      .from(store)
      .where(eq(store.id, storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .update(store)
      .set({
        category: categoryData.name,
        categoryId: categoryData.id,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    revalidateStoreCache(storeData.slug)

    return result
  })
