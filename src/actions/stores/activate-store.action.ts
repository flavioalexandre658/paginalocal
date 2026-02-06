'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'
import { notifyStoreActivated } from '@/lib/google-indexing'

const activateStoreSchema = z.object({
  storeId: z.string().uuid(),
})

export const activateStoreAction = authActionClient
  .schema(activateStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeData] = await db
      .select()
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (storeData.isActive) {
      return { success: true, alreadyActive: true }
    }

    await db
      .update(store)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))

    // Notifica o Google sobre a ativação
    notifyStoreActivated(storeData.slug, storeData.customDomain).catch((error) => {
      console.error(`[ActivateStore] Erro ao notificar Google sobre ativação de ${storeData.slug}:`, error)
    })

    // Revalida o sitemap
    await revalidateSitemap()

    // Busca o slug da categoria e revalida páginas de categoria/cidade
    const [categoryData] = await db
      .select({ slug: category.slug })
      .from(category)
      .where(eq(category.name, storeData.category))
      .limit(1)

    if (categoryData) {
      await revalidateCategoryPages(categoryData.slug, generateCitySlug(storeData.city))
    }

    return { success: true, alreadyActive: false }
  })
