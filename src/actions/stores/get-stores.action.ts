'use server'

import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const getStoresAction = authActionClient
  .action(async ({ ctx }) => {
    const result = await db
      .select()
      .from(store)
      .where(eq(store.userId, ctx.userId))
      .orderBy(desc(store.createdAt))

    return result
  })
