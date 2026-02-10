'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notifyStoreActivated, notifyStoreDeactivated } from '@/lib/google-indexing'

const toggleStoreStatusSchema = z.object({
  storeId: z.string().uuid(),
  isActive: z.boolean(),
})

export const toggleStoreStatusAction = adminActionClient
  .schema(toggleStoreStatusSchema)
  .action(async ({ parsedInput }) => {
    const { storeId, isActive } = parsedInput

    const [result] = await db
      .update(store)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    if (isActive) {
      const services = await db
        .select({ slug: service.slug })
        .from(service)
        .where(eq(service.storeId, storeId))

      const serviceSlugs = services
        .map(s => s.slug)
        .filter((slug): slug is string => !!slug)

      notifyStoreActivated(result.slug, result.customDomain, serviceSlugs).catch((error) => {
        console.error(`[ToggleStore] Erro ao indexar ${result.slug}:`, error)
      })
    } else {
      notifyStoreDeactivated(result.slug, result.customDomain).catch((error) => {
        console.error(`[ToggleStore] Erro ao desindexar ${result.slug}:`, error)
      })
    }

    return result
  })
