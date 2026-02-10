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
import { generateMarketingCopy, classifyBusinessCategory, type MarketingCopy, type FAQItem, type ServiceItem, generateFallbackServices } from '@/lib/gemini'
import type { GooglePlaceReview } from '@/lib/google-places'
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

const GOOGLE_TYPE_PT_BR: Record<string, { name: string; icon: string; description: string }> = {
  car_dealer: { name: 'Revendedora de Veículos', icon: 'IconCarGarage', description: 'Compra e venda de veículos novos e seminovos' },
  car_rental: { name: 'Locadora de Veículos', icon: 'IconCar', description: 'Aluguel de carros e veículos' },
  car_repair: { name: 'Oficina Mecânica', icon: 'IconTool', description: 'Manutenção e reparo de veículos' },
  car_wash: { name: 'Lava Jato', icon: 'IconDroplet', description: 'Lavagem e estética automotiva' },
  electric_vehicle_charging_station: { name: 'Posto de Recarga Elétrica', icon: 'IconBolt', description: 'Estação de carregamento para veículos elétricos' },
  gas_station: { name: 'Posto de Combustível', icon: 'IconGasStation', description: 'Abastecimento de veículos' },
  parking: { name: 'Estacionamento', icon: 'IconParking', description: 'Vagas de estacionamento' },
  rest_stop: { name: 'Parada de Descanso', icon: 'IconBuildingStore', description: 'Parada para descanso em rodovias' },
  tire_shop: { name: 'Borracharia', icon: 'IconTire', description: 'Serviços de pneus, alinhamento e balanceamento' },
  corporate_office: { name: 'Escritório Corporativo', icon: 'IconBuilding', description: 'Escritório empresarial' },
  farm: { name: 'Fazenda', icon: 'IconPlant', description: 'Produção agropecuária' },
  ranch: { name: 'Rancho', icon: 'IconPlant', description: 'Propriedade rural' },
  art_gallery: { name: 'Galeria de Arte', icon: 'IconPalette', description: 'Exposição e venda de obras de arte' },
  art_studio: { name: 'Ateliê de Arte', icon: 'IconPalette', description: 'Estúdio de criação artística' },
  auditorium: { name: 'Auditório', icon: 'IconBuildingStore', description: 'Espaço para palestras e apresentações' },
  museum: { name: 'Museu', icon: 'IconBuildingStore', description: 'Acervo cultural e histórico' },
  performing_arts_theater: { name: 'Teatro', icon: 'IconTheater', description: 'Apresentações teatrais e artísticas' },
  library: { name: 'Biblioteca', icon: 'IconBook', description: 'Acervo de livros e espaço de leitura' },
  preschool: { name: 'Creche', icon: 'IconSchool', description: 'Educação infantil' },
  primary_school: { name: 'Escola', icon: 'IconSchool', description: 'Ensino fundamental' },
  school: { name: 'Escola', icon: 'IconSchool', description: 'Instituição de ensino' },
  secondary_school: { name: 'Escola', icon: 'IconSchool', description: 'Ensino médio' },
  university: { name: 'Universidade', icon: 'IconSchool', description: 'Ensino superior' },
  amusement_park: { name: 'Parque de Diversões', icon: 'IconFerrisWheel', description: 'Diversão e entretenimento' },
  aquarium: { name: 'Aquário', icon: 'IconFish', description: 'Exposição de vida marinha' },
  bowling_alley: { name: 'Boliche', icon: 'IconBallBowling', description: 'Pista de boliche e lazer' },
  casino: { name: 'Cassino', icon: 'IconDice', description: 'Jogos e entretenimento' },
  movie_theater: { name: 'Cinema', icon: 'IconMovie', description: 'Exibição de filmes' },
  night_club: { name: 'Casa Noturna', icon: 'IconMusic', description: 'Entretenimento noturno e festas' },
  zoo: { name: 'Zoológico', icon: 'IconPaw', description: 'Exposição de animais' },
  accounting: { name: 'Escritório de Contabilidade', icon: 'IconCalculator', description: 'Serviços contábeis e fiscais' },
  atm: { name: 'Caixa Eletrônico', icon: 'IconCash', description: 'Saques e operações bancárias' },
  bank: { name: 'Banco', icon: 'IconBuildingBank', description: 'Serviços bancários e financeiros' },
  food: { name: 'Restaurante', icon: 'IconToolsKitchen2', description: 'Gastronomia e alimentação' },
  restaurant: { name: 'Restaurante', icon: 'IconToolsKitchen2', description: 'Gastronomia e alimentação' },
  bakery: { name: 'Padaria', icon: 'IconBread', description: 'Pães artesanais e confeitaria' },
  bar: { name: 'Bar', icon: 'IconGlass', description: 'Bebidas e petiscos' },
  cafe: { name: 'Cafeteria', icon: 'IconCoffee', description: 'Café e lanches' },
  coffee_shop: { name: 'Cafeteria', icon: 'IconCoffee', description: 'Café e lanches' },
  fast_food_restaurant: { name: 'Lanchonete', icon: 'IconBurger', description: 'Lanches rápidos e sanduíches' },
  ice_cream_shop: { name: 'Sorveteria', icon: 'IconIceCream', description: 'Sorvetes e sobremesas geladas' },
  pizza_restaurant: { name: 'Pizzaria', icon: 'IconPizza', description: 'Pizzas artesanais e delivery' },
  supermarket: { name: 'Supermercado', icon: 'IconShoppingCart', description: 'Produtos alimentícios e de limpeza' },
  grocery_store: { name: 'Mercearia', icon: 'IconShoppingCart', description: 'Produtos alimentícios' },
  market: { name: 'Mercado', icon: 'IconShoppingCart', description: 'Comércio de produtos variados' },
  convenience_store: { name: 'Conveniência', icon: 'IconShoppingBag', description: 'Produtos de conveniência' },
  meal_delivery: { name: 'Delivery', icon: 'IconTruckDelivery', description: 'Entrega de refeições' },
  meal_takeaway: { name: 'Delivery', icon: 'IconTruckDelivery', description: 'Refeições para viagem' },
  city_hall: { name: 'Prefeitura', icon: 'IconBuilding', description: 'Administração municipal' },
  courthouse: { name: 'Fórum', icon: 'IconScale', description: 'Poder judiciário' },
  fire_station: { name: 'Corpo de Bombeiros', icon: 'IconFlame', description: 'Serviço de bombeiros' },
  police: { name: 'Delegacia', icon: 'IconShield', description: 'Segurança pública' },
  post_office: { name: 'Correios', icon: 'IconMail', description: 'Serviços postais' },
  dentist: { name: 'Consultório Odontológico', icon: 'IconDental', description: 'Serviços odontológicos' },
  dental_clinic: { name: 'Clínica Odontológica', icon: 'IconDental', description: 'Serviços odontológicos' },
  doctor: { name: 'Médico', icon: 'IconStethoscope', description: 'Atendimento médico' },
  hospital: { name: 'Hospital', icon: 'IconBuildingHospital', description: 'Atendimento hospitalar' },
  pharmacy: { name: 'Farmácia', icon: 'IconPill', description: 'Medicamentos e produtos de saúde' },
  drugstore: { name: 'Farmácia', icon: 'IconPill', description: 'Medicamentos e drogaria' },
  physiotherapist: { name: 'Fisioterapeuta', icon: 'IconStretching', description: 'Fisioterapia e reabilitação' },
  spa: { name: 'Spa', icon: 'IconDroplet', description: 'Bem-estar e relaxamento' },
  gym: { name: 'Academia', icon: 'IconBarbell', description: 'Musculação e atividades físicas' },
  fitness_center: { name: 'Academia', icon: 'IconBarbell', description: 'Musculação e atividades físicas' },
  hotel: { name: 'Hotel', icon: 'IconBed', description: 'Hospedagem e eventos' },
  lodging: { name: 'Pousada', icon: 'IconBed', description: 'Hospedagem' },
  church: { name: 'Igreja', icon: 'IconBuildingChurch', description: 'Local de culto religioso' },
  barber_shop: { name: 'Barbearia', icon: 'IconScissors', description: 'Cortes masculinos e barba' },
  beauty_salon: { name: 'Salão de Beleza', icon: 'IconSparkles', description: 'Serviços de beleza e estética' },
  hair_salon: { name: 'Salão de Beleza', icon: 'IconSparkles', description: 'Cortes e tratamentos capilares' },
  florist: { name: 'Floricultura', icon: 'IconFlower', description: 'Flores e arranjos' },
  insurance_agency: { name: 'Seguradora', icon: 'IconShield', description: 'Seguros e proteção' },
  laundry: { name: 'Lavanderia', icon: 'IconWash', description: 'Lavagem de roupas' },
  lawyer: { name: 'Escritório de Advocacia', icon: 'IconScale', description: 'Serviços jurídicos' },
  locksmith: { name: 'Chaveiro', icon: 'IconKey', description: 'Cópias de chaves e fechaduras' },
  moving_company: { name: 'Empresa de Mudanças', icon: 'IconTruck', description: 'Mudanças e transportes' },
  plumber: { name: 'Encanador', icon: 'IconDroplet', description: 'Serviços hidráulicos' },
  electrician: { name: 'Eletricista', icon: 'IconBolt', description: 'Serviços elétricos' },
  painter: { name: 'Pintor', icon: 'IconPaint', description: 'Pintura residencial e comercial' },
  real_estate_agency: { name: 'Imobiliária', icon: 'IconHome', description: 'Compra, venda e aluguel de imóveis' },
  travel_agency: { name: 'Agência de Viagens', icon: 'IconPlane', description: 'Pacotes de viagem e turismo' },
  veterinary_care: { name: 'Clínica Veterinária', icon: 'IconStethoscope', description: 'Atendimento veterinário' },
  pet_store: { name: 'Pet Shop', icon: 'IconDog', description: 'Produtos e serviços para pets' },
  clothing_store: { name: 'Loja de Roupas', icon: 'IconShirt', description: 'Moda e vestuário' },
  electronics_store: { name: 'Loja de Eletrônicos', icon: 'IconDevices', description: 'Eletrônicos e tecnologia' },
  furniture_store: { name: 'Loja de Móveis', icon: 'IconArmchair', description: 'Móveis e decoração' },
  hardware_store: { name: 'Loja de Ferragens', icon: 'IconHammer', description: 'Ferramentas e materiais' },
  home_goods_store: { name: 'Loja de Decoração', icon: 'IconHome', description: 'Artigos para casa e decoração' },
  jewelry_store: { name: 'Joalheria', icon: 'IconDiamond', description: 'Joias e acessórios' },
  book_store: { name: 'Livraria', icon: 'IconBook', description: 'Livros e papelaria' },
  shoe_store: { name: 'Sapataria', icon: 'IconShoe', description: 'Calçados e acessórios' },
  shopping_mall: { name: 'Shopping Center', icon: 'IconBuildingStore', description: 'Centro comercial' },
  department_store: { name: 'Loja de Departamentos', icon: 'IconBuildingStore', description: 'Produtos variados' },
  bicycle_store: { name: 'Loja de Bicicletas', icon: 'IconBike', description: 'Bicicletas e acessórios' },
  liquor_store: { name: 'Distribuidora de Bebidas', icon: 'IconBottle', description: 'Bebidas alcoólicas e não alcoólicas' },
  cell_phone_store: { name: 'Loja de Celulares', icon: 'IconDeviceMobile', description: 'Smartphones e acessórios' },
  airport: { name: 'Aeroporto', icon: 'IconPlane', description: 'Terminal aéreo' },
  bus_station: { name: 'Rodoviária', icon: 'IconBus', description: 'Terminal rodoviário' },
  train_station: { name: 'Estação de Trem', icon: 'IconTrain', description: 'Transporte ferroviário' },
  subway_station: { name: 'Estação de Metrô', icon: 'IconTrain', description: 'Transporte metroviário' },
  tourist_attraction: { name: 'Atração Turística', icon: 'IconMapPin', description: 'Ponto turístico' },
  park: { name: 'Parque', icon: 'IconTree', description: 'Área verde e lazer' },
  cemetery: { name: 'Cemitério', icon: 'IconBuildingStore', description: 'Serviços funerários' },
  funeral_home: { name: 'Funerária', icon: 'IconBuildingStore', description: 'Serviços funerários' },
  wedding_venue: { name: 'Espaço para Eventos', icon: 'IconBuildingStore', description: 'Espaço para casamentos e eventos' },
  event_venue: { name: 'Espaço para Eventos', icon: 'IconBuildingStore', description: 'Local para eventos e conferências' },
  child_care_agency: { name: 'Creche', icon: 'IconBabyCarriage', description: 'Cuidados infantis' },
  storage: { name: 'Guarda-Volumes', icon: 'IconBox', description: 'Armazenamento e self-storage' },
  roofing_contractor: { name: 'Telhados e Coberturas', icon: 'IconHome', description: 'Serviços de telhado e cobertura' },
  courier_service: { name: 'Serviço de Entregas', icon: 'IconTruckDelivery', description: 'Entregas e logística' },
}

