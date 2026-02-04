"use server"

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, lead, testimonial, storeImage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { deleteStoreFilesFromS3 } from '@/lib/s3'

const deleteStoreSchema = z.object({
  storeId: z.string().uuid(),
  confirmationText: z.string(),
})

export const deleteStoreAction = authActionClient
  .schema(deleteStoreSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, confirmationText } = parsedInput
    const { userId } = ctx

    if (confirmationText !== 'EXCLUIR') {
      throw new Error('Texto de confirmação incorreto')
    }

    const [storeData] = await db
      .select({ id: store.id, name: store.name, slug: store.slug })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada ou você não tem permissão para excluí-la')
    }

    const deletedFilesCount = await deleteStoreFilesFromS3(storeId)

    await db.delete(storeImage).where(eq(storeImage.storeId, storeId))

    await db.delete(testimonial).where(eq(testimonial.storeId, storeId))

    await db.delete(lead).where(eq(lead.storeId, storeId))

    await db.delete(service).where(eq(service.storeId, storeId))

    await db.delete(store).where(eq(store.id, storeId))

    return {
      success: true,
      deletedStore: {
        name: storeData.name,
        slug: storeData.slug,
      },
      deletedFilesCount,
    }
  })
