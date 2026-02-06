'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { textSearchPlaces, getPhotoUrl, inferCategory } from '@/lib/google-places'

const searchPlacesSchema = z.object({
  query: z.string().min(3, 'Digite pelo menos 3 caracteres'),
})

export const searchPlacesAction = authActionClient
  .schema(searchPlacesSchema)
  .action(async ({ parsedInput }) => {
    const results = await textSearchPlaces(parsedInput.query)

    return results.map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating ?? null,
      reviewsCount: place.user_ratings_total ?? null,
      photoUrl: place.photos?.[0]
        ? getPhotoUrl(place.photos[0].photo_reference, 200)
        : null,
      isOpen: place.opening_hours?.open_now ?? null,
      category: place.types ? inferCategory(place.types) : null,
    }))
  })
