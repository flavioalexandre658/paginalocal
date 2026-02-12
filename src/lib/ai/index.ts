import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput, BusinessClassificationInput, InstitutionalPages, AIProvider } from './types'
import { generateMarketingCopyWithGemini, generateServiceDescriptionsWithGemini, classifyBusinessCategoryWithGemini, generateServiceSeoWithGemini, generateInstitutionalPagesWithGemini } from './gemini'
import { generateMarketingCopyWithOpenAI, generateServiceDescriptionsWithOpenAI, classifyBusinessCategoryWithOpenAI, generateServiceSeoWithOpenAI, generateInstitutionalPagesWithOpenAI } from './openai'

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

export function getActiveProvider(): AIProvider {
  return AI_PROVIDER
}
