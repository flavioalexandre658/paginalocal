'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, subscription, plan } from '@/db/schema'
import { eq, and, or, sql } from 'drizzle-orm'
import { generateMarketingCopy, generateServiceDescriptions } from '@/lib/gemini'
import { checkCanUseAiRewrite } from '@/lib/plan-middleware'

const generateMarketingCopySchema = z.object({
  storeId: z.string().uuid(),
})

export const generateMarketingCopyAction = authActionClient
  .schema(generateMarketingCopySchema)
  .action(async ({ parsedInput, ctx }) => {
    const aiCheck = await checkCanUseAiRewrite(ctx.userId)
    if (!aiCheck.allowed) {
      throw new Error(aiCheck.reason || 'Limite de reescritas com IA atingido')
    }

    const [storeData] = await db
      .select()
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const marketingCopy = await generateMarketingCopy({
      businessName: storeData.name,
      category: storeData.category,
      city: storeData.city,
      state: storeData.state,
      rating: storeData.googleRating ? parseFloat(storeData.googleRating) : undefined,
      reviewCount: storeData.googleReviewsCount || undefined,
    })

    const [updatedStore] = await db
      .update(store)
      .set({
        description: marketingCopy.aboutSection,
        seoTitle: marketingCopy.seoTitle,
        seoDescription: marketingCopy.seoDescription,
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))
      .returning()

    const existingServices = await db
      .select({ name: service.name })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    if (existingServices.length === 0 && marketingCopy.services) {
      for (let i = 0; i < marketingCopy.services.length; i++) {
        const svc = marketingCopy.services[i]
        await db.insert(service).values({
          storeId: parsedInput.storeId,
          name: svc.name,
          description: svc.description,
          position: i + 1,
          isActive: true,
        })
      }
    }

    const [userSubscription] = await db
      .select()
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        and(
          eq(subscription.userId, ctx.userId),
          or(eq(subscription.status, 'ACTIVE'), eq(subscription.status, 'TRIALING'))
        )
      )
      .limit(1)

    if (userSubscription && userSubscription.plan.features.aiRewritesPerMonth !== null) {
      await db
        .update(subscription)
        .set({
          aiRewritesUsedThisMonth: sql`${subscription.aiRewritesUsedThisMonth} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(subscription.id, userSubscription.subscription.id))
    }

    return {
      store: updatedStore,
      marketingCopy,
      servicesCreated: existingServices.length === 0 ? marketingCopy.services?.length || 0 : 0,
    }
  })

const regenerateServicesSchema = z.object({
  storeId: z.string().uuid(),
})

export const regenerateServicesAction = authActionClient
  .schema(regenerateServicesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const aiCheck = await checkCanUseAiRewrite(ctx.userId)
    if (!aiCheck.allowed) {
      throw new Error(aiCheck.reason || 'Limite de reescritas com IA atingido')
    }

    const [storeData] = await db
      .select()
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const existingServices = await db
      .select({ name: service.name })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    const newServices = await generateServiceDescriptions({
      businessName: storeData.name,
      category: storeData.category,
      existingServices: existingServices.map(s => s.name),
    })

    const currentMaxPosition = existingServices.length

    for (let i = 0; i < newServices.length; i++) {
      const svc = newServices[i]
      await db.insert(service).values({
        storeId: parsedInput.storeId,
        name: svc.name,
        description: svc.description,
        position: currentMaxPosition + i + 1,
        isActive: true,
      })
    }

    const [userSubscription] = await db
      .select()
      .from(subscription)
      .innerJoin(plan, eq(subscription.planId, plan.id))
      .where(
        and(
          eq(subscription.userId, ctx.userId),
          or(eq(subscription.status, 'ACTIVE'), eq(subscription.status, 'TRIALING'))
        )
      )
      .limit(1)

    if (userSubscription && userSubscription.plan.features.aiRewritesPerMonth !== null) {
      await db
        .update(subscription)
        .set({
          aiRewritesUsedThisMonth: sql`${subscription.aiRewritesUsedThisMonth} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(subscription.id, userSubscription.subscription.id))
    }

    return {
      servicesCreated: newServices.length,
      services: newServices,
    }
  })
