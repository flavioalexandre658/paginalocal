import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { db } from '@/db'
import { subscription, plan, store } from '@/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import type Stripe from 'stripe'
import type { SubscriptionStatus } from '@/db/schema'
import { notifyStoreActivated, notifyStoreDeactivated } from '@/lib/google-indexing'

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

  // Sincroniza as lojas do usuário com o limite do novo plano
  const maxStores = selectedPlan.features.maxStores
  await syncUserStoresWithPlanLimit(userId, maxStores)

  console.log(`Subscription created for user ${userId} with plan ${selectedPlan.name} (max stores: ${maxStores})`)
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
    .select({
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
    })
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscription.id))
    .limit(1)

  if (!existingSubscription) {
    return
  }

  const periodDates = getSubscriptionPeriodDates(stripeSubscription)
  const newStatus = mapStripeStatus(stripeSubscription.status)
  const newPriceId = stripeSubscription.items.data[0].price.id

  // Verifica se o plano mudou (pelo priceId)
  const [newPlan] = await db
    .select()
    .from(plan)
    .where(eq(plan.stripePriceId, newPriceId))
    .limit(1)

  // Se não encontrou pelo stripePriceId exato, tenta por monthly ou yearly
  let selectedPlan = newPlan
  if (!selectedPlan) {
    const [planByMonthly] = await db
      .select()
      .from(plan)
      .where(eq(plan.stripeMonthlyPriceId, newPriceId))
      .limit(1)
    
    if (planByMonthly) {
      selectedPlan = planByMonthly
    } else {
      const [planByYearly] = await db
        .select()
        .from(plan)
        .where(eq(plan.stripeYearlyPriceId, newPriceId))
        .limit(1)
      
      selectedPlan = planByYearly
    }
  }

  // Atualiza a subscription
  const updateData: Record<string, unknown> = {
    status: newStatus,
    currentPeriodStart: periodDates.currentPeriodStart,
    currentPeriodEnd: periodDates.currentPeriodEnd,
    cancelAtPeriodEnd: stripeSubscription.cancel_at
      ? new Date(stripeSubscription.cancel_at * 1000)
      : null,
    stripePriceId: newPriceId,
    updatedAt: new Date(),
  }

  // Se encontrou um novo plano e ele é diferente, atualiza
  if (selectedPlan && selectedPlan.id !== existingSubscription.planId) {
    updateData.planId = selectedPlan.id
    console.log(`[Webhook] Plano alterado para usuário ${existingSubscription.userId}: ${selectedPlan.name}`)
  }

  await db
    .update(subscription)
    .set(updateData)
    .where(eq(subscription.id, existingSubscription.id))

  // Se a assinatura está ativa e encontramos um plano, sincroniza as lojas
  if (newStatus === 'ACTIVE' && selectedPlan) {
    await syncUserStoresWithPlanLimit(existingSubscription.userId, selectedPlan.features.maxStores)
  } else if (newStatus === 'CANCELED' || newStatus === 'UNPAID' || newStatus === 'PAST_DUE') {
    // Se a assinatura não está mais ativa, desativa todas as lojas
    await deactivateAllUserStores(existingSubscription.userId)
  }
}

async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  const [existingSubscription] = await db
    .select({
      id: subscription.id,
      userId: subscription.userId,
    })
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

  // Desativa todas as lojas do usuário quando a assinatura é cancelada
  await deactivateAllUserStores(existingSubscription.userId)
  
  console.log(`[Webhook] Assinatura cancelada para usuário ${existingSubscription.userId}, lojas desativadas`)
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

/**
 * Sincroniza as lojas ativas do usuário com base no limite do plano.
 * - Ativa as N lojas mais recentes (até o limite do plano)
 * - Desativa as lojas excedentes
 */
async function syncUserStoresWithPlanLimit(userId: string, maxStores: number) {
  // Busca todas as lojas do usuário ordenadas por data de criação (mais recentes primeiro)
  const userStores = await db
    .select({
      id: store.id,
      slug: store.slug,
      customDomain: store.customDomain,
      isActive: store.isActive,
    })
    .from(store)
    .where(eq(store.userId, userId))
    .orderBy(desc(store.createdAt))

  if (userStores.length === 0) {
    return { activated: 0, deactivated: 0 }
  }

  // Lojas que devem ficar ativas (as N mais recentes)
  const storesToActivate = userStores.slice(0, maxStores)
  // Lojas que devem ser desativadas (excedentes)
  const storesToDeactivate = userStores.slice(maxStores)

  const activatedIds = storesToActivate.map((s) => s.id)
  const deactivatedIds = storesToDeactivate.map((s) => s.id)

  let activatedCount = 0
  let deactivatedCount = 0

  // Ativa as lojas que devem estar ativas
  if (activatedIds.length > 0) {
    const storesNeedingActivation = storesToActivate.filter((s) => !s.isActive)
    
    if (storesNeedingActivation.length > 0) {
      await db
        .update(store)
        .set({ isActive: true, updatedAt: new Date() })
        .where(
          and(
            eq(store.userId, userId),
            inArray(store.id, storesNeedingActivation.map((s) => s.id))
          )
        )

      // Notifica o Google para cada loja ativada
      for (const s of storesNeedingActivation) {
        notifyStoreActivated(s.slug, s.customDomain).catch((error) => {
          console.error(`[Webhook] Erro ao notificar Google sobre ativação de ${s.slug}:`, error)
        })
      }
      activatedCount = storesNeedingActivation.length
    }
  }

  // Desativa as lojas excedentes
  if (deactivatedIds.length > 0) {
    const storesNeedingDeactivation = storesToDeactivate.filter((s) => s.isActive)
    
    if (storesNeedingDeactivation.length > 0) {
      await db
        .update(store)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          and(
            eq(store.userId, userId),
            inArray(store.id, storesNeedingDeactivation.map((s) => s.id))
          )
        )

      // Notifica o Google para cada loja desativada
      for (const s of storesNeedingDeactivation) {
        notifyStoreDeactivated(s.slug, s.customDomain).catch((error) => {
          console.error(`[Webhook] Erro ao notificar Google sobre desativação de ${s.slug}:`, error)
        })
      }
      deactivatedCount = storesNeedingDeactivation.length
    }
  }

  console.log(`[Webhook] Sincronização de lojas para user ${userId}: ${activatedCount} ativadas, ${deactivatedCount} desativadas (limite: ${maxStores})`)
  return { activated: activatedCount, deactivated: deactivatedCount }
}

/**
 * Desativa todas as lojas do usuário (quando assinatura é cancelada)
 */
async function deactivateAllUserStores(userId: string) {
  const activeStores = await db
    .select({
      id: store.id,
      slug: store.slug,
      customDomain: store.customDomain,
    })
    .from(store)
    .where(and(eq(store.userId, userId), eq(store.isActive, true)))

  if (activeStores.length === 0) {
    return 0
  }

  await db
    .update(store)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(store.userId, userId))

  // Notifica o Google sobre a desativação
  for (const s of activeStores) {
    notifyStoreDeactivated(s.slug, s.customDomain).catch((error) => {
      console.error(`[Webhook] Erro ao notificar Google sobre desativação de ${s.slug}:`, error)
    })
  }

  console.log(`[Webhook] Desativadas ${activeStores.length} lojas do usuário ${userId}`)
  return activeStores.length
}
