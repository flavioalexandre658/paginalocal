'use server'

import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storeImage } from '@/db/schema'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const setImageAsHeroSchema = z.object({
  imageId: z.string().uuid(),
  storeId: z.string().uuid(),
})

export const setImageAsHeroAction = authActionClient
  .schema(setImageAsHeroSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { imageId, storeId } = parsedInput

    // Verificar se a loja pertence ao usuário (ou admin)
    const isAdmin = ctx.userRole === 'admin'
    const storeData = await db.query.store.findFirst({
      where: isAdmin
        ? eq(store.id, storeId)
        : and(eq(store.id, storeId), eq(store.userId, ctx.userId)),
    })

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    // Buscar a imagem selecionada
    const selectedImage = await db.query.storeImage.findFirst({
      where: and(
        eq(storeImage.id, imageId),
        eq(storeImage.storeId, storeId)
      ),
    })

    if (!selectedImage) {
      throw new Error('Imagem não encontrada')
    }

    if (selectedImage.role === 'hero') {
      throw new Error('Esta imagem já é a imagem de destaque')
    }

    // Buscar a imagem hero atual (se existir)
    const currentHero = await db.query.storeImage.findFirst({
      where: and(
        eq(storeImage.storeId, storeId),
        eq(storeImage.role, 'hero')
      ),
    })

    // Buscar o próximo order disponível para a galeria
    const galleryImages = await db.query.storeImage.findMany({
      where: and(
        eq(storeImage.storeId, storeId),
        eq(storeImage.role, 'gallery')
      ),
      orderBy: [desc(storeImage.order)],
      limit: 1,
    })

    const nextGalleryOrder = galleryImages.length > 0 ? galleryImages[0].order + 1 : 1

    // 1. Se existe hero atual, move para galeria
    if (currentHero) {
      await db
        .update(storeImage)
        .set({
          role: 'gallery',
          order: nextGalleryOrder,
        })
        .where(eq(storeImage.id, currentHero.id))
    }

    // 2. Promover imagem selecionada para hero
    await db
      .update(storeImage)
      .set({
        role: 'hero',
        order: 0,
      })
      .where(eq(storeImage.id, imageId))

    // 3. Atualizar coverUrl da store
    await db
      .update(store)
      .set({
        coverUrl: selectedImage.url,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId))

    revalidateStoreCache(storeData.slug)

    return {
      success: true,
      newHeroId: imageId,
      previousHeroId: currentHero?.id || null,
    }
  })
