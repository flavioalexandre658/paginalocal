// =============================================================================
// Google Places API (New) v1 - Interfaces and Functions
// Docs: https://developers.google.com/maps/documentation/places/web-service
// =============================================================================

// ===== Response Interfaces =====

export interface GooglePlaceReview {
  authorAttribution: {
    displayName: string
    photoUri?: string
  }
  rating: number
  text?: { text: string }
  relativePublishTimeDescription?: string
  publishTime?: string
}

export interface GooglePlacePhoto {
  name: string // resource name: "places/{placeId}/photos/{photoRef}"
  widthPx: number
  heightPx: number
}

export interface GooglePlaceDetails {
  id: string
  displayName: { text: string }
  formattedAddress: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  regularOpeningHours?: {
    weekdayDescriptions: string[]
    openNow?: boolean
    periods?: Array<{
      open: { day: number; hour: number; minute: number }
      close?: { day: number; hour: number; minute: number }
    }>
  }
  rating?: number
  userRatingCount?: number
  reviews?: GooglePlaceReview[]
  photos?: GooglePlacePhoto[]
  location?: { latitude: number; longitude: number }
  types?: string[]
  primaryType?: string
  primaryTypeDisplayName?: { text: string }
  websiteUri?: string
  addressComponents?: Array<{
    longText: string
    shortText: string
    types: string[]
  }>
  editorialSummary?: { text: string }
  generativeSummary?: {
    overview?: { text: string }
    description?: { text: string }
  }
  businessStatus?: string
  priceLevel?: string
  googleMapsUri?: string

  // Business attributes (for enriching AI prompts)
  delivery?: boolean
  dineIn?: boolean
  takeout?: boolean
  reservable?: boolean
  servesBreakfast?: boolean
  servesLunch?: boolean
  servesDinner?: boolean
  servesBeer?: boolean
  servesWine?: boolean
  servesBrunch?: boolean
  servesVegetarianFood?: boolean
  goodForChildren?: boolean
  goodForGroups?: boolean
  outdoorSeating?: boolean
  liveMusic?: boolean
  allowsDogs?: boolean
  curbsidePickup?: boolean
  paymentOptions?: {
    acceptsCreditCards?: boolean
    acceptsDebitCards?: boolean
    acceptsCashOnly?: boolean
    acceptsNfc?: boolean
  }
  parkingOptions?: {
    freeParkingLot?: boolean
    paidParkingLot?: boolean
    freeStreetParking?: boolean
    valetParking?: boolean
  }
  accessibilityOptions?: {
    wheelchairAccessibleParking?: boolean
    wheelchairAccessibleEntrance?: boolean
    wheelchairAccessibleRestroom?: boolean
    wheelchairAccessibleSeating?: boolean
  }
}

export interface TextSearchResult {
  id: string
  displayName: { text: string }
  formattedAddress: string
  rating?: number
  userRatingCount?: number
  regularOpeningHours?: {
    openNow?: boolean
  }
  photos?: GooglePlacePhoto[]
  types?: string[]
  primaryType?: string
  primaryTypeDisplayName?: { text: string }
  businessStatus?: string
  location?: { latitude: number; longitude: number }
}

// ===== API Helper =====

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key não configurada')
  }
  return apiKey
}

// ===== Text Search (New) =====

export async function textSearchPlaces(query: string): Promise<TextSearchResult[]> {
  const apiKey = getApiKey()

  const fieldMask = [
    'places.id',
    'places.displayName',
    'places.formattedAddress',
    'places.rating',
    'places.userRatingCount',
    'places.regularOpeningHours',
    'places.photos',
    'places.primaryType',
    'places.primaryTypeDisplayName',
    'places.businessStatus',
    'places.location',
  ].join(',')

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'pt-BR',
      regionCode: 'BR',
      maxResultCount: 10,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('[Google Places] Text Search error:', error)
    throw new Error(`Google Places API error: ${response.status}`)
  }

  const data = await response.json()
  return data.places || []
}

// ===== Place Details (New) =====

