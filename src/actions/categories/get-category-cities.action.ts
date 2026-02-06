'use server'

import { z } from 'zod'
import { db } from '@/db'
import { store, category } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { eq, and, desc, sql, count } from 'drizzle-orm'
import { generateCitySlug } from '@/lib/utils'

const getCategoryCitiesSchema = z.object({
  categorySlug: z.string().min(1),
  limit: z.number().optional().default(50),
})

export const getCategoryCitiesAction = actionClient
  .schema(getCategoryCitiesSchema)
  .action(async ({ parsedInput }) => {
    const { categorySlug, limit } = parsedInput
    return getCategoryCities(categorySlug, limit)
  })

export async function getCategoryCities(categorySlug: string, limit = 50) {
  const [categoryData] = await db
    .select({ name: category.name })
    .from(category)
    .where(eq(category.slug, categorySlug))
    .limit(1)

  if (!categoryData) {
    return []
  }

  const cities = await db
    .select({
      city: store.city,
      state: store.state,
      count: count(),
    })
    .from(store)
    .where(and(eq(store.category, categoryData.name), eq(store.isActive, true)))
    .groupBy(store.city, store.state)
    .orderBy(desc(count()))
    .limit(limit)

  return cities.map((c) => ({
    city: c.city,
    state: c.state,
    slug: generateCitySlug(c.city),
    count: c.count,
  }))
}

export async function getAllCategoryCityCombinations() {
  const results = await db
    .select({
      categorySlug: category.slug,
      city: store.city,
    })
    .from(store)
    .innerJoin(category, eq(store.category, category.name))
    .where(eq(store.isActive, true))
    .groupBy(category.slug, store.city)

  return results.map((r) => ({
    categorySlug: r.categorySlug,
    citySlug: generateCitySlug(r.city),
    city: r.city,
  }))
}
