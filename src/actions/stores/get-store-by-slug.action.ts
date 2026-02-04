'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const getStoreBySlugSchema = z.object({
  slug: z.string().min(1),
})

export const getStoreBySlugAction = actionClient
  .schema(getStoreBySlugSchema)
  .action(async ({ parsedInput }) => {
    const [result] = await db
      .select()
      .from(store)
      .where(and(eq(store.slug, parsedInput.slug), eq(store.isActive, true)))
      .limit(1)

    return result || null
  })
