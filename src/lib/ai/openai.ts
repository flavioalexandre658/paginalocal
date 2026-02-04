import OpenAI from 'openai'
import type { MarketingCopy, MarketingCopyInput, ServiceItem, ServiceDescriptionInput } from './types'
import { getMarketingCopyPrompt, getServiceDescriptionPrompt } from './prompts'
import { applyFallbacks } from './fallbacks'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function generateMarketingCopyWithOpenAI(data: MarketingCopyInput): Promise<MarketingCopy> {
  const prompt = getMarketingCopyPrompt(data)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Você é um especialista em Marketing Local e SEO brasileiro. Sempre retorne JSON válido sem markdown.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const text = completion.choices[0]?.message?.content || ''

  const parsed = JSON.parse(text) as MarketingCopy

  return applyFallbacks(parsed, data)
}

export async function generateServiceDescriptionsWithOpenAI(data: ServiceDescriptionInput): Promise<ServiceItem[]> {
  const prompt = getServiceDescriptionPrompt(data)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Você gera serviços para negócios locais. Sempre retorne JSON válido sem markdown.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  const text = completion.choices[0]?.message?.content || ''

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Resposta da IA não contém JSON válido')
  }

  return JSON.parse(jsonMatch[0])
}
