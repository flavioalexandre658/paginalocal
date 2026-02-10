'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const purgeStoreCacheSchema = z.object({
  storeId: z.string().uuid(),
})

export const purgeStoreCacheAction = adminActionClient
  .schema(purgeStoreCacheSchema)
  .action(async ({ parsedInput }) => {
    const [storeData] = await db
      .select({ slug: store.slug, city: store.city, isActive: store.isActive })
      .from(store)
      .where(eq(store.id, parsedInput.storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    revalidateStoreCache(storeData.slug)
    revalidatePath('/sitemap.xml')

    console.log(`[Cache] Purged cache for store "${storeData.slug}"`)

    return { slug: storeData.slug }
  })
