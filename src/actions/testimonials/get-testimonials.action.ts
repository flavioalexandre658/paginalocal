'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { testimonial } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

const getTestimonialsSchema = z.object({
  storeId: z.string().uuid(),
  limit: z.number().int().positive().optional().default(10),
})

export const getTestimonialsAction = actionClient
  .schema(getTestimonialsSchema)
  .action(async ({ parsedInput }) => {
    const result = await db
      .select()
      .from(testimonial)
      .where(eq(testimonial.storeId, parsedInput.storeId))
      .orderBy(desc(testimonial.createdAt))
      .limit(parsedInput.limit)

    return result
  })
