'use server'

import { db } from '@/db'
import { storeImage, store } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and, count } from 'drizzle-orm'
import { z } from 'zod'
import { getPhotoUrl } from '@/lib/google-places'
import { downloadImage, optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import { checkCanUploadPhoto } from '@/lib/plan-middleware'

const processStoreImagesSchema = z.object({
  storeId: z.string().uuid(),
  photoReferences: z.array(z.string()).max(7),
  storeName: z.string(),
  city: z.string(),
})

interface ProcessedImage {
  url: string
  alt: string
  role: 'hero' | 'gallery'
  order: number
  width: number
  height: number
  originalGoogleRef: string
}

const ALT_TEMPLATES = [
  (name: string, city: string) => `Fachada da ${name} em ${city}`,
  (name: string, city: string) => `Ambiente interno da ${name} em ${city}`,
  (name: string, city: string) => `Equipe da ${name} em ${city}`,
  (name: string, city: string) => `Estrutura da ${name} em ${city}`,
  (name: string, city: string) => `Atendimento na ${name} em ${city}`,
  (name: string, city: string) => `Serviços da ${name} em ${city}`,
  (name: string, city: string) => `Instalações da ${name} em ${city}`,
]

export const processStoreImagesAction = authActionClient
  .schema(processStoreImagesSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId, photoReferences, storeName, city } = parsedInput

    const storeData = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeData[0]) {
      throw new Error('Loja não encontrada')
    }

    const [currentImageCount] = await db
      .select({ count: count() })
      .from(storeImage)
      .where(eq(storeImage.storeId, storeId))

    const photoCheck = await checkCanUploadPhoto(userId, storeId, currentImageCount?.count || 0)
    if (!photoCheck.allowed) {
      throw new Error(photoCheck.reason || 'Limite de fotos atingido.')
    }

    const maxAllowed = photoCheck.remaining || 0
    const processedImages: ProcessedImage[] = []
    const maxImages = Math.min(photoReferences.length, maxAllowed, 7)

    for (let i = 0; i < maxImages; i++) {
      const photoRef = photoReferences[i]
      const isHero = i === 0
      const role = isHero ? 'hero' : 'gallery'

      try {
        const googlePhotoUrl = getPhotoUrl(photoRef, isHero ? 1200 : 800)
        const imageBuffer = await downloadImage(googlePhotoUrl)

        const optimized = isHero
          ? await optimizeHeroImage(imageBuffer)
          : await optimizeGalleryImage(imageBuffer)

        const filename = `${role}-${i}`
        const s3Key = generateS3Key(storeId, filename)
        const { url } = await uploadToS3(optimized.buffer, s3Key)

        const altText = ALT_TEMPLATES[i]
          ? ALT_TEMPLATES[i](storeName, city)
          : `Foto da ${storeName} em ${city}`

        processedImages.push({
          url,
          alt: altText,
          role,
          order: i,
          width: optimized.width,
          height: optimized.height,
          originalGoogleRef: photoRef,
        })
      } catch (error) {
        console.error(`Erro ao processar imagem ${i}:`, error)
      }
    }

    if (processedImages.length > 0) {
      await db.insert(storeImage).values(
        processedImages.map((img) => ({
          storeId,
          url: img.url,
          alt: img.alt,
          role: img.role,
          order: img.order,
          width: img.width,
          height: img.height,
          originalGoogleRef: img.originalGoogleRef,
        }))
      )

      const heroImage = processedImages.find((img) => img.role === 'hero')
      if (heroImage) {
        await db
          .update(store)
          .set({
            coverUrl: heroImage.url,
            updatedAt: new Date(),
          })
          .where(eq(store.id, storeId))
      }
    }

    return {
      success: true,
      processedCount: processedImages.length,
      heroUrl: processedImages.find((img) => img.role === 'hero')?.url,
    }
  })
