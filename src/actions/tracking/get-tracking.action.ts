'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const getTrackingSchema = z.object({
  storeSlug: z.string().min(1),
})

export const getTrackingAction = authActionClient
  .schema(getTrackingSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug } = parsedInput

    const [storeData] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.slug, storeSlug), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const trackingConfigs = await db
      .select()
      .from(tracking)
      .where(eq(tracking.storeId, storeData.id))

    return trackingConfigs
  })
