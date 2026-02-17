import type { MarketingCopyInput, ServiceDescriptionInput, BusinessClassificationInput } from './types'

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
  if (data.openingHours && Object.keys(data.openingHours).length > 0) {
    const hoursText = Object.entries(data.openingHours)
      .map(([day, hours]) => `  ${day}: ${hours}`)
      .join('\n')
    contextSections.push(`\n### HORÁRIO DE FUNCIONAMENTO:\n${hoursText}`)
  }
  if (data.businessAttributes && data.businessAttributes.length > 0) {
    contextSections.push(`\n### ATRIBUTOS DO NEGÓCIO (dados reais do Google, USE nas descrições):\n${data.businessAttributes.map(a => `- ${a}`).join('\n')}`)
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

export function getAntiAiRules(): string {
  return `### REGRAS DE ESCRITA (OBRIGATÓRIO):
- PROIBIDO frases genéricas de IA: "destaca-se", "excelência", "inovador", "comprometimento com a qualidade", "referência no mercado", "diferenciado", "ampla gama", "soluções", "vasta experiência", "profissionais altamente qualificados", "atendimento de primeira", "compromisso com", "qualidade e dedicação", "robustez", "abrangente"
- PROIBIDO verbos de IA: "alavancar", "otimizar" (no sentido genérico), "facilitar", "fomentar", "impulsionar", "delinear", "evidenciar", "nortear"
- PROIBIDO adjetivos de IA: "robusto", "abrangente", "holístico", "sinérgico", "transformador", "inovador", "cutting-edge"
- PROIBIDO conectores de IA: "no cenário atual", "nesse sentido", "vale ressaltar que", "cabe destacar que", "é importante notar que", "não apenas X, mas também Y"
- PROIBIDO usar travessão longo (—) para enfatizar. Use vírgulas, pontos ou "com".
- PROIBIDO começar com: "No cenário atual", "Quando se trata de", "Se você está procurando", "Em um mundo onde", "Em um cenário", "No contexto de"
- PROIBIDO frases de conclusão: "Em conclusão", "Em resumo", "Em suma", "Por fim, podemos dizer"
- Escreva como o DONO do negócio falaria: direto, simples, com detalhes reais
- Use linguagem coloquial brasileira natural (como se falasse com um cliente no balcão)
- Frases curtas (máx 25 palavras), parágrafos curtos (2-3 frases)
- Use APENAS dados que existem no contexto do negócio. NUNCA invente preços, horários, bairros ou dados que não foram fornecidos
- PROIBIDO inventar preços (ex: "a partir de R$79,90") se não tiver essa informação nos dados
- PROIBIDO inventar bairros ou regiões. Se não tiver, não mencione bairros
- PROIBIDO inventar horários de funcionamento se não tiver nos dados
- O texto deve ser tão ESPECÍFICO que só serve para ESTE negócio, nunca para outro`
}

export function getStoreContentPrompt(data: MarketingCopyInput): string {
  return `Você é especialista em SEO e AEO (Answer Engine Optimization) para negócios locais brasileiros.
Objetivo: esta página precisa aparecer no Google quando alguém pesquisa:
- "${data.category} perto de mim"
- "${data.category} em ${data.city}"
- "melhor ${data.category.toLowerCase()} em ${data.city}"
E aparecer citada em respostas de IA (Google AI Overview, ChatGPT, Gemini, Perplexity).

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
   - Academia: "Musculação, Funcional, Spinning e Personal Trainer em Campinas"
   - Restaurante: "Self-Service, Almoço Executivo e Marmitex por quilo em Osasco"
   - Pet Shop: "Banho e Tosa, Veterinário e Vacinação para cães e gatos em Sorocaba"
   
   ERRADO (genérico demais): "Atendimento rápido e eficiente: sua borracharia em Guarulhos!"
   ERRADO (genérico demais): "Qualidade e confiança para seu veículo"
   
   Use a descrição do Google e avaliações dos clientes para identificar os serviços REAIS.

4. **aboutSection** (4-6 frases, 300-500 chars):
   - Comece com o artigo correto conforme termGender: "A [Nome] é..." (FEMININE) ou "O [Nome] é..." (MASCULINE)
   - Esta primeira frase DEVE ser um Self-Contained Answer (citável por IA): inclua o nome, categoria e cidade.
   - Descreva os serviços principais que o negócio oferece (use dados do Google e reviews)
   - Explique o que torna esse negócio diferente (especialidade, tipo de público, método de trabalho)
   - NÃO mencione nota do Google, número de avaliações, bairros ou horários (isso já é exibido visualmente na página)
   - NÃO invente preços ou dados que não estejam no contexto fornecido
   - Termine com CTA prático: "Mande um WhatsApp para orçamento" ou "Ligue para agendar"
   - PROIBIDO: "referência em", "qualidade e dedicação", "compromisso com"

5. **seoTitle** (máx 60 chars): "${data.category} em ${data.city} | ${data.businessName}"

6. **seoDescription** (máx 155 chars):
   Liste 2-3 serviços + cidade + CTA com verbo de ação
   BOM: "Troca de pneus, alinhamento e balanceamento em Guarulhos. Borracharia Salmo 23 com atendimento 24h. Ligue agora!"
   RUIM: "Sua borracharia de confiança em Guarulhos com atendimento diferenciado."

7. **termGender** ("MASCULINE" ou "FEMININE"):
   Gênero gramatical do TIPO de negócio — pense: usamos "a [categoria]" ou "o [categoria]"?
   - FEMININE: barbearia, academia, pizzaria, padaria, farmácia, loja, clínica, escola, borracharia, oficina, sorveteria, lavanderia, confeitaria, joalheria, livraria, imobiliária, hamburgueria, lanchonete, papelaria, sapataria, empresa, agência, ótica
   - MASCULINE: restaurante, pet shop, hotel, bar, mercado, supermercado, salão, escritório, consultório, hospital, banco, posto, açougue, spa, atelier, clube, condomínio, serviço, teatro, cinema, cartório
   Categoria deste negócio: "${data.category}"

8. **termNumber** ("SINGULAR" ou "PLURAL"):
   Singular ou plural — analise o NOME do negócio.
   - SINGULAR: "a academia", "o restaurante" (padrão para 99% dos negócios)
   - PLURAL: apenas se o próprio nome do negócio for claramente plural (ex: "Clínicas Médicas", "Farmácias Central", "Serviços e Soluções")
   Nome do negócio: "${data.businessName}"

### RETORNE APENAS JSON:
{
  "brandName": "${data.businessName}",
  "heroTitle": "...",
  "heroSubtitle": "...",
  "aboutSection": "...",
  "seoTitle": "...",
  "seoDescription": "...",
  "termGender": "FEMININE",
  "termNumber": "SINGULAR"
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getFaqPrompt(data: MarketingCopyInput): string {
  return `Você é especialista em SEO e AEO (Answer Engine Optimization) para negócios locais brasileiros.
Objetivo: FAQs otimizadas para aparecer como featured snippets no Google, Google AI Overviews, e respostas de IA (ChatGPT, Gemini, Perplexity).

${buildBusinessContext(data)}

${getAntiAiRules()}

### REGRAS PARA FEATURED SNIPPETS E AEO (OBRIGATÓRIO):
- Padrão Self-Contained Answer: a resposta deve ser completa e fazer sentido sozinha, sem precisar de contexto adicional
- PRIMEIRA FRASE sempre responde a pergunta DIRETAMENTE (ex: "A ${data.businessName} fica em ${data.city}...")
- NUNCA comece a resposta com "Quando se trata de", "No contexto de", "É importante notar", "Vale ressaltar"
- Cada resposta: 50-80 palavras (tamanho ideal para snippet — nem mais, nem menos)
- Inclua nome do negócio + cidade em pelo menos 60% das respostas
- Perguntas escritas como o usuário pesquisa: linguagem natural, direta, com palavras-chave
- NUNCA use gerúndio para começar: "Sendo", "Tratando-se", "Considerando"

### GERE 8 PERGUNTAS FAQ:
As 5 primeiras são obrigatórias (adapte o texto para o negócio):
1. "Qual a melhor ${data.category.toLowerCase()} perto de mim em ${data.city}?"
2. "Quanto custa ${data.category.toLowerCase()} em ${data.city}?"
3. "Onde fica a ${data.businessName} em ${data.city}?"
4. "A ${data.businessName} abre aos sábados?"
5. "Como entrar em contato com a ${data.businessName}?"

Mais 3 perguntas baseadas nos serviços reais do negócio (use os dados fornecidos).

REGRAS CRÍTICAS:
- Escreva TODAS as perguntas COMPLETAS. NUNCA use colchetes como [serviço] ou [horário].
- TODA resposta DEVE ser afirmativa e útil. NUNCA escreva "não tenho informações", "recomendo verificar".
- Se não souber a resposta exata, use dados genéricos positivos sobre o serviço.
- Se tiver horários de funcionamento nos dados, USE nas respostas.

EXEMPLO DE RESPOSTA IDEAL (Self-Contained Answer):
Pergunta: "Onde fica a ${data.businessName} em ${data.city}?"
Resposta: "A ${data.businessName} fica em ${data.city}, ${data.state}. Para saber o endereço exato e como chegar, entre em contato pelo WhatsApp. Atendemos clientes de ${data.city} e região com atendimento rápido."

### RETORNE APENAS JSON:
[
  {"question": "Pergunta?", "answer": "Resposta direta e completa com 50-80 palavras."},
  {"question": "Pergunta?", "answer": "Resposta direta e completa com 50-80 palavras."}
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

export function getServicesPrompt(data: MarketingCopyInput, serviceNames: string[], serviceDescriptions?: (string | undefined)[]): string {
  const servicesList = serviceNames.map((name, i) => {
    const desc = serviceDescriptions?.[i]
    return desc
      ? `${i + 1}. ${name}\n   Descrição fornecida pelo dono: "${desc}"`
      : `${i + 1}. ${name}`
  }).join('\n')

  return `Você é redator de conteúdo para negócios locais brasileiros.
Cada serviço vai ter sua PRÓPRIA página no Google. Precisa ranquear para:
- "[serviço] em ${data.city}"
- "[serviço] perto de mim"
- "melhor [serviço] em ${data.city}"

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE CONTEÚDO SEO PARA ESTES SERVIÇOS:
${servicesList}

IMPORTANTE: Quando houver "Descrição fornecida pelo dono", use-a como BASE para entender o serviço e gerar conteúdo mais preciso e alinhado com o que o negócio realmente oferece. NÃO copie a descrição literalmente, mas use as informações para criar conteúdo SEO melhor.

Para CADA serviço:

- "name": Nome exato (como listado acima)

- "iconName": Nome do ícone @tabler/icons-react que MELHOR representa visualmente o serviço.
  Use APENAS um ícone desta lista:
  IconScissors, IconBarbell, IconToolsKitchen2, IconCar, IconTool, IconDog, IconStethoscope, IconHome, IconBolt, IconDroplet, IconPaint, IconCamera, IconBook, IconMusic, IconHeart, IconShirt, IconCoffee, IconPizza, IconBread, IconFlower, IconDental, IconPill, IconScale, IconCalculator, IconSchool, IconBed, IconWash, IconTruck, IconKey, IconDeviceMobile, IconShoppingCart, IconDiamond, IconSparkles, IconBrush, IconNeedle, IconBike, IconSwimming, IconYoga, IconMassage, IconEye, IconEar, IconBrain, IconBone, IconBurger, IconIceCream, IconGlass, IconBottle, IconArmchair, IconHammer, IconShoe, IconPaw, IconBabyCarriage, IconBox, IconPlane, IconTree, IconStar, IconUsers, IconClock, IconShield, IconMapPin, IconPhone, IconMail, IconWifi, IconPrinter, IconMicrophone, IconHeadphones, IconGlobe, IconRocket, IconFlag, IconAward, IconCrown, IconTarget, IconChartBar, IconDatabase, IconCode, IconBug, IconTestPipe, IconFlask, IconAtom, IconDna, IconLeaf, IconSun, IconMoon, IconCloud, IconUmbrella, IconWind, IconSnowflake, IconFish, IconButterfly, IconCat, IconHorse, IconApple, IconCarrot, IconCookie, IconCake, IconSoup, IconGrill
  Escolha o ícone que MELHOR representa o serviço. NÃO invente nomes de ícones fora desta lista.

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
  * Parágrafo 3: Região atendida em ${data.city}. Só mencione preços/horários se estiverem nos dados fornecidos.
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
    "iconName": "IconSparkles",
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
- iconName: Ícone @tabler/icons-react que representa o serviço. Use APENAS desta lista: IconScissors, IconBarbell, IconToolsKitchen2, IconCar, IconTool, IconDog, IconStethoscope, IconHome, IconBolt, IconDroplet, IconPaint, IconCamera, IconBook, IconMusic, IconHeart, IconShirt, IconCoffee, IconPizza, IconBread, IconFlower, IconDental, IconPill, IconScale, IconCalculator, IconSchool, IconBed, IconWash, IconTruck, IconKey, IconDeviceMobile, IconShoppingCart, IconDiamond, IconSparkles, IconBrush, IconNeedle, IconBike, IconSwimming, IconYoga, IconMassage, IconEye, IconEar, IconBrain, IconBone, IconBurger, IconIceCream, IconGlass, IconBottle, IconArmchair, IconHammer, IconShoe, IconPaw, IconBabyCarriage, IconBox, IconPlane, IconTree, IconStar, IconUsers, IconClock, IconShield, IconMapPin, IconPhone, IconMail, IconWifi, IconPrinter, IconMicrophone, IconHeadphones, IconGlobe, IconRocket, IconFlag, IconAward, IconCrown, IconTarget, IconChartBar, IconDatabase, IconCode, IconBug, IconTestPipe, IconFlask, IconAtom, IconDna, IconLeaf, IconSun, IconMoon, IconCloud, IconUmbrella, IconWind, IconSnowflake, IconFish, IconButterfly, IconCat, IconHorse, IconApple, IconCarrot, IconCookie, IconCake, IconSoup, IconGrill
- description: Resultado prático para o cliente (60-100 chars)
- seoTitle: "[Serviço] em [Cidade] | [Nome]" (máx 60 chars)
- seoDescription: Serviço + cidade + CTA (máx 155 chars)
- longDescription: 3-4 parágrafos (800-1200 chars) com "[serviço] perto de mim" e "[serviço] em [cidade]"

Retorne APENAS JSON array:
[
  {
    "name": "Serviço",
    "iconName": "IconSparkles",
    "description": "O que o cliente ganha",
    "seoTitle": "Serviço em Cidade | Nome",
    "seoDescription": "Meta description com CTA",
    "longDescription": "Parágrafo 1...\\nParágrafo 2..."
  }
]`
}

export function getInstitutionalPagesPrompt(data: MarketingCopyInput): string {
  return `Você é especialista em SEO e AEO (Answer Engine Optimization) para negócios locais brasileiros.
Objetivo: gerar conteúdo para as páginas institucionais "Sobre Nós" e "Contato" do site.
Essas páginas precisam ranquear para:
- "sobre ${data.businessName.toLowerCase()}"
- "contato ${data.businessName.toLowerCase()} ${data.city}"
- "${data.category.toLowerCase()} em ${data.city} contato"
E aparecer como respostas em AI Overviews quando alguém pesquisar pelo negócio.

${buildBusinessContext(data)}

${getAntiAiRules()}

### GERE CONTEÚDO PARA 2 PÁGINAS:

**1. PÁGINA SOBRE NÓS (about)**

- "title": "Sobre a ${data.businessName}" ou "Conheça a ${data.businessName}" (máx 60 chars)

- "content" (600-900 chars, 4 parágrafos separados por \\n):
  * Parágrafo 1 (Self-Contained Answer para AEO): Responda direto quem é o negócio. Comece: "A ${data.businessName} é ${data.category.toLowerCase()} em ${data.city}, ${data.state}." Continue com o que oferece. Esta frase deve ser citável por IAs.
  * Parágrafo 2: Liste os serviços/produtos principais. Use dados reais (Google, reviews). Seja específico: nomes de serviços reais, não genéricos.
  * Parágrafo 3: O que diferencia a ${data.businessName} das outras opções em ${data.city}. Use dados reais dos reviews ou atributos do negócio. PROIBIDO dizer "referência" ou "destaque". Seja concreto.
  * Parágrafo 4: CTA específico. "Para ${data.category.toLowerCase()} em ${data.city}, fale com a ${data.businessName} pelo WhatsApp."

  OBRIGATÓRIO: "${data.businessName}" (pelo menos 2x), "${data.city}" (pelo menos 2x)
  PROIBIDO: "referência em", "qualidade e dedicação", "compromisso com a qualidade", "excelência"

- "seoTitle": "Sobre a ${data.businessName} | ${data.category} em ${data.city}" (máx 60 chars)

- "seoDescription": Resumo citável do negócio + cidade + CTA (máx 155 chars)
  BOM: "A ${data.businessName} é ${data.category.toLowerCase()} em ${data.city}. Saiba mais sobre nossos serviços. Ligue ou mande um WhatsApp."
  RUIM: "Conheça nossa empresa referência com excelência no atendimento."

**2. PÁGINA CONTATO (contact)**

- "title": "Contato | ${data.businessName}" ou "Fale com a ${data.businessName}" (máx 60 chars)

- "content" (250-400 chars, 2 parágrafos separados por \\n):
  * Parágrafo 1: Convite direto. "Precisa de ${data.category.toLowerCase()} em ${data.city}? Fale com a ${data.businessName}." Seja específico sobre o que o cliente vai resolver.
  * Parágrafo 2: Como entrar em contato. Mencione WhatsApp e telefone. CTA direto.
  NÃO inclua número de telefone ou endereço (exibidos dinamicamente).

- "seoTitle": "Contato ${data.businessName} | ${data.category} em ${data.city}" (máx 60 chars)

- "seoDescription": Convite + cidade + canais (máx 155 chars)
  BOM: "Fale com a ${data.businessName} em ${data.city}. WhatsApp, telefone e endereço. Solicite um orçamento agora."

### RETORNE APENAS JSON:
{
  "about": {
    "title": "...",
    "content": "...",
    "seoTitle": "...",
    "seoDescription": "..."
  },
  "contact": {
    "title": "...",
    "content": "...",
    "seoTitle": "...",
    "seoDescription": "..."
  }
}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}

export function getBusinessClassificationPrompt(data: BusinessClassificationInput): string {
  const reviewSnippets = (data.reviews || [])
    .filter(r => r.rating >= 4 && r.text?.text && r.text.text.trim().length > 10)
    .slice(0, 5)
    .map(r => `- "${r.text!.text!.substring(0, 150)}"`)
    .join('\n')

  const reviewSection = reviewSnippets
    ? `\nAvaliações de clientes:\n${reviewSnippets}`
    : ''

  return `Você é um especialista em negócios locais no Brasil.
Com base nas informações abaixo, identifique a categoria mais adequada para esta empresa no contexto brasileiro.

Nome da empresa: "${data.businessName}"
${data.primaryType ? `Tipo do Google: "${data.primaryType}"` : 'Tipo do Google: não informado'}
${reviewSection}

REGRAS:
- O nome da categoria deve ser o MAIS COMUM no Brasil para este tipo de negócio
- Responda em português, tudo minúsculo
- Use nomes simples e diretos como os clientes pesquisariam (ex: "buffet", "restaurante", "barbearia", "academia", "oficina mecânica", "pet shop", "mercado", "loja de roupas")
- Analise o NOME da empresa e as AVALIAÇÕES para entender o que o negócio realmente faz, não confie cegamente no tipo do Google
- Exemplos de correção: se o Google diz "food" mas o nome é "Buffet Star Fashion" e reviews falam de festas → categoria é "buffet"
- Se o Google diz "store" mas o nome é "Mercearia do João" → categoria é "mercearia"

Responda APENAS com JSON válido, sem markdown:
{"category": "nome da categoria"}

RETORNE APENAS O JSON, SEM MARKDOWN.`
}
