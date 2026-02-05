'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const toggleTrackingSchema = z.object({
  storeSlug: z.string().min(1),
  trackingId: z.string().uuid(),
  isActive: z.boolean(),
})

export const toggleTrackingAction = authActionClient
  .schema(toggleTrackingSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug, trackingId, isActive } = parsedInput

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

    const [updated] = await db
      .update(tracking)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(tracking.id, trackingId))
      .returning()

    return updated
  })
