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
      .slice(0, 4)
      .map(photo => getPhotoUrl(photo.photo_reference, 400))

    const topReviews = (details.reviews || [])
      .filter(r => r.rating >= 4 && r.text && r.text.length > 20)
      .slice(0, 3)
      .map(r => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text.length > 150 ? r.text.substring(0, 150) + '...' : r.text,
        photoUrl: r.profile_photo_url || null,
      }))

    let category: string | null = null
    if (details.types && details.types.length > 0) {
      const categoryMap: Record<string, string> = {
        restaurant: 'Restaurante',
        bakery: 'Padaria',
        cafe: 'Cafeteria',
        bar: 'Bar',
        beauty_salon: 'Salão de Beleza',
        hair_care: 'Barbearia',
        gym: 'Academia',
        dentist: 'Dentista',
        doctor: 'Clínica',
        pharmacy: 'Farmácia',
        veterinary_care: 'Veterinário',
        pet_store: 'Pet Shop',
        car_repair: 'Oficina',
        car_wash: 'Lava Jato',
        car_dealer: 'Revendedora',
        store: 'Loja',
        supermarket: 'Supermercado',
        school: 'Escola',
        lodging: 'Hotel',
        real_estate_agency: 'Imobiliária',
        lawyer: 'Advocacia',
        accounting: 'Contabilidade',
        florist: 'Floricultura',
      }
      for (const type of details.types) {
        if (categoryMap[type]) {
          category = categoryMap[type]
          break
        }
      }
    }

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
