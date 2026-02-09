import { eq, and, ilike, sql } from 'drizzle-orm'
import { db } from '@/db'
import { category, service } from '@/db/schema'
import { generateSlug } from '@/lib/utils'
import {
  getPlaceDetails,
  textSearchPlaces,
  parseAddressComponents,
  parseOpeningHours,
  getPhotoUrl,
  summarizeReviews,
  extractBusinessAttributes,
  fetchNearbyNeighborhoods,
  type GooglePlaceDetails,
} from '@/lib/google-places'
import { generateMarketingCopy, type MarketingCopy, type FAQItem, type ServiceItem } from '@/lib/gemini'
import { fixOpeningHoursInFAQ, formatOpeningHoursForFAQ } from '@/lib/faq-utils'

export type { FAQItem, ServiceItem }
export type { GooglePlaceDetails }

export interface StoreBuilderResult {
  displayName: string
  category: { id: string; name: string; slug: string }
  phone: string
  whatsapp: string
  fullAddress: string
  city: string
  state: string
  zipCode: string
  openingHours?: Record<string, string>
  latitude?: number
  longitude?: number
  rating?: number
  reviewCount?: number
  coverUrl?: string
  heroTitle: string
  heroSubtitle: string
  description: string
  seoTitle: string
  seoDescription: string
  faq: FAQItem[]
  services: ServiceItem[]
  neighborhoods: string[]
  placeDetails: GooglePlaceDetails
  marketingGenerated: boolean
  /** The Place ID actually used (may differ from input if corrected via text search) */
  resolvedPlaceId: string
}

export interface StoreBuilderOverrides {
  phoneOverride?: string
  whatsappOverride?: string
  selectedCoverIndex?: number
  searchTerm?: string
  /** Original store name for text-search fallback when Place ID is stale/wrong */
  storeName?: string
  /** Original store city for text-search fallback */
  storeCity?: string
}

export async function findOrCreateCategory(
  primaryType: string | undefined,
  displayName: string
): Promise<{ id: string; name: string; slug: string }> {
  if (primaryType) {
    const byType = await db
      .select()
      .from(category)
      .where(sql`${category.typeGooglePlace} @> ${JSON.stringify([primaryType])}::jsonb`)
      .limit(1)
      .then(rows => rows[0] || null)

    if (byType) {
      console.log(`[Category] Matched by primaryType "${primaryType}" -> "${byType.name}"`)
      return { id: byType.id, name: byType.name, slug: byType.slug }
    }
  }

  const slug = generateSlug(displayName)

  const existing = await db.query.category.findFirst({
    where: (c, { eq }) => eq(c.slug, slug),
  })
  if (existing) {
    console.log(`[Category] Matched by slug "${slug}" -> "${existing.name}"`)
    return { id: existing.id, name: existing.name, slug: existing.slug }
  }

  const byName = await db
    .select()
    .from(category)
    .where(ilike(category.name, displayName))
    .limit(1)
    .then(rows => rows[0] || null)
  if (byName) {
    console.log(`[Category] Matched by name "${displayName}" -> "${byName.name}"`)
    return { id: byName.id, name: byName.name, slug: byName.slug }
  }

  console.log(`[Category] Auto-creating: "${displayName}" (primaryType: "${primaryType}", slug: "${slug}")`)

  const [created] = await db.insert(category).values({
    name: displayName,
    slug,
    icon: 'IconBuildingStore',
    description: displayName,
    seoTitle: `${displayName} perto de você`,
    seoDescription: `Encontre os melhores estabelecimentos de ${displayName} na sua região. Compare avaliações e entre em contato.`,
    heroTitle: `Encontre ${displayName}`,
    heroSubtitle: `Os melhores estabelecimentos de ${displayName} perto de você.`,
    typeGooglePlace: primaryType ? [primaryType] : [],
  }).returning()

  return { id: created.id, name: created.name, slug: created.slug }
}

export function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const FILLER_WORDS = [
  'movel', 'móvel', '24h', '24 horas', '24horas',
  'express', 'rapido', 'rápido', 'delivery', 'online',
  'ltda', 'me', 'eireli', 'sa', 's/a', 'epp', 'mei',
  'de', 'do', 'da', 'dos', 'das', 'e', 'em', 'para', 'com',
]

