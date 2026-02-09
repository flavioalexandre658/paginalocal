import type { MarketingCopyInput, ServiceDescriptionInput } from './types'

function buildBusinessContext(data: MarketingCopyInput): string {
  const contextSections: string[] = []

  if (data.googleAbout) {
    contextSections.push(`- Descrição do Google: "${data.googleAbout}"`)
  }
  if (data.website) {
    contextSections.push(`- Website: ${data.website}`)
  }
  if (data.priceRange) {
    contextSections.push(`- Faixa de Preço: ${data.priceRange}`)
  }
  if (data.address) {
    contextSections.push(`- Endereço: ${data.address}`)
  }
  if (data.businessTypes && data.businessTypes.length > 0) {
    contextSections.push(`- Tipos de negócio (Google): ${data.businessTypes.join(', ')}`)
  }
  if (data.reviewHighlights) {
    contextSections.push(`\n### O QUE OS CLIENTES DIZEM:\n${data.reviewHighlights}`)
  }

  const additionalContext = contextSections.length > 0
    ? `\n### CONTEXTO ADICIONAL:\n${contextSections.join('\n')}\n`
    : ''

  return `### DADOS DO NEGÓCIO:
- Nome: "${data.businessName}"
- Categoria: "${data.category}"
- Cidade: "${data.city}"
- Estado: "${data.state}"
${data.rating ? `- Avaliação Google: ${data.rating} estrelas` : ''}
${data.reviewCount ? `- Total de avaliações: ${data.reviewCount}` : ''}
${additionalContext}`
}

function getAntiAiRules(): string {
  return `### REGRAS ANTI-IA (OBRIGATÓRIO):
- NUNCA use palavras genéricas de IA: "destaca-se", "excelência", "inovador", "compromisso com a qualidade", "referência", "diferenciado", "ampla gama", "soluções", "vasta experiência"
- Escreva como um redator humano local: direto, específico, com dados concretos
- Use linguagem coloquial brasileira quando apropriado
- Prefira frases curtas (máx 20 palavras) e parágrafos curtos (2-3 frases)
- INCLUA dados específicos: horários, bairros, preços médios, diferenciais reais
- Cada texto deve ser ÚNICO para este negócio`
}

