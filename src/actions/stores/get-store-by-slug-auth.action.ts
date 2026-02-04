'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const getStoreBySlugAuthSchema = z.object({
  slug: z.string().min(1),
})

export const getStoreBySlugAuthAction = authActionClient
  .schema(getStoreBySlugAuthSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [result] = await db
      .select({
        id: store.id,
        slug: store.slug,
        name: store.name,
        customDomain: store.customDomain,
      })
      .from(store)
      .where(and(eq(store.slug, parsedInput.slug), eq(store.userId, ctx.userId)))
      .limit(1)

    return result || null
  })