function buildCategorySeoContent(name: string) {
  const lower = name.toLowerCase()
  return {
    seoTitle: truncate(`${name} Perto de Mim - Encontre a Melhor`, 70)!,
    seoDescription: truncate(`Encontre ${lower} perto de você com avaliações reais de clientes. Compare serviços, veja endereços e entre em contato pelo WhatsApp.`, 160)!,
    seoKeywords: [`${lower} perto de mim`, lower, `melhor ${lower}`],
    heroTitle: truncate(`Encontre ${name} Perto de Você`, 100)!,
    heroSubtitle: `Compare avaliações reais, veja endereços e entre em contato pelo WhatsApp com ${lower} da sua cidade.`,
    longDescription: `Procurando ${lower} perto de você? No Página Local você encontra ${lower} com avaliações reais de clientes, endereço completo e contato direto por WhatsApp. Compare preços e serviços, veja quem atende na sua região e escolha a melhor opção para você.`,
    faqs: [
      {
        question: `Qual a melhor ${lower} perto de mim?`,
        answer: `No Página Local você encontra ${lower} com avaliações reais de clientes na sua cidade. Compare notas, serviços e localização para escolher a melhor opção perto de você.`,
      },
      {
        question: `Como entrar em contato com ${lower}?`,
        answer: `Você pode entrar em contato pelo WhatsApp ou telefone, disponíveis no perfil de cada estabelecimento no Página Local.`,
      },
      {
        question: `${name} aceita cartão de crédito?`,
        answer: `A maioria aceita cartões de crédito e débito, além de PIX. Consulte as formas de pagamento no perfil de cada estabelecimento.`,
      },
      {
        question: `Como avaliar ${lower}?`,
        answer: `Após utilizar o serviço, você pode deixar sua avaliação no perfil do estabelecimento. Avaliações reais ajudam outros clientes a escolher.`,
      },
    ],
    suggestedServices: ['Atendimento Especializado', 'Orçamento Gratuito', 'Atendimento Rápido', 'Garantia de Satisfação'],
  }
}

