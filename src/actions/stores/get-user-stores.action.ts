'use server'

import { db } from '@/db'
import { store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, desc } from 'drizzle-orm'

export const getUserStoresAction = authActionClient
  .action(async ({ ctx }) => {
    const { userId } = ctx

    const stores = await db
      .select({
        id: store.id,
        name: store.name,
        slug: store.slug,
        category: store.category,
        city: store.city,
        state: store.state,
        coverUrl: store.coverUrl,
        googleRating: store.googleRating,
        googleReviewsCount: store.googleReviewsCount,
        isActive: store.isActive,
        createdAt: store.createdAt,
      })
      .from(store)
      .where(eq(store.userId, userId))
      .orderBy(desc(store.createdAt))

    return stores
  })
