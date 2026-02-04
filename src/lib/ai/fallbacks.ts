import type { MarketingCopy, MarketingCopyInput, FAQItem, ServiceItem } from './types'

export function extractBrandName(fullName: string, category: string): string {
  const categoryWords = category.toLowerCase().split(/\s+/)

  const cleaned = fullName
    .replace(/[—–-]{2,}/g, ' ')
    .replace(/[|\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = cleaned.split(/\s+/)
  const seen = new Set<string>()
  const unique: string[] = []

  for (const word of words) {
    const lower = word.toLowerCase()
    if (!seen.has(lower) && !categoryWords.includes(lower)) {
      seen.add(lower)
      unique.push(word)
    }
  }

  if (unique.length === 0) {
    return fullName.split(/\s+/).slice(0, 2).join(' ')
  }

  return unique.slice(0, 3).join(' ')
}

const FILLER_WORDS = [
  'movel', 'móvel', '24h', '24 horas', '24horas',
  'express', 'rapido', 'rápido', 'delivery', 'online',
  'ltda', 'me', 'eireli', 'sa', 's/a', 'epp', 'mei',
  'de', 'do', 'da', 'dos', 'das', 'e', 'em', 'para', 'com',
]

function extractEssentialWords(name: string): string[] {
  const normalized = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

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

export function generateOptimizedSlug(_category: string, brandName: string, city: string): string {
  const essentialWords = extractEssentialWords(brandName)
  const nameSlug = essentialWords.join('-').substring(0, 35)

  const citySlug = city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 20)

  return `${nameSlug}-${citySlug}`.replace(/-+/g, '-').substring(0, 60)
}

export function generateFallbackServices(category: string): ServiceItem[] {
  return [
    { name: 'Atendimento Especializado', description: `Serviço profissional de ${category.toLowerCase()} com qualidade garantida` },
    { name: 'Orçamento Gratuito', description: 'Avaliação sem compromisso para seu projeto' },
    { name: 'Atendimento Rápido', description: 'Resposta ágil para suas necessidades' },
    { name: 'Garantia de Satisfação', description: 'Compromisso com a qualidade do serviço' },
  ]
}

export function generateFallbackFAQ(brandName: string, city: string, category: string): FAQItem[] {
  return [
    {
      question: `Qual o horário de funcionamento?`,
      answer: `Atendemos de segunda a sexta das 8h às 18h e sábados das 8h às 12h. Entre em contato para confirmar disponibilidade.`,
    },
    {
      question: `Vocês atendem em qual região de ${city}?`,
      answer: `Atendemos ${city} e região metropolitana. Consulte nossa área de cobertura pelo WhatsApp.`,
    },
    {
      question: `Quais formas de pagamento são aceitas?`,
      answer: `Aceitamos dinheiro, PIX, cartões de débito e crédito. Parcelamos em até 12x dependendo do serviço.`,
    },
    {
      question: `Como agendar um serviço de ${category.toLowerCase()}?`,
      answer: `Você pode agendar pelo WhatsApp ou telefone. Respondemos rapidamente para encontrar o melhor horário.`,
    },
  ]
}

export function applyFallbacks(parsed: MarketingCopy, data: MarketingCopyInput): MarketingCopy {
  if (!parsed.brandName) {
    parsed.brandName = extractBrandName(data.businessName, data.category)
  }
  if (!parsed.slug) {
    parsed.slug = generateOptimizedSlug(data.category, parsed.brandName, data.city)
  }
  if (!parsed.services || parsed.services.length === 0) {
    parsed.services = generateFallbackServices(data.category)
  }
  if (!parsed.faq || parsed.faq.length === 0) {
    parsed.faq = generateFallbackFAQ(parsed.brandName, data.city, data.category)
  }
  if (!parsed.neighborhoods || parsed.neighborhoods.length === 0) {
    parsed.neighborhoods = ['Centro', 'Região Central', 'Zona Norte', 'Zona Sul', 'Região Metropolitana']
  }
  if (!parsed.seoTitle) {
    parsed.seoTitle = `${data.category} em ${data.city} | ${parsed.brandName}`
  }

  return parsed
}
