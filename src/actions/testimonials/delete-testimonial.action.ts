'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { testimonial, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const deleteTestimonialSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
})

export const deleteTestimonialAction = authActionClient
  .schema(deleteTestimonialSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .delete(testimonial)
      .where(and(eq(testimonial.id, parsedInput.id), eq(testimonial.storeId, parsedInput.storeId)))
      .returning()

    return result
  })
