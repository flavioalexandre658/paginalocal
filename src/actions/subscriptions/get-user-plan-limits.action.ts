"use server"

import { db } from '@/db'
import { subscription, plan } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and, or } from 'drizzle-orm'
import type { IUserPlanLimits } from '@/interfaces/subscription.interface'
import { FREE_TIER_LIMITS } from '@/lib/plan-middleware'

const DEFAULT_LIMITS: IUserPlanLimits = {
  maxStores: FREE_TIER_LIMITS.maxStores,
  maxPhotosPerStore: FREE_TIER_LIMITS.maxPhotosPerStore,
  aiRewritesPerMonth: FREE_TIER_LIMITS.aiRewritesPerMonth,
  aiRewritesUsed: 0,
  canUseCustomDomain: FREE_TIER_LIMITS.customDomain,
  canUseGmbSync: FREE_TIER_LIMITS.gmbSync,
  canUseGmbAutoUpdate: FREE_TIER_LIMITS.gmbAutoUpdate,
  canUseUnifiedDashboard: FREE_TIER_LIMITS.unifiedDashboard,
  hasActiveSubscription: false,
  planType: null,
  planName: 'Gratuito',
}

export const getUserPlanLimits = authActionClient.action(async ({ ctx }): Promise<IUserPlanLimits> => {
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
    return DEFAULT_LIMITS
  }

  const { subscription: sub, plan: userPlan } = userSubscription
  const features = userPlan.features

  return {
    maxStores: features.maxStores,
    maxPhotosPerStore: features.maxPhotosPerStore,
    aiRewritesPerMonth: features.aiRewritesPerMonth,
    aiRewritesUsed: sub.aiRewritesUsedThisMonth,
    canUseCustomDomain: features.customDomain,
    canUseGmbSync: features.gmbSync,
    canUseGmbAutoUpdate: features.gmbAutoUpdate,
    canUseUnifiedDashboard: features.unifiedDashboard,
    hasActiveSubscription: true,
    planType: userPlan.type,
    planName: userPlan.name,
  }
})
