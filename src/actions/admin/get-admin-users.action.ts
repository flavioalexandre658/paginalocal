'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { user } from '@/db/schema'
import { or, sql, ilike, count, desc } from 'drizzle-orm'

const getAdminUsersSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})

export const getAdminUsersAction = adminActionClient
  .schema(getAdminUsersSchema)
  .action(async ({ parsedInput }) => {
    const { search, page, limit } = parsedInput
    const offset = (page - 1) * limit

    const searchCondition = search
      ? or(
          ilike(user.name, `%${search}%`),
          ilike(user.email, `%${search}%`)
        )
      : undefined

    const [totalResult, users] = await Promise.all([
      db
        .select({ count: count() })
        .from(user)
        .where(searchCondition),
      db
        .select({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          image: user.image,
          banned: user.banned,
          createdAt: user.createdAt,
          storeCount: sql<number>`(SELECT COUNT(*)::int FROM store WHERE store.user_id = "user".id)`,
          planName: sql<string | null>`(
            SELECT p.name FROM subscription s
            INNER JOIN plan p ON s.plan_id = p.id
            WHERE s.user_id = "user".id
            AND (s.status = 'ACTIVE' OR s.status = 'TRIALING')
            LIMIT 1
          )`,
          subscriptionStatus: sql<string | null>`(
            SELECT s.status FROM subscription s
            WHERE s.user_id = "user".id
            AND (s.status = 'ACTIVE' OR s.status = 'TRIALING' OR s.status = 'PAST_DUE')
            ORDER BY s.created_at DESC
            LIMIT 1
          )`,
        })
        .from(user)
        .where(searchCondition)
        .orderBy(desc(user.createdAt))
        .limit(limit)
        .offset(offset),
    ])

    return {
      users,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    }
  })
