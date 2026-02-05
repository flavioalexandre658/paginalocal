'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const deleteTrackingSchema = z.object({
  storeSlug: z.string().min(1),
  trackingId: z.string().uuid(),
})

export const deleteTrackingAction = authActionClient
  .schema(deleteTrackingSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug, trackingId } = parsedInput

    const [storeData] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.slug, storeSlug), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [trackingConfig] = await db
      .select({ id: tracking.id })
      .from(tracking)
      .where(and(eq(tracking.id, trackingId), eq(tracking.storeId, storeData.id)))
      .limit(1)

    if (!trackingConfig) {
      throw new Error('Configuração de rastreamento não encontrada')
    }

    await db.delete(tracking).where(eq(tracking.id, trackingId))

    return { success: true }
  })
