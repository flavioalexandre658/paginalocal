import type { SectionContentMap } from "../types";

export const VERVEDENT_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da clinica exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — acao de agendamento curta" },
      { key: "ctaLink", type: "string", description: "Link do CTA no formato tel:+55XXXXXXXXXXX ou ancora" },
    ],
    contentGuidance:
      "Header glassmorphism com blur, logo a esquerda, nav links centralizados e botao CTA pill teal a direita. Fundo translucido com backdrop-blur e texto escuro.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 60, description: "Titulo principal — use *palavra* para accent teal/cyan" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Paragrafo de apoio descrevendo a clinica e seus diferenciais" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA primario pill teal" },
      { key: "secondaryCtaText", type: "string", maxLength: 25, description: "Texto do botao CTA secundario outline" },
      { key: "tagline", type: "string", maxLength: 40, description: "Frase curta de reforco acima do titulo ou como badge" },
      {
        key: "brands",
        type: "array",
        count: { min: 3, max: 5 },
        description: "Estatisticas ou selos de confianca exibidos abaixo do hero",
        children: [
          { key: "name", type: "string", maxLength: 20, description: "Metrica ou selo (ex: '10+ Anos', '5000+ Pacientes')" },
        ],
      },
    ],
    imageQueryHint: "dental clinic modern interior",
    imageSpec: {
      aspectRatio: "4:3",
      style: "clean professional photo, bright natural lighting",
      subject: "modern dental clinic interior with contemporary furniture and equipment",
      avoid: ["stock photo feel", "clipart", "text overlays", "watermarks", "blurry"],
    },
    contentGuidance:
      "Hero split com titulo grande a esquerda e imagem arredondada a direita. Titulo em dark com palavra-chave em accent teal (*destaque*). Dois CTAs: primario pill teal e secundario outline. Stats/badges flutuantes com numeros de confianca.",
    exampleOutput: {
      headline: "Seu sorriso merece *cuidado* de verdade",
      subheadline:
        "Tratamentos odontologicos modernos com tecnologia de ponta, equipe especializada e ambiente acolhedor. Agende sua consulta e descubra o melhor da odontologia.",
      ctaText: "Agendar consulta",
      secondaryCtaText: "Conheca a clinica",
      tagline: "Odontologia moderna e humanizada",
      brands: [
        { name: "10+ Anos" },
        { name: "5000+ Pacientes" },
        { name: "4.9 Google" },
        { name: "CRO Ativo" },
      ],
    },
  },

  // ─── [2] about v1 ─────────────────────────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase de 2-4 palavras acima do titulo" },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 2, max: 3 },
        description: "Paragrafos descritivos sobre a clinica, historia e missao",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Paragrafo descritivo de 2-3 linhas" },
        ],
      },
      {
        key: "highlights",
        type: "array",
        count: { min: 3, max: 3 },
        description: "3 diferenciais ou estatisticas da clinica",
        children: [
          { key: "label", type: "string", maxLength: 30, description: "Titulo do diferencial — 2-3 palavras" },
          { key: "value", type: "string", maxLength: 200, description: "Descricao curta ou numero de destaque" },
        ],
      },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA (ex: 'Agende sua visita', 'Saiba mais')" },
    ],
    imageQueryHint: "dental office modern clean",
    imageSpec: {
      aspectRatio: "4:3",
      style: "bright editorial photo, clean environment",
      subject: "modern dental office interior, clean and welcoming atmosphere",
      avoid: ["posed group photo", "generic office", "stock feel"],
    },
    contentGuidance:
      "Secao sobre a clinica com layout split: imagem profissional a esquerda e texto a direita. Tag uppercase em teal, titulo bold com accent, paragrafos descritivos e highlights com icones ou numeros.",
    exampleOutput: {
      title: "Cuidando do seu sorriso com *excelencia*",
      subtitle: "SOBRE NOS",
      paragraphs: [
        { text: "Somos uma clinica odontologica dedicada a oferecer tratamentos de alta qualidade em um ambiente moderno e acolhedor. Nossa equipe combina experiencia clinica com as mais recentes tecnologias." },
        { text: "Desde 2014, atendemos milhares de pacientes com foco em resultados naturais, conforto e atendimento humanizado. Cada tratamento e planejado de forma personalizada." },
        { text: "Contamos com equipamentos de ultima geracao, incluindo scanner intraoral 3D, laser e sedacao consciente para garantir sua tranquilidade." },
      ],
      highlights: [
        { label: "Equipe Especializada", value: "Dentistas com pos-graduacao e atualizacao constante em suas areas" },
        { label: "Tecnologia Avancada", value: "Scanner 3D, laser e radiografia digital para diagnosticos precisos" },
        { label: "Ambiente Acolhedor", value: "Clinica projetada para seu conforto com sala de espera climatizada" },
      ],
    },
  },

  // ─── [3] services v1 (Team) ───────────────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Membros da equipe com nome e especialidade",
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome completo do profissional (ex: Dra. Ana Paula)" },
          { key: "description", type: "string", maxLength: 100, description: "Especialidade e registro (ex: Ortodontia — CRO 12345)" },
        ],
      },
    ],
    imageQueryHint: "dentist professional portrait",
    imageSpec: {
      aspectRatio: "3:4",
      style: "professional headshot, clean background, friendly expression",
      subject: "dentist or healthcare professional portrait, wearing white coat",
      avoid: ["full body", "group photo", "sunglasses", "heavy filters"],
      count: 4,
    },
    contentGuidance:
      "Grid de cards da equipe com foto arredondada no topo, nome bold e especialidade em texto muted. Cards com fundo surface e border sutil. Hover com leve elevacao. Tag uppercase teal acima do titulo.",
  },

  // ─── [4] services v2 (Services Grid) ──────────────────────────────
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Servicos oferecidos com nome e descricao",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do servico odontologico" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao do servico em 2-3 linhas" },
        ],
      },
    ],
    contentGuidance:
      "Grid de cards de servicos com icone teal no topo, titulo bold, descricao em texto muted. Cards com fundo surface, cantos arredondados lg e hover com borda teal sutil. Tag uppercase teal acima do titulo centralizado.",
  },

  // ─── [5] contact v1 (Appointment) ─────────────────────────────────
  {
    blockType: "contact",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo convidando ao agendamento" },
      { key: "phone", type: "string", description: "Telefone de contato com DDD" },
      { key: "email", type: "string", description: "Email de contato da clinica" },
      { key: "address", type: "string", description: "Endereco completo da clinica" },
    ],
    contentGuidance:
      "Secao de agendamento com formulario a esquerda e informacoes de contato a direita. Campos do formulario com borda teal no focus. Informacoes incluem telefone, email, endereco e horarios de funcionamento.",
  },

  // ─── [6] testimonials v1 ──────────────────────────────────────────
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Titulo da secao — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Depoimentos de pacientes",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Depoimento realista em 1a pessoa sobre o tratamento" },
          { key: "author", type: "string", maxLength: 30, description: "Nome brasileiro do paciente" },
          { key: "role", type: "string", maxLength: 30, description: "Tipo de tratamento ou perfil (ex: Implante Dentario, Clareamento)" },
          { key: "rating", type: "string", description: "Avaliacao em estrelas — sempre 5" },
        ],
      },
    ],
    imageQueryHint: "happy patient portrait smile",
    imageSpec: {
      aspectRatio: "1:1",
      style: "professional headshot portrait, natural lighting, warm tones",
      subject: "happy patient portrait with beautiful smile, clean neutral background",
      avoid: ["full body", "group photo", "sunglasses", "heavy filters", "cartoon"],
      count: 6,
    },
    contentGuidance:
      "Carousel de depoimentos com foto do paciente, 5 estrelas teal, texto entre aspas, nome bold e tipo de tratamento. Cards com fundo surface e cantos arredondados. Fundo da secao com leve tint teal.",
    exampleOutput: {
      title: "O que nossos *pacientes* dizem",
      subtitle: "DEPOIMENTOS",
      items: [
        { text: "Fiz meu implante na clinica e o resultado ficou incrivel. Equipe super atenciosa e o ambiente e muito confortavel. Recomendo de olhos fechados!", author: "Mariana Silva", role: "Implante Dentario", rating: "5" },
        { text: "Sempre tive medo de dentista, mas aqui me senti acolhida desde a primeira consulta. O clareamento ficou natural e lindo.", author: "Pedro Henrique", role: "Clareamento Dental", rating: "5" },
        { text: "Levei meus filhos para a primeira consulta e eles adoraram. A dentista tem uma paciencia incrivel com criancas. Voltaremos sempre!", author: "Camila Rodrigues", role: "Odontopediatria", rating: "5" },
        { text: "Meu tratamento ortodontico esta sendo acompanhado com muito cuidado. A clinica e moderna e os horarios sao flexiveis.", author: "Lucas Ferreira", role: "Ortodontia", rating: "5" },
      ],
    },
  },

  // ─── [7] cta v1 (Newsletter) ──────────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo do banner — use *destaque* para accent teal" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo convidando a se inscrever" },
      { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botao CTA pill teal" },
    ],
    contentGuidance:
      "Banner CTA com fundo teal/primary escuro ou gradiente. Titulo grande centralizado em branco com accent, subtitulo em branco/translucido e campo de email com botao pill teal. Cantos arredondados.",
  },

  // ─── [8] footer v1 ────────────────────────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", description: "Texto de copyright exibido na base" },
      { key: "storeName", type: "string", description: "Nome da clinica no footer" },
      { key: "phone", type: "string", description: "Telefone de contato com DDD" },
      { key: "email", type: "string", description: "Email de contato" },
      { key: "address", type: "string", description: "Endereco completo da clinica" },
    ],
    contentGuidance:
      "Footer clean com logo + descricao curta, links rapidos, horarios de funcionamento e contato (telefone, email, endereco). Icones de redes sociais em teal e barra de copyright na base. Fundo surface com texto muted.",
  },
];
