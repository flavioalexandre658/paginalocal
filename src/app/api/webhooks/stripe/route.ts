import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe'
import { db } from '@/db'
import { subscription, plan, store, category, storeTransfer } from '@/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import { getOrCreateUserByEmail, createActivationToken, buildActivationUrl } from '@/lib/checkout-helpers'
import type Stripe from 'stripe'
import type { SubscriptionStatus } from '@/db/schema'
import { notifyStoreActivated, notifyStoreDeactivated } from '@/lib/google-indexing'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'

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

      case 'invoice.paid': {
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
  const { planId, billingInterval, storeSlug } = session.metadata || {}

  if (!planId || !billingInterval) {
    console.error('[Webhook] Missing planId or billingInterval in checkout session metadata')
    return
  }

  const stripeSubscriptionId = session.subscription as string

  const [alreadyProcessed] = await db
    .select({ id: subscription.id })
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1)

  if (alreadyProcessed) {
    console.log(`[Webhook] Subscription ${stripeSubscriptionId} already processed, skipping`)
    return
  }

  let resolvedUserId = session.metadata?.userId
  let isNewUser = false

  if (!resolvedUserId) {
    const email = session.customer_details?.email
    if (!email) {
      console.error('[Webhook] No userId in metadata and no email in customer_details')
      return
    }
    const resolved = await getOrCreateUserByEmail(email, session.customer_details?.name)
    resolvedUserId = resolved.id
    isNewUser = resolved.isNew
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  const [selectedPlan] = await db
    .select()
    .from(plan)
    .where(eq(plan.id, planId))
    .limit(1)

  if (!selectedPlan) {
    console.error('[Webhook] Plan not found:', planId)
    return
  }

  const periodDates = getSubscriptionPeriodDates(stripeSubscription)

  await db.insert(subscription).values({
    userId: resolvedUserId,
    planId,
    status: 'ACTIVE' as SubscriptionStatus,
    billingInterval: billingInterval as 'MONTHLY' | 'YEARLY',
    stripeCustomerId: session.customer as string,
    stripeSubscriptionId: stripeSubscription.id,
    stripePriceId: stripeSubscription.items.data[0].price.id,
    currentPeriodStart: periodDates.currentPeriodStart,
    currentPeriodEnd: periodDates.currentPeriodEnd,
    aiRewritesUsedThisMonth: 0,
    aiRewritesResetAt: getNextMonthReset(),
  })

  const maxStores = selectedPlan.features.maxStores

  if (storeSlug) {
    try {
      const [storeToTransfer] = await db
        .select({ id: store.id, name: store.name, slug: store.slug, userId: store.userId, city: store.city, category: store.category })
        .from(store)
        .where(eq(store.slug, storeSlug))
        .limit(1)

      if (storeToTransfer && storeToTransfer.userId !== resolvedUserId) {
        const fromUserId = storeToTransfer.userId

        await db
          .update(store)
          .set({ userId: resolvedUserId, isActive: true, updatedAt: new Date() })
          .where(eq(store.id, storeToTransfer.id))

        await db.insert(storeTransfer).values({
          storeId: storeToTransfer.id,
          fromUserId,
          toUserId: resolvedUserId,
          adminId: fromUserId,
          wasActivated: true,
        })

        try {
          await notifyStoreActivated(storeToTransfer.slug)
          await revalidateSitemap()

          const [categoryData] = await db
            .select({ slug: category.slug })
            .from(category)
            .where(eq(category.name, storeToTransfer.category))
            .limit(1)

          if (categoryData) {
            await revalidateCategoryPages(categoryData.slug, generateCitySlug(storeToTransfer.city))
          }
        } catch (indexError) {
          console.error(`[Webhook] Error indexing transferred store "${storeSlug}":`, indexError)
        }

        console.log(`[Webhook] Store "${storeSlug}" transferred to user ${resolvedUserId}`)
      } else if (storeToTransfer) {
        console.log(`[Webhook] Store "${storeSlug}" already belongs to user ${resolvedUserId}, skipping transfer`)
      } else {
        console.error(`[Webhook] Store "${storeSlug}" not found for auto-transfer`)
      }
    } catch (transferError) {
      console.error(`[Webhook] Error auto-transferring store "${storeSlug}":`, transferError)
    }
  }

  await syncUserStoresWithPlanLimit(resolvedUserId, maxStores)

  if (isNewUser) {
    const email = session.customer_details!.email!
    const raw = await createActivationToken(email)
    console.log(`[Onboarding] Link de ativação para ${email}: ${buildActivationUrl(raw)}`)
  }

  console.log(`[Webhook] Subscription created for user ${resolvedUserId} with plan ${selectedPlan.name} (max stores: ${maxStores})`)
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

  // Verifica se o plano mudou (pelo priceId - tenta monthly ou yearly)
  let selectedPlan = null

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

    selectedPlan = planByYearly || null
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
      category: store.category,
      city: store.city,
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
  const categoryCityPairsToRevalidate = new Set<string>()

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
        // Adiciona par categoria/cidade para revalidação
        categoryCityPairsToRevalidate.add(`${s.category}|${s.city}`)
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
        // Adiciona par categoria/cidade para revalidação
        categoryCityPairsToRevalidate.add(`${s.category}|${s.city}`)
      }
      deactivatedCount = storesNeedingDeactivation.length
    }
  }

  // Revalida o sitemap e páginas de categoria se houve mudanças
  if (activatedCount > 0 || deactivatedCount > 0) {
    await revalidateSitemap()

    // Revalida páginas de categoria/cidade afetadas
    for (const pair of categoryCityPairsToRevalidate) {
      const [categoryName, city] = pair.split('|')
      // Busca o slug da categoria
      const [categoryData] = await db
        .select({ slug: category.slug })
        .from(category)
        .where(eq(category.name, categoryName))
        .limit(1)

      if (categoryData) {
        await revalidateCategoryPages(categoryData.slug, generateCitySlug(city))
      }
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
      category: store.category,
      city: store.city,
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

  // Coleta pares categoria/cidade únicos para revalidação
  const categoryCityPairsToRevalidate = new Set<string>()

  // Notifica o Google sobre a desativação
  for (const s of activeStores) {
    notifyStoreDeactivated(s.slug, s.customDomain).catch((error) => {
      console.error(`[Webhook] Erro ao notificar Google sobre desativação de ${s.slug}:`, error)
    })
    categoryCityPairsToRevalidate.add(`${s.category}|${s.city}`)
  }

  // Revalida o sitemap e páginas de categoria
  await revalidateSitemap()

  // Revalida páginas de categoria/cidade afetadas
  for (const pair of categoryCityPairsToRevalidate) {
    const [categoryName, city] = pair.split('|')
    const [categoryData] = await db
      .select({ slug: category.slug })
      .from(category)
      .where(eq(category.name, categoryName))
      .limit(1)

    if (categoryData) {
      await revalidateCategoryPages(categoryData.slug, generateCitySlug(city))
    }
  }

  console.log(`[Webhook] Desativadas ${activeStores.length} lojas do usuário ${userId}`)
  return activeStores.length
}
