'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { uploadToS3 } from '@/lib/s3'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import sharp from 'sharp'

const uploadUserAvatarSchema = z.object({
  file: z.instanceof(FormData),
})

export const uploadUserAvatarAction = authActionClient
  .schema(uploadUserAvatarSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { file: formData } = parsedInput
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem')
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('A imagem deve ter no máximo 5MB')
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimizedBuffer = await sharp(buffer)
      .resize(256, 256, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer()

    const timestamp = Date.now()
    const key = `users/${ctx.userId}/avatar-${timestamp}.webp`

    const { url } = await uploadToS3(optimizedBuffer, key, 'image/webp')

    await db
      .update(user)
      .set({ image: url, updatedAt: new Date() })
      .where(eq(user.id, ctx.userId))

    return { url }
  })