function removeDuplicateWords(text: string): string {
  const words = text.split(/\s+/)
  const seen = new Set<string>()
  const unique: string[] = []

  for (const word of words) {
    const normalized = normalizeText(word)
    if (normalized.length > 0 && !seen.has(normalized)) {
      seen.add(normalized)
      unique.push(word)
    }
  }

  return unique.join(' ')
}

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function cleanBusinessName(gmbName: string): string {
  let cleaned = gmbName
    .replace(/\s+/g, ' ')
    .replace(/[-–—]{2,}/g, ' ')
    .trim()

  const upperCount = (cleaned.match(/[A-Z]/g) || []).length
  const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length
  if (letterCount > 0 && upperCount / letterCount > 0.8) {
    cleaned = capitalizeWords(cleaned.toLowerCase())
  }

  cleaned = removeDuplicateWords(cleaned)

  return cleaned
}

function extractEssentialWordsForSlug(name: string): string[] {
  const normalized = normalizeText(name)
  const words = normalized.split(/\s+/)

  const seen = new Set<string>()
  const essential: string[] = []

  for (const word of words) {
    const clean = word.replace(/[^a-z0-9]/g, '')

    if (clean.length < 2) continue
    if (FILLER_WORDS.includes(clean)) continue
    if (seen.has(clean)) continue

    seen.add(clean)
    essential.push(clean)

    if (essential.length >= 4) break
  }

  return essential
}

export function generateSlugFromName(name: string, city: string): string {
  const essentialWords = extractEssentialWordsForSlug(name)
  const nameSlug = essentialWords.join('-').substring(0, 35)

  const citySlug = normalizeText(city)
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20)

  return `${nameSlug}-${citySlug}`.replace(/-+/g, '-').substring(0, 60)
}

