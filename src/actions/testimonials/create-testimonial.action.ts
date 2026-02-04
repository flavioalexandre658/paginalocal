'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { testimonial, store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const createTestimonialSchema = z.object({
  storeId: z.string().uuid(),
  authorName: z.string().min(1, 'Nome do autor é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  rating: z.number().int().min(1).max(5).optional().default(5),
  imageUrl: z.string().optional(),
})

export const createTestimonialAction = authActionClient
  .schema(createTestimonialSchema)
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
      .insert(testimonial)
      .values({
        ...parsedInput,
        isGoogleReview: false,
      })
      .returning()

    return result
  })
