'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateMarketingCopy } from '@/lib/gemini'
import { generateSlug } from '@/lib/utils'

async function generateUniqueServiceSlug(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

const regenerateStoreContentSchema = z.object({
  storeId: z.string().uuid(),
})

export const regenerateStoreContentAction = adminActionClient
  .schema(regenerateStoreContentSchema)
  .action(async ({ parsedInput }) => {
    const [storeData] = await db
      .select()
      .from(store)
      .where(eq(store.id, parsedInput.storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const marketingCopy = await generateMarketingCopy({
      businessName: storeData.name,
      category: storeData.category,
      city: storeData.city,
      state: storeData.state,
      rating: storeData.googleRating ? parseFloat(storeData.googleRating) : undefined,
      reviewCount: storeData.googleReviewsCount || undefined,
    })

    const [updatedStore] = await db
      .update(store)
      .set({
        heroTitle: marketingCopy.heroTitle,
        heroSubtitle: marketingCopy.heroSubtitle,
        description: marketingCopy.aboutSection,
        seoTitle: marketingCopy.seoTitle,
        seoDescription: marketingCopy.seoDescription,
        faq: marketingCopy.faq,
        neighborhoods: marketingCopy.neighborhoods,
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))
      .returning()

    await db
      .delete(service)
      .where(eq(service.storeId, parsedInput.storeId))

    if (marketingCopy.services && marketingCopy.services.length > 0) {
      for (let i = 0; i < marketingCopy.services.length; i++) {
        const svc = marketingCopy.services[i]
        const slug = await generateUniqueServiceSlug(parsedInput.storeId, svc.name)
        await db.insert(service).values({
          storeId: parsedInput.storeId,
          name: svc.name,
          slug,
          description: svc.description,
          seoTitle: svc.seoTitle || null,
          seoDescription: svc.seoDescription || null,
          longDescription: svc.longDescription || null,
          position: i + 1,
          isActive: true,
        })
      }
    }

    return {
      store: updatedStore,
      servicesCreated: marketingCopy.services?.length || 0,
    }
  })