// Fields organized by pricing tier for cost control
const PLACE_DETAILS_FIELDS = [
  // Essentials (cheapest)
  'id',
  'displayName',
  'formattedAddress',
  'addressComponents',
  'location',
  'photos',

  // Pro
  'primaryType',
  'primaryTypeDisplayName',
  'businessStatus',
  'googleMapsUri',

  // Enterprise
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'regularOpeningHours',
  'rating',
  'userRatingCount',
  'reviews',
  'websiteUri',
  'priceLevel',

  // Enterprise + Atmosphere (richer data for prompts)
  'editorialSummary',
  'delivery',
  'dineIn',
  'takeout',
  'reservable',
  'servesBreakfast',
  'servesLunch',
  'servesDinner',
  'servesBeer',
  'servesWine',
  'servesBrunch',
  'servesVegetarianFood',
  'goodForChildren',
  'goodForGroups',
  'outdoorSeating',
  'liveMusic',
  'allowsDogs',
  'curbsidePickup',
  'paymentOptions',
  'parkingOptions',
  'accessibilityOptions',
].join(',')

export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
  const apiKey = getApiKey()

  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACE_DETAILS_FIELDS,
      'X-Goog-Api-Language': 'pt-BR',
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    console.error('[Google Places] Place Details error:', error)
    return null
  }

  const result: GooglePlaceDetails = await response.json()

  // Convert weekdayDescriptions from English to Portuguese using periods data
  if (result.regularOpeningHours) {
    const periods = result.regularOpeningHours.periods
    const descriptions = result.regularOpeningHours.weekdayDescriptions

    // If we have periods, always generate PT-BR descriptions from them (most reliable)
    if (periods && periods.length > 0) {
      result.regularOpeningHours.weekdayDescriptions = convertPeriodsToWeekdayDescriptions(periods)
      console.log(`[Google Places] Opening hours converted to PT-BR from periods data`)
    }
    // If descriptions are in English (no periods available), convert AM/PM at least
    else if (descriptions && descriptions.length > 0 && /monday|tuesday|wednesday/i.test(descriptions[0])) {
      console.log(`[Google Places] weekdayDescriptions in English without periods, keeping as-is for parseOpeningHours fallback`)
    }
  }

  console.log(`[Google Places] Details for "${result.displayName?.text}":`)
  console.log(`  primaryType: ${result.primaryType}`)
  console.log(`  primaryTypeDisplayName: ${result.primaryTypeDisplayName?.text}`)
  console.log(`  reviews: ${result.reviews?.length || 0}`)
  console.log(`  openingHours: ${result.regularOpeningHours?.weekdayDescriptions?.join(' | ') || 'N/A'}`)
  // console.log(`[Google Places] Full response:`, JSON.stringify(result, null, 2))

  return result
}

// ===== Place Reviews (separate call for more reviews) =====

export async function getPlaceReviews(placeId: string): Promise<GooglePlaceReview[]> {
  const apiKey = getApiKey()

  // The new API returns reviews as part of Place Details (up to 5)
  // For more, we fetch place details with reviews field
  const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'reviews',
      'X-Goog-Api-Language': 'pt-BR',
    },
  })

  if (!response.ok) return []

  const data = await response.json()
  return data.reviews || []
}

// ===== Photo URL =====

export function getPhotoUrl(photoName: string, maxWidth: number = 800): string {
  const apiKey = getApiKey()
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`
}

export async function downloadGooglePhoto(photoName: string, maxWidth: number = 800): Promise<Buffer> {
  const apiKey = getApiKey()
  const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&skipHttpRedirect=true&key=${apiKey}`

  const metaResponse = await fetch(mediaUrl, {
    headers: { 'Accept': 'application/json' },
  })

  if (!metaResponse.ok) {
    throw new Error(`Google Photo meta fetch failed: ${metaResponse.status}`)
  }

  const metaData = await metaResponse.json() as { photoUri?: string }
  const photoUri = metaData.photoUri

  if (!photoUri) {
    throw new Error(`Google Photo API did not return photoUri for ${photoName}`)
  }

  const imageResponse = await fetch(photoUri)
  if (!imageResponse.ok) {
    throw new Error(`Failed to download photo from ${photoUri}: ${imageResponse.status}`)
  }

  const arrayBuffer = await imageResponse.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// ===== Address Parsing =====

export function parseAddressComponents(components: GooglePlaceDetails['addressComponents']): {
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
      city = component.longText
    }
    if (component.types.includes('administrative_area_level_1')) {
      state = component.shortText
    }
    if (component.types.includes('postal_code')) {
      zipCode = component.longText
    }
    if (component.types.includes('street_number')) {
      streetNumber = component.longText
    }
    if (component.types.includes('route')) {
      route = component.longText
    }
    if (component.types.includes('sublocality_level_1') || component.types.includes('sublocality')) {
      neighborhood = component.longText
    }
  })

  const addressParts = [route, streetNumber, neighborhood].filter(Boolean)
  const address = addressParts.join(', ') || ''

  return { city, state, zipCode, address }
}

