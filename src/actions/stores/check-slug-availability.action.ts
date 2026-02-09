'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'

const checkSlugSchema = z.object({
  slug: z.string().min(3).max(60),
  storeId: z.string().uuid(),
})

export const checkSlugAvailabilityAction = authActionClient
  .schema(checkSlugSchema)
  .action(async ({ parsedInput }) => {
    const { slug, storeId } = parsedInput

    const [existing] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.slug, slug), ne(store.id, storeId)))
      .limit(1)

    return { available: !existing }
  })
