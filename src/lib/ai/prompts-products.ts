import type { MarketingCopyInput } from './types'
import { getAntiAiRules } from './prompts'

export function getProductSeoPrompt(
  storeData: MarketingCopyInput,
  productName: string,
  productDescription?: string,
  priceInCents?: number
): string {
  const priceText = priceInCents ? `R$ ${(priceInCents / 100).toFixed(2)}` : ''

  return `Você é especialista em SEO para e-commerce local brasileiro.

Produto: "${productName}"
${productDescription ? `Descrição fornecida pelo dono: "${productDescription}"` : ''}
${priceText ? `Preço: ${priceText}` : ''}
Loja: "${storeData.businessName}"
Categoria: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Objetivo: ranquear nas buscas abaixo e aparecer em AI Overviews:
- "${productName} em ${storeData.city}"
- "${productName} perto de mim"
- "comprar ${productName} ${storeData.city}"

IMPORTANTE: Se houver "Descrição fornecida pelo dono", use-a como BASE. NÃO copie literalmente.

${getAntiAiRules()}

Para CADA campo:

- "description": O que o CLIENTE ganha com este produto (60-100 chars).
  BOM: "Ração premium para cães adultos de grande porte com alta proteína"
  RUIM: "Produto de qualidade com excelência no atendimento"

- "seoTitle": "${productName} em ${storeData.city} | ${storeData.businessName}" (máx 60 chars)

- "seoDescription": Produto + preço (se tiver) + cidade + CTA (máx 155 chars)
  BOM: "Ração Premium 15kg em Guarulhos. ${storeData.businessName}. Peça pelo WhatsApp!"
  RUIM: "Oferecemos o melhor produto da região."

- "longDescription": 4 parágrafos (700-1000 chars total). Separe com \\n
  * Parágrafo 1 (Definition Block para AEO): O que é o produto, para quem serve. Comece: "${productName} é..." ou "${productName} são...". Responda como se o cliente perguntasse diretamente. Inclua "${productName} em ${storeData.city}" neste parágrafo.
  * Parágrafo 2: Detalhes, diferenciais práticos, o que está incluso. Mencione "${storeData.businessName}".
  * Parágrafo 3 (Self-Contained Answer para AEO): "${productName} perto de mim em ${storeData.city}${priceText ? ` custa ${priceText}` : ''}. Disponível na ${storeData.businessName} em ${storeData.city}, ${storeData.state}." — expanda com 2-3 frases sobre como adquirir.
  * Parágrafo 4: CTA claro: "Para comprar ${productName} em ${storeData.city}, entre em contato com a ${storeData.businessName} pelo WhatsApp."

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
  return `Você é especialista em SEO para e-commerce local brasileiro.

Coleção/Categoria: "${collectionName}"
${collectionDescription ? `Descrição fornecida pelo dono: "${collectionDescription}"` : ''}
Loja: "${storeData.businessName}"
Categoria do negócio: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Objetivo: ranquear para:
- "${collectionName} em ${storeData.city}"
- "${collectionName} ${storeData.category} ${storeData.city}"
- "${collectionName} perto de mim"

${getAntiAiRules()}

Para CADA campo:

- "description": Descrição curta da coleção (60-100 chars)
  BOM: "Camisetas masculinas de algodão, poliéster e dry-fit para todas as ocasiões"
  RUIM: "Nossa coleção exclusiva com produtos diferenciados"

- "seoTitle": "${collectionName} em ${storeData.city} | ${storeData.businessName}" (máx 60 chars)

- "seoDescription": Coleção + produtos + cidade + CTA (máx 155 chars)
  BOM: "${collectionName} em ${storeData.city}. ${storeData.businessName}, ${storeData.category}. Confira pelo WhatsApp!"
  RUIM: "Veja nossa coleção com produtos de qualidade."

- "longDescription": 4 parágrafos (800-1100 chars total). Separe com \\n
  * Parágrafo 1 (Definition Block para AEO): O que é esta coleção, quais produtos inclui, para quem é. Inclua "${collectionName} em ${storeData.city}" no texto.
  * Parágrafo 2: Por que escolher a ${storeData.businessName} para ${collectionName.toLowerCase()}. Detalhes práticos, variedade, atendimento. Mencione "${storeData.businessName}" pelo menos 1x.
  * Parágrafo 3 (Self-Contained Answer): "Para encontrar ${collectionName.toLowerCase()} perto de mim em ${storeData.city}, a ${storeData.businessName} é a opção da região." — expanda com diferenciais concretos.
  * Parágrafo 4: CTA: "Entre em contato com a ${storeData.businessName} pelo WhatsApp para ver os produtos de ${collectionName.toLowerCase()} disponíveis em ${storeData.city}."

RETORNE APENAS JSON:
{
  "description": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "longDescription": "..."
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
  const priceText = priceInCents ? `R$ ${(priceInCents / 100).toFixed(2)} ${intervalText}`.trim() : ''

  return `Você é especialista em SEO para negócios locais brasileiros.

Plano: "${planName}"
${planDescription ? `Descrição fornecida pelo dono: "${planDescription}"` : ''}
${priceText ? `Preço: ${priceText}` : ''}
Empresa: "${storeData.businessName}"
Categoria: "${storeData.category}"
Cidade: "${storeData.city}, ${storeData.state}"

Objetivo: página de planos que ranqueia para:
- "planos ${storeData.category.toLowerCase()} ${storeData.city}"
- "${planName} ${storeData.businessName}"

${getAntiAiRules()}

Para CADA campo:

- "description": Descrição curta e vendedora do plano (60-120 chars). Foque no BENEFÍCIO principal.
  BOM: "Acesso completo à musculação, funcional e aulas coletivas. Ideal para quem busca resultados."
  RUIM: "Plano premium com atendimento diferenciado."

- "longDescription": 3 parágrafos (500-800 chars total). Separe com \\n
  * Parágrafo 1: O que inclui o plano "${planName}"${priceText ? `, por ${priceText}` : ''}. Para quem é indicado. Responda direto, sem enrolação.
  * Parágrafo 2: Diferenciais práticos do plano na ${storeData.businessName} em ${storeData.city}. O que o cliente ganha na prática.
  * Parágrafo 3: CTA direto: "Para contratar o plano ${planName} da ${storeData.businessName} em ${storeData.city}, entre em contato pelo WhatsApp."

RETORNE APENAS JSON:
{
  "description": "...",
  "longDescription": "..."
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}
