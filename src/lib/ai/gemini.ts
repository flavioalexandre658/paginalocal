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

async function callGemini(prompt: string, maxTokens: number = 4000, temperature: number = 0.7): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { maxOutputTokens: maxTokens, temperature },
  })

  const result = await model.generateContent(prompt)
  return result.response.text()
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
      console.error('[AI Gemini] Nenhum JSON encontrado no texto:', cleaned.substring(0, 200))
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
    console.error('[AI Gemini] Falha ao parsear JSON. Texto recebido:', cleaned.substring(0, 300))
    return fallback
  }
}

async function callGeminiWithRetry<T>(
  prompt: string,
  fallback: T,
  maxTokens: number = 4000,
): Promise<T> {
  const text1 = await callGemini(prompt, maxTokens, 0.7)
  const result1 = safeParseJson<T>(text1, null as T)

  if (result1 !== null && (Array.isArray(result1) ? result1.length > 0 : Object.keys(result1 as object).length > 0)) {
    return result1
  }

  console.log('[AI Gemini] Primeira tentativa falhou, retentando com temperature=0.3...')
  const text2 = await callGemini(prompt, maxTokens, 0.3)
  return safeParseJson<T>(text2, fallback)
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

export async function generateMarketingCopyWithGemini(data: MarketingCopyInput): Promise<MarketingCopy> {
  console.log('[AI Gemini] Etapa 1/4: Gerando conteúdo da loja...')
  const storeContent = await callGeminiWithRetry<Record<string, unknown>>(
    getStoreContentPrompt(data), {}, 2000,
  )

  console.log('[AI Gemini] Etapa 2/4: Gerando FAQ...')
  const faq = await callGeminiWithRetry<Array<{ question: string; answer: string }>>(
    getFaqPrompt(data), [], 3000,
  )

  console.log('[AI Gemini] Etapa 3/4: Gerando nomes de serviços...')
  const serviceNames = await callGeminiWithRetry<string[]>(
    getServiceNamesPrompt(data), [], 500,
  )

  let services: ServiceItem[] = []
  if (serviceNames.length > 0) {
    const batch1Names = serviceNames.slice(0, 3)
    const batch2Names = serviceNames.slice(3, 6)

    console.log('[AI Gemini] Etapa 4a/4: Gerando SEO dos serviços 1-3...')
    const services1 = await callGeminiWithRetry<ServiceItem[]>(
      getServicesPrompt(data, batch1Names), [], 4000,
    )

    if (batch2Names.length > 0) {
      console.log('[AI Gemini] Etapa 4b/4: Gerando SEO dos serviços 4-6...')
      const services2 = await callGeminiWithRetry<ServiceItem[]>(
        getServicesPrompt(data, batch2Names), [], 4000,
      )
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
  return callGeminiWithRetry<ServiceItem[]>(
    getServiceDescriptionPrompt(data), [], 4000,
  )
}