export function getStoreContentPrompt(data: MarketingCopyInput): string {
  return `Você é um redator especialista em SEO Local para negócios brasileiros.
Objetivo: conteúdo que ranqueie para "${data.category} perto de mim", "${data.category} em ${data.city}", "melhor ${data.category.toLowerCase()} em ${data.city}".

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE O CONTEÚDO DA LOJA:

1. **brandName**: COPIE EXATAMENTE "${data.businessName}" - NUNCA modifique

2. **heroTitle** (máx 80 chars): "[Categoria] em [Cidade] – [Nome]"

3. **heroSubtitle** (máx 150 chars): Benefício principal + keyword local
   - Responda "por que escolher este negócio?"

4. **aboutSection** (4-6 frases, 300-500 chars):
   - "[Nome] é ${data.category.toLowerCase()} em [cidade], [estado], que atende [bairros/região]."
   - Serviços principais ESPECÍFICOS
   - Diferencial concreto (avaliação, horário, preço)
   - CTA natural

5. **seoTitle** (máx 60 chars): "[Categoria] em [Cidade] | [Nome]"

6. **seoDescription** (máx 155 chars): CTA + keyword local + cidade

7. **neighborhoods** (5-8 bairros): Bairros REAIS de ${data.city}

### RETORNE APENAS JSON:
{
  "brandName": "${data.businessName}",
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutSection": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "neighborhoods": ["Bairro1", "Bairro2", "Bairro3", "Bairro4", "Bairro5"]
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getFaqPrompt(data: MarketingCopyInput): string {
  return `Você é um redator especialista em SEO Local e AEO (Answer Engine Optimization) para negócios brasileiros.
Objetivo: gerar FAQs que apareçam como featured snippets no Google e em respostas de assistentes de IA.

${buildBusinessContext(data)}

${getAntiAiRules()}

### REGRAS AEO:
- Primeira frase da resposta DEVE ser uma resposta DIRETA e COMPLETA
- Mencione nome do negócio, bairro e cidade nas respostas
- Inclua dados concretos: preços médios, horários, formas de pagamento

### GERE 8 PERGUNTAS FAQ:
OBRIGATÓRIO incluir:
- "Qual a melhor ${data.category.toLowerCase()} perto de mim em ${data.city}?"
- "Quanto custa [serviço principal] em ${data.city}?"
- "Onde fica a ${data.businessName} em ${data.city}?"
- "${data.category} em ${data.city} que abre aos domingos/feriados?"
- Mais 4 perguntas específicas para ${data.category}

Respostas: 2-3 frases DIRETAS com dados concretos.

### RETORNE APENAS JSON:
[
  {"question": "Pergunta?", "answer": "Resposta direta."},
  {"question": "Pergunta?", "answer": "Resposta direta."}
]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getServicesPrompt(data: MarketingCopyInput, serviceNames: string[]): string {
  return `Você é um redator especialista em SEO Local para negócios brasileiros.
Objetivo: gerar conteúdo rico para páginas de serviço que ranqueiem para "[serviço] em ${data.city}", "[serviço] perto de mim".

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE CONTEÚDO SEO PARA ESTES SERVIÇOS:
${serviceNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Para CADA serviço, gere:
- "name": Nome exato do serviço (como listado acima)
- "description": Benefício direto para o cliente (60-100 chars)
- "seoTitle": "[Serviço] em ${data.city} | ${data.businessName}" (máx 60 chars)
- "seoDescription": Meta description com CTA e keyword local (máx 155 chars)
- "longDescription": Texto de 3-4 parágrafos (800-1200 chars):
  * Parágrafo 1: O que é o serviço e por que é importante (resposta AEO direta)
  * Parágrafo 2: Como a ${data.businessName} realiza este serviço (detalhes)
  * Parágrafo 3: Benefícios para o cliente + região atendida
  * Parágrafo 4: CTA com WhatsApp/telefone
  * Use keywords: "[serviço] em ${data.city}", "[serviço] perto de mim"
  * Separe parágrafos com \\n

### RETORNE APENAS JSON ARRAY:
[
  {
    "name": "Serviço",
    "description": "Benefício direto",
    "seoTitle": "Serviço em ${data.city} | ${data.businessName}",
    "seoDescription": "Meta description",
    "longDescription": "Parágrafo 1...\\nParágrafo 2...\\nParágrafo 3...\\nParágrafo 4..."
  }
]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getServiceNamesPrompt(data: MarketingCopyInput): string {
  return `Você é especialista em negócios locais brasileiros.

${buildBusinessContext(data)}

Gere uma lista de 6 serviços REAIS e ESPECÍFICOS para "${data.category}".
- Se for revendedora: Compra de Veículos, Venda de Seminovos, Financiamento, etc.
- Se for restaurante: Almoço Executivo, Self-Service, Delivery, etc.
- Se for barbearia: Corte de Cabelo, Barba, Degradê, etc.
- Serviços devem ser específicos para ${data.category}, NUNCA genéricos

### RETORNE APENAS JSON:
["Serviço 1", "Serviço 2", "Serviço 3", "Serviço 4", "Serviço 5", "Serviço 6"]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getMarketingCopyPrompt(data: MarketingCopyInput): string {
  return getStoreContentPrompt(data)
}

export function getServiceDescriptionPrompt(data: ServiceDescriptionInput): string {
  return `Você é um redator especialista em SEO Local brasileiro.
Gere 6 serviços relevantes para "${data.businessName}" (${data.category}).
${data.existingServices?.length ? `Evitar duplicação: ${data.existingServices.join(', ')}` : ''}

REGRAS:
- NUNCA use palavras genéricas: "destaca-se", "excelência", "inovador", "ampla gama"
- Escreva como redator humano: direto, específico, com dados reais
- Cada longDescription deve ter 3-4 parágrafos com keywords locais
- Separe parágrafos com \\n

Cada serviço deve ter:
- name: Nome do serviço (2-5 palavras)
- description: Benefício direto para o cliente (60-100 chars)
- seoTitle: "[Serviço] em [Cidade] | [Nome]" (máx 60 chars)
- seoDescription: Meta description com CTA e keyword local (máx 155 chars)
- longDescription: Texto de 3-4 parágrafos (800-1200 chars) com keywords "[serviço] perto de mim" e "[serviço] em [cidade]"

Retorne APENAS JSON array:
[
  {
    "name": "Serviço",
    "description": "Benefício direto",
    "seoTitle": "Serviço em Cidade | Nome",
    "seoDescription": "Meta description",
    "longDescription": "Parágrafo 1...\\nParágrafo 2..."
  }
]`
}
