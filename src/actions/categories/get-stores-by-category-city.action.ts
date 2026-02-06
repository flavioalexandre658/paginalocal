'use server'

import { z } from 'zod'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { eq, and, desc, count, ilike } from 'drizzle-orm'
import { generateCitySlug } from '@/lib/utils'

const getStoresByCategoryCitySchema = z.object({
  categorySlug: z.string().min(1),
  citySlug: z.string().min(1),
  limit: z.number().optional().default(20),
  offset: z.number().optional().default(0),
})

export const getStoresByCategoryCityAction = actionClient
  .schema(getStoresByCategoryCitySchema)
  .action(async ({ parsedInput }) => {
    const { categorySlug, citySlug, limit, offset } = parsedInput
    return getStoresByCategoryCity(categorySlug, citySlug, limit, offset)
  })

export async function getStoresByCategoryCity(
  categorySlug: string,
  citySlug: string,
  limit = 20,
  offset = 0
) {
  const [categoryData] = await db
    .select({ name: category.name })
    .from(category)
    .where(eq(category.slug, categorySlug))
    .limit(1)

  if (!categoryData) {
    return { stores: [], total: 0, categoryName: null, cityName: null }
  }

  const allCities = await db
    .selectDistinct({ city: store.city })
    .from(store)
    .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))

  const matchedCity = allCities.find(
    (c) => generateCitySlug(c.city) === citySlug
  )

  if (!matchedCity) {
    return { stores: [], total: 0, categoryName: categoryData.name, cityName: null }
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
      latitude: store.latitude,
      longitude: store.longitude,
    })
    .from(store)
    .where(
      and(
        eq(store.category, categoryData.name),
        eq(store.city, matchedCity.city),
        eq(store.isActive, true)
      )
    )
    .orderBy(desc(store.googleRating), desc(store.googleReviewsCount))
    .limit(limit)
    .offset(offset)

  const [{ total }] = await db
    .select({ total: count() })
    .from(store)
    .where(
      and(
        eq(store.category, categoryData.name),
        eq(store.city, matchedCity.city),
        eq(store.isActive, true)
      )
    )

  return {
    stores,
    total,
    categoryName: categoryData.name,
    cityName: matchedCity.city,
  }
}
