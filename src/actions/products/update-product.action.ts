'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storeProduct, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateProductSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const updateProductSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  collectionId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
  longDescription: z.string().nullable().optional(),
  priceInCents: z.number().int().positive().optional(),
  originalPriceInCents: z.number().int().positive().nullable().optional(),
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']).optional(),
  ctaLabel: z.string().max(80).optional(),
  ctaExternalUrl: z.string().url().nullable().optional(),
  ctaWhatsappMessage: z.string().nullable().optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  status: z.enum(['ACTIVE', 'DRAFT', 'OUT_OF_STOCK']).optional(),
  isFeatured: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
})

async function generateUniqueProductSlug(storeId: string, name: string, excludeId: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: storeProduct.id })
      .from(storeProduct)
      .where(and(eq(storeProduct.storeId, storeId), eq(storeProduct.slug, slug)))
      .limit(1)

    if (!existing || existing.id === excludeId) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const updateProductAction = authActionClient
  .schema(updateProductSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { productId, ...data } = parsedInput

    const productWithStore = await db
      .select({
        product: storeProduct,
        storeSlug: store.slug,
        storeName: store.name,
        storeCategory: store.category,
        storeCity: store.city,
        storeState: store.state,
        userId: store.userId,
      })
      .from(storeProduct)
      .innerJoin(store, eq(storeProduct.storeId, store.id))
      .where(eq(storeProduct.id, productId))
      .limit(1)

    if (!productWithStore[0] || productWithStore[0].userId !== ctx.userId) {
      throw new Error('Produto não encontrado')
    }

    const storeInfo = productWithStore[0]
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    if (data.name) {
      updateData.slug = await generateUniqueProductSlug(
        storeInfo.product.storeId, data.name, productId
      )
    }

    const [result] = await db
      .update(storeProduct)
      .set(updateData)
      .where(eq(storeProduct.id, productId))
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
        const seo = await generateProductSeo(aiInput, data.name!, userDescription, data.priceInCents)

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
            .where(eq(storeProduct.id, productId))
            .returning()

          revalidateStoreCache(storeInfo.storeSlug)
          console.log(`[Product] SEO regenerado para "${data.name}"`)
          return updated
        }
      } catch (error) {
        console.error(`[Product] Erro ao regenerar SEO:`, error)
      }
    }

    return result
  })
