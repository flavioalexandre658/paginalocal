'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { removeDomainFromVercel } from '@/actions/vercel/add-domain'
import { revalidateSitemap, revalidateStoreCache } from '@/lib/sitemap-revalidation'

const updateStoreSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(2).max(255).optional(),
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .max(60, 'Slug deve ter no máximo 60 caracteres')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Apenas letras minúsculas, números e hífens (sem hífen no início/fim)')
    .optional(),
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
  heroBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
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
  whatsappDefaultMessage: z.string().max(300, 'Mensagem deve ter no máximo 300 caracteres').optional().nullable(),
  showWhatsappButton: z.boolean().optional(),
  showCallButton: z.boolean().optional(),
  instagramUrl: z.string().url().optional().nullable(),
  facebookUrl: z.string().url().optional().nullable(),
  googleBusinessUrl: z.string().url().optional().nullable(),
  highlightBadge: z.string().max(50).optional().nullable(),
  highlightText: z.string().max(500).optional().nullable(),
})

export const updateStoreAction = authActionClient
  .schema(updateStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, slug: newSlug, ...updateData } = parsedInput

    const isAdmin = ctx.userRole === 'admin'

    const [existingStore] = await db
      .select({ id: store.id, slug: store.slug })
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

    // Slug uniqueness check
    const slugChanged = newSlug && newSlug !== existingStore.slug
    if (slugChanged) {
      const [slugTaken] = await db
        .select({ id: store.id })
        .from(store)
        .where(and(eq(store.slug, newSlug), ne(store.id, storeId)))
        .limit(1)

      if (slugTaken) {
        throw new Error('Este endereço já está em uso. Escolha outro.')
      }
    }

    const setData: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    }

    if (slugChanged) {
      setData.slug = newSlug
    }

    const [result] = await db
      .update(store)
      .set(setData)
      .where(eq(store.id, storeId))
      .returning()

    const currentSlug = slugChanged ? newSlug! : existingStore.slug
    revalidateStoreCache(currentSlug)

    if (slugChanged) {
      const oldDomain = `${existingStore.slug}.paginalocal.com.br`
      const newDomain = `${newSlug}.paginalocal.com.br`

      revalidateStoreCache(existingStore.slug)

      try {
        await addDomainToVercel(newDomain)
        console.log(`[UpdateStore] New subdomain added: ${newDomain}`)
      } catch (error) {
        console.error(`[UpdateStore] Error adding new subdomain ${newDomain}:`, error)
      }

      try {
        await removeDomainFromVercel(oldDomain)
        console.log(`[UpdateStore] Old subdomain removed: ${oldDomain}`)
      } catch (error) {
        console.error(`[UpdateStore] Error removing old subdomain ${oldDomain}:`, error)
      }

      await revalidateSitemap()
    }

    return result
  })
