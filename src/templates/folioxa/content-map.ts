import type { SectionContentMap } from "../types";

export const FOLIOXA_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome do profissional ou estudio exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — acao curta de contato" },
    ],
    contentGuidance:
      "Header escuro sticky com logo a esquerda, nav links centralizados e botao CTA pill laranja a direita. Fundo dark (#212121) com tipografia Outfit bold e hover accent orange.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 70, description: "Titulo principal — use *palavra* para accent orange" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Paragrafo de apoio descrevendo o profissional e seus diferenciais" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA primario — ex: 'Ver projetos'" },
      { key: "secondaryCtaText", type: "string", maxLength: 25, description: "Texto do botao CTA secundario — ex: 'Fale comigo'" },
      { key: "tagline", type: "string", maxLength: 50, description: "Tagline curta acima do titulo — ex: 'Designer & Developer'" },
      {
        key: "brands",
        type: "array",
        count: { min: 3, max: 6 },
        description: "Tech stack ou ferramentas que o profissional domina",
        children: [
          { key: "name", type: "string", maxLength: 20, description: "Nome da tecnologia ou ferramenta (ex: 'Figma', 'React', 'After Effects')" },
        ],
      },
    ],
    imageQueryHint: "creative designer workspace",
    imageSpec: {
      aspectRatio: "1:1",
      style: "professional portrait photo, creative workspace, moody lighting",
      subject: "creative professional at workspace with design tools and monitors",
      avoid: ["stock photo feel", "clipart", "text overlays", "watermarks", "blurry"],
    },
    contentGuidance:
      "Hero com tagline pequena acima, titulo grande bold com palavra-chave em accent orange (*destaque*), subtitulo descritivo, dois CTAs (primario orange, secundario outline) e lista de tech stack com icones abaixo. Foto circular ou arredondada do profissional a direita.",
    exampleOutput: {
      headline: "Transformo ideias em *experiencias* digitais memoraveis",
      subheadline:
        "Designer e desenvolvedor full-stack com 8+ anos criando interfaces, marcas e produtos digitais que conectam pessoas e geram resultados.",
      ctaText: "Ver projetos",
      secondaryCtaText: "Fale comigo",
      tagline: "Designer & Developer",
      brands: [
        { name: "Figma" },
        { name: "React" },
        { name: "Next.js" },
        { name: "TypeScript" },
        { name: "Framer Motion" },
      ],
    },
  },

  // ─── [2] gallery v1 (Projects Grid) ──────────────────────────────
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre o portfolio" },
      {
        key: "images",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Projetos em destaque com imagem e nome do projeto como caption",
        children: [
          { key: "url", type: "string", description: "URL da imagem do projeto" },
          { key: "caption", type: "string", maxLength: 60, description: "Nome do projeto — curto e descritivo" },
        ],
      },
    ],
    imageQueryHint: "creative design project mockup",
    imageSpec: {
      aspectRatio: "16:9",
      style: "design project mockup, clean presentation, dark background",
      subject: "creative design project mockup showing website or app interface",
      avoid: ["stock photo feel", "low quality", "text overlays", "watermarks"],
      count: 6,
    },
    contentGuidance:
      "Grid de cards de projetos com imagem grande arredondada, nome do projeto como caption bold e tags de categoria/ano. Cards com fundo surface, hover com leve zoom e overlay orange. Titulo centralizado com accent orange e subtitulo muted.",
  },

  // ─── [3] about v1 (About Split) ──────────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase de 2-4 palavras acima do titulo" },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 2, max: 3 },
        description: "Paragrafos descritivos sobre o profissional, sua trajetoria e filosofia",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Paragrafo descritivo de 2-3 linhas" },
        ],
      },
      {
        key: "highlights",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Estatisticas ou metricas do profissional",
        children: [
          { key: "label", type: "string", maxLength: 30, description: "Descricao da metrica — ex: 'Anos de experiencia'" },
          { key: "value", type: "string", maxLength: 10, description: "Valor numerico da metrica — ex: '8+'" },
        ],
      },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA (ex: 'Baixar CV')" },
    ],
    imageQueryHint: "creative professional portrait",
    imageSpec: {
      aspectRatio: "3:4",
      style: "professional portrait photo, creative environment, natural lighting",
      subject: "creative professional portrait in studio or workspace setting",
      avoid: ["posed group photo", "generic office", "stock feel"],
    },
    contentGuidance:
      "Secao about com layout split: foto arredondada do profissional a esquerda e texto a direita. Tag uppercase em orange, titulo bold Outfit com accent, paragrafos descritivos da trajetoria e grid de metricas (anos, projetos, clientes) com numeros grandes em accent.",
  },

  // ─── [4] services v1 (Process Steps) ─────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre o processo de trabalho" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Etapas do processo criativo — nome e descricao do passo",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome da etapa — ex: 'Descoberta', 'Design', 'Entrega'" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao da etapa em 2-3 linhas" },
        ],
      },
    ],
    contentGuidance:
      "3 passos numerados do processo criativo com numero grande em accent orange, titulo bold e descricao muted. Layout horizontal com dividers ou timeline. Fundo surface claro com titulo centralizado.",
  },

  // ─── [5] services v2 (Services Cards) ─────────────────────────────
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre os servicos oferecidos" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Servicos oferecidos com nome, descricao e CTA",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do servico — ex: 'Web Design', 'Branding'" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao do servico em 2-3 linhas" },
          { key: "ctaText", type: "string", maxLength: 20, description: "Texto do link CTA do card — ex: 'Saiba mais'" },
        ],
      },
    ],
    contentGuidance:
      "Grid de cards de servicos com icone orange no topo, titulo bold, descricao muted e link CTA orange na base. Cards com fundo surface, cantos arredondados lg, hover com borda accent. Titulo centralizado com accent e subtitulo.",
  },

  // ─── [6] stats v1 (Awards) ────────────────────────────────────────
  {
    blockType: "stats",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao de premios e reconhecimentos" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Premios ou reconhecimentos do profissional",
        children: [
          { key: "value", type: "string", maxLength: 40, description: "Nome do premio — ex: 'Awwwards SOTD', 'CSS Design Awards'" },
          { key: "label", type: "string", maxLength: 20, description: "Ano do premio — ex: '2024', '2023'" },
        ],
      },
    ],
    contentGuidance:
      "Lista ou grid horizontal de premios e reconhecimentos com badge/icone, nome do premio em bold e ano em texto muted. Fundo dark com texto claro e badges dourados/orange para destaque.",
  },

  // ─── [7] services v3 (How It Works) ──────────────────────────────
  {
    blockType: "services",
    variant: 3,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre como funciona o trabalho" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Passos detalhados do fluxo de trabalho com descricao",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do passo — ex: 'Briefing', 'Prototipo', 'Lancamento'" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao detalhada do passo" },
        ],
      },
    ],
    imageQueryHint: "design process illustration",
    imageSpec: {
      aspectRatio: "16:9",
      style: "clean illustration, design process, modern flat style",
      subject: "design process workflow illustration with stages and arrows",
      avoid: ["stock photo feel", "clipart", "text overlays"],
    },
    contentGuidance:
      "3 passos detalhados do fluxo de trabalho com layout alternado (imagem esquerda/direita). Numero grande em accent, titulo bold e descricao detalhada. Imagens ilustrativas de cada etapa. Fundo surface claro.",
  },

  // ─── [8] pricing v1 ──────────────────────────────────────────────
  {
    blockType: "pricing",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre os planos" },
      {
        key: "plans",
        type: "array",
        count: { min: 2, max: 3 },
        description: "Planos de servico com nome, preco, descricao, features e CTA",
        children: [
          { key: "name", type: "string", maxLength: 25, description: "Nome do plano — ex: 'Starter', 'Pro', 'Enterprise'" },
          { key: "price", type: "string", maxLength: 20, description: "Preco formatado — ex: 'R$ 2.500', 'Sob consulta'" },
          { key: "description", type: "string", maxLength: 100, description: "Descricao curta do que esta incluso no plano" },
          {
            key: "features",
            type: "array",
            count: { min: 4, max: 6 },
            description: "Lista de features incluidas no plano",
            children: [
              { key: "text", type: "string", maxLength: 50, description: "Feature do plano — ex: 'Design de ate 5 paginas'" },
            ],
          },
          { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botao CTA do plano — ex: 'Comecar'" },
          { key: "highlighted", type: "string", maxLength: 5, description: "'true' para destacar plano recomendado, 'false' para os demais" },
        ],
      },
    ],
    contentGuidance:
      "Cards de pricing lado a lado com nome, preco grande bold, descricao, lista de features com checkmarks e botao CTA. Card destacado com borda accent orange e badge 'Popular'. Fundo surface claro, cantos arredondados lg.",
    exampleOutput: {
      title: "Planos sob *medida*",
      subtitle: "Escolha o pacote ideal para o seu projeto",
      plans: [
        {
          name: "Starter",
          price: "R$ 2.500",
          description: "Ideal para landing pages e projetos menores",
          features: [
            { text: "Design de ate 5 paginas" },
            { text: "Responsivo mobile" },
            { text: "SEO basico" },
            { text: "1 rodada de revisao" },
          ],
          ctaText: "Comecar",
          highlighted: "false",
        },
        {
          name: "Pro",
          price: "R$ 5.900",
          description: "Para sites completos com funcionalidades avancadas",
          features: [
            { text: "Design de ate 15 paginas" },
            { text: "Animacoes customizadas" },
            { text: "SEO avancado" },
            { text: "CMS integrado" },
            { text: "3 rodadas de revisao" },
          ],
          ctaText: "Escolher Pro",
          highlighted: "true",
        },
        {
          name: "Enterprise",
          price: "Sob consulta",
          description: "Projetos complexos e aplicacoes web sob medida",
          features: [
            { text: "Paginas ilimitadas" },
            { text: "App web customizado" },
            { text: "Integracao com APIs" },
            { text: "Design system completo" },
            { text: "Suporte prioritario" },
            { text: "Revisoes ilimitadas" },
          ],
          ctaText: "Fale comigo",
          highlighted: "false",
        },
      ],
    },
  },

  // ─── [9] testimonials v1 ─────────────────────────────────────────
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre depoimentos" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Depoimentos de clientes com texto, nome, cargo e nota",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Texto do depoimento — 2-4 frases sobre a experiencia" },
          { key: "author", type: "string", maxLength: 40, description: "Nome completo do cliente" },
          { key: "role", type: "string", maxLength: 50, description: "Cargo e empresa do cliente — ex: 'CEO, Startup XYZ'" },
          { key: "rating", type: "string", maxLength: 1, description: "Nota de 1 a 5 — sempre '5' para depoimentos positivos" },
        ],
      },
    ],
    imageQueryHint: "happy client portrait professional",
    imageSpec: {
      aspectRatio: "1:1",
      style: "professional headshot, natural lighting, friendly expression",
      subject: "happy professional person portrait headshot",
      avoid: ["stock photo feel", "sunglasses", "group photo", "blurry"],
      count: 6,
    },
    contentGuidance:
      "Cards de depoimento com rating stars amarelas no topo, texto em italico, foto circular do cliente, nome bold e cargo em texto muted. Cards com fundo surface, cantos arredondados lg. Titulo centralizado com accent orange.",
    exampleOutput: {
      title: "O que meus *clientes* dizem",
      subtitle: "Feedback real de quem ja trabalhou comigo",
      items: [
        {
          text: "Superou todas as expectativas. O site ficou incrivel e os resultados em conversao aumentaram 40% no primeiro mes.",
          author: "Mariana Costa",
          role: "CEO, NovaTech Startup",
          rating: "5",
        },
        {
          text: "Profissional excepcional. Entendeu perfeitamente a identidade da nossa marca e entregou um design que realmente nos representa.",
          author: "Rafael Mendes",
          role: "Diretor Criativo, Agencia Lumina",
          rating: "5",
        },
        {
          text: "Trabalho impecavel do briefing a entrega. Comunicacao clara, prazos cumpridos e resultado final acima do esperado.",
          author: "Camila Ferreira",
          role: "Fundadora, Studio Bloom",
          rating: "5",
        },
        {
          text: "Recomendo de olhos fechados. O redesign do nosso produto digital aumentou o engajamento dos usuarios em 60%.",
          author: "Lucas Andrade",
          role: "Product Manager, FinApp",
          rating: "5",
        },
      ],
    },
  },

  // ─── [10] faq v1 ─────────────────────────────────────────────────
  {
    blockType: "faq",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre perguntas frequentes" },
      {
        key: "items",
        type: "array",
        count: { min: 5, max: 6 },
        description: "Perguntas e respostas frequentes sobre os servicos",
        children: [
          { key: "question", type: "string", maxLength: 80, description: "Pergunta frequente do cliente" },
          { key: "answer", type: "string", maxLength: 300, description: "Resposta clara e objetiva em 2-4 frases" },
        ],
      },
    ],
    contentGuidance:
      "FAQ com accordion — pergunta bold clicavel que expande para revelar a resposta. Icone de seta/plus que rotaciona ao abrir. Fundo surface claro com dividers sutis entre items. Titulo centralizado com accent orange.",
  },

  // ─── [11] cta v1 ─────────────────────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo do CTA — use *palavra* para accent orange" },
      { key: "subtitle", type: "string", maxLength: 150, description: "Subtitulo motivacional convidando a entrar em contato" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — ex: 'Iniciar projeto'" },
    ],
    contentGuidance:
      "Secao CTA sobre fundo dark com titulo grande bold com accent orange, subtitulo em texto claro e botao CTA pill laranja centralizado. Efeito de glow ou gradient sutil no fundo.",
  },

  // ─── [12] footer v1 ──────────────────────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", description: "Texto de copyright exibido na base" },
      { key: "storeName", type: "string", description: "Nome do profissional ou estudio no footer" },
    ],
    contentGuidance:
      "Footer minimalista com logo/nome a esquerda, links de navegacao centralizados, icones de redes sociais e barra de copyright na base. Fundo dark com texto muted claro e tipografia Outfit.",
  },
];
