'use server'

import { db } from '@/db'
import { store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const sectionConfigSchema = z.record(z.string(), z.unknown())

const storeSectionSchema = z.object({
  type: z.enum([
    'HERO',
    'ABOUT',
    'SERVICES',
    'PRODUCTS',
    'PRICING_PLANS',
    'GALLERY',
    'TESTIMONIALS',
    'FAQ',
    'AREAS',
    'STATS',
    'CONTACT',
  ]),
  isActive: z.boolean(),
  order: z.number().int().min(0),
  config: sectionConfigSchema.optional(),
})

const updateStoreSectionsSchema = z.object({
  storeId: z.string().uuid(),
  sections: z.array(storeSectionSchema).min(1),
})

export const updateStoreSectionsAction = authActionClient
  .schema(updateStoreSectionsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, sections } = parsedInput

    const storeOwnership = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeOwnership[0]) {
      throw new Error('Você não tem permissão para editar esta loja')
    }

    const result = await db
      .update(store)
      .set({
        sections,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    revalidateTag('store-data')
    revalidateTag(`store-${storeId}`)

    return result[0]
  })
