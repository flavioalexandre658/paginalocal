'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storePage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateInstitutionalPages } from '@/lib/ai'
import type { MarketingCopyInput } from '@/lib/ai'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const generateStorePagesSchema = z.object({
  storeId: z.string().uuid(),
})

export const generateStorePagesAction = authActionClient
  .schema(generateStorePagesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId } = parsedInput

    const [storeData] = await db
      .select({
        id: store.id,
        slug: store.slug,
        name: store.name,
        category: store.category,
        city: store.city,
        state: store.state,
        description: store.description,
        address: store.address,
        googleRating: store.googleRating,
        googleReviewsCount: store.googleReviewsCount,
      })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const existingPages = await db
      .select({ id: storePage.id, type: storePage.type })
      .from(storePage)
      .where(eq(storePage.storeId, storeId))

    if (existingPages.length >= 2) {
      throw new Error('Páginas institucionais já foram geradas')
    }

    const aiInput: MarketingCopyInput = {
      businessName: storeData.name,
      category: storeData.category,
      city: storeData.city,
      state: storeData.state,
      rating: storeData.googleRating ? parseFloat(storeData.googleRating) : undefined,
      reviewCount: storeData.googleReviewsCount ?? undefined,
      googleAbout: storeData.description ?? undefined,
      address: storeData.address,
    }

    const pages = await generateInstitutionalPages(aiInput)

    const pagesToInsert = [
      {
        storeId,
        type: 'ABOUT' as const,
        slug: 'sobre-nos',
        title: pages.about.title,
        content: pages.about.content,
        seoTitle: pages.about.seoTitle,
        seoDescription: pages.about.seoDescription,
      },
      {
        storeId,
        type: 'CONTACT' as const,
        slug: 'contato',
        title: pages.contact.title,
        content: pages.contact.content,
        seoTitle: pages.contact.seoTitle,
        seoDescription: pages.contact.seoDescription,
      },
    ]

    const result = await db.insert(storePage).values(pagesToInsert).returning()

    revalidateStoreCache(storeData.slug)

    return result
  })
