'use server'

import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { store, testimonial, service, storeImage, category } from '@/db/schema'
import { checkCanCreateStore, getUserPlanContext } from '@/lib/plan-middleware'
import {
  getPlaceDetails,
  parseAddressComponents,
  parseOpeningHours,
  inferCategory,
  getPhotoUrl,
  summarizeReviews,
} from '@/lib/google-places'
import { generateMarketingCopy, type MarketingCopy, type FAQItem, type ServiceItem } from '@/lib/gemini'
import { downloadImage, optimizeHeroImage, optimizeGalleryImage } from '@/lib/image-optimizer'
import { uploadToS3, generateS3Key } from '@/lib/s3'
import { addDomainToVercel } from '@/actions/vercel/add-domain'
import { notifyStoreActivated } from '@/lib/google-indexing'

const createStoreFromGoogleSchema = z.object({
  googlePlaceId: z.string().min(1),
  searchTerm: z.string().min(1),
  selectedCoverIndex: z.number().int().min(0).optional(),
})

const CATEGORY_SERVICES: Record<string, string[]> = {
  borracharia: ['troca', 'reparo', 'alinhamento', 'balanceamento de pneus'],
  oficina: ['manutenção', 'reparo', 'revisão automotiva'],
  mecânica: ['conserto', 'manutenção', 'diagnóstico de veículos'],
  revendedora: ['compra', 'venda', 'financiamento', 'troca de veículos'],
  veículos: ['compra', 'venda', 'financiamento', 'avaliação de veículos'],
  seminovos: ['compra', 'venda', 'financiamento', 'consignação'],
  concessionária: ['venda', 'financiamento', 'revisão', 'peças originais'],
  locadora: ['aluguel', 'locação', 'reserva de veículos'],
  lava: ['lavagem', 'polimento', 'higienização'],
  estacionamento: ['vaga', 'mensalista', 'rotativo'],
  barbearia: ['corte', 'barba', 'tratamentos capilares'],
  salão: ['corte', 'coloração', 'tratamentos de beleza'],
  restaurante: ['almoço', 'jantar', 'refeições'],
  pizzaria: ['pizzas', 'delivery', 'rodízio'],
  padaria: ['pães', 'bolos', 'confeitaria'],
  lanchonete: ['lanches', 'sanduíches', 'sucos'],
  petshop: ['banho', 'tosa', 'produtos pet'],
  veterinário: ['consultas', 'vacinas', 'cirurgias'],
  clínica: ['consultas', 'exames', 'tratamentos'],
  dentista: ['consultas', 'tratamentos', 'implantes'],
  academia: ['musculação', 'treinos', 'aulas'],
  farmácia: ['medicamentos', 'produtos de saúde'],
  supermercado: ['compras', 'produtos', 'delivery'],
  imobiliária: ['compra', 'venda', 'aluguel de imóveis'],
  advogado: ['consultoria', 'processos', 'orientação jurídica'],
  contador: ['contabilidade', 'impostos', 'abertura de empresa'],
  escola: ['matrículas', 'ensino', 'atividades'],
  hotel: ['hospedagem', 'reservas', 'eventos'],
  floricultura: ['flores', 'arranjos', 'decoração'],
}

function getServicesForCategory(category: string): string {
  const lower = category.toLowerCase()
  for (const [key, services] of Object.entries(CATEGORY_SERVICES)) {
    if (lower.includes(key)) {
      return services.slice(0, 3).join(', ')
    }
  }
  return 'serviços especializados'
}

