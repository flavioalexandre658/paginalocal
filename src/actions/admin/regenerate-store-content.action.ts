'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, testimonial, storeImage } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'
import { downloadGooglePhoto } from '@/lib/google-places'
import { optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import {
  buildStoreFromGoogle,
  generateUniqueServiceSlugForStore,
  truncate,
} from '@/lib/store-builder'

const regenerateStoreContentSchema = z.object({
  storeId: z.string().uuid(),
  googlePlaceId: z.string().min(1, 'Google Place ID é obrigatório'),
})

export const regenerateStoreContentAction = adminActionClient
  .schema(regenerateStoreContentSchema)
  .action(async ({ parsedInput }) => {
    const [storeData] = await db
      .select()
      .from(store)
      .where(eq(store.id, parsedInput.storeId))
      .limit(1)

    if (!storeData) {
      throw new Error('Loja não encontrada')
    }

    const googlePlaceId = parsedInput.googlePlaceId

    console.log(`[Regenerate] Rebuilding store "${storeData.name}" (id: ${storeData.id}) from Google Place ID: ${googlePlaceId}`)

    // ===== Build store data from Google (same logic as creation) =====
    const result = await buildStoreFromGoogle(googlePlaceId)

    // ===== Process and upload ALL images from Google =====
    let newCoverUrl = result.coverUrl
    let imagesProcessed = 0
    const photos = result.placeDetails.photos

    console.log(`[Regenerate] Google returned ${photos?.length ?? 0} photos`)

    if (photos && photos.length > 0) {
      // Delete existing Google-imported images (keep manually uploaded ones)
      const existingImages = await db
        .select({ id: storeImage.id, originalGoogleRef: storeImage.originalGoogleRef })
        .from(storeImage)
        .where(eq(storeImage.storeId, parsedInput.storeId))

      const googleImages = existingImages.filter(img => img.originalGoogleRef)
      if (googleImages.length > 0) {
        for (const img of googleImages) {
          await db.delete(storeImage).where(eq(storeImage.id, img.id))
        }
        console.log(`[Regenerate] Deleted ${googleImages.length} existing Google images`)
      }

      const manualImageCount = existingImages.length - googleImages.length

      const altVariations = [
        'Fachada', 'Ambiente interno', 'Equipe', 'Estrutura', 'Atendimento',
        'Serviços', 'Instalações', 'Detalhes', 'Vista', 'Espaço',
        'Área externa', 'Recepção', 'Produtos', 'Interior', 'Entrada',
        'Vitrine', 'Salão', 'Área de trabalho', 'Decoração', 'Ambiente',
      ]

      for (let i = 0; i < photos.length; i++) {
        const photoName = photos[i].name
        const isHero = i === 0
        const role = isHero ? 'hero' : 'gallery'
        const altPrefix = altVariations[i % altVariations.length]

        try {
          console.log(`[Regenerate] Downloading photo ${i + 1}/${photos.length}...`)
          const imageBuffer = await downloadGooglePhoto(photoName, isHero ? 1200 : 800)

          const optimized = isHero
            ? await optimizeHeroImage(imageBuffer)
            : await optimizeGalleryImage(imageBuffer)

          const filename = `${role}-regen-${i}`
          const s3Key = generateS3Key(storeData.id, filename)
          const { url } = await uploadToS3(optimized.buffer, s3Key)

          await db.insert(storeImage).values({
            storeId: parsedInput.storeId,
            url,
            alt: `${altPrefix} da ${result.displayName} em ${result.city}`,
            role,
            order: manualImageCount + i,
            width: optimized.width,
            height: optimized.height,
            originalGoogleRef: photoName,
          })

          if (isHero) {
            newCoverUrl = url
          }

          imagesProcessed++
          console.log(`[Regenerate] Photo ${i + 1} saved (${role})`)
        } catch (error) {
          console.error(`[Regenerate] FAILED photo ${i + 1}/${photos.length}:`, error instanceof Error ? error.message : error)
          if (isHero) {
            newCoverUrl = storeData.coverUrl || result.coverUrl
          }
        }
      }

      console.log(`[Regenerate] Images: ${imagesProcessed}/${photos.length} saved`)
    }

    // ===== Update store (preserve: id, userId, slug, isActive, logoUrl, faviconUrl, images in store_image) =====
    const [updatedStore] = await db
      .update(store)
      .set({
        name: result.displayName,
        category: truncate(result.category.name, 100)!,
        categoryId: result.category.id,
        phone: result.phone,
        whatsapp: result.whatsapp,
        address: result.fullAddress,
        city: truncate(result.city, 100)!,
        state: truncate(result.state, 2)!,
        zipCode: result.zipCode,
        googlePlaceId,
        googleRating: result.rating?.toString(),
        googleReviewsCount: result.reviewCount,
        openingHours: result.openingHours,
        latitude: result.latitude?.toString(),
        longitude: result.longitude?.toString(),
        coverUrl: newCoverUrl,
        heroTitle: truncate(result.heroTitle, 100),
        heroSubtitle: truncate(result.heroSubtitle, 200),
        description: result.description,
        seoTitle: truncate(result.seoTitle, 70),
        seoDescription: truncate(result.seoDescription, 160),
        faq: result.faq,
        neighborhoods: result.neighborhoods,
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))
      .returning()

    // ===== Delete and recreate testimonials from fresh Google reviews =====
    await db
      .delete(testimonial)
      .where(eq(testimonial.storeId, parsedInput.storeId))

    let testimonialsSynced = 0
    if (result.placeDetails.reviews && result.placeDetails.reviews.length > 0) {
      const topReviews = result.placeDetails.reviews
        .filter(r => r.rating >= 4)
        .sort((a, b) => {
          const aHasText = a.text?.text && a.text.text.trim().length > 0 ? 1 : 0
          const bHasText = b.text?.text && b.text.text.trim().length > 0 ? 1 : 0
          if (bHasText !== aHasText) return bHasText - aHasText
          return b.rating - a.rating
        })

      for (const review of topReviews) {
        const reviewContent = review.text?.text && review.text.text.trim().length > 0
          ? review.text.text
          : `Avaliou com ${review.rating} estrelas`

        await db
          .insert(testimonial)
          .values({
            storeId: parsedInput.storeId,
            authorName: review.authorAttribution?.displayName || 'Anônimo',
            content: reviewContent,
            rating: review.rating,
            imageUrl: review.authorAttribution?.photoUri || null,
            isGoogleReview: true,
          })
          .onConflictDoNothing()

        testimonialsSynced++
      }

      console.log(`[Regenerate] Synced ${testimonialsSynced} testimonials from Google reviews`)
    }

    // ===== Delete and recreate services =====
    await db
      .delete(service)
      .where(eq(service.storeId, parsedInput.storeId))

    for (let i = 0; i < result.services.length; i++) {
      const svc = result.services[i]
      const svcSlug = await generateUniqueServiceSlugForStore(parsedInput.storeId, svc.name)
      await db
        .insert(service)
        .values({
          storeId: parsedInput.storeId,
          name: svc.name,
          slug: svcSlug,
          description: svc.description,
          seoTitle: truncate(svc.seoTitle, 70) || null,
          seoDescription: truncate(svc.seoDescription, 160) || null,
          longDescription: svc.longDescription || null,
          position: i + 1,
          isActive: true,
        })
    }

    console.log(`[Regenerate] Created ${result.services.length} services`)

    // ===== Revalidate sitemap and category pages =====
    if (storeData.isActive) {
      await revalidateSitemap()

      if (result.category.slug) {
        await revalidateCategoryPages(result.category.slug, generateCitySlug(updatedStore.city))
      }
    }

    console.log(`[Regenerate] Store "${result.displayName}" fully regenerated`)

    return {
      store: updatedStore,
      displayName: result.displayName,
      categoryName: result.category.name,
      servicesCreated: result.services.length,
      faqGenerated: result.faq.length,
      neighborhoodsGenerated: result.neighborhoods.length,
      testimonialsSynced,
      marketingGenerated: result.marketingGenerated,
    }
  })
