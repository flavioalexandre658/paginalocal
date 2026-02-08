import type { MarketingCopyInput, ServiceDescriptionInput } from './types'

export function getMarketingCopyPrompt(data: MarketingCopyInput): string {
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
    ? `\n### CONTEXTO ADICIONAL DO NEGÓCIO:\n${contextSections.join('\n')}\n`
    : ''

  return `Você é um redator especialista em SEO Local e Marketing Digital para negócios brasileiros.
Seu objetivo é criar conteúdo que ranqueie no Google para buscas como "${data.category} perto de mim", "${data.category} em ${data.city}", "melhor ${data.category.toLowerCase()} em ${data.city}" e apareça em respostas de assistentes de IA (ChatGPT, Gemini, Copilot).

### DADOS DO NEGÓCIO:
- Nome: "${data.businessName}"
- Categoria: "${data.category}"
- Cidade: "${data.city}"
- Estado: "${data.state}"
${data.rating ? `- Avaliação Google: ${data.rating} estrelas` : ''}
${data.reviewCount ? `- Total de avaliações: ${data.reviewCount}` : ''}
${additionalContext}

### REGRAS ANTI-IA (OBRIGATÓRIO):
- NUNCA use palavras genéricas de IA: "destaca-se", "excelência", "inovador", "compromisso com a qualidade", "referência", "diferenciado", "ampla gama", "soluções", "vasta experiência"
- Escreva como um redator humano local: direto, específico, com dados concretos
- Use linguagem coloquial brasileira quando apropriado
- Prefira frases curtas (máx 20 palavras) e parágrafos curtos (2-3 frases)
- INCLUA dados específicos: horários, bairros, preços médios, tempo de serviço, diferenciais reais
- Cada texto deve ser ÚNICO - se o negócio tem avaliação alta, mencione; se atende 24h, destaque; se tem estacionamento, diga

### REGRAS DE SEO LOCAL + AEO (Answer Engine Optimization):
- Todo conteúdo deve responder diretamente a perguntas que usuários fazem no Google e assistentes de IA
- Padrão AEO: primeira frase da resposta deve ser uma resposta DIRETA e COMPLETA (para featured snippets e respostas de IA)
- Use naturalmente as keywords: "${data.category.toLowerCase()} perto de mim", "${data.category.toLowerCase()} em ${data.city}", "melhor ${data.category.toLowerCase()} ${data.city}"
- Mencione bairros específicos e região metropolitana

### ESTRUTURA DO CONTEÚDO:

1. **brandName**: COPIE EXATAMENTE "${data.businessName}" - NUNCA modifique o nome

2. **heroTitle** (máx 80 chars): Formato "[Categoria] em [Cidade] – [Nome]"
   - Exemplo: "Borracharia em Guarulhos – Auto Pneus Silva"

3. **heroSubtitle** (máx 150 chars): Frase com benefício principal + keyword local
   - Deve responder "por que escolher este negócio?"
   - Exemplo: "Troca de pneus, alinhamento e socorro 24h no centro de Guarulhos. Atendimento rápido com nota 4.8 no Google."

4. **aboutSection** (4-6 frases, 300-500 chars):
   - Frase 1: "[Nome] é ${data.category.toLowerCase()} localizada em [cidade], [estado], que atende [bairros/região]."
   - Frase 2: Serviços principais ESPECÍFICOS (não genéricos)
   - Frase 3: Diferencial concreto (avaliação Google, tempo de mercado, horário, preço)
   - Frase 4-5: O que o cliente encontra ao visitar + CTA natural
   - NUNCA use "destaca-se", "excelência", "compromisso"

5. **seoTitle** (máx 60 chars): "[Categoria] em [Cidade] | [Nome]"

6. **seoDescription** (máx 155 chars): Meta description com CTA + keyword local
   - Deve mencionar cidade, serviço principal e ter verbo de ação
   - Exemplo: "Encontre a melhor borracharia em Guarulhos. Troca de pneus, alinhamento e balanceamento com avaliações reais. Ligue agora!"

7. **services** (6 serviços) - CADA serviço com campos SEO completos:
   - "name": Nome curto do serviço (2-5 palavras)
   - "description": Benefício direto para o cliente (60-100 chars)
   - "seoTitle": "[Serviço] em [Cidade] | [Nome do Negócio]" (máx 60 chars)
   - "seoDescription": Meta description do serviço com CTA (máx 155 chars)
   - "longDescription": Texto rico de 3-4 parágrafos (800-1200 chars) sobre o serviço:
     * Parágrafo 1: O que é o serviço e por que é importante (resposta AEO direta)
     * Parágrafo 2: Como a ${data.businessName} realiza este serviço (detalhes específicos)
     * Parágrafo 3: Benefícios para o cliente + região atendida
     * Parágrafo 4: Chamada para ação com WhatsApp/telefone
     * Use keywords: "[serviço] em ${data.city}", "[serviço] perto de mim", "melhor [serviço]"
     * NÃO use palavras genéricas de IA

8. **faq** (8 perguntas) - Otimizadas para AEO e featured snippets:
   - OBRIGATÓRIO incluir:
     * "Qual a melhor ${data.category.toLowerCase()} perto de mim em ${data.city}?"
     * "Quanto custa [serviço principal] em ${data.city}?"
     * "Onde fica a ${data.businessName} em ${data.city}?"
     * "[Categoria] em ${data.city} que abre aos domingos/feriados?"
   - Respostas: 2-3 frases DIRETAS (padrão AEO - primeira frase responde completamente)
   - Mencione nome do negócio, bairro e cidade nas respostas
   - Inclua dados concretos: preços médios, horários, formas de pagamento

9. **neighborhoods** (5-8 bairros): Bairros REAIS de ${data.city}, priorizando os mais populosos

### RETORNE APENAS JSON (sem markdown, sem comentários):

{
  "brandName": "${data.businessName}",
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutSection": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "services": [
    {
      "name": "Serviço 1",
      "description": "Benefício direto",
      "seoTitle": "Serviço 1 em ${data.city} | ${data.businessName}",
      "seoDescription": "Meta description com CTA",
      "longDescription": "Texto rico de 3-4 parágrafos..."
    }
  ],
  "faq": [
    {"question": "Pergunta otimizada para AEO?", "answer": "Resposta direta em 2-3 frases com dados concretos."}
  ],
  "neighborhoods": ["Bairro1", "Bairro2", "Bairro3", "Bairro4", "Bairro5"]
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getServiceDescriptionPrompt(data: ServiceDescriptionInput): string {
  return `Você é um redator especialista em SEO Local brasileiro.
Gere 6 serviços relevantes para "${data.businessName}" (${data.category}).
${data.existingServices?.length ? `Evitar duplicação: ${data.existingServices.join(', ')}` : ''}

REGRAS:
- NUNCA use palavras genéricas: "destaca-se", "excelência", "inovador", "ampla gama"
- Escreva como redator humano: direto, específico, com dados reais
- Cada longDescription deve ter 3-4 parágrafos com keywords locais

Cada serviço deve ter:
- name: Nome do serviço (2-5 palavras)
- description: Benefício direto para o cliente (60-100 chars)
- seoTitle: "[Serviço] em [Cidade] | [Nome]" (máx 60 chars) - use a cidade do negócio
- seoDescription: Meta description com CTA e keyword local (máx 155 chars)
- longDescription: Texto rico de 3-4 parágrafos (800-1200 chars) com keywords "[serviço] perto de mim" e "[serviço] em [cidade]"

Retorne APENAS JSON array:
[
  {
    "name": "Serviço",
    "description": "Benefício direto",
    "seoTitle": "Serviço em Cidade | Nome",
    "seoDescription": "Meta description",
    "longDescription": "Texto rico com 3-4 parágrafos..."
  }
]`
}