// ===== Opening Hours: Convert periods to PT-BR weekdayDescriptions =====

const DAY_NAMES_PT: Record<number, string> = {
  0: 'domingo',
  1: 'segunda-feira',
  2: 'terça-feira',
  3: 'quarta-feira',
  4: 'quinta-feira',
  5: 'sexta-feira',
  6: 'sábado',
}

function pad(n: number): string {
  return n.toString().padStart(2, '0')
}

/**
 * Converts structured `periods` from Google Places API (New)
 * into Portuguese weekdayDescriptions matching the old API format.
 * e.g. "segunda-feira: 10:00 – 20:00"
 */
export function convertPeriodsToWeekdayDescriptions(
  periods: Array<{
    open: { day: number; hour: number; minute: number }
    close?: { day: number; hour: number; minute: number }
  }>
): string[] {
  // Group periods by day (a day can have multiple periods, e.g. lunch + dinner)
  const dayPeriods: Record<number, string[]> = {}

  for (const period of periods) {
    const day = period.open.day
    const openTime = `${pad(period.open.hour)}:${pad(period.open.minute)}`

    let range: string
    if (period.close) {
      const closeTime = `${pad(period.close.hour)}:${pad(period.close.minute)}`
      range = `${openTime} – ${closeTime}`
    } else {
      // No close = open 24h
      range = 'Aberto 24 horas'
    }

    if (!dayPeriods[day]) {
      dayPeriods[day] = []
    }
    dayPeriods[day].push(range)
  }

  // Build descriptions for all 7 days (Monday=1 first, then 2..6, then Sunday=0)
  const orderedDays = [1, 2, 3, 4, 5, 6, 0]
  const descriptions: string[] = []

  for (const day of orderedDays) {
    const dayName = DAY_NAMES_PT[day]
    if (dayPeriods[day] && dayPeriods[day].length > 0) {
      descriptions.push(`${dayName}: ${dayPeriods[day].join(', ')}`)
    } else {
      descriptions.push(`${dayName}: Fechado`)
    }
  }

  return descriptions
}

// ===== Opening Hours Parsing =====

export function parseOpeningHours(weekdayDescriptions: string[]): Record<string, string> {
  // Support both Portuguese and English day names
  const daysMap: Record<string, string> = {
    'segunda-feira': 'seg',
    'terça-feira': 'ter',
    'quarta-feira': 'qua',
    'quinta-feira': 'qui',
    'sexta-feira': 'sex',
    'sábado': 'sab',
    'domingo': 'dom',
    // English fallback (in case weekdayDescriptions come in English)
    'monday': 'seg',
    'tuesday': 'ter',
    'wednesday': 'qua',
    'thursday': 'qui',
    'friday': 'sex',
    'saturday': 'sab',
    'sunday': 'dom',
  }

  const hours: Record<string, string> = {}

  weekdayDescriptions.forEach(line => {
    const [day, ...timeParts] = line.split(': ')
    const time = timeParts.join(': ') // rejoin in case time contains ':'
    const dayKey = daysMap[day?.toLowerCase()?.trim()]
    if (dayKey && time && time !== 'Fechado' && time !== 'Closed') {
      // Convert AM/PM format to 24h if needed
      const normalized = convertTo24h(time)
      hours[dayKey] = normalized
    }
  })

  return hours
}

/**
 * Converts time strings from AM/PM format to 24h format.
 * "10:00 AM – 8:00 PM" -> "10:00-20:00"
 * "10:00 – 20:00" -> "10:00-20:00" (already 24h, just normalize)
 */
function convertTo24h(timeStr: string): string {
  // Normalize dashes and whitespace
  const normalized = timeStr.replace(/\s/g, '').replace('–', '-').replace('—', '-')

  // Check if it contains AM/PM
  if (/[AP]M/i.test(normalized)) {
    // Split by dash to get open-close
    const parts = normalized.split('-')
    const converted = parts.map(part => {
      const match = part.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
      if (!match) return part.trim()

      let hour = parseInt(match[1], 10)
      const minute = match[2]
      const period = match[3].toUpperCase()

      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0

      return `${pad(hour)}:${minute}`
    })
    return converted.join('-')
  }

  return normalized
}

// ===== Business Attributes Extraction (for AI prompts) =====

