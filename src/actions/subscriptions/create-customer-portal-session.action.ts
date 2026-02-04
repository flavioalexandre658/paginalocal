"use server"

import { db } from '@/db'
import { subscription } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { stripe } from '@/lib/stripe'
import { eq, and, or } from 'drizzle-orm'
import { z } from 'zod'

const createCustomerPortalSessionSchema = z.object({
  returnUrl: z.string().url().optional(),
})

export const createCustomerPortalSession = authActionClient
  .schema(createCustomerPortalSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { returnUrl } = parsedInput

    const [userSubscription] = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.userId, userId),
          or(
            eq(subscription.status, 'ACTIVE'),
            eq(subscription.status, 'TRIALING'),
            eq(subscription.status, 'CANCELED'),
            eq(subscription.status, 'PAST_DUE')
          )
        )
      )
      .limit(1)

    if (!userSubscription?.stripeCustomerId) {
      throw new Error('Nenhuma assinatura encontrada')
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: returnUrl || `${appUrl}/painel`,
    })

    return {
      portalUrl: session.url,
    }
  })
