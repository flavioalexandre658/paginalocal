'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { uploadToS3 } from '@/lib/s3'
import { db } from '@/db'
import { store, storeImage } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import sharp from 'sharp'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const uploadStoreImageSchema = z.object({
  storeId: z.string().uuid(),
  file: z.instanceof(FormData),
  role: z.enum(['hero', 'gallery']).default('gallery'),
})

export const uploadStoreImageAction = authActionClient
  .schema(uploadStoreImageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, file: formData, role } = parsedInput
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    const isAdmin = ctx.userRole === 'admin'
    const storeData = await db.query.store.findFirst({
      where: isAdmin
        ? eq(store.id, storeId)
        : and(eq(store.id, storeId), eq(store.userId, ctx.userId)),
    })

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem')
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('A imagem deve ter no máximo 10MB')
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const isHero = role === 'hero'
    const dimensions = isHero
      ? { width: 1200, height: 675 }
      : { width: 800, height: 800 }

    const optimizedBuffer = await sharp(buffer)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .webp({ quality: 65 })
      .toBuffer()

    const metadata = await sharp(optimizedBuffer).metadata()

    const timestamp = Date.now()
    const key = `stores/${storeId}/${role}-${timestamp}.webp`

    const { url } = await uploadToS3(optimizedBuffer, key, 'image/webp')

    const existingImages = await db.query.storeImage.findMany({
      where: eq(storeImage.storeId, storeId),
      orderBy: (img, { desc }) => [desc(img.order)],
    })

    const nextOrder = existingImages.length > 0 ? existingImages[0].order + 1 : 0

    const [newImage] = await db
      .insert(storeImage)
      .values({
        storeId,
        url,
        alt: `Foto da ${storeData.name}`,
        role,
        order: isHero ? 0 : nextOrder,
        width: metadata.width,
        height: metadata.height,
      })
      .returning()

    if (isHero) {
      await db
        .update(store)
        .set({ coverUrl: url, updatedAt: new Date() })
        .where(eq(store.id, storeId))
    }

    revalidateStoreCache(storeData.slug)

    return {
      image: newImage,
      url,
    }
  })
