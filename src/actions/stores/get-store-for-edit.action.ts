'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, storeImage, storePage } from '@/db/schema'
import type { StoreStat, StoreSection } from '@/db/schema/stores.schema'
import { eq, and, asc } from 'drizzle-orm'

const getStoreForEditSchema = z.object({
  storeSlug: z.string().min(1),
})

export const getStoreForEditAction = authActionClient
  .schema(getStoreForEditSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug } = parsedInput
    const isAdmin = ctx.userRole === 'admin'

    const [storeData] = await db
      .select()
      .from(store)
      .where(
        isAdmin
          ? eq(store.slug, storeSlug)
          : and(eq(store.slug, storeSlug), eq(store.userId, ctx.userId))
      )
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [services, images, pages] = await Promise.all([
      db
        .select()
        .from(service)
        .where(eq(service.storeId, storeData.id))
        .orderBy(asc(service.position)),
      db
        .select()
        .from(storeImage)
        .where(eq(storeImage.storeId, storeData.id))
        .orderBy(asc(storeImage.order)),
      db
        .select()
        .from(storePage)
        .where(eq(storePage.storeId, storeData.id)),
    ])

    return {
      store: {
        id: storeData.id,
        name: storeData.name,
        slug: storeData.slug,
        description: storeData.description,
        category: storeData.category,
        categoryId: storeData.categoryId,
        phone: storeData.phone,
        whatsapp: storeData.whatsapp,
        address: storeData.address,
        city: storeData.city,
        state: storeData.state,
        zipCode: storeData.zipCode,
        latitude: storeData.latitude,
        longitude: storeData.longitude,
        logoUrl: storeData.logoUrl,
        faviconUrl: storeData.faviconUrl,
        coverUrl: storeData.coverUrl,
        primaryColor: storeData.primaryColor,
        heroBackgroundColor: storeData.heroBackgroundColor,
        buttonColor: storeData.buttonColor,
        openingHours: storeData.openingHours as Record<string, string> | null,
        heroTitle: storeData.heroTitle,
        heroSubtitle: storeData.heroSubtitle,
        seoTitle: storeData.seoTitle,
        seoDescription: storeData.seoDescription,
        faq: storeData.faq as Array<{ question: string; answer: string }> | null,
        neighborhoods: storeData.neighborhoods as string[] | null,
        isActive: storeData.isActive,
        googlePlaceId: storeData.googlePlaceId,
        customDomain: storeData.customDomain,
        whatsappDefaultMessage: storeData.whatsappDefaultMessage,
        showWhatsappButton: storeData.showWhatsappButton,
        showCallButton: storeData.showCallButton,
        instagramUrl: storeData.instagramUrl,
        facebookUrl: storeData.facebookUrl,
        googleBusinessUrl: storeData.googleBusinessUrl,
        stats: storeData.stats as StoreStat[] | null,
        fontFamily: storeData.fontFamily,
        highlightBadge: storeData.highlightBadge,
        highlightText: storeData.highlightText,
        mode: storeData.mode,
        sections: storeData.sections as StoreSection[] | null,
        templateId: storeData.templateId,
        templateConfig: storeData.templateConfig,
      },
      services,
      images,
      pages,
    }
  })
