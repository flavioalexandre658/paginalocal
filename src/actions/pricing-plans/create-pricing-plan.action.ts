'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storePricingPlan, store } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generatePricingPlanSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const createPricingPlanSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().optional(),
  priceInCents: z.number().int().positive('Preço deve ser maior que zero'),
  interval: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']).default('MONTHLY'),
  features: z.array(z.string()).optional(),
  isHighlighted: z.boolean().default(false),
  isActive: z.boolean().default(true),
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']).default('WHATSAPP'),
  ctaLabel: z.string().max(80).optional(),
  ctaExternalUrl: z.string().url().optional(),
  ctaWhatsappMessage: z.string().optional(),
})

export const createPricingPlanAction = authActionClient
  .schema(createPricingPlanSchema)
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
      .select({ max: sql<number>`COALESCE(MAX(${storePricingPlan.position}), 0)` })
      .from(storePricingPlan)
      .where(eq(storePricingPlan.storeId, parsedInput.storeId))

    const [result] = await db
      .insert(storePricingPlan)
      .values({
        ...parsedInput,
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
      const seo = await generatePricingPlanSeo(
        aiInput, parsedInput.name, userDescription, parsedInput.priceInCents, parsedInput.interval
      )

      if (seo) {
        const [updated] = await db
          .update(storePricingPlan)
          .set({
            description: userDescription || seo.description,
            updatedAt: new Date(),
          })
          .where(eq(storePricingPlan.id, result.id))
          .returning()

        revalidateStoreCache(storeResult.slug)
        console.log(`[PricingPlan] Descrição gerada para "${parsedInput.name}"`)
        return updated
      }
    } catch (error) {
      console.error(`[PricingPlan] Erro ao gerar descrição para "${parsedInput.name}":`, error)
    }

    return result
  })
