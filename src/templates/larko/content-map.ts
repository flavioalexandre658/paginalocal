import type { SectionContentMap } from "../types";

export const LARKO_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa ou consultoria exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — acao curta de contato ou agendamento" },
    ],
    contentGuidance:
      "Header branco sticky com logo texto a esquerda em Geist bold verde escuro, nav links centralizados e botao CTA pill verde (#0E1201) a direita com border-radius 50px. Fundo clean com sombra sutil no scroll.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 70, description: "Titulo principal — use *palavra* para destaque italic com accent lime" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Paragrafo de apoio descrevendo a proposta de valor da empresa" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA primario — ex: 'Agendar consultoria'" },
      { key: "tagline", type: "string", maxLength: 50, description: "Tagline curta acima do titulo — ex: 'Consultoria Estrategica'" },
      { key: "badgeText", type: "string", maxLength: 50, description: "Texto de badge/selo de credibilidade — ex: 'Top 10 Consultorias 2025'" },
      {
        key: "brands",
        type: "array",
        count: { min: 3, max: 6 },
        description: "Logos de clientes ou parceiros de confianca",
        children: [
          { key: "name", type: "string", maxLength: 20, description: "Nome do cliente ou parceiro (ex: 'Google', 'Ambev', 'TOTVS')" },
        ],
      },
    ],
    imageQueryHint: "professional business consulting meeting",
    imageSpec: {
      aspectRatio: "16:9",
      style: "professional business photo, corporate environment, clean lighting",
      subject: "business professionals in modern office discussing strategy",
      avoid: ["stock photo feel", "clipart", "text overlays", "watermarks", "blurry"],
    },
    contentGuidance:
      "Hero com tagline uppercase pequena acima, headline grande bold Geist com palavra em italico accent lime (*destaque*), subtitulo descritivo, botao CTA pill verde escuro, badge de credibilidade e faixa de logos de clientes abaixo. Fundo claro com foto profissional de negocio a direita.",
    exampleOutput: {
      headline: "Aceleramos o *crescimento* do seu negocio com estrategia",
      subheadline:
        "Consultoria especializada em marketing digital, gestao e estrategia de negocios para empresas que buscam resultados mensuraveis e crescimento sustentavel.",
      ctaText: "Agendar consultoria",
      tagline: "Consultoria Estrategica",
      badgeText: "Top 10 Consultorias Brasil 2025",
      brands: [
        { name: "Ambev" },
        { name: "TOTVS" },
        { name: "Natura" },
        { name: "iFood" },
        { name: "Stone" },
      ],
    },
  },

  // ─── [2] services v1 (Cards Services) ─────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent lime italic" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo curto descrevendo os servicos oferecidos" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Servicos oferecidos com nome e descricao",
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome do servico — ex: 'Estrategia Digital', 'Gestao de Marca'" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao objetiva do servico em 1-2 linhas" },
        ],
      },
    ],
    contentGuidance:
      "4 cards escuros (dark green/cream) com numeros grandes (01, 02, 03, 04) em accent lime, titulo bold do servico e descricao muted. Icones lime no canto. Cards com border-radius 6px, fundo escuro e hover com borda lime sutil. Titulo da secao centralizado com accent italic.",
    exampleOutput: {
      title: "Nossos *servicos* especializados",
      subtitle: "Solucoes completas para seu negocio",
      items: [
        {
          name: "Estrategia de Marketing Digital",
          description: "Planejamento e execucao de campanhas de marketing com foco em ROI e conversao para escalar seu negocio.",
        },
        {
          name: "Consultoria de Gestao",
          description: "Diagnostico completo e plano de acao para otimizar processos, reduzir custos e aumentar a eficiencia operacional.",
        },
        {
          name: "Branding Corporativo",
          description: "Construcao e fortalecimento de marca com identidade visual, posicionamento e comunicacao estrategica.",
        },
        {
          name: "Transformacao Digital",
          description: "Implementacao de tecnologias e processos digitais para modernizar operacoes e melhorar a experiencia do cliente.",
        },
      ],
    },
  },

  // ─── [3] gallery v1 (Portfolio Cases) ─────────────────────────────
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent lime italic" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo curto sobre os cases de sucesso" },
      {
        key: "images",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Cases de portfolio com imagem e descricao do projeto",
        children: [
          { key: "url", type: "string", description: "URL da imagem do case/projeto" },
          { key: "caption", type: "string", maxLength: 60, description: "Nome do case — curto e descritivo" },
          { key: "alt", type: "string", maxLength: 120, description: "Descricao acessivel da imagem do case" },
        ],
      },
    ],
    imageQueryHint: "business case study presentation corporate",
    imageSpec: {
      aspectRatio: "16:9",
      style: "business case study, corporate presentation, clean professional",
      subject: "business strategy presentation or corporate project showcase",
      avoid: ["stock photo feel", "low quality", "text overlays", "watermarks"],
      count: 4,
    },
    contentGuidance:
      "Grid de 3-4 cases de portfolio com imagens grandes arredondadas (6px), caption bold com nome do case e descricao curta. Cards com fundo surface, hover com overlay verde escuro e icone de seta. Titulo centralizado com accent lime italic.",
    exampleOutput: {
      title: "Cases de *sucesso*",
      subtitle: "Resultados que falam por si",
      images: [
        {
          url: "",
          caption: "Estrategia digital para fintech Scale",
          alt: "Dashboard de resultados mostrando crescimento de 200% em leads para a fintech Scale",
        },
        {
          url: "",
          caption: "Rebranding completo da NovaTech",
          alt: "Nova identidade visual e materiais de marca da empresa NovaTech",
        },
        {
          url: "",
          caption: "Campanha de lancamento GreenFood",
          alt: "Campanha de marketing digital para lancamento do app GreenFood com resultados de engajamento",
        },
      ],
    },
  },

  // ─── [4] about v1 (About Carousel) ────────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent lime italic" },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 1, max: 3 },
        description: "Paragrafos descritivos sobre a empresa, sua historia e filosofia",
        children: [
          { key: "text", type: "string", maxLength: 200, description: "Paragrafo descritivo de 2-3 linhas sobre a empresa" },
        ],
      },
      {
        key: "highlights",
        type: "array",
        count: { min: 4, max: 4 },
        description: "Vantagens ou diferenciais da empresa com icones",
        children: [
          { key: "label", type: "string", maxLength: 30, description: "Nome do diferencial — ex: 'Experiencia Comprovada'" },
          { key: "value", type: "string", maxLength: 80, description: "Descricao curta do diferencial ou metrica — ex: '15+ anos no mercado'" },
        ],
      },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — ex: 'Conheca a equipe'" },
    ],
    imageQueryHint: "corporate team professional office",
    imageSpec: {
      aspectRatio: "16:9",
      style: "corporate team photo, modern office, natural lighting",
      subject: "professional team in modern corporate office environment",
      avoid: ["posed group photo", "generic stock", "blurry", "outdated office"],
    },
    contentGuidance:
      "Secao sobre nos com layout split: slider/carrossel de fotos da equipe e escritorio a esquerda e texto a direita. Titulo bold Geist com accent lime, paragrafos descritivos e grid de 4 vantagens/diferenciais com icones lime e labels bold. Botao CTA pill verde escuro.",
    exampleOutput: {
      title: "Sobre a *nossa* empresa",
      paragraphs: [
        { text: "Somos uma consultoria especializada em transformar negocios atraves de estrategias inovadoras e solucoes personalizadas que geram resultados reais e mensuraveis." },
        { text: "Com mais de 15 anos de experiencia e uma equipe multidisciplinar, ja ajudamos centenas de empresas a alcancar seus objetivos de crescimento e eficiencia." },
      ],
      highlights: [
        { label: "Experiencia Comprovada", value: "15+ anos no mercado B2B" },
        { label: "Equipe Especializada", value: "40+ consultores certificados" },
        { label: "Clientes Atendidos", value: "500+ empresas em 12 segmentos" },
        { label: "Satisfacao", value: "98% de aprovacao dos clientes" },
      ],
      ctaText: "Conheca a equipe",
    },
  },

  // ─── [5] cta v1 (CTA Green) ───────────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 70, description: "Titulo do CTA — use *palavra* para accent lime italic" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo motivacional convidando a iniciar o contato" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — ex: 'Fale com um consultor'" },
    ],
    contentGuidance:
      "Secao CTA sobre fundo escuro verde (#0E1201) com gradiente sutil lime, headline grande bold Geist com accent lime italic, subtitulo em texto claro muted e botao CTA pill lime centralizado. Pode incluir mini slider de depoimentos ou badge de confianca.",
    exampleOutput: {
      title: "Pronto para *transformar* seu negocio?",
      subtitle: "Agende uma consultoria gratuita e descubra como podemos acelerar seus resultados em 90 dias.",
      ctaText: "Fale com um consultor",
    },
  },

  // ─── [6] services v2 (Solutions Grid) ─────────────────────────────
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent lime italic" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo curto sobre as solucoes oferecidas" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Solucoes em formato de colunas com nome, descricao e imagem",
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome da solucao — ex: 'Growth Marketing', 'Gestao Agil'" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao da solucao com outputs esperados" },
          { key: "image", type: "string", description: "URL da imagem ilustrativa da solucao" },
        ],
      },
    ],
    imageQueryHint: "business strategy graphic corporate illustration",
    imageSpec: {
      aspectRatio: "4:3",
      style: "corporate business graphic, clean modern illustration, professional",
      subject: "business strategy or consulting concept illustration with charts and graphs",
      avoid: ["stock photo feel", "clipart", "cartoonish", "low quality"],
      count: 3,
    },
    contentGuidance:
      "3 colunas de solucoes com imagem no topo (border-radius 6px), titulo bold e descricao de outputs/entregas. Cards com fundo surface claro, hover com sombra sutil. Categorias organizadas por area de atuacao. Titulo da secao com accent lime italic.",
    exampleOutput: {
      title: "Nossas *solucoes* por area",
      subtitle: "Expertise em cada frente de atuacao",
      items: [
        {
          name: "Growth Marketing",
          description: "Estrategias de aquisicao, SEO, midia paga e automacao para gerar leads qualificados e escalar receita de forma previsivel.",
          image: "",
        },
        {
          name: "Gestao e Processos",
          description: "Mapeamento, otimizacao e automacao de processos internos para reduzir custos operacionais e aumentar produtividade.",
          image: "",
        },
        {
          name: "Transformacao Digital",
          description: "Implementacao de ferramentas, dashboards e cultura data-driven para tomada de decisao baseada em dados reais.",
          image: "",
        },
      ],
    },
  },

  // ─── [7] testimonials v1 (Testimonials Slider) ────────────────────
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent lime italic" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo curto sobre os depoimentos" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 5 },
        description: "Depoimentos de clientes com texto, nome e cargo",
        children: [
          { key: "text", type: "string", maxLength: 200, description: "Texto do depoimento — 2-3 frases sobre a experiencia e resultados" },
          { key: "author", type: "string", maxLength: 40, description: "Nome completo do cliente" },
          { key: "role", type: "string", maxLength: 50, description: "Cargo e empresa do cliente — ex: 'CEO, TechCorp'" },
        ],
      },
    ],
    imageQueryHint: "professional executive headshot portrait",
    imageSpec: {
      aspectRatio: "1:1",
      style: "professional headshot, corporate portrait, clean background",
      subject: "business professional executive portrait headshot",
      avoid: ["stock photo feel", "sunglasses", "group photo", "blurry", "casual"],
      count: 5,
    },
    contentGuidance:
      "Slider de depoimentos com texto em italico, aspas decorativas verdes, foto circular do cliente, nome bold Geist e cargo em texto muted. Cards com fundo surface claro, navegacao por setas ou dots. Titulo centralizado com accent lime italic.",
    exampleOutput: {
      title: "O que nossos *clientes* dizem",
      subtitle: "Depoimentos de quem confia em nos",
      items: [
        {
          text: "A consultoria foi um divisor de aguas para nossa empresa. Em 6 meses, triplicamos nossa geracao de leads e dobramos o faturamento mensal.",
          author: "Ricardo Almeida",
          role: "CEO, TechScale Startup",
        },
        {
          text: "Equipe extremamente profissional e comprometida com resultados. O plano estrategico que desenvolveram transformou nossa operacao de marketing.",
          author: "Fernanda Oliveira",
          role: "Diretora de Marketing, Grupo Viva",
        },
        {
          text: "Recomendo sem hesitacao. A abordagem data-driven e o acompanhamento proximo fizeram toda a diferenca no crescimento sustentavel do nosso negocio.",
          author: "Carlos Eduardo Santos",
          role: "Fundador, InnovaHub",
        },
        {
          text: "Contratamos para um projeto de transformacao digital e o resultado superou todas as expectativas. ROI positivo ja no segundo trimestre.",
          author: "Ana Beatriz Lima",
          role: "COO, LogisTech Solutions",
        },
      ],
    },
  },

  // ─── [8] footer v1 (Footer Dark Green) ────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", maxLength: 80, description: "Texto de copyright exibido na base do footer" },
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa ou consultoria no footer" },
    ],
    contentGuidance:
      "Footer verde escuro (#0E1201) com logo/nome a esquerda em Geist bold, formulario de newsletter, links de navegacao em colunas, icones de redes sociais e barra de copyright na base com texto muted claro. Accent lime em links hover e botao de newsletter.",
  },
];
