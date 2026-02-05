'use server'

import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { subscription, plan } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const getRecentPurchaseAction = authActionClient
  .action(async ({ ctx }) => {
    const [recentSubscription] = await db
      .select({
        id: subscription.id,
        stripeSubscriptionId: subscription.stripeSubscriptionId,
        billingInterval: subscription.billingInterval,
        createdAt: subscription.createdAt,
        plan: {
          id: plan.id,
          name: plan.name,
          type: plan.type,
          monthlyPriceInCents: plan.monthlyPriceInCents,
          yearlyPriceInCents: plan.yearlyPriceInCents,
        },
      })
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(eq(subscription.userId, ctx.userId))
      .orderBy(desc(subscription.createdAt))
      .limit(1)

    if (!recentSubscription) {
      return null
    }

    const priceInCents =
      recentSubscription.billingInterval === 'YEARLY'
        ? recentSubscription.plan.yearlyPriceInCents
        : recentSubscription.plan.monthlyPriceInCents

    return {
      transactionId: recentSubscription.stripeSubscriptionId || recentSubscription.id,
      value: priceInCents / 100,
      currency: 'BRL',
      planId: recentSubscription.plan.id,
      planName: recentSubscription.plan.name,
      planType: recentSubscription.plan.type,
      billingInterval: recentSubscription.billingInterval,
      createdAt: recentSubscription.createdAt,
    }
  })
