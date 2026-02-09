'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { getPlaceDetails, getPhotoUrl } from '@/lib/google-places'

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
      .map(photo => getPhotoUrl(photo.name, 400))

    const topReviews = (details.reviews || [])
      .sort((a, b) => b.rating - a.rating)
      .map(r => ({
        author: r.authorAttribution?.displayName || 'Anônimo',
        rating: r.rating,
        text: r.text?.text
          ? (r.text.text.length > 200 ? r.text.text.substring(0, 200) + '...' : r.text.text)
          : '',
        photoUrl: r.authorAttribution?.photoUri || null,
      }))

    // Categoria direta do Google em PT-BR
    const category = details.primaryTypeDisplayName?.text || null

    let priceLevel: string | null = null
    if (details.priceLevel) {
      const priceLevels: Record<string, string> = {
        'PRICE_LEVEL_FREE': 'Gratuito',
        'PRICE_LEVEL_INEXPENSIVE': '$',
        'PRICE_LEVEL_MODERATE': '$$',
        'PRICE_LEVEL_EXPENSIVE': '$$$',
        'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$',
      }
      priceLevel = priceLevels[details.priceLevel] || null
    }

    return {
      placeId: details.id,
      name: details.displayName?.text || '',
      address: details.formattedAddress || '',
      phone: details.nationalPhoneNumber || null,
      website: details.websiteUri || null,
      rating: details.rating || null,
      reviewsCount: details.userRatingCount || null,
      photos,
      openingHours: details.regularOpeningHours?.weekdayDescriptions || null,
      isOpen: details.regularOpeningHours?.openNow ?? null,
      category,
      priceLevel,
      topReviews,
    }
  })
