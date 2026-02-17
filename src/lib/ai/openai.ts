import OpenAI from 'openai'
import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput, BusinessClassificationInput, InstitutionalPages } from './types'
import {
  getStoreContentPrompt,
  getFaqPrompt,
  getServiceNamesPrompt,
  getServicesPrompt,
  getServiceDescriptionPrompt,
  getBusinessClassificationPrompt,
  getInstitutionalPagesPrompt,
} from './prompts'
import {
  getProductSeoPrompt,
  getCollectionSeoPrompt,
  getPricingPlanSeoPrompt,
} from './prompts-products'
import { applyFallbacks, generateFallbackFAQ, generateFallbackServices } from './fallbacks'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

async function callOpenAI(systemPrompt: string, userPrompt: string, maxTokens: number = 4000, temperature: number = 0.7): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: maxTokens,
  })

  return completion.choices[0]?.message?.content || ''
}

function cleanJsonText(text: string): string {
  let cleaned = text.trim()
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  cleaned = cleaned.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
  return cleaned
}

function safeParseJson<T>(text: string, fallback: T): T {
  const cleaned = cleanJsonText(text)

  try {
    const match = cleaned.match(/[\[{][\s\S]*[\]}]/)
    if (!match) {
      console.error('[AI OpenAI] Nenhum JSON encontrado no texto:', cleaned.substring(0, 200))
      return fallback
    }
    return JSON.parse(match[0])
  } catch {
    const repaired = repairTruncatedJson(cleaned)
    if (repaired) {
      try {
        return JSON.parse(repaired)
      } catch {
        // noop
      }
    }
    console.error('[AI OpenAI] Falha ao parsear JSON. Texto recebido:', cleaned.substring(0, 300))
    return fallback
  }
}

async function callOpenAIWithRetry<T>(
  systemPrompt: string,
  userPrompt: string,
  fallback: T,
  maxTokens: number = 4000,
): Promise<T> {
  const text1 = await callOpenAI(systemPrompt, userPrompt, maxTokens, 0.7)
  const result1 = safeParseJson<T>(text1, null as T)

  if (result1 !== null && (Array.isArray(result1) ? result1.length > 0 : Object.keys(result1 as object).length > 0)) {
    return result1
  }

  console.log('[AI OpenAI] Primeira tentativa falhou, retentando com temperature=0.3...')
  const text2 = await callOpenAI(systemPrompt, userPrompt, maxTokens, 0.3)
  const result2 = safeParseJson<T>(text2, fallback)
  return result2
}

