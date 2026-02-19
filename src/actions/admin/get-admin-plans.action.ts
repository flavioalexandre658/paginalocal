'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { plan } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

const getAdminPlansSchema = z.object({
  onlyActive: z.boolean().optional().default(true),
})

export const getAdminPlansAction = adminActionClient
  .schema(getAdminPlansSchema)
  .action(async ({ parsedInput }) => {
    const plans = await db
      .select({
        id: plan.id,
        name: plan.name,
        type: plan.type,
        monthlyPriceInCents: plan.monthlyPriceInCents,
        yearlyPriceInCents: plan.yearlyPriceInCents,
        stripeMonthlyPriceId: plan.stripeMonthlyPriceId,
        stripeYearlyPriceId: plan.stripeYearlyPriceId,
        isActive: plan.isActive,
        isHighlighted: plan.isHighlighted,
        sortOrder: plan.sortOrder,
      })
      .from(plan)
      .where(parsedInput.onlyActive ? eq(plan.isActive, true) : undefined)
      .orderBy(asc(plan.sortOrder))

    return { plans }
  })
