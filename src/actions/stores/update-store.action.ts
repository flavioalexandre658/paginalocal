'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const updateStoreSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(2).max(255).optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zipCode: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  coverUrl: z.string().url().optional().nullable(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  openingHours: z.record(z.string(), z.string()).optional().nullable(),
  heroTitle: z.string().max(100).optional(),
  heroSubtitle: z.string().max(200).optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  customDomain: z.string().max(255).optional().nullable(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  neighborhoods: z.array(z.string()).optional(),
  showWhatsappButton: z.boolean().optional(),
  showCallButton: z.boolean().optional(),
})

export const updateStoreAction = authActionClient
  .schema(updateStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, ...updateData } = parsedInput

    const isAdmin = ctx.userRole === 'admin'

    const [existingStore] = await db
      .select({ id: store.id })
      .from(store)
      .where(
        isAdmin
          ? eq(store.id, storeId)
          : and(eq(store.id, storeId), eq(store.userId, ctx.userId))
      )
      .limit(1)

    if (!existingStore) {
      throw new Error('Loja não encontrada')
    }

    const [result] = await db
      .update(store)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))
      .returning()

    return result
  })
