export interface GooglePlaceReview {
  author_name: string
  rating: number
  text: string
  profile_photo_url?: string
  time: number
  relative_time_description?: string
}

export interface GooglePlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  international_phone_number?: string
  opening_hours?: {
    weekday_text: string[]
    open_now?: boolean
  }
  rating?: number
  user_ratings_total?: number
  reviews?: GooglePlaceReview[]
  photos?: Array<{
    photo_reference: string
    height: number
    width: number
  }>
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
  types?: string[]
  website?: string
  address_components?: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  editorial_summary?: {
    overview: string
    language: string
  }
  business_status?: string
  price_level?: number
  url?: string
  vicinity?: string
}

export interface GooglePlacePrediction {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

export async function searchPlaces(query: string): Promise<GooglePlacePrediction[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key não configurada')
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&types=establishment&language=pt-BR&components=country:br&key=${apiKey}`
  )

  const data = await response.json()

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(`Google Places API error: ${data.status}`)
  }

  return data.predictions || []
}

export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key não configurada')
  }

  const fields = [
    'place_id',
    'name',
    'formatted_address',
    'formatted_phone_number',
    'international_phone_number',
    'opening_hours',
    'rating',
    'user_ratings_total',
    'reviews',
    'photos',
    'geometry',
    'types',
    'website',
    'address_components',
    'editorial_summary',
    'business_status',
    'price_level',
    'url',
    'vicinity',
  ].join(',')

  const [mostRelevantResponse, newestResponse, highestResponse] = await Promise.all([
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}&language=pt-BR&reviews_sort=most_relevant`
    ),
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR&reviews_sort=newest`
    ),
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR&reviews_sort=highest_rating`
    ),
  ])

  const mostRelevantData = await mostRelevantResponse.json()
  const newestData = await newestResponse.json()
  const highestData = await highestResponse.json()

  if (mostRelevantData.status !== 'OK') {
    return null
  }

  const result = mostRelevantData.result as GooglePlaceDetails
  const allReviews: GooglePlaceReview[] = result.reviews ? [...result.reviews] : []

  console.log(`[Reviews] most_relevant: ${result.reviews?.length || 0} reviews`)

  const addUniqueReviews = (reviews: GooglePlaceReview[], source: string) => {
    const existingIds = new Set(allReviews.map(r => `${r.author_name}-${r.time}`))
    let added = 0
    for (const r of reviews) {
      const id = `${r.author_name}-${r.time}`
      if (!existingIds.has(id)) {
        allReviews.push(r)
        existingIds.add(id)
        added++
      }
    }
    console.log(`[Reviews] ${source}: ${reviews.length} reviews (${added} novas)`)
  }

  if (newestData.status === 'OK' && newestData.result?.reviews) {
    addUniqueReviews(newestData.result.reviews, 'newest')
  }

  if (highestData.status === 'OK' && highestData.result?.reviews) {
    addUniqueReviews(highestData.result.reviews, 'highest_rating')
  }

  result.reviews = allReviews
  console.log(`[Reviews] Total único: ${allReviews.length} reviews`)

  return result
}

export async function getPlaceReviews(placeId: string): Promise<GooglePlaceReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key não configurada')
  }

  const [mostRelevantResponse, newestResponse, highestResponse] = await Promise.all([
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR&reviews_sort=most_relevant`
    ),
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR&reviews_sort=newest`
    ),
    fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pt-BR&reviews_sort=highest_rating`
    ),
  ])

  const mostRelevantData = await mostRelevantResponse.json()
  const newestData = await newestResponse.json()
  const highestData = await highestResponse.json()

  const allReviews: GooglePlaceReview[] = []
  const existingIds = new Set<string>()

  const addUniqueReviews = (reviews: GooglePlaceReview[]) => {
    for (const r of reviews) {
      const id = `${r.author_name}-${r.time}`
      if (!existingIds.has(id)) {
        allReviews.push(r)
        existingIds.add(id)
      }
    }
  }

  if (mostRelevantData.status === 'OK' && mostRelevantData.result?.reviews) {
    addUniqueReviews(mostRelevantData.result.reviews)
  }

  if (newestData.status === 'OK' && newestData.result?.reviews) {
    addUniqueReviews(newestData.result.reviews)
  }

  if (highestData.status === 'OK' && highestData.result?.reviews) {
    addUniqueReviews(highestData.result.reviews)
  }

  return allReviews.sort((a, b) => b.rating - a.rating)
}

export function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`
}

