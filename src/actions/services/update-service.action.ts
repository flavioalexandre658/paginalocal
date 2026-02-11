'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateSlug } from '@/lib/utils'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generateServiceSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const updateServiceSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  priceInCents: z.number().int().positive().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

async function generateUniqueServiceSlug(storeId: string, name: string, excludeId: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(
        eq(service.storeId, storeId),
        eq(service.slug, slug),
      ))
      .limit(1)

    if (!existing || existing.id === excludeId) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export const updateServiceAction = authActionClient
  .schema(updateServiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, storeId, ...data } = parsedInput

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
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: new Date(),
    }

    if (data.name) {
      updateData.slug = await generateUniqueServiceSlug(storeId, data.name, id)
    }

    const [result] = await db
      .update(service)
      .set(updateData)
      .where(and(eq(service.id, id), eq(service.storeId, storeId)))
      .returning()

    revalidateStoreCache(storeResult.slug)

    if (data.name) {
      try {
        const aiInput: MarketingCopyInput = {
          businessName: storeResult.name,
          category: storeResult.category,
          city: storeResult.city,
          state: storeResult.state,
        }

        const [seo] = await generateServiceSeo(aiInput, [data.name])

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
            .where(eq(service.id, id))
            .returning()

          revalidateStoreCache(storeResult.slug)
          console.log(`[Service] SEO regenerado para "${data.name}"`)
          return updated
        }
      } catch (error) {
        console.error(`[Service] Erro ao regenerar SEO para "${data.name}":`, error)
      }
    }

    return result
  })
