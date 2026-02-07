'use server'

import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { user, store, subscription, plan } from '@/db/schema'
import { eq, and, or, count, sql, gte, desc } from 'drizzle-orm'

export const getAdminDashboardAction = adminActionClient.action(async () => {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsersResult,
    totalStoresResult,
    activeStoresResult,
    subscriptionStats,
    mrrData,
    recentUsers,
    expiringSubscriptions,
    pastDueSubscriptions,
    revenueByPlan,
  ] = await Promise.all([
    db.select({ count: count() }).from(user),
    db.select({ count: count() }).from(store),
    db.select({ count: count() }).from(store).where(eq(store.isActive, true)),
    db
      .select({
        status: subscription.status,
        count: count(),
      })
      .from(subscription)
      .groupBy(subscription.status),
    db
      .select({
        monthlyTotal: sql<number>`COALESCE(SUM(
          CASE 
            WHEN ${subscription.billingInterval} = 'MONTHLY' THEN ${plan.monthlyPriceInCents}
            WHEN ${subscription.billingInterval} = 'YEARLY' THEN ROUND(${plan.yearlyPriceInCents}::numeric / 12)
            ELSE 0
          END
        ), 0)`,
      })
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      ),
    db
      .select({
        date: sql<string>`DATE(${user.createdAt})`,
        count: count(),
      })
      .from(user)
      .where(gte(user.createdAt, thirtyDaysAgo))
      .groupBy(sql`DATE(${user.createdAt})`)
      .orderBy(sql`DATE(${user.createdAt})`),
    db
      .select({
        id: subscription.id,
        userId: subscription.userId,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        userName: user.name,
        userEmail: user.email,
        planName: plan.name,
      })
      .from(subscription)
      .innerJoin(user, eq(subscription.userId, user.id))
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        and(
          or(
            eq(subscription.status, 'ACTIVE'),
            eq(subscription.status, 'TRIALING')
          ),
          sql`${subscription.currentPeriodEnd} <= ${sevenDaysFromNow}`,
          sql`${subscription.currentPeriodEnd} >= ${now}`
        )
      )
      .orderBy(subscription.currentPeriodEnd)
      .limit(20),
    db
      .select({
        id: subscription.id,
        userId: subscription.userId,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone,
        planName: plan.name,
      })
      .from(subscription)
      .innerJoin(user, eq(subscription.userId, user.id))
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(eq(subscription.status, 'PAST_DUE'))
      .orderBy(desc(subscription.updatedAt))
      .limit(20),
    db
      .select({
        planName: plan.name,
        planType: plan.type,
        count: count(),
        revenue: sql<number>`COALESCE(SUM(
          CASE 
            WHEN ${subscription.billingInterval} = 'MONTHLY' THEN ${plan.monthlyPriceInCents}
            WHEN ${subscription.billingInterval} = 'YEARLY' THEN ROUND(${plan.yearlyPriceInCents}::numeric / 12)
            ELSE 0
          END
        ), 0)`,
      })
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        or(
          eq(subscription.status, 'ACTIVE'),
          eq(subscription.status, 'TRIALING')
        )
      )
      .groupBy(plan.name, plan.type),
  ])

  const totalUsers = totalUsersResult[0]?.count || 0
  const totalStores = totalStoresResult[0]?.count || 0
  const activeStores = activeStoresResult[0]?.count || 0

  const statusCounts: Record<string, number> = {}
  for (const row of subscriptionStats) {
    statusCounts[row.status] = row.count
  }

  const activeSubscriptions = (statusCounts['ACTIVE'] || 0) + (statusCounts['TRIALING'] || 0)
  const canceledSubscriptions = statusCounts['CANCELED'] || 0
  const pastDueCount = statusCounts['PAST_DUE'] || 0
  const totalEverSubscribed = Object.values(statusCounts).reduce((a, b) => a + b, 0)

  const mrrInCents = Number(mrrData[0]?.monthlyTotal || 0)
  const arrInCents = mrrInCents * 12

  const churnRate = totalEverSubscribed > 0
    ? Math.round((canceledSubscriptions / totalEverSubscribed) * 10000) / 100
    : 0

  return {
    totalUsers,
    totalStores,
    activeStores,
    inactiveStores: totalStores - activeStores,
    activeSubscriptions,
    canceledSubscriptions,
    pastDueCount,
    mrrInCents,
    arrInCents,
    churnRate,
    recentUsers,
    expiringSubscriptions,
    pastDueSubscriptions,
    revenueByPlan,
  }
})
