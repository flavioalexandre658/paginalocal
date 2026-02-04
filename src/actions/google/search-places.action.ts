'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { searchPlaces } from '@/lib/google-places'

const searchPlacesSchema = z.object({
  query: z.string().min(3, 'Digite pelo menos 3 caracteres'),
})

export const searchPlacesAction = authActionClient
  .schema(searchPlacesSchema)
  .action(async ({ parsedInput }) => {
    const predictions = await searchPlaces(parsedInput.query)

    return predictions.map(p => ({
      placeId: p.place_id,
      name: p.structured_formatting.main_text,
      address: p.structured_formatting.secondary_text,
      description: p.description,
    }))
  })