function repairTruncatedJson(text: string): string | null {
  const match = text.match(/[\[{][\s\S]*/)
  if (!match) return null

  let json = match[0]
  let braceCount = 0
  let bracketCount = 0
  let inString = false
  let escaped = false

  for (const char of json) {
    if (escaped) { escaped = false; continue }
    if (char === '\\') { escaped = true; continue }
    if (char === '"') { inString = !inString; continue }
    if (inString) continue
    if (char === '{') braceCount++
    if (char === '}') braceCount--
    if (char === '[') bracketCount++
    if (char === ']') bracketCount--
  }

  while (bracketCount > 0) {
    json += ']'
    bracketCount--
  }
  while (braceCount > 0) {
    json += '}'
    braceCount--
  }

  return json
}

export async function generateMarketingCopyWithOpenAI(data: MarketingCopyInput): Promise<MarketingCopy> {
  const systemPrompt = 'Você é especialista em SEO local e AEO brasileiro. Gere textos que ranqueiam no Google e são citados por IAs (Google AI Overview, ChatGPT, Gemini). Evite frases de IA (excelência, robusto, comprometimento, holístico, inovador). Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log('[AI OpenAI] Etapa 1/4: Gerando conteúdo da loja...')
  const storeContent = await callOpenAIWithRetry<Record<string, unknown>>(
    systemPrompt, getStoreContentPrompt(data), {}, 2000,
  )

  console.log('[AI OpenAI] Etapa 2/4: Gerando FAQ...')
  const faq = await callOpenAIWithRetry<Array<{ question: string; answer: string }>>(
    systemPrompt, getFaqPrompt(data), [], 3000,
  )

  console.log('[AI OpenAI] Etapa 3/4: Gerando nomes de serviços...')
  const serviceNames = await callOpenAIWithRetry<string[]>(
    systemPrompt, getServiceNamesPrompt(data), [], 500,
  )

  let services: ServiceItem[] = []
  if (serviceNames.length > 0) {
    const batch1Names = serviceNames.slice(0, 3)
    const batch2Names = serviceNames.slice(3, 6)

    console.log('[AI OpenAI] Etapa 4a/4: Gerando SEO dos serviços 1-3...')
    const services1 = await callOpenAIWithRetry<ServiceItem[]>(
      systemPrompt, getServicesPrompt(data, batch1Names), [], 4000,
    )

    if (batch2Names.length > 0) {
      console.log('[AI OpenAI] Etapa 4b/4: Gerando SEO dos serviços 4-6...')
      const services2 = await callOpenAIWithRetry<ServiceItem[]>(
        systemPrompt, getServicesPrompt(data, batch2Names), [], 4000,
      )
      services = [...services1, ...services2]
    } else {
      services = services1
    }
  }

  const rawGender = storeContent.termGender as string
  const rawNumber = storeContent.termNumber as string

  const result: MarketingCopy = {
    brandName: (storeContent.brandName as string) || '',
    slug: '',
    heroTitle: (storeContent.heroTitle as string) || '',
    heroSubtitle: (storeContent.heroSubtitle as string) || '',
    aboutSection: (storeContent.aboutSection as string) || '',
    seoTitle: (storeContent.seoTitle as string) || '',
    seoDescription: (storeContent.seoDescription as string) || '',
    services: services.length > 0 ? services : generateFallbackServices(data.category),
    faq: faq.length > 0 ? faq : generateFallbackFAQ(data.businessName, data.city, data.category),
    neighborhoods: (storeContent.neighborhoods as string[]) || [],
    termGender: (rawGender === 'MASCULINE' || rawGender === 'FEMININE') ? rawGender : 'FEMININE',
    termNumber: (rawNumber === 'PLURAL') ? 'PLURAL' : 'SINGULAR',
  }

  console.log('[AI OpenAI] Geração concluída! Serviços:', result.services.length, 'FAQs:', result.faq.length)

  return applyFallbacks(result, data)
}

export async function generateServiceDescriptionsWithOpenAI(data: ServiceDescriptionInput): Promise<ServiceItem[]> {
  const prompt = getServiceDescriptionPrompt(data)

  const text = await callOpenAI(
    'Você gera serviços para negócios locais. Sempre retorne JSON válido sem markdown.',
    prompt,
    4000
  )

  return safeParseJson<ServiceItem[]>(text, [])
}

export async function generateServiceSeoWithOpenAI(
  data: MarketingCopyInput,
  serviceNames: string[],
  serviceDescriptions?: (string | undefined)[],
): Promise<ServiceItem[]> {
  const systemPrompt = 'Você é especialista em SEO local e AEO brasileiro. Gere textos que ranqueiam no Google ("[serviço] em [cidade]") e são citados por IAs. Evite frases de IA (excelência, robusto, comprometimento, holístico). Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log(`[AI OpenAI] Gerando SEO para ${serviceNames.length} serviço(s): ${serviceNames.join(', ')}`)

  const result = await callOpenAIWithRetry<ServiceItem[]>(
    systemPrompt, getServicesPrompt(data, serviceNames, serviceDescriptions), [], 4000,
  )

  return result.map(svc => ({
    ...svc,
    seoTitle: (svc.seoTitle || '').substring(0, 70),
    seoDescription: (svc.seoDescription || '').substring(0, 160),
  }))
}

export async function classifyBusinessCategoryWithOpenAI(data: BusinessClassificationInput): Promise<string | null> {
  const systemPrompt = 'Você classifica negócios locais brasileiros. Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'
  const userPrompt = getBusinessClassificationPrompt(data)

  console.log(`[AI OpenAI] Classificando categoria para "${data.businessName}"...`)

  const result = await callOpenAIWithRetry<{ category: string | null }>(
    systemPrompt, userPrompt, { category: null }, 200,
  )

  const categoryName = result?.category?.trim()?.toLowerCase() || null
  console.log(`[AI OpenAI] Categoria identificada: "${categoryName}"`)
  return categoryName
}

export async function generateInstitutionalPagesWithOpenAI(data: MarketingCopyInput): Promise<InstitutionalPages> {
  const systemPrompt = 'Você é especialista em SEO local e AEO brasileiro. Gere textos institucionais que ranqueiam no Google e são citados por IAs. Evite frases de IA (referência em, qualidade e dedicação, excelência, comprometimento). Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log(`[AI OpenAI] Gerando páginas institucionais para "${data.businessName}"`)

  const fallback: InstitutionalPages = {
    about: {
      title: `Sobre a ${data.businessName}`,
      content: `A ${data.businessName} é ${data.category.toLowerCase()} em ${data.city}, ${data.state}. Entre em contato para conhecer nossos serviços.`,
      seoTitle: `Sobre a ${data.businessName} | ${data.category} em ${data.city}`,
      seoDescription: `Conheça a ${data.businessName}, ${data.category.toLowerCase()} em ${data.city}. Saiba mais sobre nossos serviços.`,
    },
    contact: {
      title: `Contato | ${data.businessName}`,
      content: `Entre em contato com a ${data.businessName} em ${data.city}. Atendemos por WhatsApp e telefone.`,
      seoTitle: `Contato ${data.businessName} | ${data.category} em ${data.city}`,
      seoDescription: `Entre em contato com a ${data.businessName} em ${data.city}. Atendemos por WhatsApp e telefone.`,
    },
  }

  const result = await callOpenAIWithRetry<InstitutionalPages>(
    systemPrompt, getInstitutionalPagesPrompt(data), fallback, 3000,
  )

  return {
    about: {
      title: (result.about?.title || fallback.about.title).substring(0, 255),
      content: result.about?.content || fallback.about.content,
      seoTitle: (result.about?.seoTitle || fallback.about.seoTitle).substring(0, 70),
      seoDescription: (result.about?.seoDescription || fallback.about.seoDescription).substring(0, 160),
    },
    contact: {
      title: (result.contact?.title || fallback.contact.title).substring(0, 255),
      content: result.contact?.content || fallback.contact.content,
      seoTitle: (result.contact?.seoTitle || fallback.contact.seoTitle).substring(0, 70),
      seoDescription: (result.contact?.seoDescription || fallback.contact.seoDescription).substring(0, 160),
    },
  }
}

export interface ProductSeoResult {
  description: string
  seoTitle: string
  seoDescription: string
  longDescription: string
}

export interface CollectionSeoResult {
  description: string
  seoTitle: string
  seoDescription: string
  longDescription: string
}

export interface PricingPlanSeoResult {
  description: string
  longDescription: string
}

export async function generateProductSeoWithOpenAI(
  data: MarketingCopyInput,
  productName: string,
  productDescription?: string,
  priceInCents?: number,
): Promise<ProductSeoResult> {
  const systemPrompt = 'Você é especialista em SEO e AEO para e-commerce local brasileiro. Gere textos que ranqueiam no Google ("[produto] em [cidade]") e são citados por IAs. Evite frases genéricas de IA (excelência, comprometimento, robusto, holístico). Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log(`[AI OpenAI] Gerando SEO para produto "${productName}"`)

  const fallback: ProductSeoResult = {
    description: productDescription || productName,
    seoTitle: `${productName} | ${data.businessName}`.substring(0, 60),
    seoDescription: `${productName} em ${data.city}. ${data.businessName}. Peça pelo WhatsApp!`.substring(0, 155),
    longDescription: `${productName} disponível na ${data.businessName} em ${data.city}, ${data.state}.\nEntre em contato pelo WhatsApp para mais informações.`,
  }

  const result = await callOpenAIWithRetry<ProductSeoResult>(
    systemPrompt, getProductSeoPrompt(data, productName, productDescription, priceInCents), fallback, 2000,
  )

  return {
    description: (result.description || fallback.description).substring(0, 255),
    seoTitle: (result.seoTitle || fallback.seoTitle).substring(0, 70),
    seoDescription: (result.seoDescription || fallback.seoDescription).substring(0, 160),
    longDescription: result.longDescription || fallback.longDescription,
  }
}

export async function generateCollectionSeoWithOpenAI(
  data: MarketingCopyInput,
  collectionName: string,
  collectionDescription?: string,
): Promise<CollectionSeoResult> {
  const systemPrompt = 'Você é especialista em SEO e AEO para e-commerce local brasileiro. Gere textos que ranqueiam no Google e são citados por IAs (ChatGPT, Gemini, Perplexity). Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log(`[AI OpenAI] Gerando SEO para coleção "${collectionName}"`)

  const fallback: CollectionSeoResult = {
    description: collectionDescription || collectionName,
    seoTitle: `${collectionName} em ${data.city} | ${data.businessName}`.substring(0, 60),
    seoDescription: `${collectionName} em ${data.city}. Confira no catálogo da ${data.businessName}! Peça pelo WhatsApp.`.substring(0, 155),
    longDescription: `${collectionName} disponível na ${data.businessName} em ${data.city}, ${data.state}.\nA ${data.businessName} oferece ${collectionName.toLowerCase()} para clientes de ${data.city} e região.\nEntre em contato pelo WhatsApp para ver os produtos disponíveis.`,
  }

  const result = await callOpenAIWithRetry<CollectionSeoResult>(
    systemPrompt, getCollectionSeoPrompt(data, collectionName, collectionDescription), fallback, 2000,
  )

  return {
    description: (result.description || fallback.description).substring(0, 255),
    seoTitle: (result.seoTitle || fallback.seoTitle).substring(0, 70),
    seoDescription: (result.seoDescription || fallback.seoDescription).substring(0, 160),
    longDescription: result.longDescription || fallback.longDescription,
  }
}

export async function generatePricingPlanSeoWithOpenAI(
  data: MarketingCopyInput,
  planName: string,
  planDescription?: string,
  priceInCents?: number,
  interval?: 'MONTHLY' | 'YEARLY' | 'ONE_TIME',
): Promise<PricingPlanSeoResult> {
  const systemPrompt = 'Você é especialista em SEO e copywriting para negócios locais brasileiros. Gere textos que ranqueiam no Google e convertem visitantes em clientes. Sempre retorne JSON válido sem markdown. NUNCA use blocos de código (```).'

  console.log(`[AI OpenAI] Gerando SEO para plano "${planName}"`)

  const fallback: PricingPlanSeoResult = {
    description: planDescription || `${planName} - ${data.businessName}`,
    longDescription: `${planName} disponível na ${data.businessName} em ${data.city}, ${data.state}.\nEntre em contato pelo WhatsApp para saber mais sobre este plano e condições disponíveis.`,
  }

  const result = await callOpenAIWithRetry<PricingPlanSeoResult>(
    systemPrompt, getPricingPlanSeoPrompt(data, planName, planDescription, priceInCents, interval), fallback, 1500,
  )

  return {
    description: (result.description || fallback.description).substring(0, 500),
    longDescription: result.longDescription || fallback.longDescription,
  }
}