const CATEGORY_PATTERNS = [
  'borracharia', 'oficina', 'mecânica', 'mecanica', 'barbearia', 'salão', 'salao',
  'restaurante', 'pizzaria', 'lanchonete', 'padaria', 'mercado', 'supermercado',
  'pet shop', 'petshop', 'veterinário', 'veterinaria', 'clínica', 'clinica',
  'academia', 'estúdio', 'estudio', 'loja', 'farmácia', 'farmacia',
  'auto peças', 'autopeças', 'auto center', 'autocenter', 'revendedora', 'revenda',
  'concessionária', 'concessionaria', 'locadora', 'lava jato', 'lava rápido',
  'estacionamento', 'hotel', 'pousada', 'imobiliária', 'imobiliaria',
  'advogado', 'advocacia', 'contador', 'contabilidade', 'escola', 'colégio',
  'colegio', 'faculdade', 'dentista', 'odontologia', 'floricultura', 'floriculturas',
  'papelaria', 'livraria', 'açougue', 'acougue', 'distribuidora', 'atacado', 'varejo',
  'sorveteria', 'açaí', 'acai', 'hamburgueria', 'churrascaria', 'bar', 'pub',
  'posto', 'auto posto', 'conveniência', 'conveniencia', 'mercadinho', 'minimercado',
  'móvel', 'movel', 'móveis', 'moveis', 'eletro', 'eletrônicos', 'eletronicos',
]

interface ExtractedBusinessInfo {
  displayName: string
  brandName: string
  category: string
  slug: string
}

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

