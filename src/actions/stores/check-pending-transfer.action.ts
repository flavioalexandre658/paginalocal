'use server'

import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storeTransfer } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export const checkPendingTransferAction = authActionClient
  .action(async ({ ctx }) => {
    const [transfer] = await db
      .select({
        id: storeTransfer.id,
        storeId: storeTransfer.storeId,
        wasActivated: storeTransfer.wasActivated,
        createdAt: storeTransfer.createdAt,
        storeName: store.name,
        storeSlug: store.slug,
      })
      .from(storeTransfer)
      .innerJoin(store, eq(storeTransfer.storeId, store.id))
      .where(eq(storeTransfer.toUserId, ctx.userId))
      .orderBy(desc(storeTransfer.createdAt))
      .limit(1)

    if (!transfer) {
      return { hasTransfer: false as const }
    }

    return {
      hasTransfer: true as const,
      transfer: {
        id: transfer.id,
        storeName: transfer.storeName,
        storeSlug: transfer.storeSlug,
        wasActivated: transfer.wasActivated,
        createdAt: transfer.createdAt,
      },
    }
  })