export function parseAddressComponents(components: GooglePlaceDetails['address_components']): {
  city: string
  state: string
  zipCode: string
  address: string
} {
  let city = ''
  let state = ''
  let zipCode = ''
  let streetNumber = ''
  let route = ''
  let neighborhood = ''

  components?.forEach(component => {
    if (component.types.includes('administrative_area_level_2')) {
      city = component.long_name
    }
    if (component.types.includes('administrative_area_level_1')) {
      state = component.short_name
    }
    if (component.types.includes('postal_code')) {
      zipCode = component.long_name
    }
    if (component.types.includes('street_number')) {
      streetNumber = component.long_name
    }
    if (component.types.includes('route')) {
      route = component.long_name
    }
    if (component.types.includes('sublocality_level_1') || component.types.includes('sublocality')) {
      neighborhood = component.long_name
    }
  })

  const addressParts = [route, streetNumber, neighborhood].filter(Boolean)
  const address = addressParts.join(', ') || ''

  return { city, state, zipCode, address }
}

export function parseOpeningHours(weekdayText: string[]): Record<string, string> {
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
    const dayKey = daysMap[day?.toLowerCase()]
    if (dayKey && time && time !== 'Fechado') {
      const normalized = time.replace(/\s/g, '').replace('–', '-')
      hours[dayKey] = normalized
    }
  })

  return hours
}

export function inferCategory(types: string[]): string {
  const categoryMap: Record<string, string> = {
    'car_dealer': 'Revendedora de Veículos',
    'car_rental': 'Locadora de Veículos',
    'car_repair': 'Oficina Mecânica',
    'car_wash': 'Lava Jato',
    'gas_station': 'Posto de Combustível',
    'parking': 'Estacionamento',
    'restaurant': 'Restaurante',
    'cafe': 'Cafeteria',
    'bakery': 'Padaria',
    'bar': 'Bar',
    'night_club': 'Casa Noturna',
    'beauty_salon': 'Salão de Beleza',
    'hair_care': 'Cabeleireiro',
    'spa': 'Spa',
    'gym': 'Academia',
    'physiotherapist': 'Fisioterapeuta',
    'dentist': 'Dentista',
    'doctor': 'Médico',
    'hospital': 'Hospital',
    'pharmacy': 'Farmácia',
    'veterinary_care': 'Veterinário',
    'pet_store': 'Pet Shop',
    'store': 'Loja',
    'clothing_store': 'Loja de Roupas',
    'electronics_store': 'Loja de Eletrônicos',
    'furniture_store': 'Loja de Móveis',
    'hardware_store': 'Loja de Ferragens',
    'home_goods_store': 'Loja de Decoração',
    'jewelry_store': 'Joalheria',
    'shoe_store': 'Sapataria',
    'shopping_mall': 'Shopping Center',
    'supermarket': 'Supermercado',
    'grocery_or_supermarket': 'Supermercado',
    'convenience_store': 'Conveniência',
    'liquor_store': 'Distribuidora de Bebidas',
    'florist': 'Floricultura',
    'book_store': 'Livraria',
    'bicycle_store': 'Loja de Bicicletas',
    'lawyer': 'Advogado',
    'accounting': 'Contador',
    'real_estate_agency': 'Imobiliária',
    'insurance_agency': 'Seguradora',
    'travel_agency': 'Agência de Viagens',
    'bank': 'Banco',
    'atm': 'Caixa Eletrônico',
    'lodging': 'Hotel',
    'campground': 'Camping',
    'rv_park': 'Estacionamento de Trailers',
    'meal_delivery': 'Delivery',
    'meal_takeaway': 'Delivery',
    'moving_company': 'Empresa de Mudanças',
    'storage': 'Guarda-Volumes',
    'laundry': 'Lavanderia',
    'locksmith': 'Chaveiro',
    'painter': 'Pintor',
    'plumber': 'Encanador',
    'electrician': 'Eletricista',
    'roofing_contractor': 'Telhador',
    'general_contractor': 'Empreiteiro',
    'school': 'Escola',
    'university': 'Universidade',
    'primary_school': 'Escola Primária',
    'secondary_school': 'Escola Secundária',
    'library': 'Biblioteca',
    'museum': 'Museu',
    'art_gallery': 'Galeria de Arte',
    'movie_theater': 'Cinema',
    'amusement_park': 'Parque de Diversões',
    'zoo': 'Zoológico',
    'aquarium': 'Aquário',
    'bowling_alley': 'Boliche',
    'stadium': 'Estádio',
    'church': 'Igreja',
    'mosque': 'Mesquita',
    'synagogue': 'Sinagoga',
    'hindu_temple': 'Templo Hindu',
    'cemetery': 'Cemitério',
    'funeral_home': 'Funerária',
    'police': 'Delegacia',
    'fire_station': 'Corpo de Bombeiros',
    'post_office': 'Correios',
    'local_government_office': 'Órgão Público',
    'city_hall': 'Prefeitura',
    'courthouse': 'Fórum',
    'embassy': 'Embaixada',
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type]
    }
  }

  return 'Comércio Local'
}