export function extractBusinessAttributes(place: GooglePlaceDetails): string[] {
  const attributes: string[] = []

  if (place.delivery) attributes.push('Faz delivery/entrega')
  if (place.dineIn) attributes.push('Atende no local')
  if (place.takeout) attributes.push('Retirada no balcão')
  if (place.reservable) attributes.push('Aceita reservas')
  if (place.servesBreakfast) attributes.push('Serve café da manhã')
  if (place.servesLunch) attributes.push('Serve almoço')
  if (place.servesDinner) attributes.push('Serve jantar')
  if (place.servesBrunch) attributes.push('Serve brunch')
  if (place.servesBeer) attributes.push('Serve cerveja')
  if (place.servesWine) attributes.push('Serve vinho')
  if (place.servesVegetarianFood) attributes.push('Opções vegetarianas')
  if (place.goodForChildren) attributes.push('Bom para crianças')
  if (place.goodForGroups) attributes.push('Bom para grupos')
  if (place.outdoorSeating) attributes.push('Área externa')
  if (place.liveMusic) attributes.push('Música ao vivo')
  if (place.allowsDogs) attributes.push('Aceita pets')
  if (place.curbsidePickup) attributes.push('Coleta na calçada')

  if (place.paymentOptions) {
    const payments: string[] = []
    if (place.paymentOptions.acceptsCreditCards) payments.push('cartão de crédito')
    if (place.paymentOptions.acceptsDebitCards) payments.push('cartão de débito')
    if (place.paymentOptions.acceptsNfc) payments.push('pagamento por aproximação')
    if (place.paymentOptions.acceptsCashOnly) payments.push('somente dinheiro')
    if (payments.length > 0) attributes.push(`Aceita: ${payments.join(', ')}`)
  }

  if (place.parkingOptions) {
    const parking: string[] = []
    if (place.parkingOptions.freeParkingLot) parking.push('estacionamento gratuito')
    if (place.parkingOptions.freeStreetParking) parking.push('estacionamento na rua')
    if (place.parkingOptions.valetParking) parking.push('manobrista')
    if (parking.length > 0) attributes.push(`Estacionamento: ${parking.join(', ')}`)
  }

  if (place.accessibilityOptions) {
    const access: string[] = []
    if (place.accessibilityOptions.wheelchairAccessibleEntrance) access.push('entrada acessível')
    if (place.accessibilityOptions.wheelchairAccessibleRestroom) access.push('banheiro acessível')
    if (place.accessibilityOptions.wheelchairAccessibleSeating) access.push('assentos acessíveis')
    if (access.length > 0) attributes.push(`Acessibilidade: ${access.join(', ')}`)
  }

  return attributes
}

// ===== Business Context Extraction (for AI prompts) =====

