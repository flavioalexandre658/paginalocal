'use server'

import { db } from '@/db'
import { store, testimonial, storeImage } from '@/db/schema'
import { authActionClient } from '@/lib/safe-action'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { getPlaceDetails, getPhotoUrl, parseOpeningHours, type GooglePlaceReview } from '@/lib/google-places'
import { downloadImage, optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import { checkCanUseGmbSync } from '@/lib/plan-middleware'

const syncStoreWithGoogleSchema = z.object({
  storeId: z.string().uuid(),
})

export const syncStoreWithGoogleAction = authActionClient
  .schema(syncStoreWithGoogleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { userId } = ctx
    const { storeId } = parsedInput

    const gmbCheck = await checkCanUseGmbSync(userId)
    if (!gmbCheck.allowed) {
      throw new Error(gmbCheck.reason || 'Sincronização com Google Meu Negócio disponível apenas para assinantes.')
    }

    const storeData = await db
      .select({
        id: store.id,
        googlePlaceId: store.googlePlaceId,
        name: store.name,
        city: store.city,
      })
      .from(store)
      .where(and(eq(store.id, storeId), eq(store.userId, userId)))
      .limit(1)

    if (!storeData[0]) {
      throw new Error('Loja não encontrada')
    }

    if (!storeData[0].googlePlaceId) {
      throw new Error('Esta loja não possui integração com o Google')
    }

    const placeDetails = await getPlaceDetails(storeData[0].googlePlaceId)

    if (!placeDetails) {
      throw new Error('Não foi possível obter dados do Google')
    }

    const storeName = storeData[0].name
    const city = storeData[0].city || ''

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (placeDetails.rating) {
      updateData.googleRating = placeDetails.rating.toString()
    }

    if (placeDetails.userRatingCount) {
      updateData.googleReviewsCount = placeDetails.userRatingCount
    }

    if (placeDetails.nationalPhoneNumber) {
      updateData.phone = placeDetails.nationalPhoneNumber.replace(/\D/g, '')
    }

    if (placeDetails.regularOpeningHours?.weekdayDescriptions) {
      updateData.openingHours = parseOpeningHours(placeDetails.regularOpeningHours.weekdayDescriptions)
    }

    await db
      .update(store)
      .set(updateData)
      .where(eq(store.id, storeId))

    // ===== Sync reviews =====
    let newReviewsCount = 0

    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      const topReviews = placeDetails.reviews
        .filter((r: GooglePlaceReview) => r.rating >= 4)
        .sort((a: GooglePlaceReview, b: GooglePlaceReview) => {
          const aHasText = a.text?.text && a.text.text.trim().length > 0 ? 1 : 0
          const bHasText = b.text?.text && b.text.text.trim().length > 0 ? 1 : 0
          if (bHasText !== aHasText) return bHasText - aHasText
          return b.rating - a.rating
        })
        .slice(0, 15)

      for (const review of topReviews) {
        const reviewContent = review.text?.text && review.text.text.trim().length > 0
          ? review.text.text
          : `Avaliou com ${review.rating} estrelas`

        const result = await db
          .insert(testimonial)
          .values({
            storeId: storeId,
            authorName: review.authorAttribution?.displayName || 'Anônimo',
            content: reviewContent,
            rating: review.rating,
            imageUrl: review.authorAttribution?.photoUri || null,
            isGoogleReview: true,
          })
          .onConflictDoNothing()
          .returning()

        if (result.length > 0) {
          newReviewsCount++
        }
      }
    }

    // ===== Sync images =====
    let imagesProcessed = 0

    if (placeDetails.photos && placeDetails.photos.length > 0) {
      const existingImages = await db
        .select({ originalGoogleRef: storeImage.originalGoogleRef })
        .from(storeImage)
        .where(eq(storeImage.storeId, storeId))

      const existingRefs = new Set(existingImages.map(img => img.originalGoogleRef))

      const currentImageCount = existingImages.length
      const maxNewImages = Math.max(0, 7 - currentImageCount)

      const newPhotos = placeDetails.photos
        .filter(photo => !existingRefs.has(photo.name))
        .slice(0, maxNewImages)

      const altTemplates = [
        `Fachada da ${storeName} em ${city}`,
        `Ambiente interno da ${storeName} em ${city}`,
        `Equipe da ${storeName} em ${city}`,
        `Estrutura da ${storeName} em ${city}`,
        `Atendimento na ${storeName} em ${city}`,
        `Serviços da ${storeName} em ${city}`,
        `Instalações da ${storeName} em ${city}`,
      ]

      for (let i = 0; i < newPhotos.length; i++) {
        const photo = newPhotos[i]
        const photoName = photo.name
        const imageIndex = currentImageCount + i
        const isHero = imageIndex === 0
        const role = isHero ? 'hero' : 'gallery'

        try {
          const googlePhotoUrl = getPhotoUrl(photoName, isHero ? 1200 : 800)
          const imageBuffer = await downloadImage(googlePhotoUrl)

          const optimized = isHero
            ? await optimizeHeroImage(imageBuffer)
            : await optimizeGalleryImage(imageBuffer)

          const filename = `${role}-${imageIndex}-${Date.now()}`
          const s3Key = generateS3Key(storeId, filename)
          const { url } = await uploadToS3(optimized.buffer, s3Key)

          await db.insert(storeImage).values({
            storeId,
            url,
            alt: altTemplates[imageIndex] || `Foto da ${storeName} em ${city}`,
            role,
            order: imageIndex,
            width: optimized.width,
            height: optimized.height,
            originalGoogleRef: photoName,
          })

          if (isHero) {
            await db
              .update(store)
              .set({ coverUrl: url, updatedAt: new Date() })
              .where(eq(store.id, storeId))
          }

          imagesProcessed++
        } catch (error) {
          console.error(`[Sync Images] Erro ao processar imagem ${i}:`, error)
        }
      }
    }

    const updatedStore = await db
      .select({
        googleRating: store.googleRating,
        googleReviewsCount: store.googleReviewsCount,
      })
      .from(store)
      .where(eq(store.id, storeId))
      .limit(1)

    return {
      success: true,
      rating: updatedStore[0]?.googleRating,
      reviewsCount: updatedStore[0]?.googleReviewsCount,
      newReviewsAdded: newReviewsCount,
      imagesProcessed,
    }
  })