export async function generateUniqueServiceSlugForStore(storeId: string, name: string): Promise<string> {
  const baseSlug = generateSlug(name)
  let slug = baseSlug
  let counter = 1

  while (true) {
    const [existing] = await db
      .select({ id: service.id })
      .from(service)
      .where(and(eq(service.storeId, storeId), eq(service.slug, slug)))
      .limit(1)

    if (!existing) return slug
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export function truncate(str: string | undefined | null, maxLength: number): string | undefined {
  if (!str) return undefined
  return str.length > maxLength ? str.substring(0, maxLength) : str
}

function buildSeoH1(categoryName: string, city: string, displayName: string): string {
  return `${categoryName} em ${city} – ${displayName}`
}

function buildSeoSubtitle(categoryName: string, city: string): string {
  return `${categoryName} em ${city} com atendimento rápido e de confiança`
}

function buildSeoDescription(displayName: string, categoryName: string, city: string): string {
  const lower = categoryName.toLowerCase()
  return `${displayName} é referência em ${lower} em ${city}, oferecendo serviços com rapidez, qualidade e atendimento de confiança.`
}

function generateFallbackServicesLocal(categoryName: string): ServiceItem[] {
  const lower = categoryName.toLowerCase()

  return [
    { name: 'Atendimento Especializado', description: `Serviço profissional de ${lower} com qualidade garantida` },
    { name: 'Orçamento Gratuito', description: 'Avaliação sem compromisso para seu projeto' },
    { name: 'Atendimento Rápido', description: 'Resposta ágil para suas necessidades' },
    { name: 'Garantia de Satisfação', description: 'Compromisso com a qualidade do serviço' },
    { name: 'Profissionais Qualificados', description: 'Equipe treinada e experiente' },
    { name: 'Preço Justo', description: 'Melhor custo-benefício da região' },
  ]
}

interface FAQContext {
  displayName: string
  city: string
  category: string
  address?: string
  phone?: string
  openingHours?: Record<string, string>
}

function generateFallbackFAQLocal(ctx: FAQContext): FAQItem[] {
  const { displayName, city, category: categoryName, address, phone, openingHours } = ctx
  const lower = categoryName.toLowerCase()
  const hoursText = formatOpeningHoursForFAQ(openingHours)

  const addressText = address
    ? `Estamos localizados em ${address}, ${city}. Clique no mapa acima para ver nossa localização exata e traçar a rota até nós.`
    : `Estamos localizados em ${city}. Clique no mapa acima para ver nossa localização exata.`

  const contactText = phone
    ? `Você pode agendar pelo WhatsApp ou telefone ${phone}. Respondemos rapidamente.`
    : `Você pode agendar pelo WhatsApp ou telefone. Respondemos rapidamente para encontrar o melhor horário.`

  return [
    {
      question: `Qual o horário de funcionamento da ${displayName}?`,
      answer: hoursText,
    },
    {
      question: `Onde fica a ${displayName} em ${city}?`,
      answer: addressText,
    },
    {
      question: `Quais serviços a ${displayName} oferece?`,
      answer: `Oferecemos serviços de ${lower} com qualidade e garantia. Entre em contato para saber mais sobre cada serviço.`,
    },
    {
      question: `A ${displayName} atende em qual região de ${city}?`,
      answer: `Atendemos ${city} e toda a região metropolitana. Consulte nossa área de cobertura pelo WhatsApp.`,
    },
    {
      question: `Quais formas de pagamento a ${displayName} aceita?`,
      answer: `Aceitamos dinheiro, PIX, cartões de débito e crédito. Parcelamos em até 12x dependendo do serviço.`,
    },
    {
      question: `A ${displayName} faz orçamento gratuito?`,
      answer: `Sim! Fazemos orçamento gratuito e sem compromisso. Entre em contato pelo WhatsApp ou telefone.`,
    },
    {
      question: `Como agendar um serviço de ${lower} em ${city}?`,
      answer: contactText,
    },
    {
      question: `A ${displayName} tem estacionamento?`,
      answer: `Entre em contato conosco para informações sobre estacionamento e acesso ao local.`,
    },
  ]
}

const PRICE_MAP: Record<string, string> = {
  'PRICE_LEVEL_FREE': 'Gratuito',
  'PRICE_LEVEL_INEXPENSIVE': 'Econômico',
  'PRICE_LEVEL_MODERATE': 'Moderado',
  'PRICE_LEVEL_EXPENSIVE': 'Caro',
  'PRICE_LEVEL_VERY_EXPENSIVE': 'Muito Caro',
}

/**
 * Detects if the Place API result is a geographic area (city, state, country)
 * rather than an actual business. This happens when a stale/wrong Place ID
 * is stored in the database.
 */
function isGeographicResult(place: GooglePlaceDetails): boolean {
  const geoTypes = ['locality', 'political', 'administrative_area_level_1', 'administrative_area_level_2', 'country', 'postal_code']
  const hasGeoTypes = place.types?.some(t => geoTypes.includes(t)) ?? false
  const noPrimaryType = !place.primaryType
  const noPhone = !place.nationalPhoneNumber && !place.internationalPhoneNumber
  const noReviews = !place.reviews || place.reviews.length === 0
  const noRating = !place.rating

  // If it has geo types and lacks business indicators, it's geographic
  if (hasGeoTypes && noPrimaryType && noPhone) return true
  // If it has absolutely no business data at all, also suspect
  if (noPrimaryType && noPhone && noReviews && noRating) return true

  return false
}

export async function buildStoreFromGoogle(
  googlePlaceId: string,
  overrides?: StoreBuilderOverrides,
): Promise<StoreBuilderResult> {
  let placeDetails = await getPlaceDetails(googlePlaceId)
  let resolvedPlaceId = googlePlaceId

  if (!placeDetails) {
    throw new Error('Não foi possível buscar dados do Google')
  }

  // ===== Validate: detect if Place ID points to a geographic area instead of a business =====
  if (isGeographicResult(placeDetails)) {
    const searchName = overrides?.storeName
    const searchCity = overrides?.storeCity

    if (searchName) {
      const query = searchCity ? `${searchName} ${searchCity}` : searchName
      console.log(`[StoreBuilder] Place ID "${googlePlaceId}" returned geographic result ("${placeDetails.displayName?.text}"). Searching for: "${query}"`)

      const searchResults = await textSearchPlaces(query)

      if (searchResults.length > 0) {
        const bestMatch = searchResults[0]
        console.log(`[StoreBuilder] Text search found: "${bestMatch.displayName.text}" (id: ${bestMatch.id}, type: ${bestMatch.primaryType})`)

        // Re-fetch full details with the corrected Place ID
        const correctedDetails = await getPlaceDetails(bestMatch.id)
        if (correctedDetails && !isGeographicResult(correctedDetails)) {
          placeDetails = correctedDetails
          resolvedPlaceId = bestMatch.id
          console.log(`[StoreBuilder] Corrected Place ID: ${resolvedPlaceId}`)
        } else {
          console.warn(`[StoreBuilder] Text search result also looks invalid, proceeding with original`)
        }
      } else {
        console.warn(`[StoreBuilder] Text search returned no results for "${query}"`)
      }
    } else {
      console.warn(`[StoreBuilder] Place ID "${googlePlaceId}" returned geographic result but no storeName provided for fallback search`)
    }
  }

  const { city, state, zipCode, address } = parseAddressComponents(placeDetails.addressComponents)
  const openingHours = placeDetails.regularOpeningHours?.weekdayDescriptions
    ? parseOpeningHours(placeDetails.regularOpeningHours.weekdayDescriptions)
    : undefined

  const googlePrimaryType = placeDetails.primaryType
  const googleDisplayName = placeDetails.primaryTypeDisplayName?.text || 'Outro'
  console.log(`[StoreBuilder] Google primaryType: "${googlePrimaryType}", displayName: "${googleDisplayName}"`)

  const categoryRecord = await findOrCreateCategory(googlePrimaryType, googleDisplayName)
  const categoryName = categoryRecord.name
  console.log(`[StoreBuilder] Category: "${categoryName}" (id: ${categoryRecord.id}, slug: ${categoryRecord.slug})`)

  const googlePhone = placeDetails.nationalPhoneNumber?.replace(/\D/g, '') || ''
  const googleWhatsapp = placeDetails.internationalPhoneNumber?.replace(/\D/g, '') || googlePhone

  const phone = overrides?.phoneOverride?.replace(/\D/g, '') || googlePhone
  const whatsapp = overrides?.whatsappOverride?.replace(/\D/g, '') || googleWhatsapp

  const selectedCoverIndex = overrides?.selectedCoverIndex ?? 0
  const coverPhotoIndex = placeDetails.photos && selectedCoverIndex < placeDetails.photos.length
    ? selectedCoverIndex
    : 0

  const coverUrl = placeDetails.photos?.[coverPhotoIndex]
    ? getPhotoUrl(placeDetails.photos[coverPhotoIndex].name, 1200)
    : undefined

  const displayName = cleanBusinessName(placeDetails.displayName?.text || overrides?.searchTerm || 'Negócio')

  const heroTitle = buildSeoH1(categoryName, city, displayName)
  const heroSubtitle = buildSeoSubtitle(categoryName, city)
  const aboutSection = buildSeoDescription(displayName, categoryName, city)

  const reviewHighlights = summarizeReviews(placeDetails.reviews)
  const businessAttributes = extractBusinessAttributes(placeDetails)

  let marketingCopy: MarketingCopy | null = null
  let marketingGenerated = false
  try {
    marketingCopy = await generateMarketingCopy({
      businessName: displayName,
      category: categoryName,
      city,
      state,
      rating: placeDetails.rating,
      reviewCount: placeDetails.userRatingCount,
      googleAbout: placeDetails.editorialSummary?.text,
      website: placeDetails.websiteUri,
      priceRange: placeDetails.priceLevel ? PRICE_MAP[placeDetails.priceLevel] : undefined,
      reviewHighlights: reviewHighlights || undefined,
      businessTypes: placeDetails.types,
      address: placeDetails.formattedAddress,
      openingHours,
      businessAttributes: businessAttributes.length > 0 ? businessAttributes : undefined,
    })
    marketingGenerated = true
  } catch (error) {
    console.error('[StoreBuilder] Erro ao gerar marketing copy:', error)
  }

  const seoTitle = truncate(
    `${categoryName} em ${city} | ${displayName}`,
    70
  )!
  const seoDescription = truncate(
    marketingCopy?.seoDescription || `${displayName} - ${categoryName} em ${city}, ${state}. Entre em contato pelo WhatsApp!`,
    160
  )!

  const finalServices = (marketingCopy?.services && marketingCopy.services.length >= 4)
    ? marketingCopy.services.slice(0, 6)
    : generateFallbackServicesLocal(categoryName)

  const fullAddress = address || placeDetails.formattedAddress

  const rawFAQ = (marketingCopy?.faq && marketingCopy.faq.length >= 6)
    ? marketingCopy.faq.slice(0, 8)
    : generateFallbackFAQLocal({
      displayName,
      city,
      category: categoryName,
      address: fullAddress,
      phone: placeDetails.nationalPhoneNumber || phone,
      openingHours,
    })

  const finalFAQ = fixOpeningHoursInFAQ(rawFAQ, openingHours, displayName)

  let finalNeighborhoods: string[] = []
  if (placeDetails.location) {
    finalNeighborhoods = await fetchNearbyNeighborhoods(
      placeDetails.location.latitude,
      placeDetails.location.longitude,
      city,
    )
  }
  if (finalNeighborhoods.length === 0 && marketingCopy?.neighborhoods && marketingCopy.neighborhoods.length > 0) {
    finalNeighborhoods = marketingCopy.neighborhoods
  }

  return {
    displayName,
    category: categoryRecord,
    phone,
    whatsapp,
    fullAddress,
    city,
    state,
    zipCode,
    openingHours,
    latitude: placeDetails.location?.latitude,
    longitude: placeDetails.location?.longitude,
    rating: placeDetails.rating,
    reviewCount: placeDetails.userRatingCount,
    coverUrl,
    heroTitle,
    heroSubtitle,
    description: marketingCopy?.aboutSection || aboutSection,
    seoTitle,
    seoDescription,
    faq: finalFAQ,
    services: finalServices,
    neighborhoods: finalNeighborhoods,
    placeDetails,
    marketingGenerated,
    resolvedPlaceId,
  }
}
