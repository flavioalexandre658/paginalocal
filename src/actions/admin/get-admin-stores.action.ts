'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, or, sql, ilike, count, desc, and } from 'drizzle-orm'

const getAdminStoresSchema = z.object({
  search: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['all', 'active', 'inactive']).default('all'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const getAdminStoresAction = adminActionClient
  .schema(getAdminStoresSchema)
  .action(async ({ parsedInput }) => {
    const { search, userId, status, page, limit } = parsedInput
    const offset = (page - 1) * limit

    const conditions = []

    if (search) {
      conditions.push(
        or(
          ilike(store.name, `%${search}%`),
          ilike(store.slug, `%${search}%`)
        )
      )
    }

    if (userId) {
      conditions.push(eq(store.userId, userId))
    }

    if (status === 'active') {
      conditions.push(eq(store.isActive, true))
    } else if (status === 'inactive') {
      conditions.push(eq(store.isActive, false))
    }

    const whereCondition = conditions.length > 0
      ? and(...conditions)
      : undefined

    const [totalResult, stores] = await Promise.all([
      db
        .select({ count: count() })
        .from(store)
        .where(whereCondition),
      db
        .select({
          id: store.id,
          name: store.name,
          slug: store.slug,
          category: store.category,
          city: store.city,
          state: store.state,
          isActive: store.isActive,
          coverUrl: store.coverUrl,
          createdAt: store.createdAt,
          userId: store.userId,
          ownerName: sql<string>`(SELECT u.name FROM "user" u WHERE u.id = store.user_id)`,
          ownerEmail: sql<string>`(SELECT u.email FROM "user" u WHERE u.id = store.user_id)`,
          ownerPhone: sql<string | null>`(SELECT u.phone FROM "user" u WHERE u.id = store.user_id)`,
          ownerPlan: sql<string | null>`(
            SELECT p.name FROM subscription s
            INNER JOIN plan p ON s.plan_id = p.id
            WHERE s.user_id = store.user_id
            AND (s.status = 'ACTIVE' OR s.status = 'TRIALING')
            LIMIT 1
          )`,
        })
        .from(store)
        .where(whereCondition)
        .orderBy(desc(store.createdAt))
        .limit(limit)
        .offset(offset),
    ])

    return {
      stores,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    }
  })
