'use server'

import { z } from 'zod'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { eq, and, desc, count, sql, countDistinct } from 'drizzle-orm'

const getStoresByCategorySchema = z.object({
  categorySlug: z.string().min(1),
  limit: z.number().optional().default(12),
  offset: z.number().optional().default(0),
})

export const getStoresByCategoryAction = actionClient
  .schema(getStoresByCategorySchema)
  .action(async ({ parsedInput }) => {
    const { categorySlug, limit, offset } = parsedInput

    const [categoryData] = await db
      .select({ name: category.name })
      .from(category)
      .where(eq(category.slug, categorySlug))
      .limit(1)

    if (!categoryData) {
      return { stores: [], total: 0, categoryName: null }
    }

    const stores = await db
      .select({
        id: store.id,
        name: store.name,
        slug: store.slug,
        description: store.description,
        city: store.city,
        state: store.state,
        address: store.address,
        phone: store.phone,
        whatsapp: store.whatsapp,
        coverUrl: store.coverUrl,
        logoUrl: store.logoUrl,
        googleRating: store.googleRating,
        googleReviewsCount: store.googleReviewsCount,
      })
      .from(store)
      .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))
      .orderBy(desc(store.googleRating), desc(store.googleReviewsCount))
      .limit(limit)
      .offset(offset)

    const [{ total }] = await db
      .select({ total: count() })
      .from(store)
      .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))

    return {
      stores,
      total,
      categoryName: categoryData.name,
    }
  })

export async function getStoresByCategory(categorySlug: string, limit = 12, offset = 0) {
  const [categoryData] = await db
    .select({ name: category.name })
    .from(category)
    .where(eq(category.slug, categorySlug))
    .limit(1)

  if (!categoryData) {
    return { stores: [], total: 0, categoryName: null }
  }

  const stores = await db
    .select({
      id: store.id,
      name: store.name,
      slug: store.slug,
      description: store.description,
      city: store.city,
      state: store.state,
      address: store.address,
      phone: store.phone,
      whatsapp: store.whatsapp,
      coverUrl: store.coverUrl,
      logoUrl: store.logoUrl,
      googleRating: store.googleRating,
      googleReviewsCount: store.googleReviewsCount,
    })
    .from(store)
    .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))
    .orderBy(desc(store.googleRating), desc(store.googleReviewsCount))
    .limit(limit)
    .offset(offset)

  const [{ total }] = await db
    .select({ total: count() })
    .from(store)
    .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))

  return {
    stores,
    total,
    categoryName: categoryData.name,
  }
}

export async function getCategoryStats(categoryName: string) {
  const result = await db
    .select({
      totalStores: count(),
      totalCities: countDistinct(store.city),
      avgRating: sql<string>`ROUND(AVG(${store.googleRating}::numeric), 1)`,
      totalReviews: sql<number>`SUM(${store.googleReviewsCount})`,
    })
    .from(store)
    .where(and(eq(store.category, categoryName), eq(store.isActive, true)))

  return {
    totalStores: result[0]?.totalStores || 0,
    totalCities: result[0]?.totalCities || 0,
    avgRating: result[0]?.avgRating || '0',
    totalReviews: result[0]?.totalReviews || 0,
  }
}
