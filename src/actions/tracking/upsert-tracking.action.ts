'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { tracking, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import type { TrackingPlatform } from '@/db/schema'

const upsertTrackingSchema = z.object({
  storeSlug: z.string().min(1),
  platform: z.enum(['GTM', 'GOOGLE_ANALYTICS', 'GOOGLE_ADS', 'META_PIXEL', 'KWAI', 'TIKTOK']),
  trackingId: z.string().min(1),
})

export const upsertTrackingAction = authActionClient
  .schema(upsertTrackingSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeSlug, platform, trackingId } = parsedInput

    const [storeData] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.slug, storeSlug), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [existing] = await db
      .select({ id: tracking.id })
      .from(tracking)
      .where(and(eq(tracking.storeId, storeData.id), eq(tracking.platform, platform)))
      .limit(1)

    if (existing) {
      const [updated] = await db
        .update(tracking)
        .set({
          trackingId,
          updatedAt: new Date(),
        })
        .where(eq(tracking.id, existing.id))
        .returning()

      return updated
    }

    const [created] = await db
      .insert(tracking)
      .values({
        storeId: storeData.id,
        platform: platform as TrackingPlatform,
        trackingId,
        isActive: true,
      })
      .returning()

    return created
  })
