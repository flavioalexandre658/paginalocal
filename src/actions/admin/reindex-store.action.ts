'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notifyStoreActivated } from '@/lib/google-indexing'

const reindexStoreSchema = z.object({
  storeId: z.string().uuid(),
})

export const reindexStoreAction = adminActionClient
  .schema(reindexStoreSchema)
  .action(async ({ parsedInput }) => {
    const [storeData] = await db
      .select({
        slug: store.slug,
        name: store.name,
        customDomain: store.customDomain,
        isActive: store.isActive,
      })
      .from(store)
      .where(eq(store.id, parsedInput.storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (!storeData.isActive) {
      throw new Error('Loja não está ativa. Ative-a antes de solicitar indexação.')
    }

    const services = await db
      .select({ slug: service.slug })
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))

    const serviceSlugs = services
      .map(s => s.slug)
      .filter((slug): slug is string => !!slug)

    const result = await notifyStoreActivated(
      storeData.slug,
      storeData.customDomain,
      serviceSlugs,
    )

    return {
      storeName: storeData.name,
      slug: storeData.slug,
      totalUrls: result.total,
      successCount: result.success,
      failedCount: result.failed,
    }
  })
