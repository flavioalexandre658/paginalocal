import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput, BusinessClassificationInput, InstitutionalPages, AIProvider } from './types'
import { generateMarketingCopyWithGemini, generateServiceDescriptionsWithGemini, classifyBusinessCategoryWithGemini, generateServiceSeoWithGemini, generateInstitutionalPagesWithGemini } from './gemini'
import { generateMarketingCopyWithOpenAI, generateServiceDescriptionsWithOpenAI, classifyBusinessCategoryWithOpenAI, generateServiceSeoWithOpenAI, generateInstitutionalPagesWithOpenAI, generateProductSeoWithOpenAI, generateCollectionSeoWithOpenAI, generatePricingPlanSeoWithOpenAI } from './openai'
import type { ProductSeoResult, CollectionSeoResult, PricingPlanSeoResult } from './openai'

export type { MarketingCopy, MarketingCopyInput, FAQItem, ServiceItem, ServiceDescriptionInput, BusinessClassificationInput, InstitutionalPages, InstitutionalPageContent, AIProvider } from './types'
export { extractBrandName, generateOptimizedSlug, generateFallbackServices, generateFallbackFAQ } from './fallbacks'

const AI_PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'openai'

export async function generateMarketingCopy(data: MarketingCopyInput): Promise<MarketingCopy> {
  console.log(`[AI] Usando provider: ${AI_PROVIDER}`)

  if (AI_PROVIDER === 'openai') {
    return generateMarketingCopyWithOpenAI(data)
  }

  return generateMarketingCopyWithGemini(data)
}

export async function generateServiceDescriptions(data: ServiceDescriptionInput): Promise<ServiceItem[]> {
  console.log(`[AI] Usando provider: ${AI_PROVIDER}`)

  if (AI_PROVIDER === 'openai') {
    return generateServiceDescriptionsWithOpenAI(data)
  }

  return generateServiceDescriptionsWithGemini(data)
}

export async function classifyBusinessCategory(data: BusinessClassificationInput): Promise<string | null> {
  console.log(`[AI] Classificando categoria com provider: ${AI_PROVIDER}`)

  if (AI_PROVIDER === 'openai') {
    return classifyBusinessCategoryWithOpenAI(data)
  }

  return classifyBusinessCategoryWithGemini(data)
}

export async function generateServiceSeo(
  data: MarketingCopyInput,
  serviceNames: string[],
  serviceDescriptions?: (string | undefined)[],
): Promise<ServiceItem[]> {
  console.log(`[AI] Gerando SEO para serviço(s) "${serviceNames.join(', ')}" com provider: ${AI_PROVIDER}`)

  if (AI_PROVIDER === 'openai') {
    return generateServiceSeoWithOpenAI(data, serviceNames, serviceDescriptions)
  }

  return generateServiceSeoWithGemini(data, serviceNames, serviceDescriptions)
}

export async function generateInstitutionalPages(data: MarketingCopyInput): Promise<InstitutionalPages> {
  console.log(`[AI] Gerando páginas institucionais para "${data.businessName}" com provider: ${AI_PROVIDER}`)

  if (AI_PROVIDER === 'openai') {
    return generateInstitutionalPagesWithOpenAI(data)
  }

  return generateInstitutionalPagesWithGemini(data)
}

export async function generateProductSeo(
  data: MarketingCopyInput,
  productName: string,
  productDescription?: string,
  priceInCents?: number,
): Promise<ProductSeoResult> {
  console.log(`[AI] Gerando SEO para produto "${productName}" com provider: ${AI_PROVIDER}`)
  return generateProductSeoWithOpenAI(data, productName, productDescription, priceInCents)
}

export async function generateCollectionSeo(
  data: MarketingCopyInput,
  collectionName: string,
  collectionDescription?: string,
): Promise<CollectionSeoResult> {
  console.log(`[AI] Gerando SEO para coleção "${collectionName}" com provider: ${AI_PROVIDER}`)
  return generateCollectionSeoWithOpenAI(data, collectionName, collectionDescription)
}

export async function generatePricingPlanSeo(
  data: MarketingCopyInput,
  planName: string,
  planDescription?: string,
  priceInCents?: number,
  interval?: 'MONTHLY' | 'YEARLY' | 'ONE_TIME',
): Promise<PricingPlanSeoResult> {
  console.log(`[AI] Gerando descrição para plano "${planName}" com provider: ${AI_PROVIDER}`)
  return generatePricingPlanSeoWithOpenAI(data, planName, planDescription, priceInCents, interval)
}

export function getActiveProvider(): AIProvider {
  return AI_PROVIDER
}
