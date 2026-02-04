import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput, AIProvider } from './types'
import { generateMarketingCopyWithGemini, generateServiceDescriptionsWithGemini } from './gemini'
import { generateMarketingCopyWithOpenAI, generateServiceDescriptionsWithOpenAI } from './openai'

export type { MarketingCopy, MarketingCopyInput, FAQItem, ServiceItem, ServiceDescriptionInput, AIProvider } from './types'
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

export function getActiveProvider(): AIProvider {
  return AI_PROVIDER
}
