import { GoogleGenerativeAI } from '@google/generative-ai'
import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput } from './types'
import { getMarketingCopyPrompt, getServiceDescriptionPrompt } from './prompts'
import { applyFallbacks } from './fallbacks'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function generateMarketingCopyWithGemini(data: MarketingCopyInput): Promise<MarketingCopy> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = getMarketingCopyPrompt(data)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Resposta da IA não contém JSON válido')
  }

  const parsed = JSON.parse(jsonMatch[0]) as MarketingCopy

  return applyFallbacks(parsed, data)
}

export async function generateServiceDescriptionsWithGemini(data: ServiceDescriptionInput): Promise<ServiceItem[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = getServiceDescriptionPrompt(data)

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Resposta da IA não contém JSON válido')
  }

  return JSON.parse(jsonMatch[0])
}
