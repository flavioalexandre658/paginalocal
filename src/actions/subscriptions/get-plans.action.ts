"use server"

import { db } from '@/db'
import { plan } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { eq, asc } from 'drizzle-orm'

export const getPlans = actionClient.action(async () => {
  const plans = await db
    .select()
    .from(plan)
    .where(eq(plan.isActive, true))
    .orderBy(asc(plan.sortOrder))

  return plans
})
