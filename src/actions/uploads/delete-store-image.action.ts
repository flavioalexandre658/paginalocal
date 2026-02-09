'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, storeImage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

const deleteStoreImageSchema = z.object({
  imageId: z.string().uuid(),
  storeId: z.string().uuid(),
})

export const deleteStoreImageAction = authActionClient
  .schema(deleteStoreImageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { imageId, storeId } = parsedInput

    const isAdmin = ctx.userRole === 'admin'
    const storeData = await db.query.store.findFirst({
      where: isAdmin
        ? eq(store.id, storeId)
        : and(eq(store.id, storeId), eq(store.userId, ctx.userId)),
    })

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const image = await db.query.storeImage.findFirst({
      where: and(eq(storeImage.id, imageId), eq(storeImage.storeId, storeId)),
    })

    if (!image) {
      throw new Error('Imagem não encontrada')
    }

    await db.delete(storeImage).where(eq(storeImage.id, imageId))

    if (image.role === 'hero' && storeData.coverUrl === image.url) {
      await db
        .update(store)
        .set({ coverUrl: null, updatedAt: new Date() })
        .where(eq(store.id, storeId))
    }

    return { success: true }
  })
