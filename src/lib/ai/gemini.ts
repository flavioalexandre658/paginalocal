import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput } from './types'
import {
  getStoreContentPrompt,
  getFaqPrompt,
  getServiceNamesPrompt,
  getServicesPrompt,
  getServiceDescriptionPrompt,
} from './prompts'
import { applyFallbacks, generateFallbackFAQ, generateFallbackServices } from './fallbacks'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

async function callGemini(prompt: string, maxTokens: number = 4000): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { maxOutputTokens: maxTokens },
  })

  const result = await model.generateContent(prompt)
  return result.response.text()
}

function safeParseJson<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/[\[{][\s\S]*[\]}]/)
    if (!match) return fallback
    return JSON.parse(match[0])
  } catch {
    const repaired = repairTruncatedJson(text)
    if (repaired) {
      try {
        return JSON.parse(repaired)
      } catch {
        // noop
      }
    }
    console.error('[AI Gemini] Falha ao parsear JSON')
    return fallback
  }
}

function repairTruncatedJson(text: string): string | null {
  const match = text.match(/[\[{][\s\S]*/)
  if (!match) return null

  let json = match[0]
  let braceCount = 0
  let bracketCount = 0

  for (const char of json) {
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

export async function generateMarketingCopyWithGemini(data: MarketingCopyInput): Promise<MarketingCopy> {
  console.log('[AI Gemini] Etapa 1/4: Gerando conteúdo da loja...')
  const storeContentText = await callGemini(getStoreContentPrompt(data), 2000)
  const storeContent = safeParseJson<Record<string, unknown>>(storeContentText, {})

  console.log('[AI Gemini] Etapa 2/4: Gerando FAQ...')
  const faqText = await callGemini(getFaqPrompt(data), 3000)
  const faq = safeParseJson<Array<{ question: string; answer: string }>>(faqText, [])

  console.log('[AI Gemini] Etapa 3/4: Gerando nomes de serviços...')
  const serviceNamesText = await callGemini(getServiceNamesPrompt(data), 500)
  const serviceNames = safeParseJson<string[]>(serviceNamesText, [])

  let services: ServiceItem[] = []
  if (serviceNames.length > 0) {
    const batch1Names = serviceNames.slice(0, 3)
    const batch2Names = serviceNames.slice(3, 6)

    console.log('[AI Gemini] Etapa 4a/4: Gerando SEO dos serviços 1-3...')
    const services1Text = await callGemini(getServicesPrompt(data, batch1Names), 4000)
    const services1 = safeParseJson<ServiceItem[]>(services1Text, [])

    if (batch2Names.length > 0) {
      console.log('[AI Gemini] Etapa 4b/4: Gerando SEO dos serviços 4-6...')
      const services2Text = await callGemini(getServicesPrompt(data, batch2Names), 4000)
      const services2 = safeParseJson<ServiceItem[]>(services2Text, [])
      services = [...services1, ...services2]
    } else {
      services = services1
    }
  }

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
  }

  console.log('[AI Gemini] Geração concluída! Serviços:', result.services.length, 'FAQs:', result.faq.length)

  return applyFallbacks(result, data)
}

export async function generateServiceDescriptionsWithGemini(data: ServiceDescriptionInput): Promise<ServiceItem[]> {
  const text = await callGemini(getServiceDescriptionPrompt(data), 4000)
  return safeParseJson<ServiceItem[]>(text, [])
}
