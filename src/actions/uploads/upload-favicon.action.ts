'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { uploadToS3 } from '@/lib/s3'
import { db } from '@/db'
import { store } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import sharp from 'sharp'
import { revalidateStoreCache } from '@/lib/sitemap-revalidation'

const uploadFaviconSchema = z.object({
  storeId: z.string().uuid(),
  file: z.instanceof(FormData),
})

export const uploadFaviconAction = authActionClient
  .schema(uploadFaviconSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { storeId, file: formData } = parsedInput
    const file = formData.get('file') as File

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    const storeData = await db.query.store.findFirst({
      where: and(eq(store.id, storeId), eq(store.userId, ctx.userId)),
    })

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('O arquivo deve ser uma imagem')
    }

    if (file.size > 2 * 1024 * 1024) {
      throw new Error('O favicon deve ter no máximo 2MB')
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Salvar em alta qualidade (180x180) para manter nitidez em diferentes contextos
    // O navegador redimensiona conforme necessário para o favicon real
    const optimizedBuffer = await sharp(buffer)
      .resize(180, 180, { 
        fit: 'cover',
        withoutEnlargement: false, // Permite aumentar se for menor
      })
      .png({ 
        quality: 100,
        compressionLevel: 6, // Balanceia qualidade vs tamanho
      })
      .toBuffer()

    const timestamp = Date.now()
    const key = `stores/${storeId}/favicon-${timestamp}.png`

    const { url } = await uploadToS3(optimizedBuffer, key, 'image/png')

    await db
      .update(store)
      .set({ faviconUrl: url, updatedAt: new Date() })
      .where(eq(store.id, storeId))

    revalidateStoreCache(storeData.slug)

    return { url }
  })
