'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'

const searchLocationSchema = z.object({
  query: z.string().min(3, 'Digite pelo menos 3 caracteres'),
})

const getLocationDetailsSchema = z.object({
  placeId: z.string().min(1, 'Place ID é obrigatório'),
})

interface LocationPrediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

export type LocationScope = 'city' | 'state' | 'country'

export interface LocationDetails {
  placeId: string
  street: string
  streetNumber: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  fullAddress: string
  latitude: number
  longitude: number
  locationScope: LocationScope
}

export const searchLocationAction = actionClient
  .schema(searchLocationSchema)
  .action(async ({ parsedInput }): Promise<LocationPrediction[]> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      throw new Error('Google Places API key não configurada')
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(parsedInput.query)}&types=(regions)&language=pt-BR&components=country:br&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status)
      return []
    }

    return (data.predictions || []).map((p: {
      place_id: string
      description: string
      structured_formatting: { main_text: string; secondary_text: string }
    }) => ({
      placeId: p.place_id,
      description: p.description,
      mainText: p.structured_formatting.main_text,
      secondaryText: p.structured_formatting.secondary_text,
    }))
  })

export const getLocationDetailsAction = actionClient
  .schema(getLocationDetailsSchema)
  .action(async ({ parsedInput }): Promise<LocationDetails | null> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      throw new Error('Google Places API key não configurada')
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${parsedInput.placeId}&fields=place_id,address_components,geometry,formatted_address&language=pt-BR&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status !== 'OK') {
      console.error('Google Places Details error:', data.status)
      return null
    }

    const result = data.result
    const components = result.address_components || []

    let street = ''
    let streetNumber = ''
    let neighborhood = ''
    let city = ''
    let stateLongName = ''
    let state = ''
    let zipCode = ''

    for (const component of components) {
      const types: string[] = component.types

      if (types.includes('route')) {
        street = component.long_name
      }
      if (types.includes('street_number')) {
        streetNumber = component.long_name
      }
      if (types.includes('sublocality_level_1') || types.includes('sublocality')) {
        neighborhood = component.long_name
      }
      if (types.includes('administrative_area_level_2')) {
        city = component.long_name
      }
      if (types.includes('locality') && !city) {
        city = component.long_name
      }
      if (types.includes('administrative_area_level_3') && !city) {
        city = component.long_name
      }
      if (types.includes('administrative_area_level_1')) {
        state = component.short_name
        stateLongName = component.long_name
      }
      if (types.includes('postal_code')) {
        zipCode = component.long_name.replace('-', '')
      }
    }

    // Detectar escopo do local selecionado
    const resultTypes: string[] = result.types || []
    let locationScope: LocationScope = 'city'

    if (resultTypes.includes('country')) {
      locationScope = 'country'
      city = 'Brasil'
      state = 'BR'
    } else if (
      resultTypes.includes('administrative_area_level_1') ||
      (!city && stateLongName)
    ) {
      locationScope = 'state'
      city = stateLongName
    }

    return {
      placeId: parsedInput.placeId,
      street,
      streetNumber,
      neighborhood,
      city,
      state,
      zipCode,
      fullAddress: result.formatted_address || '',
      latitude: result.geometry?.location?.lat || 0,
      longitude: result.geometry?.location?.lng || 0,
      locationScope,
    }
  })

export const getNearbyNeighborhoodsAction = actionClient
  .schema(z.object({
    latitude: z.number(),
    longitude: z.number(),
    city: z.string(),
  }))
  .action(async ({ parsedInput }): Promise<string[]> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    if (!apiKey) {
      return getDefaultNeighborhoods(parsedInput.city)
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${parsedInput.latitude},${parsedInput.longitude}&radius=30000&type=locality|sublocality&language=pt-BR&key=${apiKey}`
      )

      const data = await response.json()

      if (data.status !== 'OK') {
        return getDefaultNeighborhoods(parsedInput.city)
      }

      const neighborhoods = new Set<string>()

      for (const place of data.results.slice(0, 15)) {
        const name = place.name
        if (name && name !== parsedInput.city && name.length > 2) {
          neighborhoods.add(name)
        }

        if (place.vicinity) {
          const parts = place.vicinity.split(',').map((p: string) => p.trim())
          parts.forEach((p: string) => {
            if (p && p !== parsedInput.city && p.length > 2 && !p.match(/^\d/)) {
              neighborhoods.add(p)
            }
          })
        }
      }

      const result = Array.from(neighborhoods).slice(0, 8)

      if (result.length < 5) {
        return [...result, ...getDefaultNeighborhoods(parsedInput.city).slice(0, 5 - result.length)]
      }

      return result
    } catch (error) {
      console.error('Error fetching nearby neighborhoods:', error)
      return getDefaultNeighborhoods(parsedInput.city)
    }
  })

function getDefaultNeighborhoods(city: string): string[] {
  return [
    'Centro',
    `Centro de ${city}`,
    'Zona Norte',
    'Zona Sul',
    'Região Central',
  ]
}
