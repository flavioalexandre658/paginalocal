'use server'

import { db } from '@/db'
import { storePricingPlan, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const reorderPricingPlansSchema = z.object({
  storeId: z.string().uuid(),
  planIds: z.array(z.string().uuid()).min(1),
})

export const reorderPricingPlansAction = authActionClient
  .schema(reorderPricingPlansSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, planIds } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para reordenar planos desta loja')
    }

    const plans = await db
      .select({ id: storePricingPlan.id })
      .from(storePricingPlan)
      .where(and(
        eq(storePricingPlan.storeId, storeId),
        inArray(storePricingPlan.id, planIds)
      ))

    if (plans.length !== planIds.length) {
      throw new Error('Alguns planos não pertencem a esta loja')
    }

    for (let i = 0; i < planIds.length; i++) {
      await db
        .update(storePricingPlan)
        .set({
          position: i,
          updatedAt: new Date(),
        })
        .where(eq(storePricingPlan.id, planIds[i]))
    }

    revalidateTag('store-data')
    revalidateTag(`store-pricing-plans-${storeId}`)

    return { success: true }
  })
