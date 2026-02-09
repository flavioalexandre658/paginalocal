'use server'

import { z } from 'zod'
import { adminActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, service, testimonial } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'
import { getPhotoUrl } from '@/lib/google-places'
import { downloadImage, optimizeHeroImage } from '@/lib/image-optimizer'
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

    // ===== Update cover image from Google =====
    let newCoverUrl = result.coverUrl
    if (result.placeDetails.photos && result.placeDetails.photos.length > 0) {
      try {
        const coverPhoto = result.placeDetails.photos[0]
        const googlePhotoUrl = getPhotoUrl(coverPhoto.name, 1200)
        const imageBuffer = await downloadImage(googlePhotoUrl)
        const optimized = await optimizeHeroImage(imageBuffer)
        const s3Key = generateS3Key(storeData.id, 'cover-regen')
        const { url } = await uploadToS3(optimized.buffer, s3Key)
        newCoverUrl = url
        console.log(`[Regenerate] Cover image updated from Google`)
      } catch (error) {
        console.error('[Regenerate] Error updating cover image, keeping existing:', error)
        newCoverUrl = storeData.coverUrl || result.coverUrl
      }
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
        seoTitle: result.seoTitle,
        seoDescription: result.seoDescription,
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
        .slice(0, 15)

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
          seoTitle: svc.seoTitle || null,
          seoDescription: svc.seoDescription || null,
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
