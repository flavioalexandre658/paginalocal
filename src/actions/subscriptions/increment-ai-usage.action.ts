"use server"

import { db } from '@/db'
import { subscription, plan } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and, or, sql } from 'drizzle-orm'

export const incrementAiUsage = authActionClient.action(async ({ ctx }) => {
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
    throw new Error('Nenhuma assinatura ativa encontrada')
  }

  const { subscription: sub, plan: userPlan } = userSubscription
  const aiLimit = userPlan.features.aiRewritesPerMonth

  if (aiLimit !== null && sub.aiRewritesUsedThisMonth >= aiLimit) {
    throw new Error('Limite de reescritas com IA atingido este mês')
  }

  const now = new Date()
  const resetAt = sub.aiRewritesResetAt

  if (resetAt && now > resetAt) {
    const nextReset = new Date(now)
    nextReset.setMonth(nextReset.getMonth() + 1)
    nextReset.setDate(1)
    nextReset.setHours(0, 0, 0, 0)

    await db
      .update(subscription)
      .set({
        aiRewritesUsedThisMonth: 1,
        aiRewritesResetAt: nextReset,
        updatedAt: new Date(),
      })
      .where(eq(subscription.id, sub.id))
  } else {
    if (!resetAt) {
      const nextReset = new Date(now)
      nextReset.setMonth(nextReset.getMonth() + 1)
      nextReset.setDate(1)
      nextReset.setHours(0, 0, 0, 0)

      await db
        .update(subscription)
        .set({
          aiRewritesUsedThisMonth: sql`${subscription.aiRewritesUsedThisMonth} + 1`,
          aiRewritesResetAt: nextReset,
          updatedAt: new Date(),
        })
        .where(eq(subscription.id, sub.id))
    } else {
      await db
        .update(subscription)
        .set({
          aiRewritesUsedThisMonth: sql`${subscription.aiRewritesUsedThisMonth} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(subscription.id, sub.id))
    }
  }

  return { success: true }
})
