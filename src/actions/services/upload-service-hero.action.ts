'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { uploadToS3 } from '@/lib/s3'
import { db } from '@/db'
import { store, service } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import sharp from 'sharp'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const uploadServiceHeroSchema = z.object({
  serviceId: z.string().uuid(),
  storeId: z.string().uuid(),
  file: z.instanceof(FormData),
})

export const uploadServiceHeroAction = authActionClient
  .schema(uploadServiceHeroSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { serviceId, storeId, file: formData } = parsedInput
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    const isAdmin = ctx.userRole === 'admin'
    const [storeData] = await db
      .select({ id: store.id, slug: store.slug })
      .from(store)
      .where(
        isAdmin
          ? eq(store.id, storeId)
          : and(eq(store.id, storeId), eq(store.userId, ctx.userId))
      )
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const [serviceData] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.id, serviceId), eq(service.storeId, storeId)))
      .limit(1)

    if (!serviceData) {
      throw new Error('Serviço não encontrado')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem')
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('A imagem deve ter no máximo 10MB')
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 675, { fit: 'cover' })
      .webp({ quality: 75 })
      .toBuffer()

    const timestamp = Date.now()
    const key = `services/${serviceId}/hero-${timestamp}.webp`

    const { url } = await uploadToS3(optimizedBuffer, key, 'image/webp')

    await db
      .update(service)
      .set({ heroImageUrl: url, updatedAt: new Date() })
      .where(eq(service.id, serviceId))

    revalidateStoreCache(storeData.slug)

    return { url }
  })
