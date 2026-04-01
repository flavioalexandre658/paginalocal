import type { SectionContentMap } from "../types";

export const AURORA_CONTENT_MAP: SectionContentMap[] = [
  // ── 1. Header Pill ──
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa exibido no header" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA pill no header (ex: 'Comecar agora')" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA do header (ex: '#contato')" },
    ],
    contentGuidance:
      "Header flutuante pill-shaped com logo/nome a esquerda, navegacao central e botao CTA pill a direita. O CTA usa fundo escuro com seta circular branca. Mantenha o texto do CTA curto e orientado a acao.",
  },

  // ── 2. Hero Dashboard ──
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 80, description: "Titulo principal. Use *asteriscos* para destacar palavras na cor accent." },
      { key: "subheadline", type: "string", maxLength: 160, description: "Subtitulo descritivo abaixo do H1." },
      { key: "badgeText", type: "string", maxLength: 40, description: "Texto de badge/pill acima do titulo (opcional)." },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao primario pill (fundo escuro + seta)." },
      { key: "secondaryCtaText", type: "string", maxLength: 25, description: "Texto do botao secundario outline pill." },
      {
        key: "brands",
        type: "array",
        count: { min: 4, max: 6 },
        children: [
          { key: "name", type: "string", maxLength: 20, description: "Nome da marca/parceiro" },
        ],
        description: "Lista de marcas exibidas em marquee infinito abaixo do hero.",
      },
    ],
    contentGuidance:
      "Secao hero split: texto a esquerda (H1 grande com tracking apertado, subtitulo, dois botoes pill) e area de mockup/imagem a direita com cards skeleton sobrepostos. Abaixo, marquee infinito de logos de parceiros com fade nas bordas. Use *asteriscos* no headline para colorir palavras com a cor accent.",
    exampleOutput: {
      headline: "Simplifique sua *gestao* com inteligencia",
      subheadline: "Plataforma completa para automatizar processos, gerenciar equipes e escalar resultados com dados em tempo real.",
      badgeText: "Novo: Integracao com IA",
      ctaText: "Comecar agora",
      secondaryCtaText: "Ver demo",
      brands: [
        { name: "TechFlow" },
        { name: "DataSync" },
        { name: "CloudBase" },
        { name: "MetricHub" },
        { name: "Automate" },
      ],
    },
  },

  // ── 3. Process Steps (services v1) ──
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo." },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Titulo do passo" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao do passo" },
          { key: "ctaText", type: "string", maxLength: 25, description: "Texto do CTA do passo (opcional)" },
        ],
        description: "Exatamente 3 passos numerados (01, 02, 03) exibidos como cards clicaveis.",
      },
    ],
    contentGuidance:
      "Secao de processo com titulo centralizado + card surface contendo um dashboard skeleton no topo (visivel apenas desktop) e 3 cards de passos numerados (01, 02, 03) em grid abaixo. O card ativo expande mostrando imagem. Cada passo deve representar uma etapa logica do servico/produto.",
  },

  // ── 4. Feature Tabs (services v2) ──
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo." },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome da feature (aparece na tab pill)" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao detalhada da feature. A primeira frase vira o H3 do card." },
        ],
        description: "Features exibidas como tabs pill no topo + card expandido com imagem a esquerda e texto a direita.",
      },
    ],
    contentGuidance:
      "Secao de features com tabs pill arredondadas no topo (coluna no mobile, linha no desktop). Ao clicar uma tab, o card abaixo mostra: imagem/preview escuro a esquerda e nome + descricao a direita. A primeira frase da descricao e usada como titulo H3 grande no card. Cada item deve ser uma funcionalidade distinta do produto.",
  },

  // ── 5. Integration Grid (stats v1) ──
  {
    blockType: "stats",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        children: [
          { key: "value", type: "string", maxLength: 20, description: "Nome curto da ferramenta/integracao (ex: 'Slack', 'Notion'). NAO use numeros." },
          { key: "label", type: "string", maxLength: 80, description: "Descricao da integracao. O primeiro item.label aparece como paragrafo de apoio abaixo do titulo." },
        ],
        description: "Lista de integracoes/ferramentas. value = nome da ferramenta (1-2 palavras), label = descricao. NAO sao estatisticas numericas.",
      },
    ],
    contentGuidance:
      "ATENCAO: Esta secao NAO exibe numeros/estatisticas. Renderiza como: coluna esquerda com titulo, paragrafo (items[0].label) e lista numerada de integracoes (01, 02, 03...) mostrando label + value de cada item. Coluna direita com grid vertical de logos animado (scroll infinito em 2 colunas com direcoes opostas). Cada card quadrado mostra um icone geometrico colorido + o value (nome da ferramenta) abaixo. Use nomes reais de ferramentas/plataformas relevantes ao nicho do cliente.",
    exampleOutput: {
      title: "Conecte com suas *ferramentas* favoritas",
      items: [
        { value: "Slack", label: "Comunicacao integrada com notificacoes em tempo real para sua equipe." },
        { value: "Notion", label: "Sincronize documentos e bases de conhecimento automaticamente." },
        { value: "Stripe", label: "Pagamentos e faturamento conectados sem friccao." },
        { value: "HubSpot", label: "CRM unificado com dados de clientes sempre atualizados." },
        { value: "Zapier", label: "Automacoes ilimitadas conectando centenas de apps." },
      ],
    },
  },

  // ── 6. Pricing Glassmorphism (pricing v1) ──
  {
    blockType: "pricing",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo." },
      {
        key: "plans",
        type: "array",
        count: { min: 2, max: 3 },
        children: [
          { key: "name", type: "string", maxLength: 25, description: "Nome do plano" },
          { key: "price", type: "string", maxLength: 15, description: "Preco formatado (ex: 'R$97')" },
          { key: "description", type: "string", maxLength: 100, description: "Descricao curta do plano" },
          { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA do plano" },
          {
            key: "features",
            type: "array",
            count: { min: 3, max: 6 },
            children: [
              { key: "feature", type: "string", maxLength: 60, description: "Item da lista de features" },
            ],
            description: "Lista de features incluidas no plano.",
          },
        ],
        description: "Planos de preco exibidos em lista escura a esquerda + card glassmorphism com detalhes a direita.",
      },
    ],
    contentGuidance:
      "Secao de pricing com fundo escuro arredondado (radius 32), blobs decorativos coloridos e layout split: esquerda tem titulo branco + lista de planos clicaveis em fundo escuro semitransparente (o ativo fica destacado), direita tem card glassmorphism com icone + nome + preco grande + descricao + botao pill accent + lista de features com checkmarks. O '/ mo' e fixo apos o preco.",
  },

  // ── 7. Case Studies + Testimonials (testimonials v1) ──
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo." },
      {
        key: "items",
        type: "array",
        count: { min: 7, max: 7 },
        children: [
          { key: "text", type: "string", maxLength: 200, description: "Texto do case study (items 0-3) ou depoimento longo (items 4-6)" },
          { key: "author", type: "string", maxLength: 40, description: "Nome da empresa (items 0-3) ou nome da pessoa (items 4-6)" },
          { key: "role", type: "string", maxLength: 40, description: "Cargo/funcao (usado apenas nos items 4-6, os quote cards)" },
        ],
        description: "7 items obrigatorios. Items 0-3 = case study cards (imagem escura + nome empresa overlay + texto curto). Items 4-6 = quote cards (aspas + depoimento longo + nome pessoa + cargo + avatar).",
      },
    ],
    contentGuidance:
      "Secao dividida em duas partes separadas por um divider de simbolos +. PARTE 1 (Case Studies): titulo + subtitulo centralizados, grid 2x2 de cards com area de imagem escura (com nome da empresa centralizado em overlay + badge de ano), e abaixo texto curto descritivo. O author dos items 0-3 deve ser um NOME DE EMPRESA. PARTE 2 (Depoimentos): 3 cards em grid horizontal com aspas decorativas, texto longo de depoimento, e rodape com nome da pessoa + cargo + avatar circular. Os items sao divididos automaticamente: primeira metade = case studies, segunda metade = quote cards.",
    exampleOutput: {
      title: "Resultados que *falam* por si",
      subtitle: "Veja como empresas estao transformando seus processos com nossa plataforma.",
      items: [
        { text: "Reducao de 45% no tempo de onboarding de novos colaboradores.", author: "TechFlow", role: "" },
        { text: "Aumento de 3x na velocidade de entrega de projetos.", author: "DataSync Corp", role: "" },
        { text: "Economia de 120 horas mensais em processos manuais.", author: "CloudBase", role: "" },
        { text: "ROI positivo em apenas 2 meses de implementacao.", author: "MetricHub", role: "" },
        { text: "A plataforma transformou completamente a forma como gerenciamos nossos projetos. A interface e intuitiva e a equipe de suporte e excepcional. Recomendo para qualquer empresa que busca eficiencia.", author: "Marina Santos", role: "CTO, TechFlow" },
        { text: "Depois de testar diversas solucoes, finalmente encontramos algo que realmente funciona. A integracao foi rapida e os resultados apareceram desde a primeira semana.", author: "Ricardo Almeida", role: "Diretor de Operacoes, DataSync" },
        { text: "O melhor investimento que fizemos este ano. A automacao de processos nos permitiu focar no que realmente importa: crescer o negocio.", author: "Camila Ferreira", role: "CEO, CloudBase" },
      ],
    },
  },

  // ── 8. FAQ Split Clean (faq v1) ──
  {
    blockType: "faq",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo." },
      {
        key: "items",
        type: "array",
        count: { min: 5, max: 6 },
        children: [
          { key: "question", type: "string", maxLength: 80, description: "Pergunta frequente" },
          { key: "answer", type: "string", maxLength: 300, description: "Resposta detalhada" },
        ],
        description: "Perguntas frequentes exibidas como accordion.",
      },
    ],
    contentGuidance:
      "Layout split: coluna esquerda (33%) com titulo + subtitulo que fica sticky no scroll (desktop). Coluna direita (58%) com accordion dentro de card surface — cada item tem fundo branco semi, radius 20, e icone + que vira X ao abrir. O primeiro item vem aberto por padrao. Use perguntas reais e relevantes ao nicho do cliente.",
  },

  // ── 9. Footer Newsletter Grid (footer v1) ──
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", maxLength: 80, description: "Texto de copyright no rodape." },
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa no rodape." },
      { key: "tagline", type: "string", maxLength: 100, description: "Tagline/descricao curta abaixo do nome." },
      {
        key: "navLinks",
        type: "array",
        count: { min: 4, max: 8 },
        children: [
          { key: "label", type: "string", maxLength: 25, description: "Texto do link" },
          { key: "href", type: "string", maxLength: 100, description: "URL do link (ex: '#services', '#faq')" },
        ],
        description: "Links de navegacao divididos automaticamente em 2 colunas.",
      },
      { key: "address", type: "string", maxLength: 100, description: "Endereco fisico (opcional)." },
      { key: "phone", type: "string", maxLength: 20, description: "Telefone de contato." },
      { key: "email", type: "string", maxLength: 50, description: "Email de contato." },
    ],
    contentGuidance:
      "Footer com fundo escuro arredondado (radius 24) dentro do background claro. Topo: area de newsletter com input pill + botao accent. Abaixo: grid de 4 colunas — (1) marca + tagline, (2) navegacao primeira metade, (3) navegacao segunda metade ou contato, (4) contato com endereco/telefone/email. Rodape com copyright + links sociais (Instagram, Facebook, WhatsApp) + credito 'Desenvolvido por Decolou'.",
  },
];
