import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { db } from '@/db'
import { subscription, plan, store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import type { SubscriptionStatus } from '@/db/schema'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'customer.subscription.created': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(stripeSubscription)
        break
      }

      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(stripeSubscription)
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(stripeSubscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function getSubscriptionPeriodDates(sub: Stripe.Subscription) {
  const subData = sub as unknown as { current_period_start?: number; current_period_end?: number }
  const startTimestamp = subData.current_period_start
  const endTimestamp = subData.current_period_end

  return {
    currentPeriodStart: startTimestamp ? new Date(startTimestamp * 1000) : new Date(),
    currentPeriodEnd: endTimestamp ? new Date(endTimestamp * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { userId, planId, billingInterval, storeSlug } = session.metadata || {}

  if (!userId || !planId || !billingInterval) {
    console.error('Missing metadata in checkout session')
    return
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  const [selectedPlan] = await db
    .select()
    .from(plan)
    .where(eq(plan.id, planId))
    .limit(1)

  if (!selectedPlan) {
    console.error('Plan not found:', planId)
    return
  }

  const periodDates = getSubscriptionPeriodDates(stripeSubscription)

  const subscriptionData = {
    userId: userId,
    planId: planId,
    status: 'ACTIVE' as SubscriptionStatus,
    billingInterval: billingInterval as 'MONTHLY' | 'YEARLY',
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: stripeSubscription.items.data[0].price.id,
    currentPeriodStart: periodDates.currentPeriodStart,
    currentPeriodEnd: periodDates.currentPeriodEnd,
    aiRewritesUsedThisMonth: 0,
    aiRewritesResetAt: getNextMonthReset(),
  }

  await db.insert(subscription).values(subscriptionData)

  if (storeSlug) {
    await db
      .update(store)
      .set({
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(store.slug, storeSlug))
  }

  console.log(`Subscription created for user ${userId} with plan ${selectedPlan.name}`)
}

async function handleSubscriptionCreated(stripeSubscription: Stripe.Subscription) {
  const { userId, planId, billingInterval } = stripeSubscription.metadata || {}

  if (!userId || !planId) {
    return
  }

  const existingSubscription = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1)

  if (existingSubscription.length > 0) {
    return
  }

  const periodDates = getSubscriptionPeriodDates(stripeSubscription)

  const subscriptionData = {
    userId: userId,
    planId: planId,
    status: mapStripeStatus(stripeSubscription.status),
    billingInterval: (billingInterval as 'MONTHLY' | 'YEARLY') || 'MONTHLY',
    stripeCustomerId: stripeSubscription.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: stripeSubscription.items.data[0].price.id,
    currentPeriodStart: periodDates.currentPeriodStart,
    currentPeriodEnd: periodDates.currentPeriodEnd,
    aiRewritesUsedThisMonth: 0,
    aiRewritesResetAt: getNextMonthReset(),
  }

  await db.insert(subscription).values(subscriptionData)
}

async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  const [existingSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1)

  if (!existingSubscription) {
    return
  }

  const periodDates = getSubscriptionPeriodDates(stripeSubscription)

  await db
    .update(subscription)
    .set({
      status: mapStripeStatus(stripeSubscription.status),
      currentPeriodStart: periodDates.currentPeriodStart,
      currentPeriodEnd: periodDates.currentPeriodEnd,
      cancelAtPeriodEnd: stripeSubscription.cancel_at
        ? new Date(stripeSubscription.cancel_at * 1000)
        : null,
      stripePriceId: stripeSubscription.items.data[0].price.id,
      updatedAt: new Date(),
    })
    .where(eq(subscription.id, existingSubscription.id))
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const [existingSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1)

  if (!existingSubscription) {
    return
  }

  await db
    .update(subscription)
    .set({
      status: 'CANCELED' as SubscriptionStatus,
      updatedAt: new Date(),
    })
    .where(eq(subscription.id, existingSubscription.id))
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | null }
  const subscriptionId = invoiceData.subscription
  if (!subscriptionId) return

  const [existingSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1)

  if (!existingSubscription) return

  await db
    .update(subscription)
    .set({
      status: 'ACTIVE' as SubscriptionStatus,
      updatedAt: new Date(),
    })
    .where(eq(subscription.id, existingSubscription.id))
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const invoiceData = invoice as unknown as { subscription?: string | null }
  const subscriptionId = invoiceData.subscription
  if (!subscriptionId) return

  const [existingSubscription] = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, subscriptionId))
    .limit(1)

  if (!existingSubscription) return

  await db
    .update(subscription)
    .set({
      status: 'PAST_DUE' as SubscriptionStatus,
      updatedAt: new Date(),
    })
    .where(eq(subscription.id, existingSubscription.id))
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: 'ACTIVE',
    canceled: 'CANCELED',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'INCOMPLETE_EXPIRED',
    past_due: 'PAST_DUE',
    trialing: 'TRIALING',
    unpaid: 'UNPAID',
    paused: 'CANCELED',
  }
  return statusMap[status] || 'ACTIVE'
}

function getNextMonthReset() {
  const now = new Date()
  const nextReset = new Date(now)
  nextReset.setMonth(nextReset.getMonth() + 1)
  nextReset.setDate(1)
  nextReset.setHours(0, 0, 0, 0)
  return nextReset
}