async function findCategoryBySlugOrName(name: string): Promise<{ id: string; name: string; slug: string } | null> {
  const slug = generateSlug(name)

  const bySlug = await db.query.category.findFirst({
    where: (c, { eq: eqOp }) => eqOp(c.slug, slug),
  })
  if (bySlug) {
    return { id: bySlug.id, name: bySlug.name, slug: bySlug.slug }
  }

  const byName = await db
    .select()
    .from(category)
    .where(ilike(category.name, name))
    .limit(1)
    .then(rows => rows[0] || null)
  if (byName) {
    return { id: byName.id, name: byName.name, slug: byName.slug }
  }

  return null
}

async function autoCreateCategory(
  name: string,
  icon?: string,
  description?: string,
): Promise<{ id: string; name: string; slug: string }> {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1)
  const slug = generateSlug(capitalizedName)

  const existingPt = await db.query.category.findFirst({
    where: (c, { eq: eqOp }) => eqOp(c.slug, slug),
  })
  if (existingPt) {
    console.log(`[Category] Auto-create found existing by slug "${slug}" -> "${existingPt.name}"`)
    return { id: existingPt.id, name: existingPt.name, slug: existingPt.slug }
  }

  const seo = buildCategorySeoContent(capitalizedName)
  console.log(`[Category] Auto-creating category "${capitalizedName}" with full SEO (typeGooglePlace: [])`)

  const [created] = await db.insert(category).values({
    name: truncate(capitalizedName, 100)!,
    slug: truncate(slug, 100)!,
    icon: icon || 'IconBuildingStore',
    description: description || `Serviços de ${capitalizedName.toLowerCase()}`,
    suggestedServices: seo.suggestedServices,
    seoTitle: seo.seoTitle,
    seoDescription: seo.seoDescription,
    seoKeywords: seo.seoKeywords,
    heroTitle: seo.heroTitle,
    heroSubtitle: seo.heroSubtitle,
    longDescription: seo.longDescription,
    faqs: seo.faqs,
    typeGooglePlace: [],
  }).returning()

  return { id: created.id, name: created.name, slug: created.slug }
}

