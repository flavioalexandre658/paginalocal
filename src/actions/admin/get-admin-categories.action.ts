'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { category } from '@/db/schema'
import { ilike, count, desc, asc, and } from 'drizzle-orm'

const getAdminCategoriesSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['name', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const getAdminCategoriesAction = adminActionClient
  .schema(getAdminCategoriesSchema)
  .action(async ({ parsedInput }) => {
    const { search, page, limit, sortBy, sortOrder } = parsedInput
    const offset = (page - 1) * limit

    const conditions = []

    if (search) {
      conditions.push(ilike(category.name, `%${search}%`))
    }

    const whereCondition = conditions.length > 0
      ? and(...conditions)
      : undefined

    const orderBy = sortBy === 'name'
      ? (sortOrder === 'asc' ? asc(category.name) : desc(category.name))
      : (sortOrder === 'asc' ? asc(category.createdAt) : desc(category.createdAt))

    const [totalResult, categories] = await Promise.all([
      db
        .select({ count: count() })
        .from(category)
        .where(whereCondition),
      db
        .select()
        .from(category)
        .where(whereCondition)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
    ])

    return {
      categories,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    }
  })
