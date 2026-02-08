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

const CATEGORY_SERVICES: Record<string, ServiceItem[]> = {
  'borracharia': [
    { name: 'Troca de Pneus', description: 'Montagem e desmontagem de pneus de todos os aros com agilidade' },
    { name: 'Alinhamento', description: 'Alinhamento computadorizado para rodar seguro e economizar pneu' },
    { name: 'Balanceamento', description: 'Balanceamento de rodas para eliminar vibrações no volante' },
    { name: 'Calibragem', description: 'Calibragem com medidor digital para pressão correta dos pneus' },
    { name: 'Reparo de Pneus', description: 'Conserto de pneu furado com plugue ou manchão sem precisar trocar' },
    { name: 'Socorro 24h', description: 'Atendimento emergencial na estrada para pneu furado a qualquer hora' },
  ],
  'barbearia': [
    { name: 'Corte de Cabelo', description: 'Corte masculino na tesoura ou máquina no estilo que você preferir' },
    { name: 'Barba', description: 'Aparar e modelar a barba com navalha e toalha quente' },
    { name: 'Corte e Barba', description: 'Combo completo de corte e barba com desconto no pacote' },
    { name: 'Degradê', description: 'Corte degradê com acabamento preciso na máquina e navalha' },
    { name: 'Sobrancelha', description: 'Design de sobrancelha masculina com navalha para rosto alinhado' },
    { name: 'Hidratação Capilar', description: 'Tratamento para cabelo ressecado com produtos profissionais' },
  ],
  'academia': [
    { name: 'Musculação', description: 'Treino de musculação com equipamentos modernos e acompanhamento' },
    { name: 'Aulas de Spinning', description: 'Aulas de bike indoor em grupo com música e instrutor motivando' },
    { name: 'Funcional', description: 'Treino funcional para condicionamento físico e perda de peso' },
    { name: 'Avaliação Física', description: 'Avaliação corporal completa para montar seu treino personalizado' },
    { name: 'Personal Trainer', description: 'Acompanhamento individual com personal para resultados mais rápidos' },
    { name: 'Aulas de Yoga', description: 'Yoga para flexibilidade, equilíbrio e redução de estresse' },
  ],
  'restaurante': [
    { name: 'Almoço Executivo', description: 'Prato do dia com arroz, feijão, salada e proteína a preço fixo' },
    { name: 'Self-Service', description: 'Buffet por quilo com variedade de pratos quentes e saladas' },
    { name: 'Delivery', description: 'Entrega no endereço pelo iFood ou WhatsApp com cardápio completo' },
    { name: 'Marmitex', description: 'Marmita completa para levar com embalagem térmica' },
    { name: 'Eventos', description: 'Reserva para aniversários, confraternizações e eventos corporativos' },
    { name: 'Sobremesas', description: 'Sobremesas caseiras feitas no dia para complementar sua refeição' },
  ],
  'oficina mecanica': [
    { name: 'Troca de Óleo', description: 'Troca de óleo do motor com filtro usando marcas homologadas' },
    { name: 'Revisão Completa', description: 'Check-up geral do veículo com relatório detalhado de cada item' },
    { name: 'Freios', description: 'Troca de pastilhas, discos e regulagem do sistema de freios' },
    { name: 'Suspensão', description: 'Reparo e troca de amortecedores, molas e bandejas' },
    { name: 'Injeção Eletrônica', description: 'Diagnóstico e limpeza de bicos injetores por scanner automotivo' },
    { name: 'Elétrica Automotiva', description: 'Reparo em alternador, motor de arranque e parte elétrica geral' },
  ],
  'pet shop': [
    { name: 'Banho e Tosa', description: 'Banho com shampoo adequado e tosa higiênica ou na máquina' },
    { name: 'Consulta Veterinária', description: 'Atendimento veterinário para check-up, vacinas e tratamentos' },
    { name: 'Ração e Acessórios', description: 'Rações premium, brinquedos, coleiras e acessórios para pets' },
    { name: 'Vacinação', description: 'Aplicação de vacinas com carteirinha e orientação veterinária' },
    { name: 'Hotel para Pets', description: 'Hospedagem com cuidado e supervisão enquanto você viaja' },
    { name: 'Adestramento', description: 'Treinamento comportamental com profissional experiente' },
  ],
}

