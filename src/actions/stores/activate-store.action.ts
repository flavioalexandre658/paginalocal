'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, category } from '@/db/schema'
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

    const services = await db
      .select({ slug: service.slug })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    const serviceSlugs = services
      .map(s => s.slug)
      .filter((slug): slug is string => !!slug)

    notifyStoreActivated(storeData.slug, storeData.customDomain, serviceSlugs).catch((error) => {
      console.error(`[ActivateStore] Erro ao notificar Google sobre ativação de ${storeData.slug}:`, error)
    })

    await revalidateSitemap()

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
