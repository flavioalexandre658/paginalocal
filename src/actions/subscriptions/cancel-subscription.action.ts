"use server"

import { db } from '@/db'
import { subscription } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { stripe } from '@/lib/stripe'
import { eq, and, or } from 'drizzle-orm'

export const cancelSubscription = authActionClient.action(async ({ ctx }) => {
  const { userId } = ctx

  const [userSubscription] = await db
    .select()
    .from(subscription)
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

  if (!userSubscription.stripeSubscriptionId) {
    throw new Error('ID da assinatura Stripe não encontrado')
  }

  await stripe.subscriptions.update(userSubscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  })

  const stripeSubscription = await stripe.subscriptions.retrieve(
    userSubscription.stripeSubscriptionId
  )

  await db
    .update(subscription)
    .set({
      cancelAtPeriodEnd: stripeSubscription.cancel_at
        ? new Date(stripeSubscription.cancel_at * 1000)
        : null,
      updatedAt: new Date(),
    })
    .where(eq(subscription.id, userSubscription.id))

  return { success: true }
})
