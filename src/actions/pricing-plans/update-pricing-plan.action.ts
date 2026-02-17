'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { storePricingPlan, store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'
import { generatePricingPlanSeo } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'

const updatePricingPlanSchema = z.object({
  planId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().nullable().optional(),
  priceInCents: z.number().int().positive().optional(),
  interval: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']).optional(),
  features: z.array(z.string()).optional(),
  isHighlighted: z.boolean().optional(),
  isActive: z.boolean().optional(),
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']).optional(),
  ctaLabel: z.string().max(80).optional(),
  ctaExternalUrl: z.string().url().nullable().optional(),
  ctaWhatsappMessage: z.string().nullable().optional(),
  position: z.number().int().min(0).optional(),
})

export const updatePricingPlanAction = authActionClient
  .schema(updatePricingPlanSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { planId, ...data } = parsedInput

    const planWithStore = await db
      .select({
        plan: storePricingPlan,
        storeSlug: store.slug,
        storeName: store.name,
        storeCategory: store.category,
        storeCity: store.city,
        storeState: store.state,
        userId: store.userId,
      })
      .from(storePricingPlan)
      .innerJoin(store, eq(storePricingPlan.storeId, store.id))
      .where(eq(storePricingPlan.id, planId))
      .limit(1)

    if (!planWithStore[0] || planWithStore[0].userId !== ctx.userId) {
      throw new Error('Plano não encontrado')
    }

    const storeInfo = planWithStore[0]

    const [result] = await db
      .update(storePricingPlan)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(storePricingPlan.id, planId))
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
        const seo = await generatePricingPlanSeo(
          aiInput, data.name!, userDescription, data.priceInCents, data.interval
        )

        if (seo) {
          const [updated] = await db
            .update(storePricingPlan)
            .set({
              description: userDescription || seo.description,
              updatedAt: new Date(),
            })
            .where(eq(storePricingPlan.id, planId))
            .returning()

          revalidateStoreCache(storeInfo.storeSlug)
          console.log(`[PricingPlan] Descrição regenerada para "${data.name}"`)
          return updated
        }
      } catch (error) {
        console.error(`[PricingPlan] Erro ao regenerar descrição:`, error)
      }
    }

    return result
  })