export function generateFallbackServices(category: string): ServiceItem[] {
  const key = category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const specific = CATEGORY_SERVICES[key]

  if (specific) return specific

  return [
    { name: 'Atendimento Especializado', description: `Serviço profissional de ${category.toLowerCase()} com equipe treinada` },
    { name: 'Orçamento Gratuito', description: 'Avaliação sem compromisso pelo WhatsApp ou presencialmente' },
    { name: 'Atendimento Rápido', description: 'Resposta ágil pelo WhatsApp para tirar dúvidas e agendar' },
    { name: 'Garantia de Satisfação', description: 'Trabalho com garantia e acompanhamento pós-serviço' },
    { name: 'Pacotes Especiais', description: 'Combos e pacotes com preço especial para serviços recorrentes' },
    { name: 'Atendimento Domiciliar', description: 'Serviço na sua casa ou empresa sem precisar se deslocar' },
  ]
}

export function generateFallbackFAQ(brandName: string, city: string, category: string): FAQItem[] {
  return [
    {
      question: `Qual a melhor ${category.toLowerCase()} perto de mim em ${city}?`,
      answer: `A ${brandName} é ${category.toLowerCase()} em ${city} com atendimento profissional e avaliações positivas de clientes. Fica fácil de chegar e atende toda a região. Entre em contato pelo WhatsApp para saber mais.`,
    },
    {
      question: `Qual o horário de funcionamento da ${brandName}?`,
      answer: `Atendemos de segunda a sexta das 8h às 18h e sábados das 8h às 12h. Horários podem variar em feriados. Mande uma mensagem no WhatsApp para confirmar.`,
    },
    {
      question: `Onde fica a ${brandName} em ${city}?`,
      answer: `A ${brandName} fica em ${city} e atende a cidade e região metropolitana. Veja o endereço completo e mapa na nossa página. É fácil de encontrar e tem estacionamento próximo.`,
    },
    {
      question: `Quanto custa ${category.toLowerCase()} em ${city}?`,
      answer: `Os preços variam de acordo com o serviço. A ${brandName} oferece orçamento gratuito pelo WhatsApp. Mande uma mensagem com o que precisa e receba o valor rapidamente.`,
    },
    {
      question: `Quais formas de pagamento a ${brandName} aceita?`,
      answer: `Aceitamos dinheiro, PIX, cartões de débito e crédito. Parcelamos em até 12x dependendo do serviço. Consulte condições pelo WhatsApp.`,
    },
    {
      question: `Como agendar um serviço de ${category.toLowerCase()} em ${city}?`,
      answer: `Agende pelo WhatsApp enviando uma mensagem com o serviço desejado. Respondemos rápido e encontramos o melhor horário para você. Atendemos ${city} e região.`,
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

  if (parsed.services) {
    parsed.services = parsed.services.map(svc => ({
      ...svc,
      seoTitle: svc.seoTitle || `${svc.name} em ${data.city} | ${parsed.brandName}`,
      seoDescription: svc.seoDescription || `${svc.name} na ${parsed.brandName}, ${data.category.toLowerCase()} em ${data.city}. ${svc.description} Entre em contato pelo WhatsApp!`,
      longDescription: svc.longDescription || generateFallbackServiceLongDescription(svc.name, parsed.brandName, data.category, data.city, data.state),
    }))
  }

  if (!parsed.faq || parsed.faq.length === 0) {
    parsed.faq = generateFallbackFAQ(parsed.brandName, data.city, data.category)
  }
  if (!parsed.neighborhoods || parsed.neighborhoods.length === 0) {
    parsed.neighborhoods = [`Centro de ${data.city}`, 'Região Central', 'Zona Norte', 'Zona Sul', 'Região Metropolitana']
  }
  if (!parsed.seoTitle) {
    parsed.seoTitle = `${data.category} em ${data.city} | ${parsed.brandName}`
  }
  if (!parsed.seoDescription) {
    parsed.seoDescription = `${data.category} em ${data.city}. ${parsed.brandName} oferece serviços profissionais com atendimento pelo WhatsApp. Veja avaliações e entre em contato!`
  }

  return parsed
}

function generateFallbackServiceLongDescription(
  serviceName: string,
  brandName: string,
  category: string,
  city: string,
  state: string,
): string {
  return `Procurando por ${serviceName.toLowerCase()} em ${city}? A ${brandName} é ${category.toLowerCase()} em ${city}, ${state}, que oferece ${serviceName.toLowerCase()} com profissionais experientes e atendimento personalizado.

Na ${brandName}, o serviço de ${serviceName.toLowerCase()} é realizado com equipamentos adequados e atenção aos detalhes. Nosso objetivo é que você saia satisfeito e volte sempre que precisar.

Atendemos clientes de ${city} e região metropolitana. Se você está buscando ${serviceName.toLowerCase()} perto de você, entre em contato pelo WhatsApp para tirar dúvidas e agendar um horário.

Ligue ou mande uma mensagem pelo WhatsApp para fazer seu orçamento de ${serviceName.toLowerCase()} sem compromisso. Atendimento de segunda a sábado.`
}
