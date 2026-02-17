'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storeProductCollection, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateCollectionSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const updateCollectionSchema = z.object({
  collectionId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

async function generateUniqueCollectionSlug(storeId: string, name: string, excludeId: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: storeProductCollection.id })
      .from(storeProductCollection)
      .where(and(eq(storeProductCollection.storeId, storeId), eq(storeProductCollection.slug, slug)))
      .limit(1)

    if (!existing || existing.id === excludeId) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const updateCollectionAction = authActionClient
  .schema(updateCollectionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { collectionId, ...data } = parsedInput

    const collectionWithStore = await db
      .select({
        collection: storeProductCollection,
        storeSlug: store.slug,
        storeName: store.name,
        storeCategory: store.category,
        storeCity: store.city,
        storeState: store.state,
        userId: store.userId,
      })
      .from(storeProductCollection)
      .innerJoin(store, eq(storeProductCollection.storeId, store.id))
      .where(eq(storeProductCollection.id, collectionId))
      .limit(1)

    if (!collectionWithStore[0] || collectionWithStore[0].userId !== ctx.userId) {
      throw new Error('Coleção não encontrada')
    }

    const storeInfo = collectionWithStore[0]
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    if (data.name) {
      updateData.slug = await generateUniqueCollectionSlug(
        storeInfo.collection.storeId, data.name, collectionId
      )
    }

    const [result] = await db
      .update(storeProductCollection)
      .set(updateData)
      .where(eq(storeProductCollection.id, collectionId))
      .returning()

    revalidateStoreCache(storeInfo.storeSlug)

    const shouldRegenerateAi = !!data.name
    if (shouldRegenerateAi) {
      try {
        const aiInput: MarketingCopyInput = {
          businessName: storeInfo.storeName,
          category: storeInfo.storeCategory,
          city: storeInfo.storeCity,
          state: storeInfo.storeState,
        }

        const userDescription = (data.description && data.description.trim()) || undefined
        const seo = await generateCollectionSeo(aiInput, data.name!, userDescription)

        if (seo) {
          const [updated] = await db
            .update(storeProductCollection)
            .set({
              description: userDescription || seo.description,
              seoTitle: seo.seoTitle,
              seoDescription: seo.seoDescription,
              updatedAt: new Date(),
            })
            .where(eq(storeProductCollection.id, collectionId))
            .returning()

          revalidateStoreCache(storeInfo.storeSlug)
          console.log(`[Collection] SEO regenerado para "${data.name}"`)
          return updated
        }
      } catch (error) {
        console.error(`[Collection] Erro ao regenerar SEO:`, error)
      }
    }

    return result
  })