export async function findOrCreateCategory(
  primaryType: string | undefined,
  displayName: string,
  businessName?: string,
  reviews?: GooglePlaceReview[],
): Promise<{ id: string; name: string; slug: string }> {
  // 1. AI-based classification (most accurate)
  if (businessName) {
    try {
      const aiCategory = await classifyBusinessCategory({
        businessName,
        primaryType,
        reviews,
      })

      if (aiCategory) {
        console.log(`[Category] AI classified "${businessName}" as "${aiCategory}"`)

        const found = await findCategoryBySlugOrName(aiCategory)
        if (found) {
          console.log(`[Category] AI match found in DB: "${found.name}" (slug: ${found.slug})`)
          return found
        }

        console.log(`[Category] AI category "${aiCategory}" not in DB, auto-creating...`)
        const translation = primaryType ? GOOGLE_TYPE_PT_BR[primaryType] : undefined
        return autoCreateCategory(
          aiCategory,
          translation?.icon,
          translation?.description,
        )
      }
    } catch (error) {
      console.error(`[Category] AI classification failed, falling back to rule-based:`, error)
    }
  }

  // 2. Fallback: Match by primaryType in existing categories
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

  // 3. Fallback: Match by slug from displayName
  const found = await findCategoryBySlugOrName(displayName)
  if (found) {
    console.log(`[Category] Matched by slug/name "${displayName}" -> "${found.name}"`)
    return found
  }

  // 4. Fallback: Auto-create with GOOGLE_TYPE_PT_BR translation
  if (primaryType && GOOGLE_TYPE_PT_BR[primaryType]) {
    const translation = GOOGLE_TYPE_PT_BR[primaryType]
    const existingTranslation = await findCategoryBySlugOrName(translation.name)
    if (existingTranslation) {
      console.log(`[Category] Translation "${primaryType}" -> "${translation.name}" matched existing "${existingTranslation.name}"`)
      return existingTranslation
    }

    return autoCreateCategory(translation.name, translation.icon, translation.description)
  }

  // 5. Fallback to "Outro"
  const outroCategory = await db.query.category.findFirst({
    where: (c, { eq: eqOp }) => eqOp(c.slug, 'outro'),
  })

  if (outroCategory) {
    console.log(`[Category] No match for "${displayName}" (primaryType: "${primaryType}"), falling back to "Outro"`)
    return { id: outroCategory.id, name: outroCategory.name, slug: outroCategory.slug }
  }

  // 6. Last resort: create "Outro" if it doesn't exist
  return autoCreateCategory('Outro', 'IconBuildingStore', 'Outros tipos de negócio')
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

function deduplicateFAQ(faq: FAQItem[]): FAQItem[] {
  const seen = new Set<string>()
  return faq.filter(item => {
    const key = normalizeText(item.question).replace(/[^a-z0-9]/g, '')
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
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

/**
 * Ensures every service has seoTitle, seoDescription, and longDescription.
 * AI generation sometimes returns incomplete fields; fallback services never have them.
 * This guarantees service pages always have rich SEO content.
 */
function enrichServiceFields(
  services: ServiceItem[],
  businessName: string,
  categoryName: string,
  city: string,
  state: string,
): ServiceItem[] {
  return services.map(svc => ({
    ...svc,
    seoTitle: truncate(svc.seoTitle || `${svc.name} em ${city} | ${businessName}`, 70),
    seoDescription: truncate(svc.seoDescription || `${svc.name} na ${businessName}, ${categoryName.toLowerCase()} em ${city}. ${svc.description} Entre em contato pelo WhatsApp!`, 160),
    longDescription: svc.longDescription || generateServiceLongDescription(svc.name, svc.description, businessName, categoryName, city, state),
  }))
}

/**
 * Generates a rich long description for a service page when AI didn't provide one.
 * Contains local SEO keywords: "[serviço] em [cidade]", "[serviço] perto de mim", business name.
 */
function generateServiceLongDescription(
  serviceName: string,
  description: string,
  businessName: string,
  categoryName: string,
  city: string,
  state: string,
): string {
  const lower = serviceName.toLowerCase()
  const catLower = categoryName.toLowerCase()

  return `Procurando por ${lower} em ${city}? A ${businessName} é ${catLower} em ${city}, ${state}, que oferece ${lower} com profissionais experientes e atendimento personalizado. ${description}

Na ${businessName}, o serviço de ${lower} é realizado com atenção aos detalhes e foco no resultado para o cliente. Trabalhamos para que cada atendimento de ${lower} em ${city} supere suas expectativas, com equipamentos adequados e equipe preparada.

Se você está buscando ${lower} perto de mim em ${city} e região, a ${businessName} atende clientes de toda a cidade e região metropolitana. Nossa localização facilita o acesso para quem precisa de ${lower} com praticidade.

Entre em contato pelo WhatsApp para fazer seu orçamento de ${lower} na ${businessName} sem compromisso. Atendemos ${city}, ${state} e região.`
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
  const businessDisplayName = placeDetails.displayName?.text || overrides?.searchTerm || ''
  console.log(`[StoreBuilder] Google primaryType: "${googlePrimaryType}", displayName: "${googleDisplayName}", business: "${businessDisplayName}"`)

  const categoryRecord = await findOrCreateCategory(
    googlePrimaryType,
    googleDisplayName,
    businessDisplayName,
    placeDetails.reviews,
  )
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

  const heroTitle = truncate(buildSeoH1(categoryName, city, displayName), 100)!
  const heroSubtitle = truncate(buildSeoSubtitle(categoryName, city), 200)!
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

  const finalHeroTitle = truncate(
    marketingCopy?.heroTitle || heroTitle,
    100
  )!
  const finalHeroSubtitle = truncate(
    marketingCopy?.heroSubtitle || heroSubtitle,
    200
  )!
  const seoTitle = truncate(
    marketingCopy?.seoTitle || `${categoryName} em ${city} | ${displayName}`,
    70
  )!
  const seoDescription = truncate(
    marketingCopy?.seoDescription || `${displayName} - ${categoryName} em ${city}, ${state}. Entre em contato pelo WhatsApp!`,
    160
  )!

  // Use AI services if available, otherwise category-specific fallbacks from ai/fallbacks.ts
  const rawServices = (marketingCopy?.services && marketingCopy.services.length >= 4)
    ? marketingCopy.services.slice(0, 6)
    : generateFallbackServices(categoryName)

  // Always enrich: ensure every service has seoTitle, seoDescription, and longDescription
  const finalServices = enrichServiceFields(rawServices, displayName, categoryName, city, state)

  const fullAddress = address || placeDetails.formattedAddress

  const rawFAQ = (marketingCopy?.faq && marketingCopy.faq.length >= 6)
    ? deduplicateFAQ(marketingCopy.faq).slice(0, 8)
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
    heroTitle: finalHeroTitle,
    heroSubtitle: finalHeroSubtitle,
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
