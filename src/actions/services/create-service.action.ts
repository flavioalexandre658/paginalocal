'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateServiceSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const createServiceSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  priceInCents: z.number().int().positive().optional(),
  imageUrl: z.string().optional(),
})

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

export const createServiceAction = authActionClient
  .schema(createServiceSchema)
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
      .select({ max: sql<number>`COALESCE(MAX(${service.position}), 0)` })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    const slug = await generateUniqueServiceSlug(parsedInput.storeId, parsedInput.name)

    const [result] = await db
      .insert(service)
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

      const [seo] = await generateServiceSeo(aiInput, [parsedInput.name])

      if (seo) {
        const [updated] = await db
          .update(service)
          .set({
            description: seo.description,
            seoTitle: seo.seoTitle,
            seoDescription: seo.seoDescription,
            longDescription: seo.longDescription,
            updatedAt: new Date(),
          })
          .where(eq(service.id, result.id))
          .returning()

        revalidateStoreCache(storeResult.slug)
        console.log(`[Service] SEO gerado para "${parsedInput.name}"`)
        return updated
      }
    } catch (error) {
      console.error(`[Service] Erro ao gerar SEO para "${parsedInput.name}":`, error)
    }

    return result
  })
