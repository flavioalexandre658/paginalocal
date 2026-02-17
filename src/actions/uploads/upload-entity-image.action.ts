'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { uploadToS3 } from '@/lib/s3'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import sharp from 'sharp'

const uploadEntityImageSchema = z.object({
  storeId: z.string().uuid(),
  file: z.instanceof(FormData),
  entity: z.enum(['product', 'collection']),
  entityId: z.string().optional(),
})

export const uploadEntityImageAction = authActionClient
  .schema(uploadEntityImageSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, file: formData, entity, entityId } = parsedInput
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

    const dimensions = entity === 'product'
      ? { width: 800, height: 800 }
      : { width: 1200, height: 900 }

    const optimizedBuffer = await sharp(buffer)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .webp({ quality: 70 })
      .toBuffer()

    const timestamp = Date.now()
    const suffix = entityId ? `-${entityId.substring(0, 8)}` : ''
    const key = `stores/${storeId}/${entity}s/${entity}${suffix}-${timestamp}.webp`

    const { url } = await uploadToS3(optimizedBuffer, key, 'image/webp')

    return { url }
  })
