'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storeProductCollection, store } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateCollectionSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const createCollectionSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
})

async function generateUniqueCollectionSlug(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: storeProductCollection.id })
      .from(storeProductCollection)
      .where(and(eq(storeProductCollection.storeId, storeId), eq(storeProductCollection.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const createCollectionAction = authActionClient
  .schema(createCollectionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category,
        city: store.city,
        state: store.state,
      })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [maxPosition] = await db
      .select({ max: sql<number>`COALESCE(MAX(${storeProductCollection.position}), 0)` })
      .from(storeProductCollection)
      .where(eq(storeProductCollection.storeId, parsedInput.storeId))

    const slug = await generateUniqueCollectionSlug(parsedInput.storeId, parsedInput.name)

    const [result] = await db
      .insert(storeProductCollection)
      .values({
        storeId: parsedInput.storeId,
        name: parsedInput.name,
        slug,
        description: parsedInput.description || null,
        imageUrl: parsedInput.imageUrl || null,
        isActive: parsedInput.isActive,
        position: (maxPosition?.max || 0) + 1,
      })
      .returning()

    revalidateStoreCache(storeResult.slug)

    try {
      const aiInput: MarketingCopyInput = {
        businessName: storeResult.name,
        category: storeResult.category,
        city: storeResult.city,
        state: storeResult.state,
      }

      const userDescription = parsedInput.description?.trim() || undefined
      const seo = await generateCollectionSeo(aiInput, parsedInput.name, userDescription)

      if (seo) {
        const [updated] = await db
          .update(storeProductCollection)
          .set({
            description: userDescription || seo.description,
            seoTitle: seo.seoTitle,
            seoDescription: seo.seoDescription,
            updatedAt: new Date(),
          })
          .where(eq(storeProductCollection.id, result.id))
          .returning()

        revalidateStoreCache(storeResult.slug)
        console.log(`[Collection] SEO gerado para "${parsedInput.name}"`)
        return updated
      }
    } catch (error) {
      console.error(`[Collection] Erro ao gerar SEO para "${parsedInput.name}":`, error)
    }

    return result
  })
