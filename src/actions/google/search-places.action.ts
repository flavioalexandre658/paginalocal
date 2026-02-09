'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { textSearchPlaces, getPhotoUrl } from '@/lib/google-places'

const searchPlacesSchema = z.object({
  query: z.string().min(3, 'Digite pelo menos 3 caracteres'),
})

export const searchPlacesAction = authActionClient
  .schema(searchPlacesSchema)
  .action(async ({ parsedInput }) => {
    const results = await textSearchPlaces(parsedInput.query)

    return results.map(place => ({
      placeId: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating ?? null,
      reviewsCount: place.userRatingCount ?? null,
      photoUrl: place.photos?.[0]
        ? getPhotoUrl(place.photos[0].name, 200)
        : null,
      isOpen: place.regularOpeningHours?.openNow ?? null,
      // Categoria direta do Google em PT-BR (sem mapeamento!)
      category: place.primaryTypeDisplayName?.text || null,
    }))
  })
