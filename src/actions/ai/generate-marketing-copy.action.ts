'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, subscription, plan } from '@/db/schema'
import { eq, and, or, sql } from 'drizzle-orm'
import { generateMarketingCopy, generateServiceDescriptions } from '@/lib/gemini'
import { checkCanUseAiRewrite } from '@/lib/plan-middleware'
import { generateSlug } from '@/lib/utils'

async function generateUniqueServiceSlug(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

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
      address: storeData.address || undefined,
      openingHours: (storeData.openingHours as Record<string, string>) || undefined,
    })

    const [updatedStore] = await db
      .update(store)
      .set({
        heroTitle: marketingCopy.heroTitle,
        heroSubtitle: marketingCopy.heroSubtitle,
        description: marketingCopy.aboutSection,
        seoTitle: marketingCopy.seoTitle,
        seoDescription: marketingCopy.seoDescription,
        faq: marketingCopy.faq,
        neighborhoods: marketingCopy.neighborhoods,
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
        const slug = await generateUniqueServiceSlug(parsedInput.storeId, svc.name)
        await db.insert(service).values({
          storeId: parsedInput.storeId,
          name: svc.name,
          slug,
          description: svc.description,
          seoTitle: svc.seoTitle || null,
          seoDescription: svc.seoDescription || null,
          longDescription: svc.longDescription || null,
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
      const slug = await generateUniqueServiceSlug(parsedInput.storeId, svc.name)
      await db.insert(service).values({
        storeId: parsedInput.storeId,
        name: svc.name,
        slug,
        description: svc.description,
        seoTitle: svc.seoTitle || null,
        seoDescription: svc.seoDescription || null,
        longDescription: svc.longDescription || null,
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
