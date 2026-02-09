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
    contextSections.push(`\n### O QUE OS CLIENTES DIZEM (use como base para serviços e diferenciais):\n${data.reviewHighlights}`)
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
  return `### REGRAS DE ESCRITA (OBRIGATÓRIO):
- PROIBIDO frases genéricas de IA: "destaca-se", "excelência", "inovador", "comprometimento com a qualidade", "referência no mercado", "diferenciado", "ampla gama", "soluções", "vasta experiência", "profissionais altamente qualificados", "atendimento de primeira", "compromisso com"
- PROIBIDO usar travessão longo (—) para enfatizar. Use vírgulas, pontos ou "com".
- PROIBIDO começar com: "No cenário atual", "Quando se trata de", "Se você está procurando", "Em um mundo onde"
- PROIBIDO palavras vazias: "robusto", "abrangente", "inovador", "transformador", "holístico", "sinérgico"
- Escreva como o DONO do negócio falaria: direto, simples, com detalhes reais
- Use linguagem coloquial brasileira natural (como se falasse com um cliente no balcão)
- Frases curtas (máx 25 palavras), parágrafos curtos (2-3 frases)
- INCLUA dados concretos: serviços reais, bairros atendidos, preços quando possível, horários, formas de pagamento
- O texto deve ser tão ESPECÍFICO que só serve para ESTE negócio, nunca para outro`
}

