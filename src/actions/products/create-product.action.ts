'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateProductSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const createProductSchema = z.object({
  storeId: z.string().uuid(),
  collectionId: z.string().uuid().optional().nullable(),
  name: z.string().min(1, 'Nome é obrigatório').max(255),
  description: z.string().optional(),
  priceInCents: z.number().int().positive('Preço deve ser maior que zero'),
  originalPriceInCents: z.number().int().positive().optional(),
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']).default('WHATSAPP'),
  ctaLabel: z.string().max(80).optional(),
  ctaExternalUrl: z.string().url().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).default('ACTIVE'),
  isFeatured: z.boolean().default(false),
})

async function generateUniqueProductSlug(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: storeProduct.id })
      .from(storeProduct)
      .where(and(eq(storeProduct.storeId, storeId), eq(storeProduct.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const createProductAction = authActionClient
  .schema(createProductSchema)
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
      .select({ max: sql<number>`COALESCE(MAX(${storeProduct.position}), 0)` })
      .from(storeProduct)
      .where(eq(storeProduct.storeId, parsedInput.storeId))

    const slug = await generateUniqueProductSlug(parsedInput.storeId, parsedInput.name)

    const [result] = await db
      .insert(storeProduct)
      .values({
        ...parsedInput,
        slug,
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
      const seo = await generateProductSeo(aiInput, parsedInput.name, userDescription, parsedInput.priceInCents)

      if (seo) {
        const [updated] = await db
          .update(storeProduct)
          .set({
            description: userDescription || seo.description,
            seoTitle: seo.seoTitle,
            seoDescription: seo.seoDescription,
            longDescription: seo.longDescription,
            updatedAt: new Date(),
          })
          .where(eq(storeProduct.id, result.id))
          .returning()

        revalidateStoreCache(storeResult.slug)
        console.log(`[Product] SEO gerado para "${parsedInput.name}"`)
        return updated
      }
    } catch (error) {
      console.error(`[Product] Erro ao gerar SEO para "${parsedInput.name}":`, error)
    }

    return result
  })
