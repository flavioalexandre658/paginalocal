"use server"

import { db } from '@/db'
import { plan, user, subscription } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { stripe } from '@/lib/stripe'
import { eq, and, or } from 'drizzle-orm'
import { z } from 'zod'

const createCheckoutSessionSchema = z.object({
  planId: z.string().uuid(),
  billingInterval: z.enum(['MONTHLY', 'YEARLY']),
  storeSlug: z.string().optional(),
})

export const createCheckoutSession = authActionClient
  .schema(createCheckoutSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId, userEmail } = ctx
    const { planId, billingInterval, storeSlug } = parsedInput

    const [selectedPlan] = await db
      .select()
      .from(plan)
      .where(eq(plan.id, planId))
      .limit(1)

    if (!selectedPlan) {
      throw new Error('Plano não encontrado')
    }

    const existingSubscription = await db
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

    if (existingSubscription.length > 0) {
      throw new Error('Você já possui uma assinatura ativa')
    }

    const priceId = billingInterval === 'MONTHLY'
      ? selectedPlan.stripeMonthlyPriceId
      : selectedPlan.stripeYearlyPriceId

    if (!priceId) {
      throw new Error('Preço não configurado para este plano')
    }

    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1)

    let stripeCustomerId: string | undefined

    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    })

    if (existingCustomers.data.length > 0) {
      stripeCustomerId = existingCustomers.data[0].id
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userData?.name || undefined,
        metadata: {
          userId: userId,
        },
      })
      stripeCustomerId = customer.id
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const successUrl = storeSlug
      ? `${appUrl}/painel/${storeSlug}?subscription=success`
      : `${appUrl}/painel?subscription=success`

    const cancelUrl = storeSlug
      ? `${appUrl}/painel/${storeSlug}?subscription=canceled`
      : `${appUrl}/planos?subscription=canceled`

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        planId: planId,
        planType: selectedPlan.type,
        billingInterval: billingInterval,
        ...(storeSlug && { storeSlug }),
      },
      subscription_data: {
        metadata: {
          userId: userId,
          planId: planId,
          planType: selectedPlan.type,
          billingInterval: billingInterval,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      locale: 'pt-BR',
    })

    if (!session.url) {
      throw new Error('Erro ao criar sessão de checkout')
    }

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    }
  })