export function getStoreContentPrompt(data: MarketingCopyInput): string {
  return `Você é redator de conteúdo para negócios locais brasileiros.
Objetivo: esta página precisa aparecer no Google quando alguém pesquisa:
- "${data.category} perto de mim"
- "${data.category} em ${data.city}"
- "melhor ${data.category.toLowerCase()} em ${data.city}"

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE O CONTEÚDO:

1. **brandName**: COPIE EXATAMENTE "${data.businessName}"

2. **heroTitle** (máx 80 chars): "${data.category} em ${data.city} – ${data.businessName}"

3. **heroSubtitle** (100-180 chars):
   LISTE OS SERVIÇOS/PRODUTOS PRINCIPAIS do negócio + especialidade + cidade.
   O subtítulo é a PRIMEIRA coisa que o Google lê. Precisa conter as palavras-chave que o cliente pesquisa.
   
   FORMATO: "[Serviço1], [Serviço2], [Serviço3] [especialidade/nicho] em [Cidade] com [diferencial concreto]"
   
   EXEMPLOS:
   - Borracharia: "Troca, Reparo e Venda de Pneus Novos e Seminovos para veículos pesados em Guarulhos com atendimento rápido e de confiança"
   - Barbearia: "Corte Masculino, Barba, Degradê e Tratamentos Capilares em São Paulo com agendamento pelo WhatsApp"
   - Academia: "Musculação, Funcional, Spinning e Personal Trainer em Campinas com planos a partir de R$79,90"
   - Restaurante: "Self-Service, Almoço Executivo e Marmitex por quilo em Osasco com estacionamento próprio"
   - Pet Shop: "Banho e Tosa, Veterinário e Vacinação para cães e gatos em Sorocaba"
   
   ERRADO (genérico demais): "Atendimento rápido e eficiente: sua borracharia em Guarulhos!"
   ERRADO (genérico demais): "Qualidade e confiança para seu veículo"
   
   Use a descrição do Google e avaliações dos clientes para identificar os serviços REAIS.

4. **aboutSection** (4-6 frases, 300-500 chars):
   - Comece: "A ${data.businessName} é ${data.category.toLowerCase()} em ${data.city}, ${data.state}."
   - Liste 3-4 serviços principais com as palavras que o cliente pesquisaria
   - Diferencial concreto: nota ${data.rating ? data.rating + ' no Google' : 'nas avaliações'}, horário, preço, especialidade
   - Mencione 2-3 bairros da região
   - Termine com CTA prático: "Mande um WhatsApp para orçamento" ou "Ligue para agendar"

5. **seoTitle** (máx 60 chars): "${data.category} em ${data.city} | ${data.businessName}"

6. **seoDescription** (máx 155 chars):
   Liste 2-3 serviços + cidade + CTA com verbo de ação
   BOM: "Troca de pneus, alinhamento e balanceamento em Guarulhos. Borracharia Salmo 23 com atendimento 24h. Ligue agora!"
   RUIM: "Sua borracharia de confiança em Guarulhos com atendimento diferenciado."

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
  return `Você é redator de conteúdo para negócios locais brasileiros.
Objetivo: FAQs que apareçam como featured snippets no Google e em respostas de IA (ChatGPT, Gemini, Google AI Overview).

${buildBusinessContext(data)}

${getAntiAiRules()}

### REGRAS PARA FEATURED SNIPPETS:
- Primeira frase RESPONDE a pergunta de forma DIRETA (sem enrolação, sem "é importante notar que")
- A resposta deve funcionar sozinha, sem precisar ler mais nada
- Use nome do negócio, bairro e cidade nas respostas
- Inclua dados concretos: preços médios, horários reais, formas de pagamento
- Respostas entre 50-80 palavras (tamanho ideal para snippet)
- Perguntas escritas EXATAMENTE como o usuário pesquisa no Google (linguagem natural)

### GERE 8 PERGUNTAS FAQ:
OBRIGATÓRIAS:
1. "Qual a melhor ${data.category.toLowerCase()} perto de mim em ${data.city}?"
2. "Quanto custa [serviço principal da categoria] em ${data.city}?"
3. "Onde fica a ${data.businessName} em ${data.city}?"
4. "${data.category} em ${data.city} que abre [sábado/domingo/feriado]?"
5. "Como agendar [serviço] na ${data.businessName}?"

Mais 3 perguntas ESPECÍFICAS para ${data.category} — use as avaliações dos clientes para criar perguntas que pessoas reais fariam.

Cada resposta: 2-4 frases com dados concretos. Comece SEMPRE respondendo direto.
BOM: "A ${data.businessName} fica na [endereço], em ${data.city}. O local é de fácil acesso..."
RUIM: "Quando se trata de localização, é importante destacar que..."

### RETORNE APENAS JSON:
[
  {"question": "Pergunta?", "answer": "Resposta direta com dados."},
  {"question": "Pergunta?", "answer": "Resposta direta com dados."}
]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getServiceNamesPrompt(data: MarketingCopyInput): string {
  return `Você conhece negócios locais brasileiros.

${buildBusinessContext(data)}

Liste 6 serviços REAIS que "${data.businessName}" (${data.category}) oferece.

REGRAS:
- PRIORIDADE: use a descrição do Google e avaliações dos clientes para listar serviços que o negócio REALMENTE oferece
- Se não tiver informação, liste os serviços mais buscados no Google para ${data.category}
- Cada nome: 2-5 palavras, exatamente como o cliente pesquisaria
- PROIBIDO serviços genéricos como "Atendimento Especializado", "Pacotes Especiais", "Serviço Premium"

EXEMPLOS por categoria:
- Borracharia: Troca de Pneus, Alinhamento, Balanceamento, Calibragem, Reparo de Pneus, Socorro 24h
- Barbearia: Corte de Cabelo, Barba, Degradê, Sobrancelha, Corte e Barba, Platinado
- Academia: Musculação, Personal Trainer, Funcional, Spinning, Yoga, Avaliação Física
- Restaurante: Almoço Executivo, Self-Service, Delivery, Marmitex, Rodízio, Café da Manhã
- Oficina Mecânica: Troca de Óleo, Revisão Completa, Freios, Suspensão, Injeção Eletrônica, Elétrica Automotiva
- Pet Shop: Banho e Tosa, Veterinário, Vacinação, Ração e Acessórios, Hotel para Pets, Adestramento
- Salão de Beleza: Corte Feminino, Escova, Coloração, Manicure e Pedicure, Hidratação, Progressiva

### RETORNE APENAS JSON:
["Serviço 1", "Serviço 2", "Serviço 3", "Serviço 4", "Serviço 5", "Serviço 6"]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getServicesPrompt(data: MarketingCopyInput, serviceNames: string[]): string {
  return `Você é redator de conteúdo para negócios locais brasileiros.
Cada serviço vai ter sua PRÓPRIA página no Google. Precisa ranquear para:
- "[serviço] em ${data.city}"
- "[serviço] perto de mim"
- "melhor [serviço] em ${data.city}"

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE CONTEÚDO SEO PARA ESTES SERVIÇOS:
${serviceNames.map((name, i) => `${i + 1}. ${name}`).join('\n')}

Para CADA serviço:

- "name": Nome exato (como listado acima)

- "description": O que o CLIENTE ganha com este serviço (60-100 chars)
  Descreva o RESULTADO para o cliente, não elogie o negócio.
  BOM: "Montagem e desmontagem de pneus de todos os aros com agilidade"
  BOM: "Corte degradê com acabamento preciso na máquina e navalha"
  RUIM: "Serviço profissional de qualidade com atendimento diferenciado"
  RUIM: "Excelência e comprometimento no atendimento ao cliente"

- "seoTitle": "[Serviço] em ${data.city} | ${data.businessName}" (máx 60 chars)

- "seoDescription": Serviço + o que inclui + cidade + CTA (máx 155 chars)
  BOM: "Troca de pneus em Guarulhos para carros, caminhões e motos. Borracharia Salmo 23 com atendimento na hora. Ligue agora!"
  RUIM: "Oferecemos o melhor serviço de troca de pneus da região com excelência."

- "longDescription": 3-4 parágrafos (800-1200 chars total):
  * Parágrafo 1: O que é o serviço, para quem serve, quando é necessário. Comece respondendo diretamente, como se o cliente perguntasse "O que é [serviço]?"
  * Parágrafo 2: Como a ${data.businessName} faz este serviço. Detalhes práticos: equipamentos, técnicas, tempo médio, o que está incluso.
  * Parágrafo 3: Região atendida em ${data.city}, diferenciais concretos (preço, horário, garantia), condições de pagamento.
  * Parágrafo 4: CTA claro: "Entre em contato pelo WhatsApp para agendar seu [serviço] na ${data.businessName}" ou similar.
  
  OBRIGATÓRIO no texto:
  - "[serviço] em ${data.city}" (pelo menos 2x no texto)
  - "[serviço] perto de mim" (pelo menos 1x)
  - "${data.businessName}" (pelo menos 2x)
  
  Separe parágrafos com \\n

### RETORNE APENAS JSON ARRAY:
[
  {
    "name": "Serviço",
    "description": "O que o cliente ganha",
    "seoTitle": "Serviço em ${data.city} | ${data.businessName}",
    "seoDescription": "Meta description prática",
    "longDescription": "Parágrafo 1...\\nParágrafo 2...\\nParágrafo 3...\\nParágrafo 4..."
  }
]

RETORNE APENAS O JSON ARRAY, SEM MARKDOWN.`
}

export function getMarketingCopyPrompt(data: MarketingCopyInput): string {
  return getStoreContentPrompt(data)
}

export function getServiceDescriptionPrompt(data: ServiceDescriptionInput): string {
  return `Você é redator de conteúdo para negócios locais brasileiros.
Gere 6 serviços para "${data.businessName}" (${data.category}).
${data.existingServices?.length ? `Serviços que JÁ existem (NÃO duplicar): ${data.existingServices.join(', ')}` : ''}

REGRAS:
- PROIBIDO frases genéricas: "destaca-se", "excelência", "inovador", "ampla gama", "comprometimento"
- Escreva como o dono do negócio falaria: direto, simples, com dados reais
- description descreve o que o CLIENTE ganha, não elogia o negócio
- longDescription com 3-4 parágrafos e keywords locais
- Separe parágrafos com \\n

Cada serviço:
- name: Nome do serviço (2-5 palavras) como o cliente pesquisaria no Google
- description: Resultado prático para o cliente (60-100 chars)
- seoTitle: "[Serviço] em [Cidade] | [Nome]" (máx 60 chars)
- seoDescription: Serviço + cidade + CTA (máx 155 chars)
- longDescription: 3-4 parágrafos (800-1200 chars) com "[serviço] perto de mim" e "[serviço] em [cidade]"

Retorne APENAS JSON array:
[
  {
    "name": "Serviço",
    "description": "O que o cliente ganha",
    "seoTitle": "Serviço em Cidade | Nome",
    "seoDescription": "Meta description com CTA",
    "longDescription": "Parágrafo 1...\\nParágrafo 2..."
  }
]`
}
