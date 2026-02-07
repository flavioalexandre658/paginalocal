'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { user } from '@/db/schema'
import { or, ilike, sql } from 'drizzle-orm'

const searchUsersSchema = z.object({
  query: z.string().min(1),
})

export const searchUsersAction = adminActionClient
  .schema(searchUsersSchema)
  .action(async ({ parsedInput }) => {
    const { query } = parsedInput

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        planName: sql<string | null>`(
          SELECT p.name FROM subscription s
          INNER JOIN plan p ON s.plan_id = p.id
          WHERE s.user_id = "user".id
          AND (s.status = 'ACTIVE' OR s.status = 'TRIALING')
          LIMIT 1
        )`,
        storeCount: sql<number>`(SELECT COUNT(*)::int FROM store WHERE store.user_id = "user".id)`,
      })
      .from(user)
      .where(
        or(
          ilike(user.name, `%${query}%`),
          ilike(user.email, `%${query}%`)
        )
      )
      .limit(10)

    return users
  })