export function extractBusinessContext(place: GooglePlaceDetails): {
  about: string | null
  keyServices: string[]
  customerHighlights: string[]
  priceRange: string | null
} {
  let about: string | null = null
  const keyServices: string[] = []
  const customerHighlights: string[] = []
  let priceRange: string | null = null

  if (place.editorial_summary?.overview) {
    about = place.editorial_summary.overview
  }

  if (place.price_level !== undefined) {
    const priceMap: Record<number, string> = {
      0: 'Gratuito',
      1: 'Econômico',
      2: 'Moderado',
      3: 'Caro',
      4: 'Muito Caro',
    }
    priceRange = priceMap[place.price_level] || null
  }

  if (place.reviews && place.reviews.length > 0) {
    const positiveReviews = place.reviews
      .filter(r => r.rating >= 4 && r.text && r.text.length > 5)
      .slice(0, 10)

    const serviceKeywords = new Set<string>()
    const highlightKeywords = new Set<string>()

    const servicePatterns = [
      /atendimento/gi, /serviço/gi, /qualidade/gi, /preço/gi,
      /rápido/gi, /profissional/gi, /excelente/gi, /recomendo/gi,
      /confiança/gi, /honesto/gi, /pontual/gi, /educado/gi,
    ]

    positiveReviews.forEach(review => {
      const text = review.text.toLowerCase()

      servicePatterns.forEach(pattern => {
        const match = text.match(pattern)
        if (match) {
          const context = extractContext(review.text, match[0])
          if (context) {
            if (['atendimento', 'serviço', 'qualidade', 'preço'].some(k => match[0].toLowerCase().includes(k))) {
              serviceKeywords.add(context)
            } else {
              highlightKeywords.add(context)
            }
          }
        }
      })
    })

    keyServices.push(...Array.from(serviceKeywords).slice(0, 5))
    customerHighlights.push(...Array.from(highlightKeywords).slice(0, 5))
  }

  return { about, keyServices, customerHighlights, priceRange }
}

function extractContext(text: string, keyword: string): string | null {
  const index = text.toLowerCase().indexOf(keyword.toLowerCase())
  if (index === -1) return null

  const start = Math.max(0, index - 30)
  const end = Math.min(text.length, index + keyword.length + 50)
  let context = text.slice(start, end).trim()

  if (start > 0) context = '...' + context
  if (end < text.length) context = context + '...'

  return context.length > 20 ? context : null
}

export function summarizeReviews(reviews: GooglePlaceDetails['reviews']): string {
  if (!reviews || reviews.length === 0) return ''

  const positiveReviews = reviews
    .filter(r => r.rating >= 4 && r.text && r.text.length > 20)
    .slice(0, 8)

  if (positiveReviews.length === 0) return ''

  const highlights: string[] = []

  positiveReviews.forEach(review => {
    const sentences = review.text.split(/[.!?]/).filter(s => s.trim().length > 10)
    sentences.slice(0, 2).forEach(s => highlights.push(s.trim()))
  })

  return highlights.slice(0, 10).join('. ')
}
