"use server"

import { db } from '@/db'
import { subscription, plan } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and, or } from 'drizzle-orm'

export const getUserSubscription = authActionClient.action(async ({ ctx }) => {
  const { userId } = ctx

  const [userSubscription] = await db
    .select({
      subscription: subscription,
      plan: plan,
    })
    .from(subscription)
    .innerJoin(plan, eq(subscription.planId, plan.id))
    .where(
      and(
        eq(subscription.userId, userId),
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
    )
    .limit(1)

  if (!userSubscription) {
    return null
  }

  return {
    ...userSubscription.subscription,
    plan: userSubscription.plan,
  }
})
