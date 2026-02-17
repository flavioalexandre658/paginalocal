'use server'

import { db } from '@/db'
import { storePricingPlan, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and, asc } from 'drizzle-orm'

const getPricingPlansSchema = z.object({
  storeId: z.string().uuid(),
  includeInactive: z.boolean().default(false),
})

export const getPricingPlansAction = authActionClient
  .schema(getPricingPlansSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, includeInactive } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para acessar esta loja')
    }

    const conditions = [eq(storePricingPlan.storeId, storeId)]
    
    if (!includeInactive) {
      conditions.push(eq(storePricingPlan.isActive, true))
    }

    const plans = await db
      .select()
      .from(storePricingPlan)
      .where(and(...conditions))
      .orderBy(asc(storePricingPlan.position), asc(storePricingPlan.createdAt))

    return plans
  })
