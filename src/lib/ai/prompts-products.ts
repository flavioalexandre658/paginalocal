import type { MarketingCopyInput } from './types'
import { getAntiAiRules } from './prompts'

export function getProductSeoPrompt(
  storeData: MarketingCopyInput,
  productName: string,
  productDescription?: string,
  priceInCents?: number
): string {
  return `Você é redator de conteúdo SEO para e-commerce brasileiro.

Produto: "${productName}"
${productDescription ? `Descrição fornecida pelo dono: "${productDescription}"` : ''}
${priceInCents ? `Preço: R$ ${(priceInCents / 100).toFixed(2)}` : ''}
Loja: "${storeData.businessName}"
Categoria: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Gere conteúdo SEO otimizado para ranquear:
- "${productName} em ${storeData.city}"
- "${productName} perto de mim"
- "comprar ${productName} ${storeData.city}"

IMPORTANTE: Se houver "Descrição fornecida pelo dono", use-a como BASE para entender o produto e gerar conteúdo mais preciso. NÃO copie literalmente.

Para CADA campo:

- "description": Resultado prático para o cliente (60-100 chars). O que o CLIENTE ganha com este produto.
  BOM: "Ração premium para cães adultos de grande porte com alta proteína"
  RUIM: "Produto de qualidade com excelência no atendimento"

- "seoTitle": "[Produto] em ${storeData.city} | ${storeData.businessName}" (máx 60 chars)

- "seoDescription": Produto + preço (se tiver) + cidade + CTA (máx 155 chars)
  BOM: "Ração Premium 15kg em Guarulhos. ${storeData.businessName} com entrega rápida. Peça pelo WhatsApp!"
  RUIM: "Oferecemos o melhor produto da região com excelência."

- "longDescription": 3-4 parágrafos (600-1000 chars total):
  * Parágrafo 1: O que é o produto, para quem serve
  * Parágrafo 2: Detalhes, diferenciais, qualidade
  * Parágrafo 3: Disponibilidade em ${storeData.city}, como adquirir
  * Parágrafo 4: CTA claro via WhatsApp
  Separe parágrafos com \\n

${getAntiAiRules()}

RETORNE APENAS JSON:
{
  "description": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "longDescription": "..."
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getCollectionSeoPrompt(
  storeData: MarketingCopyInput,
  collectionName: string,
  collectionDescription?: string
): string {
  return `Você é redator de conteúdo SEO para e-commerce brasileiro.

Coleção/Categoria: "${collectionName}"
${collectionDescription ? `Descrição fornecida pelo dono: "${collectionDescription}"` : ''}
Loja: "${storeData.businessName}"
Categoria do negócio: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Gere conteúdo SEO para página de coleção. Deve ranquear:
- "${collectionName} em ${storeData.city}"
- "${collectionName} ${storeData.category} ${storeData.city}"

- "description": Descrição curta da coleção (60-100 chars)
  BOM: "Camisetas masculinas de algodão, poliéster e dry-fit para todas as ocasiões"
  RUIM: "Nossa coleção exclusiva com produtos de qualidade"

- "seoTitle": "${collectionName} | ${storeData.businessName}" (máx 60 chars)

- "seoDescription": Coleção + produtos + cidade + CTA (máx 155 chars)

${getAntiAiRules()}

RETORNE APENAS JSON:
{
  "description": "...",
  "seoTitle": "...",
  "seoDescription": "..."
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getPricingPlanSeoPrompt(
  storeData: MarketingCopyInput,
  planName: string,
  planDescription?: string,
  priceInCents?: number,
  interval?: 'MONTHLY' | 'YEARLY' | 'ONE_TIME'
): string {
  const intervalText = interval === 'MONTHLY' ? 'por mês' : interval === 'YEARLY' ? 'por ano' : ''

  return `Você é redator de conteúdo para negócios locais brasileiros.

Plano: "${planName}"
${planDescription ? `Descrição fornecida pelo dono: "${planDescription}"` : ''}
${priceInCents ? `Preço: R$ ${(priceInCents / 100).toFixed(2)} ${intervalText}` : ''}
Empresa: "${storeData.businessName}"
Categoria: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Gere uma descrição comercial para este plano.

- "description": Descrição curta e vendedora do plano (60-120 chars). Foque no BENEFÍCIO principal.
  BOM: "Acesso completo à musculação, funcional e aulas coletivas. Ideal para quem busca resultados."
  RUIM: "Plano premium com excelência no atendimento diferenciado."

${getAntiAiRules()}

RETORNE APENAS JSON:
{
  "description": "..."
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}
