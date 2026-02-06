'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { getPlaceDetails, getPhotoUrl, inferCategory } from '@/lib/google-places'

const getPlacePreviewSchema = z.object({
  placeId: z.string().min(1, 'Place ID é obrigatório'),
})

export interface PlacePreview {
  placeId: string
  name: string
  address: string
  phone: string | null
  website: string | null
  rating: number | null
  reviewsCount: number | null
  photos: string[]
  openingHours: string[] | null
  isOpen: boolean | null
  category: string | null
  priceLevel: string | null
  topReviews: {
    author: string
    rating: number
    text: string
    photoUrl: string | null
  }[]
}

export const getPlacePreviewAction = authActionClient
  .schema(getPlacePreviewSchema)
  .action(async ({ parsedInput }): Promise<PlacePreview | null> => {
    const details = await getPlaceDetails(parsedInput.placeId)

    if (!details) {
      return null
    }

    const photos = (details.photos || [])
      .slice(0, 10)
      .map(photo => getPhotoUrl(photo.photo_reference, 400))

    const topReviews = (details.reviews || [])
      .sort((a, b) => b.rating - a.rating)
      .map(r => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text && r.text.length > 0
          ? (r.text.length > 200 ? r.text.substring(0, 200) + '...' : r.text)
          : '',
        photoUrl: r.profile_photo_url || null,
      }))

    const category = details.types ? inferCategory(details.types) : null

    let priceLevel: string | null = null
    if (details.price_level !== undefined) {
      const priceLevels = ['Gratuito', '$', '$$', '$$$', '$$$$']
      priceLevel = priceLevels[details.price_level] || null
    }

    return {
      placeId: details.place_id,
      name: details.name,
      address: details.formatted_address,
      phone: details.formatted_phone_number || null,
      website: details.website || null,
      rating: details.rating || null,
      reviewsCount: details.user_ratings_total || null,
      photos,
      openingHours: details.opening_hours?.weekday_text || null,
      isOpen: details.opening_hours?.open_now ?? null,
      category,
      priceLevel,
      topReviews,
    }
  })
