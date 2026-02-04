'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, testimonial } from '@/db/schema'
import { eq } from 'drizzle-orm'

const syncBusinessDataSchema = z.object({
  storeId: z.string().uuid(),
  googlePlaceId: z.string(),
})

interface GooglePlaceDetails {
  name: string
  formatted_address: string
  formatted_phone_number?: string
  opening_hours?: {
    weekday_text: string[]
  }
  rating?: number
  user_ratings_total?: number
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    profile_photo_url?: string
  }>
  photos?: Array<{
    photo_reference: string
  }>
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

async function fetchGooglePlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key não configurada')
  }

  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'opening_hours',
    'rating',
    'user_ratings_total',
    'reviews',
    'photos',
    'geometry',
  ].join(',')

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=pt-BR`
  )

  const data = await response.json()

  if (data.status !== 'OK') {
    return null
  }

  return data.result
}

function parseOpeningHours(weekdayText: string[]): Record<string, string> {
  const daysMap: Record<string, string> = {
    'segunda-feira': 'seg',
    'terça-feira': 'ter',
    'quarta-feira': 'qua',
    'quinta-feira': 'qui',
    'sexta-feira': 'sex',
    'sábado': 'sab',
    'domingo': 'dom',
  }

  const hours: Record<string, string> = {}

  weekdayText.forEach(line => {
    const [day, time] = line.split(': ')
    const dayKey = daysMap[day.toLowerCase()]
    if (dayKey && time && time !== 'Fechado') {
      const normalized = time.replace(/\s/g, '').replace('–', '-')
      hours[dayKey] = normalized
    }
  })

  return hours
}

export const syncBusinessDataAction = authActionClient
  .schema(syncBusinessDataSchema)
  .action(async ({ parsedInput }) => {
    const placeDetails = await fetchGooglePlaceDetails(parsedInput.googlePlaceId)

    if (!placeDetails) {
      throw new Error('Não foi possível buscar dados do Google')
    }

    const openingHours = placeDetails.opening_hours?.weekday_text
      ? parseOpeningHours(placeDetails.opening_hours.weekday_text)
      : undefined

    const [updatedStore] = await db
      .update(store)
      .set({
        googlePlaceId: parsedInput.googlePlaceId,
        googleRating: placeDetails.rating?.toString(),
        googleReviewsCount: placeDetails.user_ratings_total,
        openingHours: openingHours,
        latitude: placeDetails.geometry?.location.lat.toString(),
        longitude: placeDetails.geometry?.location.lng.toString(),
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
            authorName: review.author_name,
            content: review.text,
            rating: review.rating,
            imageUrl: review.profile_photo_url,
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