export function extractBusinessContext(place: GooglePlaceDetails): {
  about: string | null
  keyServices: string[]
  customerHighlights: string[]
  priceRange: string | null
  businessAttributes: string[]
} {
  let about: string | null = null
  const keyServices: string[] = []
  const customerHighlights: string[] = []
  let priceRange: string | null = null

  if (place.editorialSummary?.text) {
    about = place.editorialSummary.text
  }

  if (place.generativeSummary?.overview?.text) {
    about = (about ? about + '. ' : '') + place.generativeSummary.overview.text
  }

  if (place.priceLevel) {
    const priceMap: Record<string, string> = {
      'PRICE_LEVEL_FREE': 'Gratuito',
      'PRICE_LEVEL_INEXPENSIVE': 'Econômico',
      'PRICE_LEVEL_MODERATE': 'Moderado',
      'PRICE_LEVEL_EXPENSIVE': 'Caro',
      'PRICE_LEVEL_VERY_EXPENSIVE': 'Muito Caro',
    }
    priceRange = priceMap[place.priceLevel] || null
  }

  if (place.reviews && place.reviews.length > 0) {
    const positiveReviews = place.reviews
      .filter(r => r.rating >= 4 && r.text?.text && r.text.text.length > 5)
      .slice(0, 10)

    const serviceKeywords = new Set<string>()
    const highlightKeywords = new Set<string>()

    const servicePatterns = [
      /atendimento/gi, /serviço/gi, /qualidade/gi, /preço/gi,
      /rápido/gi, /profissional/gi, /excelente/gi, /recomendo/gi,
      /confiança/gi, /honesto/gi, /pontual/gi, /educado/gi,
    ]

    positiveReviews.forEach(review => {
      const reviewText = review.text?.text || ''
      const text = reviewText.toLowerCase()

      servicePatterns.forEach(pattern => {
        const match = text.match(pattern)
        if (match) {
          const context = extractContext(reviewText, match[0])
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

  const businessAttributes = extractBusinessAttributes(place)

  return { about, keyServices, customerHighlights, priceRange, businessAttributes }
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

// ===== Reviews Summarization =====

export function summarizeReviews(reviews: GooglePlaceDetails['reviews']): string {
  if (!reviews || reviews.length === 0) return ''

  const fiveStarReviews = reviews
    .filter(r => r.rating === 5 && r.text?.text && r.text.text.length > 30)
    .slice(0, 6)

  const fourStarReviews = reviews
    .filter(r => r.rating === 4 && r.text?.text && r.text.text.length > 30)
    .slice(0, 3)

  const bestReviews = [...fiveStarReviews, ...fourStarReviews].slice(0, 8)

  if (bestReviews.length === 0) return ''

  return bestReviews
    .map(r => `[${r.rating}★] "${(r.text?.text || '').substring(0, 200)}"`)
    .join('\n')
}

// Summarize testimonials from database (unchanged - uses DB format)
export function summarizeTestimonials(testimonials: { rating: number; content: string }[]): string {
  if (!testimonials || testimonials.length === 0) return ''

  const fiveStarReviews = testimonials
    .filter(t => t.rating === 5 && t.content && t.content.length > 30)
    .slice(0, 6)

  const fourStarReviews = testimonials
    .filter(t => t.rating === 4 && t.content && t.content.length > 30)
    .slice(0, 3)

  const bestReviews = [...fiveStarReviews, ...fourStarReviews].slice(0, 8)

  if (bestReviews.length === 0) return ''

  return bestReviews
    .map(t => `[${t.rating}★] "${t.content.substring(0, 200)}"`)
    .join('\n')
}

// ===== Nearby Neighborhoods (uses Geocoding + Legacy Nearby Search) =====

export async function fetchNearbyNeighborhoods(
  latitude: number,
  longitude: number,
  city: string,
): Promise<string[]> {
  const apiKey = getApiKey()
  const neighborhoods = new Set<string>()
  const nearbyCities = new Set<string>()

  const isValidName = (name: string) =>
    name &&
    name !== city &&
    name.length > 2 &&
    !name.match(/^\d/) &&
    !name.match(/^(brasil|brazil)$/i)

  try {
    // Geocoding API (separate from Places, stays the same)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=pt-BR&result_type=sublocality|neighborhood|locality&key=${apiKey}`
    )

    const data = await response.json()

    if (data.status === 'OK' && data.results) {
      for (const result of data.results) {
        for (const component of result.address_components || []) {
          const types: string[] = component.types
          if (
            types.includes('sublocality_level_1') ||
            types.includes('sublocality') ||
            types.includes('neighborhood')
          ) {
            if (isValidName(component.long_name)) {
              neighborhoods.add(component.long_name)
            }
          }
          if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            if (isValidName(component.long_name)) {
              nearbyCities.add(component.long_name)
            }
          }
        }
      }
    }

    // Legacy Nearby Search (for neighborhood discovery - no equivalent in New API)
    const radii = [10000, 25000, 40000]

    for (const radius of radii) {
      if (neighborhoods.size >= 6) break

      const nearbyResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=sublocality&language=pt-BR&key=${apiKey}`
      )

      const nearbyData = await nearbyResponse.json()

      if (nearbyData.status === 'OK' && nearbyData.results) {
        for (const place of nearbyData.results.slice(0, 20)) {
          if (isValidName(place.name)) {
            neighborhoods.add(place.name)
          }
          if (place.vicinity) {
            const parts = place.vicinity.split(',').map((p: string) => p.trim())
            for (const part of parts) {
              if (isValidName(part)) {
                neighborhoods.add(part)
              }
            }
          }
        }
      }
    }

    if (neighborhoods.size < 6) {
      const cityResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=locality&language=pt-BR&key=${apiKey}`
      )

      const cityData = await cityResponse.json()

      if (cityData.status === 'OK' && cityData.results) {
        for (const place of cityData.results.slice(0, 15)) {
          if (isValidName(place.name)) {
            nearbyCities.add(place.name)
          }
        }
      }
    }

    const allResults = [
      ...Array.from(neighborhoods),
      ...Array.from(nearbyCities),
    ]

    const unique = [...new Set(allResults)].slice(0, 10)
    console.log(`[Google Places] Bairros/regiões encontrados para ${city}: [${unique.join(', ')}]`)
    return unique
  } catch (error) {
    console.error('[Google Places] Erro ao buscar bairros:', error)
    return []
  }
}
