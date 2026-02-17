'use server'

import { db } from '@/db'
import { storePricingPlan, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const deletePricingPlanSchema = z.object({
  planId: z.string().uuid(),
})

export const deletePricingPlanAction = authActionClient
  .schema(deletePricingPlanSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { planId } = parsedInput

    const planWithStore = await db
      .select({
        planId: storePricingPlan.id,
        storeId: storePricingPlan.storeId,
        userId: store.userId,
      })
      .from(storePricingPlan)
      .innerJoin(store, eq(storePricingPlan.storeId, store.id))
      .where(eq(storePricingPlan.id, planId))
      .limit(1)

    if (!planWithStore[0] || planWithStore[0].userId !== userId) {
      throw new Error('Plano não encontrado ou você não tem permissão para excluí-lo')
    }

    await db.delete(storePricingPlan).where(eq(storePricingPlan.id, planId))

    revalidateTag('store-data')
    revalidateTag(`store-pricing-plans-${planWithStore[0].storeId}`)

    return { success: true }
  })