function detectCategoryFromName(name: string, googleCategory: string): string {
  const normalized = normalizeText(name)

  for (const pattern of CATEGORY_PATTERNS) {
    const normalizedPattern = normalizeText(pattern)
    if (normalized.includes(normalizedPattern)) {
      return pattern
    }
  }

  return googleCategory.toLowerCase()
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

function extractBusinessInfo(
  gmbName: string,
  _gmbDescription: string | undefined,
  googleCategory: string,
  city: string
): ExtractedBusinessInfo {
  const displayName = cleanBusinessName(gmbName)
  const detectedCategory = detectCategoryFromName(displayName, googleCategory)
  const categoryForDisplay = capitalizeWords(detectedCategory)
  const slug = generateSlugFromName(displayName, city)

  return {
    displayName,
    brandName: displayName,
    category: categoryForDisplay,
    slug,
  }
}

function truncate(str: string | undefined | null, maxLength: number): string | undefined {
  if (!str) return undefined
  return str.length > maxLength ? str.substring(0, maxLength) : str
}

function generateFallbackServices(category: string): ServiceItem[] {
  const lower = category.toLowerCase()

  if (lower.includes('borracharia')) {
    return [
      { name: 'Troca de Pneus', description: 'Troca rápida e segura de pneus de todas as marcas e tamanhos' },
      { name: 'Reparo de Pneus', description: 'Conserto de furos e danos com garantia de qualidade' },
      { name: 'Alinhamento', description: 'Alinhamento computadorizado para maior durabilidade dos pneus' },
      { name: 'Balanceamento', description: 'Balanceamento preciso para conforto e segurança' },
      { name: 'Calibragem', description: 'Calibragem gratuita com equipamentos de precisão' },
      { name: 'Atendimento 24h', description: 'Socorro emergencial disponível a qualquer hora' },
    ]
  }

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

function formatOpeningHoursForFAQ(hours?: Record<string, string>): string {
  if (!hours || Object.keys(hours).length === 0) {
    return 'Consulte nosso horário de funcionamento pelo telefone ou WhatsApp.'
  }

  const DAYS_ORDER = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
  const DAYS_NAMES: Record<string, string> = {
    seg: 'segunda',
    ter: 'terça',
    qua: 'quarta',
    qui: 'quinta',
    sex: 'sexta',
    sab: 'sábado',
    dom: 'domingo',
  }

  const sortedEntries = Object.entries(hours).sort((a, b) => {
    return DAYS_ORDER.indexOf(a[0]) - DAYS_ORDER.indexOf(b[0])
  })

  if (sortedEntries.length === 0) return 'Consulte nosso horário pelo telefone.'

  const formatted = sortedEntries
    .map(([day, time]) => `${DAYS_NAMES[day] || day}: ${time}`)
    .join(', ')

  return `Nosso horário de funcionamento é: ${formatted}.`
}

function fixOpeningHoursInFAQ(
  faq: FAQItem[],
  openingHours?: Record<string, string>,
  storeName?: string
): FAQItem[] {
  const hoursAnswer = formatOpeningHoursForFAQ(openingHours)

  return faq.map(item => {
    const questionLower = item.question.toLowerCase()
    if (
      questionLower.includes('horário') ||
      questionLower.includes('horario') ||
      questionLower.includes('funcionamento') ||
      questionLower.includes('abre') ||
      questionLower.includes('fecha')
    ) {
      return {
        question: storeName
          ? `Qual o horário de funcionamento da ${storeName}?`
          : item.question,
        answer: hoursAnswer,
      }
    }
    return item
  })
}

function generateFallbackFAQ(ctx: FAQContext): FAQItem[] {
  const { displayName, city, category, address, phone, openingHours } = ctx
  const lower = category.toLowerCase()
  const services = getServicesForCategory(category)
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
      answer: `Oferecemos ${services} com qualidade e garantia. Entre em contato para saber mais sobre cada serviço.`,
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
  const services = getServicesForCategory(category)
  return `${capitalizeWords(services)} em ${city} com atendimento rápido e de confiança`
}

function buildSeoDescription(displayName: string, category: string, city: string): string {
  const lower = category.toLowerCase()
  const services = getServicesForCategory(category)
  return `${displayName} é referência em ${lower} em ${city}, oferecendo serviços de ${services} com rapidez, qualidade e atendimento de confiança.`
}

const CATEGORY_SLUG_MAPPING: Record<string, string> = {
  'borracharia': 'borracharia',
  'oficina': 'oficina-mecanica',
  'mecânica': 'oficina-mecanica',
  'mecanica': 'oficina-mecanica',
  'auto center': 'auto-center',
  'autocenter': 'auto-center',
  'auto peças': 'auto-center',
  'autopeças': 'auto-center',
  'revendedora': 'revendedora-veiculos',
  'revenda': 'revendedora-veiculos',
  'concessionária': 'revendedora-veiculos',
  'concessionaria': 'revendedora-veiculos',
  'veículos': 'revendedora-veiculos',
  'seminovos': 'revendedora-veiculos',
  'lava jato': 'lava-jato',
  'lava rápido': 'lava-jato',
  'lava': 'lava-jato',
  'estacionamento': 'estacionamento',
  'barbearia': 'barbearia',
  'salão': 'salao-beleza',
  'salao': 'salao-beleza',
  'restaurante': 'restaurante',
  'churrascaria': 'restaurante',
  'pizzaria': 'pizzaria',
  'hamburgueria': 'lanchonete',
  'lanchonete': 'lanchonete',
  'sorveteria': 'lanchonete',
  'açaí': 'lanchonete',
  'acai': 'lanchonete',
  'padaria': 'padaria',
  'confeitaria': 'padaria',
  'pet shop': 'pet-shop',
  'petshop': 'pet-shop',
  'veterinário': 'clinica-veterinaria',
  'veterinaria': 'clinica-veterinaria',
  'clínica': 'clinica-medica',
  'clinica': 'clinica-medica',
  'dentista': 'consultorio-odontologico',
  'odontologia': 'consultorio-odontologico',
  'academia': 'academia',
  'estúdio': 'academia',
  'estudio': 'academia',
  'farmácia': 'farmacia',
  'farmacia': 'farmacia',
  'supermercado': 'supermercado',
  'mercado': 'supermercado',
  'mercadinho': 'supermercado',
  'minimercado': 'supermercado',
  'imobiliária': 'imobiliaria',
  'imobiliaria': 'imobiliaria',
  'advogado': 'escritorio-advocacia',
  'advocacia': 'escritorio-advocacia',
  'contador': 'escritorio-contabilidade',
  'contabilidade': 'escritorio-contabilidade',
  'escola': 'escola',
  'colégio': 'escola',
  'colegio': 'escola',
  'faculdade': 'escola',
  'hotel': 'hotel',
  'pousada': 'hotel',
  'floricultura': 'floricultura',
  'floriculturas': 'floricultura',
}

async function matchCategoryFromDatabase(detectedCategory: string): Promise<{ id: string; name: string } | null> {
  const lower = detectedCategory.toLowerCase()

  const mappedSlug = CATEGORY_SLUG_MAPPING[lower]

  if (mappedSlug) {
    const found = await db.query.category.findFirst({
      where: (c, { eq }) => eq(c.slug, mappedSlug),
    })
    if (found) {
      return { id: found.id, name: found.name }
    }
  }

  for (const [pattern, slug] of Object.entries(CATEGORY_SLUG_MAPPING)) {
    if (lower.includes(pattern)) {
      const found = await db.query.category.findFirst({
        where: (c, { eq }) => eq(c.slug, slug),
      })
      if (found) {
        return { id: found.id, name: found.name }
      }
    }
  }

  const fuzzyMatch = await db.query.category.findFirst({
    where: (c, { ilike }) => ilike(c.name, `%${lower}%`),
  })

  if (fuzzyMatch) {
    return { id: fuzzyMatch.id, name: fuzzyMatch.name }
  }

  const outroCategory = await db.query.category.findFirst({
    where: (c, { eq }) => eq(c.slug, 'outro'),
  })

  return outroCategory ? { id: outroCategory.id, name: outroCategory.name } : null
}

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

    const placeDetails = await getPlaceDetails(googlePlaceId)

    if (!placeDetails) {
      throw new Error('Não foi possível buscar dados do Google')
    }

    const { city, state, zipCode, address } = parseAddressComponents(placeDetails.address_components)
    const openingHours = placeDetails.opening_hours?.weekday_text
      ? parseOpeningHours(placeDetails.opening_hours.weekday_text)
      : undefined
    const googleCategory = inferCategory(placeDetails.types || [])

    const phone = placeDetails.formatted_phone_number?.replace(/\D/g, '') || ''
    const whatsapp = placeDetails.international_phone_number?.replace(/\D/g, '') || phone

    const coverPhotoIndex = placeDetails.photos && selectedCoverIndex < placeDetails.photos.length
      ? selectedCoverIndex
      : 0

    const coverUrl = placeDetails.photos?.[coverPhotoIndex]
      ? getPhotoUrl(placeDetails.photos[coverPhotoIndex].photo_reference, 1200)
      : undefined

    const gmbName = placeDetails.name || searchTerm
    const gmbDescription = placeDetails.editorial_summary?.overview

    const businessInfo = extractBusinessInfo(gmbName, gmbDescription, googleCategory, city)

    const { displayName, brandName, category: detectedCategory, slug: baseSlug } = businessInfo

    const matchedCategory = await matchCategoryFromDatabase(detectedCategory)
    const categoryName = matchedCategory?.name || detectedCategory
    const categoryId = matchedCategory?.id || null

    const heroTitle = buildSeoH1(categoryName, city, displayName)
    const heroSubtitle = buildSeoSubtitle(categoryName, city)
    const aboutSection = buildSeoDescription(displayName, categoryName, city)

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

    const reviewHighlights = summarizeReviews(placeDetails.reviews)

    const priceRangeMap: Record<number, string> = {
      0: 'Gratuito',
      1: 'Econômico',
      2: 'Moderado',
      3: 'Caro',
      4: 'Muito Caro',
    }

    let marketingCopy: MarketingCopy | null = null
    try {
      marketingCopy = await generateMarketingCopy({
        businessName: displayName,
        category: categoryName,
        city,
        state,
        rating: placeDetails.rating,
        reviewCount: placeDetails.user_ratings_total,
        googleAbout: placeDetails.editorial_summary?.overview,
        website: placeDetails.website,
        priceRange: placeDetails.price_level !== undefined ? priceRangeMap[placeDetails.price_level] : undefined,
        reviewHighlights: reviewHighlights || undefined,
        businessTypes: placeDetails.types,
        address: placeDetails.formatted_address,
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

    const fullAddress = address || placeDetails.formatted_address

    const rawFAQ = (marketingCopy?.faq && marketingCopy.faq.length >= 6)
      ? marketingCopy.faq.slice(0, 8)
      : generateFallbackFAQ({
        displayName,
        city,
        category: categoryName,
        address: fullAddress,
        phone: placeDetails.formatted_phone_number || phone,
        openingHours,
      })

    const finalFAQ = fixOpeningHoursInFAQ(rawFAQ, openingHours, displayName)

    const finalNeighborhoods = (marketingCopy?.neighborhoods && marketingCopy.neighborhoods.length > 0)
      ? marketingCopy.neighborhoods
      : ['Centro', 'Região Central', 'Zona Norte', 'Zona Sul', 'Região Metropolitana']

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
        googleReviewsCount: placeDetails.user_ratings_total,
        openingHours,
        latitude: placeDetails.geometry?.location.lat.toString(),
        longitude: placeDetails.geometry?.location.lng.toString(),
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

    if (placeDetails.reviews && placeDetails.reviews.length > 0) {
      console.log(`[Reviews Debug] Total recebido do Google: ${placeDetails.reviews.length}`)

      const topReviews = placeDetails.reviews
        .filter(r => r.rating >= 4)
        .sort((a, b) => {
          const aHasText = a.text && a.text.trim().length > 0 ? 1 : 0
          const bHasText = b.text && b.text.trim().length > 0 ? 1 : 0
          if (bHasText !== aHasText) return bHasText - aHasText
          if (b.rating !== a.rating) return b.rating - a.rating
          return b.time - a.time
        })
        .slice(0, 15)

      console.log(`[Reviews Debug] ✅ Salvando ${topReviews.length} reviews com rating >= 4`)

      for (const review of topReviews) {
        const reviewContent = review.text && review.text.trim().length > 0
          ? review.text
          : `Avaliou com ${review.rating} estrelas`

        await db
          .insert(testimonial)
          .values({
            storeId: newStore.id,
            authorName: review.author_name,
            content: reviewContent,
            rating: review.rating,
            imageUrl: review.profile_photo_url,
            isGoogleReview: true,
          })
          .onConflictDoNothing()
      }
    }

    for (let i = 0; i < finalServices.length; i++) {
      const svc = finalServices[i]
      await db
        .insert(service)
        .values({
          storeId: newStore.id,
          name: svc.name,
          description: svc.description,
          position: i + 1,
          isActive: true,
        })
    }

    let imagesProcessed = 0
    let heroImageUrl = coverUrl

    if (placeDetails.photos && placeDetails.photos.length > 0) {
      const allPhotos = [...placeDetails.photos]
      if (coverPhotoIndex > 0 && coverPhotoIndex < allPhotos.length) {
        const [selectedPhoto] = allPhotos.splice(coverPhotoIndex, 1)
        allPhotos.unshift(selectedPhoto)
      }
      const photoRefs = allPhotos.slice(0, 7)

      const altTemplates = [
        `Fachada da ${displayName} em ${city}`,
        `Ambiente interno da ${displayName} em ${city}`,
        `Equipe da ${displayName} em ${city}`,
        `Estrutura da ${displayName} em ${city}`,
        `Atendimento na ${displayName} em ${city}`,
        `Serviços da ${displayName} em ${city}`,
        `Instalações da ${displayName} em ${city}`,
      ]

      for (let i = 0; i < photoRefs.length; i++) {
        const photoRef = photoRefs[i].photo_reference
        const isHero = i === 0
        const role = isHero ? 'hero' : 'gallery'

        try {
          const googlePhotoUrl = getPhotoUrl(photoRef, isHero ? 1200 : 800)
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
            originalGoogleRef: photoRef,
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

    if (shouldActivateStore) {
      notifyStoreActivated(newStore.slug).catch((error) => {
        console.error('[Google Import] Erro ao notificar Google Indexing API:', error)
      })
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
