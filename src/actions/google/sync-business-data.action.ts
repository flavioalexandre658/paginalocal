'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, testimonial } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getPlaceDetails, parseOpeningHours } from '@/lib/google-places'

const syncBusinessDataSchema = z.object({
  storeId: z.string().uuid(),
  googlePlaceId: z.string(),
})

export const syncBusinessDataAction = authActionClient
  .schema(syncBusinessDataSchema)
  .action(async ({ parsedInput }) => {
    const placeDetails = await getPlaceDetails(parsedInput.googlePlaceId)

    if (!placeDetails) {
      throw new Error('Não foi possível buscar dados do Google')
    }

    const openingHours = placeDetails.regularOpeningHours?.weekdayDescriptions
      ? parseOpeningHours(placeDetails.regularOpeningHours.weekdayDescriptions)
      : undefined

    const [updatedStore] = await db
      .update(store)
      .set({
        googlePlaceId: parsedInput.googlePlaceId,
        googleRating: placeDetails.rating?.toString(),
        googleReviewsCount: placeDetails.userRatingCount,
        openingHours: openingHours,
        latitude: placeDetails.location?.latitude.toString(),
        longitude: placeDetails.location?.longitude.toString(),
        updatedAt: new Date(),
      })
      .where(eq(store.id, parsedInput.storeId))
      .returning()

    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      const topReviews = placeDetails.reviews
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5)

      for (const review of topReviews) {
        await db
          .insert(testimonial)
          .values({
            storeId: parsedInput.storeId,
            authorName: review.authorAttribution?.displayName || 'Anônimo',
            content: review.text?.text || '',
            rating: review.rating,
            imageUrl: review.authorAttribution?.photoUri || null,
            isGoogleReview: true,
          })
          .onConflictDoNothing()
      }
    }

    return {
      store: updatedStore,
      syncedReviews: placeDetails.reviews?.length || 0,
    }
  })
