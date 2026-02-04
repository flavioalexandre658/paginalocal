'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { testimonial, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const updateTestimonialSchema = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
  authorName: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  imageUrl: z.string().nullable().optional(),
})

export const updateTestimonialAction = authActionClient
  .schema(updateTestimonialSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, storeId, ...data } = parsedInput

    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .update(testimonial)
      .set(data)
      .where(and(eq(testimonial.id, id), eq(testimonial.storeId, storeId)))
      .returning()

    return result
  })
