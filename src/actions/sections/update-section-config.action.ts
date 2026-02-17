'use server'

import { db } from '@/db'
import { store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'
import type { StoreSection, SectionType } from '@/db/schema'

const updateSectionConfigSchema = z.object({
  storeId: z.string().uuid(),
  sectionType: z.enum([
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
  config: z.record(z.string(), z.unknown()),
})

export const updateSectionConfigAction = authActionClient
  .schema(updateSectionConfigSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, sectionType, config } = parsedInput

    const storeData = await db
      .select()
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeData[0]) {
      throw new Error('Loja não encontrada ou você não tem permissão para editá-la')
    }

    const currentSections = (storeData[0].sections as StoreSection[] | null) || []

    const updatedSections = currentSections.map(section => {
      if (section.type === sectionType) {
        return {
          ...section,
          config: {
            ...section.config,
            ...config,
          },
        }
      }
      return section
    })

    const result = await db
      .update(store)
      .set({
        sections: updatedSections,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    revalidateTag('store-data')
    revalidateTag(`store-${storeId}`)

    return result[0]
  })
