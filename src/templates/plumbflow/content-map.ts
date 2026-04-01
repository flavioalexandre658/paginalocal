import type { SectionContentMap } from "../types";

export const PLUMBFLOW_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botão CTA pill — telefone com DDD" },
      { key: "ctaLink", type: "string", description: "Link do CTA no formato tel:+55XXXXXXXXXXX" },
    ],
    contentGuidance:
      "Header escuro com top bar (telefone, email, 24h). Logo à esquerda, nav links no centro, CTA pill laranja com telefone à direita.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "tagline", type: "string", maxLength: 40, description: "Frase curta acima do título principal" },
      { key: "headline", type: "string", maxLength: 60, description: "Título principal — use *palavra* para accent laranja" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Parágrafo de apoio abaixo do título" },
      { key: "badgeText", type: "string", maxLength: 50, description: "Texto do badge de destaque lateral" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botão CTA primário" },
      { key: "ctaLink", type: "string", description: "Link do CTA primário" },
      { key: "secondaryCtaText", type: "string", maxLength: 25, description: "Texto do botão CTA secundário" },
      { key: "secondaryCtaLink", type: "string", description: "Link do CTA secundário" },
      {
        key: "brands",
        type: "array",
        count: { min: 3, max: 5 },
        description: "Lista de logos/nomes de marcas parceiras ou clientes",
        children: [
          { key: "name", type: "string", description: "Nome da marca/cliente" },
        ],
      },
    ],
    imageQueryHint: "professional worker service technician",
    contentGuidance:
      "Hero de impacto com título grande em branco, accent laranja na palavra destacada. Dois CTAs (primário pill laranja, secundário outline). Badge estatístico flutuante e barra de logos de parceiros na base.",
    exampleOutput: {
      tagline: "Especialistas em climatização",
      headline: "O *conforto* que sua casa merecia",
      subheadline:
        "Instalação e manutenção de ar condicionado com mais de uma década de experiência.",
      badgeText: "Referência em climatização no sul da Bahia",
      ctaText: "Solicite seu orçamento",
      secondaryCtaText: "Conheça nossos serviços",
      brands: [{ name: "Cliente A" }, { name: "Cliente B" }, { name: "Cliente C" }],
    },
  },

  // ─── [2] contact v1 (Quick Form) ──────────────────────────────────
  {
    blockType: "contact",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Título do card — pode usar *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Frase descritiva curta abaixo do título" },
    ],
    contentGuidance:
      "Card inline com título à esquerda + 2 inputs (nome, telefone) + botão 'Solicitar orçamento' à direita. Subtitle aparece como texto pequeno abaixo do título.",
  },

  // ─── [3] about v1 (Tabs + Checklist) ──────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase de 2-4 palavras acima do título" },
      {
        key: "highlights",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Exatamente 3 tabs com título curto e parágrafo descritivo",
        children: [
          { key: "label", type: "string", maxLength: 20, description: "Nome da tab — 1-2 palavras" },
          { key: "value", type: "string", maxLength: 300, description: "Parágrafo descritivo de 3-4 linhas para a tab" },
        ],
      },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Itens de checklist com frases curtas",
        children: [
          { key: "text", type: "string", maxLength: 50, description: "Frase curta de checklist — 5-8 palavras" },
        ],
      },
    ],
    imageQueryHint: "professional team office workspace",
    contentGuidance:
      "Seção sobre a empresa com 3 tabs clicáveis (Missão, Expertise, Valores). Cada tab revela um parágrafo descritivo. À direita, imagem profissional. Abaixo, checklist com ícones de check e frases curtas de diferenciais.",
    exampleOutput: {
      title: "Conheça nossa *história*",
      subtitle: "QUEM SOMOS",
      highlights: [
        { label: "Missão", value: "Oferecer serviços de climatização com excelência técnica e atendimento humanizado, garantindo o conforto térmico ideal para residências e empresas da região." },
        { label: "Expertise", value: "Com mais de 10 anos no mercado, nossa equipe é certificada pelos principais fabricantes e atualizada com as últimas tecnologias em refrigeração e HVAC." },
        { label: "Valores", value: "Transparência, pontualidade e compromisso com o resultado. Cada projeto é tratado com dedicação total, do orçamento à entrega final." },
      ],
      paragraphs: [
        { text: "Equipe certificada e treinada constantemente" },
        { text: "Atendimento em até 24 horas" },
        { text: "Garantia em todos os serviços" },
        { text: "Orçamento sem compromisso" },
      ],
    },
  },

  // ─── [4] stats v1 (Counter) ────────────────────────────────────────
  {
    blockType: "stats",
    variant: 1,
    fields: [
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 4 },
        description: "Exatamente 4 contadores com número e descrição",
        children: [
          { key: "value", type: "string", maxLength: 10, description: "Número com sufixo (ex: 10+, 98%, 24/7)" },
          { key: "label", type: "string", maxLength: 40, description: "Descrição curta do contador" },
        ],
      },
    ],
    contentGuidance:
      "Faixa horizontal com 4 contadores animados. Cada contador exibe um número grande em destaque com sufixo e uma descrição abaixo. Fundo escuro com separadores verticais entre os itens.",
    exampleOutput: {
      items: [
        { value: "10+", label: "Anos de experiência no mercado" },
        { value: "98%", label: "Clientes satisfeitos" },
        { value: "5k+", label: "Serviços realizados" },
        { value: "24/7", label: "Atendimento de emergência" },
      ],
    },
  },

  // ─── [5] services v1 (Tabs com imagem) ─────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag curta acima do título" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 5 },
        description: "Lista de serviços com tab, descrição e CTA",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do serviço — título da tab" },
          { key: "description", type: "string", maxLength: 250, description: "Descrição detalhada do serviço" },
          { key: "ctaText", type: "string", maxLength: 15, description: "Texto do botão de ação da tab" },
        ],
      },
    ],
    imageQueryHint: "professional service repair maintenance",
    contentGuidance:
      "Seção de serviços com tabs laterais à esquerda. Ao clicar em uma tab, exibe descrição do serviço com botão CTA e imagem ilustrativa à direita. Estilo clean com fundo claro.",
  },

  // ─── [6] services v2 (Timeline/Process) ────────────────────────────
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do título" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 5 },
        description: "Passos do processo em ordem cronológica",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do passo" },
          { key: "description", type: "string", maxLength: 200, description: "Descrição do que acontece neste passo" },
        ],
      },
    ],
    contentGuidance:
      "Timeline vertical com passos numerados (01, 02, 03...). Cada passo tem número grande em accent laranja, título em negrito e descrição. Linha conectora entre os passos. Fundo escuro com texto claro.",
  },

  // ─── [7] services v3 (Why Choose Us) ──────────────────────────────
  {
    blockType: "services",
    variant: 3,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Tag uppercase acima do título" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Exatamente 3 cards de diferenciais/benefícios",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Título do diferencial" },
          { key: "description", type: "string", maxLength: 200, description: "Descrição do benefício para o cliente" },
        ],
      },
    ],
    imageQueryHint: "certified professional team working",
    contentGuidance:
      "Seção 'Por que nos escolher' com 3 cards lado a lado. Cada card tem ícone, título em negrito e descrição. Imagem de equipe ao fundo ou ao lado. Fundo claro com accent nos ícones.",
  },

  // ─── [8] testimonials v1 ───────────────────────────────────────────
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 20, description: "Tag curta acima do título" },
      {
        key: "items",
        type: "array",
        count: { min: 6, max: 7 },
        description: "Depoimentos de clientes reais",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Depoimento realista em 1ª pessoa" },
          { key: "author", type: "string", maxLength: 30, description: "Nome brasileiro do cliente" },
          { key: "role", type: "string", maxLength: 30, description: "Profissão ou tipo de cliente" },
          { key: "rating", type: "string", description: "Avaliação em estrelas — sempre 5" },
        ],
      },
    ],
    imageQueryHint: "happy customer portrait brazilian",
    contentGuidance:
      "Carrossel de depoimentos com cards contendo 5 estrelas amarelas, texto de avaliação entre aspas, nome do autor em negrito e profissão abaixo. Fundo escuro com cards claros.",
  },

  // ─── [9] gallery v1 (Bento Grid) ──────────────────────────────────
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Título da seção — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase acima do título" },
      {
        key: "images",
        type: "array",
        count: { min: 5, max: 5 },
        description: "Exatamente 5 imagens para o grid bento",
        children: [
          { key: "url", type: "string", description: "URL da imagem — deixar vazio para preenchimento automático" },
          { key: "caption", type: "string", maxLength: 30, description: "Legenda curta de 2-4 palavras" },
        ],
      },
    ],
    imageQueryHint: "plumbing hvac repair installation work",
    contentGuidance:
      "Grid estilo bento com 5 imagens em tamanhos variados. A primeira imagem ocupa mais espaço. Cada imagem tem legenda em overlay semi-transparente na base. Cantos arredondados e gap entre as imagens.",
  },

  // ─── [10] cta v1 (Banner + Form) ──────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Título do banner — use *destaque* para accent" },
      { key: "subtitle", type: "string", maxLength: 100, description: "Tag uppercase acima do título" },
      { key: "ctaText", type: "string", maxLength: 30, description: "Título do formulário de contato" },
    ],
    contentGuidance:
      "Banner escuro com badge 24/7, título grande à esquerda e formulário de contato compacto à direita. Imagem de profissional ao fundo com overlay. Botão pill laranja no formulário.",
  },

  // ─── [11] footer v1 ───────────────────────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", description: "Texto de copyright exibido na base" },
      { key: "storeName", type: "string", description: "Nome da empresa no footer" },
      { key: "phone", type: "string", description: "Telefone de contato com DDD" },
      { key: "email", type: "string", description: "Email de contato" },
      { key: "address", type: "string", description: "Endereço completo da empresa" },
    ],
    contentGuidance:
      "Footer escuro com 4 colunas: logo + descrição, links rápidos, áreas de atendimento e contato (telefone, email, endereço). Ícones de redes sociais e barra de copyright na base.",
  },
];
