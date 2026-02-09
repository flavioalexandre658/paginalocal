'use server'

import { z } from 'zod'
import { eq, and, ilike, sql } from 'drizzle-orm'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, testimonial, service, storeImage, category } from '@/db/schema'
import { checkCanCreateStore, getUserPlanContext } from '@/lib/plan-middleware'
import { generateSlug } from '@/lib/utils'
import {
  getPlaceDetails,
  parseAddressComponents,
  parseOpeningHours,
  getPhotoUrl,
  summarizeReviews,
  extractBusinessAttributes,
} from '@/lib/google-places'
import { generateMarketingCopy, type MarketingCopy, type FAQItem, type ServiceItem } from '@/lib/gemini'
import { fixOpeningHoursInFAQ, formatOpeningHoursForFAQ } from '@/lib/faq-utils'
import { downloadImage, optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { notifyStoreActivated } from '@/lib/google-indexing'
import { revalidateSitemap, revalidateCategoryPages } from '@/lib/sitemap-revalidation'
import { generateCitySlug } from '@/lib/utils'

// ===== Schema =====

const createStoreFromGoogleSchema = z.object({
  googlePlaceId: z.string().min(1),
  searchTerm: z.string().min(1),
  selectedCoverIndex: z.number().int().min(0).optional(),
  whatsappOverride: z.string().optional(),
  phoneOverride: z.string().optional(),
})

// ===== Category: Auto-create from Google =====

async function findOrCreateCategory(
  primaryType: string | undefined,
  displayName: string
): Promise<{ id: string; name: string; slug: string }> {
  // 1. Match by Google primaryType in our typeGooglePlace array (preferred)
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

  // 2. Fallback: match by displayName slug or name
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

  // 3. Auto-create new category (rare - only for types not yet mapped)
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

// ===== Helper Functions =====

function normalizeText(str: string): string {
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

function cleanBusinessName(gmbName: string): string {
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

function generateSlugFromName(name: string, city: string): string {
  const essentialWords = extractEssentialWordsForSlug(name)
  const nameSlug = essentialWords.join('-').substring(0, 35)

  const citySlug = normalizeText(city)
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20)

  return `${nameSlug}-${citySlug}`.replace(/-+/g, '-').substring(0, 60)
}

async function generateUniqueServiceSlugForStore(storeId: string, name: string): Promise<string> {
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

function truncate(str: string | undefined | null, maxLength: number): string | undefined {
  if (!str) return undefined
  return str.length > maxLength ? str.substring(0, maxLength) : str
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function buildSeoH1(category: string, city: string, displayName: string): string {
  return `${category} em ${city} – ${displayName}`
}

function buildSeoSubtitle(category: string, city: string): string {
  return `${category} em ${city} com atendimento rápido e de confiança`
}

function buildSeoDescription(displayName: string, category: string, city: string): string {
  const lower = category.toLowerCase()
  return `${displayName} é referência em ${lower} em ${city}, oferecendo serviços com rapidez, qualidade e atendimento de confiança.`
}

// ===== Fallback Services =====

function generateFallbackServices(category: string): ServiceItem[] {
  const lower = category.toLowerCase()

  return [
    { name: 'Atendimento Especializado', description: `Serviço profissional de ${lower} com qualidade garantida` },
    { name: 'Orçamento Gratuito', description: 'Avaliação sem compromisso para seu projeto' },
    { name: 'Atendimento Rápido', description: 'Resposta ágil para suas necessidades' },
    { name: 'Garantia de Satisfação', description: 'Compromisso com a qualidade do serviço' },
    { name: 'Profissionais Qualificados', description: 'Equipe treinada e experiente' },
    { name: 'Preço Justo', description: 'Melhor custo-benefício da região' },
  ]
}

// ===== Fallback FAQ =====

interface FAQContext {
  displayName: string
  city: string
  category: string
  address?: string
  phone?: string
  openingHours?: Record<string, string>
}

function generateFallbackFAQ(ctx: FAQContext): FAQItem[] {
  const { displayName, city, category, address, phone, openingHours } = ctx
  const lower = category.toLowerCase()
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

// ===== Main Action =====

export const createStoreFromGoogleAction = authActionClient
  .schema(createStoreFromGoogleSchema)
  .action(async ({ parsedInput, ctx }) => {
    const storeCheck = await checkCanCreateStore(ctx.userId)
    if (!storeCheck.allowed) {
      throw new Error(storeCheck.reason || 'Limite de lojas atingido. Assine um plano para criar mais lojas.')
    }

    const planContext = await getUserPlanContext(ctx.userId)
    const shouldActivateStore = planContext.hasActiveSubscription

    console.log('[Google Import] Plan context:', {
      userId: ctx.userId,
      hasActiveSubscription: planContext.hasActiveSubscription,
      planType: planContext.planType,
      planName: planContext.planName,
      shouldActivateStore,
    })

    const { googlePlaceId, searchTerm, selectedCoverIndex = 0 } = parsedInput

    const existingStore = await db.query.store.findFirst({
      where: (s, { eq }) => eq(s.googlePlaceId, googlePlaceId),
      columns: { id: true, name: true },
    })

    if (existingStore) {
      throw new Error('Esta empresa já está cadastrada na plataforma. Cada empresa do Google pode ser cadastrada apenas uma vez.')
    }

    // ===== Fetch Google Place Details (API v1 New) =====
    const placeDetails = await getPlaceDetails(googlePlaceId)

    if (!placeDetails) {
      throw new Error('Não foi possível buscar dados do Google')
    }

    // ===== Parse basic data =====
    const { city, state, zipCode, address } = parseAddressComponents(placeDetails.addressComponents)
    const openingHours = placeDetails.regularOpeningHours?.weekdayDescriptions
      ? parseOpeningHours(placeDetails.regularOpeningHours.weekdayDescriptions)
      : undefined

    // ===== Category: match by Google primaryType =====
    const googlePrimaryType = placeDetails.primaryType
    const googleDisplayName = placeDetails.primaryTypeDisplayName?.text || 'Outro'
    console.log(`[Category] Google primaryType: "${googlePrimaryType}", displayName: "${googleDisplayName}"`)

    const categoryRecord = await findOrCreateCategory(googlePrimaryType, googleDisplayName)
    const categoryName = categoryRecord.name
    const categoryId = categoryRecord.id
    console.log(`[Category] Final: "${categoryName}" (id: ${categoryId}, slug: ${categoryRecord.slug})`)

    // ===== Contact info =====
    const googlePhone = placeDetails.nationalPhoneNumber?.replace(/\D/g, '') || ''
    const googleWhatsapp = placeDetails.internationalPhoneNumber?.replace(/\D/g, '') || googlePhone

    const phone = parsedInput.phoneOverride?.replace(/\D/g, '') || googlePhone
    const whatsapp = parsedInput.whatsappOverride?.replace(/\D/g, '') || googleWhatsapp

    // ===== Cover photo =====
    const coverPhotoIndex = placeDetails.photos && selectedCoverIndex < placeDetails.photos.length
      ? selectedCoverIndex
      : 0

    const coverUrl = placeDetails.photos?.[coverPhotoIndex]
      ? getPhotoUrl(placeDetails.photos[coverPhotoIndex].name, 1200)
      : undefined

    // ===== Business name & slug =====
    const displayName = cleanBusinessName(placeDetails.displayName?.text || searchTerm)
    const brandName = displayName
    const baseSlug = generateSlugFromName(displayName, city)

    let slug = baseSlug
    let counter = 1
    while (true) {
      const existing = await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, slug),
      })
      if (!existing) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // ===== SEO defaults =====
    const heroTitle = buildSeoH1(categoryName, city, displayName)
    const heroSubtitle = buildSeoSubtitle(categoryName, city)
    const aboutSection = buildSeoDescription(displayName, categoryName, city)

    // ===== Reviews & Business Attributes for AI prompts =====
    const reviewHighlights = summarizeReviews(placeDetails.reviews)
    const businessAttributes = extractBusinessAttributes(placeDetails)

    const priceMap: Record<string, string> = {
      'PRICE_LEVEL_FREE': 'Gratuito',
      'PRICE_LEVEL_INEXPENSIVE': 'Econômico',
      'PRICE_LEVEL_MODERATE': 'Moderado',
      'PRICE_LEVEL_EXPENSIVE': 'Caro',
      'PRICE_LEVEL_VERY_EXPENSIVE': 'Muito Caro',
    }

    // ===== Generate marketing copy with AI =====
    let marketingCopy: MarketingCopy | null = null
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
        priceRange: placeDetails.priceLevel ? priceMap[placeDetails.priceLevel] : undefined,
        reviewHighlights: reviewHighlights || undefined,
        businessTypes: placeDetails.types,
        address: placeDetails.formattedAddress,
        openingHours,
        businessAttributes: businessAttributes.length > 0 ? businessAttributes : undefined,
      })
    } catch (error) {
      console.error('Erro ao gerar marketing copy:', error)
    }

    const seoTitle = truncate(
      `${categoryName} em ${city} | ${displayName}`,
      70
    )
    const seoDescription = truncate(
      marketingCopy?.seoDescription || `${displayName} - ${categoryName} em ${city}, ${state}. Entre em contato pelo WhatsApp!`,
      160
    )

    const finalServices = (marketingCopy?.services && marketingCopy.services.length >= 4)
      ? marketingCopy.services.slice(0, 6)
      : generateFallbackServices(categoryName)

    const fullAddress = address || placeDetails.formattedAddress

    const rawFAQ = (marketingCopy?.faq && marketingCopy.faq.length >= 6)
      ? marketingCopy.faq.slice(0, 8)
      : generateFallbackFAQ({
        displayName,
        city,
        category: categoryName,
        address: fullAddress,
        phone: placeDetails.nationalPhoneNumber || phone,
        openingHours,
      })

    const finalFAQ = fixOpeningHoursInFAQ(rawFAQ, openingHours, displayName)

    // ===== Neighborhoods =====
    let finalNeighborhoods: string[] = []
    if (placeDetails.location) {
      const { fetchNearbyNeighborhoods } = await import('@/lib/google-places')
      finalNeighborhoods = await fetchNearbyNeighborhoods(
        placeDetails.location.latitude,
        placeDetails.location.longitude,
        city,
      )
    }
    if (finalNeighborhoods.length === 0 && marketingCopy?.neighborhoods && marketingCopy.neighborhoods.length > 0) {
      finalNeighborhoods = marketingCopy.neighborhoods
    }

    // ===== Create store =====
    const [newStore] = await db
      .insert(store)
      .values({
        userId: ctx.userId,
        name: displayName,
        slug,
        category: truncate(categoryName, 100)!,
        categoryId,
        phone,
        whatsapp,
        address: fullAddress,
        city: truncate(city, 100)!,
        state: truncate(state, 2)!,
        zipCode,
        googlePlaceId,
        googleRating: placeDetails.rating?.toString(),
        googleReviewsCount: placeDetails.userRatingCount,
        openingHours,
        latitude: placeDetails.location?.latitude.toString(),
        longitude: placeDetails.location?.longitude.toString(),
        coverUrl,
        heroTitle: truncate(heroTitle, 100),
        heroSubtitle: truncate(heroSubtitle, 200),
        description: marketingCopy?.aboutSection || aboutSection,
        seoTitle,
        seoDescription,
        faq: finalFAQ,
        neighborhoods: finalNeighborhoods,
        isActive: shouldActivateStore,
      })
      .returning()

    // ===== Save reviews as testimonials =====
    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      console.log(`[Reviews] Total recebido do Google: ${placeDetails.reviews.length}`)

      const topReviews = placeDetails.reviews
        .filter(r => r.rating >= 4)
        .sort((a, b) => {
          const aHasText = a.text?.text && a.text.text.trim().length > 0 ? 1 : 0
          const bHasText = b.text?.text && b.text.text.trim().length > 0 ? 1 : 0
          if (bHasText !== aHasText) return bHasText - aHasText
          return b.rating - a.rating
        })
        .slice(0, 15)

      console.log(`[Reviews] Salvando ${topReviews.length} reviews com rating >= 4`)

      for (const review of topReviews) {
        const reviewContent = review.text?.text && review.text.text.trim().length > 0
          ? review.text.text
          : `Avaliou com ${review.rating} estrelas`

        await db
          .insert(testimonial)
          .values({
            storeId: newStore.id,
            authorName: review.authorAttribution?.displayName || 'Anônimo',
            content: reviewContent,
            rating: review.rating,
            imageUrl: review.authorAttribution?.photoUri || null,
            isGoogleReview: true,
          })
          .onConflictDoNothing()
      }
    }

    // ===== Save services =====
    for (let i = 0; i < finalServices.length; i++) {
      const svc = finalServices[i]
      const svcSlug = await generateUniqueServiceSlugForStore(newStore.id, svc.name)
      await db
        .insert(service)
        .values({
          storeId: newStore.id,
          name: svc.name,
          slug: svcSlug,
          description: svc.description,
          seoTitle: svc.seoTitle || null,
          seoDescription: svc.seoDescription || null,
          longDescription: svc.longDescription || null,
          position: i + 1,
          isActive: true,
        })
    }

    // ===== Process and upload images =====
    let imagesProcessed = 0
    let heroImageUrl = coverUrl

    if (placeDetails.photos && placeDetails.photos.length > 0) {
      const allPhotos = [...placeDetails.photos]
      if (coverPhotoIndex > 0 && coverPhotoIndex < allPhotos.length) {
        const [selectedPhoto] = allPhotos.splice(coverPhotoIndex, 1)
        allPhotos.unshift(selectedPhoto)
      }
      const photosToProcess = allPhotos.slice(0, 7)

      const altTemplates = [
        `Fachada da ${displayName} em ${city}`,
        `Ambiente interno da ${displayName} em ${city}`,
        `Equipe da ${displayName} em ${city}`,
        `Estrutura da ${displayName} em ${city}`,
        `Atendimento na ${displayName} em ${city}`,
        `Serviços da ${displayName} em ${city}`,
        `Instalações da ${displayName} em ${city}`,
      ]

      for (let i = 0; i < photosToProcess.length; i++) {
        const photoName = photosToProcess[i].name
        const isHero = i === 0
        const role = isHero ? 'hero' : 'gallery'

        try {
          const googlePhotoUrl = getPhotoUrl(photoName, isHero ? 1200 : 800)
          const imageBuffer = await downloadImage(googlePhotoUrl)

          const optimized = isHero
            ? await optimizeHeroImage(imageBuffer)
            : await optimizeGalleryImage(imageBuffer)

          const filename = `${role}-${i}`
          const s3Key = generateS3Key(newStore.id, filename)
          const { url } = await uploadToS3(optimized.buffer, s3Key)

          await db.insert(storeImage).values({
            storeId: newStore.id,
            url,
            alt: altTemplates[i] || `Foto da ${displayName} em ${city}`,
            role,
            order: i,
            width: optimized.width,
            height: optimized.height,
            originalGoogleRef: photoName,
          })

          if (isHero) {
            heroImageUrl = url
            await db
              .update(store)
              .set({ coverUrl: url, updatedAt: new Date() })
              .where(eq(store.id, newStore.id))
          }

          imagesProcessed++
        } catch (error) {
          console.error(`[Images] Erro ao processar imagem ${i}:`, error)
        }
      }
    }

    // ===== Create subdomain =====
    let subdomainCreated = false
    const subdomain = `${newStore.slug}.paginalocal.com.br`
    try {
      const domainResult = await addDomainToVercel(subdomain)
      subdomainCreated = domainResult.success
      if (!domainResult.success) {
        console.error('[Google Import] Erro ao criar subdomínio na Vercel:', domainResult.error)
      }
    } catch (error) {
      console.error('[Google Import] Erro ao criar subdomínio na Vercel:', error)
    }

    // ===== Revalidate if active =====
    if (shouldActivateStore) {
      notifyStoreActivated(newStore.slug).catch((error) => {
        console.error('[Google Import] Erro ao notificar Google Indexing API:', error)
      })

      await revalidateSitemap()

      if (categoryRecord.slug) {
        await revalidateCategoryPages(categoryRecord.slug, generateCitySlug(newStore.city))
      }
    }

    return {
      store: newStore,
      slug: newStore.slug,
      brandName,
      displayName,
      marketingGenerated: !!marketingCopy,
      reviewsSynced: placeDetails.reviews?.length || 0,
      servicesGenerated: finalServices.length,
      faqGenerated: finalFAQ.length,
      neighborhoodsGenerated: finalNeighborhoods.length,
      imagesProcessed,
      heroImageUrl,
      subdomainCreated,
    }
  })
