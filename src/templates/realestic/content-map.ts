import type { SectionContentMap } from "../types";

export const REALESTIC_CONTENT_MAP: SectionContentMap[] = [
  // ── 1. Header (Flat Nav) ──
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa exibido no header" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA pill accent (ex: 'Fale conosco')" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA (ex: '#contato')" },
    ],
    contentGuidance:
      "Header plano com logo/nome a esquerda, links de navegacao centrais e botao CTA pill na cor accent a direita. Estilo clean e moderno.",
  },

  // ── 2. Hero Centered ──
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 80, description: "Titulo principal grande centralizado. Use *asteriscos* para destacar 1 palavra na cor accent." },
      { key: "tagline", type: "string", maxLength: 30, description: "Texto do badge pill acima do titulo (ex: 'Imobiliaria', 'Arquitetura')" },
      { key: "subheadline", type: "string", maxLength: 160, description: "Subtitulo descritivo abaixo do H1 (opcional)" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA pill abaixo do titulo (opcional)" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
    ],
    contentGuidance:
      "Secao hero centralizada: badge pill colorido no topo, H1 grande (60px) com 1 palavra em accent, subtitulo e CTA opcacional. Abaixo, imagem de cover gigante com border-radius 38px. A imagem ocupa toda a largura e e o destaque visual principal.",
    imageSpec: {
      aspectRatio: "16:9",
      style: "cinematic professional real estate photography",
      subject: "Foto profissional de imovel, fachada moderna ou interior sofisticado",
      avoid: ["texto", "logos", "pessoas em primeiro plano"],
    },
    exampleOutput: {
      headline: "Encontre o imovel que combina com sua *vida*",
      tagline: "Imoveis",
      subheadline: "Seu novo lar esta mais perto do que imagina. Experiencia e dedicacao para encontrar o imovel perfeito.",
      ctaText: "Ver imoveis",
      ctaLink: "#imoveis",
    },
  },

  // ── 3. Vision Cards (services v1) ──
  {
    blockType: "services",
    variant: 1,
    iconOnly: true,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Nossa Missao', 'Diferenciais')" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao escuro abaixo do titulo" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Titulo do card" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao do card" },
          { key: "icon", type: "string", maxLength: 40, description: "Token de ícone Lucide (ex: 'lucide:Home', 'lucide:Shield'). NUNCA gere imagem aqui." },
        ],
        description: "Exatamente 3 cards com ÍCONE Lucide accent + titulo + descricao. NÃO usar imagem.",
      },
    ],
    contentGuidance:
      "Layout 2 colunas: esquerda tem tag com dot accent + H2 + botao escuro. Direita tem 3 cards horizontais (ÍCONE LUCIDE quadrado accent + titulo + descricao). Cada card representa um valor ou diferencial do negocio. Use token Lucide em `icon` (ex: 'lucide:Home', 'lucide:Star'). NÃO gerar imagem.",
    exampleOutput: {
      title: "Os valores que guiam tudo o que *fazemos*",
      subtitle: "Nossa Missao",
      ctaText: "Saiba mais",
      ctaLink: "#sobre",
      items: [
        { name: "Imovel dos Sonhos", description: "Descubra seu espaco ideal com nossas opcoes de imoveis selecionados.", icon: "lucide:Home" },
        { name: "Investimento Seguro", description: "Analise profissional para garantir o melhor retorno no seu investimento.", icon: "lucide:Shield" },
        { name: "Suporte Completo", description: "Acompanhamento em todas as etapas, da busca ate a assinatura.", icon: "lucide:LifeBuoy" },
      ],
    },
  },

  // ── 4. Property Grid (gallery v1) ──
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao de imoveis/portfolio. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Imoveis', 'Portfolio')" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao 'Ver todos'" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do botao" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 6 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome do imovel/projeto" },
          { key: "description", type: "string", maxLength: 60, description: "Endereco ou localizacao" },
          { key: "badge", type: "string", maxLength: 15, description: "Badge no card (ex: 'Disponivel', 'Vendido', 'Destaque')" },
          { key: "details", type: "string", maxLength: 40, description: "Detalhes separados por · (ex: '3 quartos · 2 banheiros · 120m²')" },
        ],
        description: "3 a 6 cards de imoveis/projetos em grid 3 colunas, cada um com imagem, badge, localizacao, nome e detalhes.",
      },
    ],
    contentGuidance:
      "Grid 3x de cards de imoveis/projetos. Cada card tem: imagem grande (320px) com badge accent, localizacao com pin, nome em destaque e detalhes (quartos, banheiros, area). O badge aparece sobre a imagem.",
    imageSpec: {
      aspectRatio: "4:3",
      style: "professional real estate interior or exterior photography",
      subject: "Foto de imovel, casa, apartamento ou espaco comercial",
      avoid: ["texto sobreposto", "logos", "pessoas"],
      count: 6,
    },
    exampleOutput: {
      title: "Encontre seu *imovel* ideal aqui",
      subtitle: "Imoveis",
      ctaText: "Ver todos",
      ctaLink: "#imoveis",
      items: [
        { name: "Residencia Jardim", description: "Rua das Flores, 123 - SP", badge: "Disponivel", details: "3 quartos · 2 banheiros · 180m²" },
        { name: "Apartamento Centro", description: "Av. Paulista, 456 - SP", badge: "Destaque", details: "2 quartos · 1 banheiro · 85m²" },
        { name: "Casa Alphaville", description: "Alameda Santos, 789 - SP", badge: "Disponivel", details: "4 quartos · 3 banheiros · 320m²" },
      ],
    },
  },

  // ── 5. Feature Grid (services v2) ──
  {
    blockType: "services",
    variant: 2,
    iconOnly: true,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo centralizado. Use *asteriscos* para accent." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 6 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Titulo da feature" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao da feature" },
          { key: "icon", type: "string", maxLength: 40, description: "Token de ícone no formato 'lucide:Nome' (ex: 'lucide:Star', 'lucide:Shield', 'lucide:Award'). Escolha 1 ícone Lucide adequado ao tema do item. NUNCA gere imagem aqui." },
        ],
        description: "3 a 6 features em grid 3 colunas. Cada item TEM ícone Lucide (campo `icon`), NUNCA imagem.",
      },
    ],
    contentGuidance:
      "Secao dentro de um card arredondado (bg surface, radius 34px). Header centralizado com tag + H2. Grid 3x2 de features, cada uma com ÍCONE LUCIDE em fundo accent-light + titulo + descricao. NÃO gerar imagem — usar token Lucide em `icon` (ex: 'lucide:Award', 'lucide:Shield').",
    exampleOutput: {
      title: "Descubra as vantagens e *beneficios* exclusivos",
      subtitle: "Diferenciais",
      items: [
        { name: "Orientacao Especializada", description: "Insights profissionais para decisoes imobiliarias com confianca.", icon: "lucide:Compass" },
        { name: "Busca Personalizada", description: "Encontramos imoveis que combinam com suas necessidades unicas.", icon: "lucide:Search" },
        { name: "Negociacao Eficiente", description: "Expertise em negociacao para garantir o melhor valor.", icon: "lucide:HandshakeIcon" },
        { name: "Documentacao Completa", description: "Assessoria juridica e documental em todas as etapas.", icon: "lucide:FileText" },
        { name: "Pos-Venda", description: "Suporte continuo mesmo apos a conclusao do negocio.", icon: "lucide:LifeBuoy" },
        { name: "Avaliacao Precisa", description: "Laudos e avaliacoes baseados em dados de mercado atualizados.", icon: "lucide:Ruler" },
      ],
    },
  },

  // ── 6. Quote Split (testimonials v1) ──
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Frase de introducao da citacao (ex: 'Na [Nome da Empresa],')" },
      {
        key: "items",
        type: "array",
        count: { min: 1, max: 1 },
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Texto da citacao/missao — paragrafo longo sobre a empresa" },
          { key: "author", type: "string", maxLength: 40, description: "Nome do autor ou fundador" },
          { key: "role", type: "string", maxLength: 40, description: "Cargo ou funcao" },
        ],
        description: "Exatamente 1 citacao com imagem, texto, autor e cargo.",
      },
    ],
    contentGuidance:
      "Layout 2 colunas: imagem portrait arredondada a esquerda, citacao a direita. A primeira frase do texto aparece em cor escura, o restante em cinza. Abaixo tem uma assinatura decorativa em accent. Use isso como missao/visao da empresa.",
    imageSpec: {
      aspectRatio: "3:4",
      style: "editorial portrait professional",
      subject: "Retrato profissional do fundador ou equipe em ambiente de trabalho",
      avoid: ["selfie", "casual", "fundo branco"],
    },
    exampleOutput: {
      title: "Na Sua Imobiliaria,",
      items: [
        {
          text: "nossa missao e simples: oferecer as melhores solucoes imobiliarias, sob medida para suas necessidades. Entendemos que encontrar o imovel perfeito e mais do que uma transacao — e sobre criar um espaco onde a vida acontece.",
          author: "Carlos Silva",
          role: "Fundador e CEO",
        },
      ],
    },
  },

  // ── 7. Accordion Split (faq v1) ──
  {
    blockType: "faq",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*. Ex: 'Descubra as *vantagens* e beneficios'" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Como funciona')" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 5 },
        children: [
          { key: "question", type: "string", maxLength: 60, description: "Pergunta ou titulo da etapa" },
          { key: "answer", type: "string", maxLength: 200, description: "Resposta ou descricao da etapa" },
        ],
        description: "3 a 5 perguntas/etapas em formato accordion. Primeiro aberto por padrao.",
      },
    ],
    contentGuidance:
      "Layout 2 colunas: accordion a esquerda com indicador de linha lateral (accent quando ativo), imagem a direita. Pode ser usado como FAQ ou como etapas do processo. O primeiro item comeca aberto.",
    imageSpec: {
      aspectRatio: "4:3",
      style: "professional real estate or business photography",
      subject: "Interior de escritorio moderno ou espaco de atendimento",
      avoid: ["texto", "logos"],
    },
    exampleOutput: {
      title: "Descubra as *vantagens* e beneficios exclusivos",
      subtitle: "Como funciona",
      items: [
        { question: "Encontre seu imovel ideal", answer: "Navegue por nosso catalogo completo, filtre por localizacao, preco e caracteristicas para encontrar o lar perfeito." },
        { question: "Agende uma visita", answer: "Marque um horario para visitar o imovel pessoalmente e conhecer cada detalhe do espaco." },
        { question: "Feche o negocio", answer: "Nossa equipe acompanha toda a documentacao e negociacao ate a entrega das chaves." },
      ],
    },
  },

  // ── 8. Why Us Overlay (about v1) ──
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Por que nos escolher')" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Titulo do item de checklist" },
          { key: "description", type: "string", maxLength: 100, description: "Descricao curta do item" },
        ],
        description: "Exatamente 3 items de checklist com icone tick + titulo + descricao, exibidos em card overlay sobre a imagem.",
      },
    ],
    contentGuidance:
      "Imagem full-width com card branco overlay no canto inferior direito (desktop). O card contem 3 itens de checklist com tick icon. Ideal para mostrar diferenciais da empresa.",
    imageSpec: {
      aspectRatio: "16:9",
      style: "cinematic wide real estate or office photography",
      subject: "Fachada de escritorio moderno, espaco de coworking ou imovel de alto padrao",
      avoid: ["pessoas em destaque", "texto"],
    },
    exampleOutput: {
      title: "O que nos torna o *parceiro* ideal para seu imovel?",
      subtitle: "Por que nos escolher",
      items: [
        { name: "Conhecimento Local", description: "Experiencia profunda e insights sobre o mercado da regiao." },
        { name: "Busca Personalizada", description: "Encontramos imoveis que combinam com suas necessidades unicas." },
        { name: "Suporte Completo", description: "Da busca ate a entrega das chaves, acompanhamos cada etapa." },
      ],
    },
  },

  // ── 9. Carousel Cards (testimonials v2) ──
  {
    blockType: "testimonials",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo centralizado com *accent*." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Depoimentos')" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        children: [
          { key: "text", type: "string", maxLength: 200, description: "Texto do depoimento" },
          { key: "author", type: "string", maxLength: 40, description: "Nome do cliente" },
          { key: "role", type: "string", maxLength: 40, description: "Cidade ou cargo (ex: 'Sao Paulo, SP')" },
          { key: "rating", type: "string", maxLength: 3, description: "Nota de 1 a 5" },
        ],
        description: "3 a 4 depoimentos em carousel horizontal. Cada um com avatar, texto, nome e localizacao.",
      },
    ],
    contentGuidance:
      "Carousel horizontal em card grande com bg escuro (var(--pgl-text)). Cada slide tem avatar circular (120px) + texto do depoimento em branco + nome e localizacao. Navegacao por setas e dots.",
    imageSpecs: {
      "items.*.image": {
        aspectRatio: "1:1",
        style: "headshot portrait professional",
        subject: "Retrato profissional de pessoa sorrindo",
        avoid: ["corpo inteiro", "fundo colorido"],
        count: 4,
      },
    },
    exampleOutput: {
      title: "Feedback real de clientes *satisfeitos*",
      subtitle: "Depoimentos",
      items: [
        { text: "A experiencia foi incrivel! Encontramos nosso apartamento dos sonhos em tempo recorde.", author: "Maria Santos", role: "Sao Paulo, SP", rating: "5" },
        { text: "Profissionalismo e atencao aos detalhes. Recomendo para todos que buscam um imovel.", author: "Joao Lima", role: "Rio de Janeiro, RJ", rating: "5" },
        { text: "Do inicio ao fim, tudo foi transparente e eficiente. Equipe nota 10!", author: "Ana Costa", role: "Belo Horizonte, MG", rating: "5" },
        { text: "Encontraram exatamente o que procuravamos. Atendimento personalizado e dedicado.", author: "Pedro Oliveira", role: "Curitiba, PR", rating: "5" },
      ],
    },
  },

  // ── 10. Blog Grid (stats v1) ──
  {
    blockType: "stats",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*." },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Blog')" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        children: [
          { key: "value", type: "string", maxLength: 60, description: "Titulo do artigo/dica" },
          { key: "label", type: "string", maxLength: 20, description: "Categoria (ex: 'Dicas', 'Mercado', 'Investimento')" },
        ],
        description: "3 cards de blog/dicas em grid 3 colunas com imagem, categoria badge e titulo.",
      },
    ],
    contentGuidance:
      "Grid 3x de cards de blog. Cada card tem imagem grande (aspect 1.36:1, radius 24px), badge de categoria pill em accent-light e titulo. Represente dicas, artigos ou novidades relevantes para o publico.",
    imageSpec: {
      aspectRatio: "4:3",
      style: "editorial lifestyle or real estate photography",
      subject: "Foto relacionada ao tema do artigo — imoveis, decoracao, investimento",
      avoid: ["texto", "logos"],
      count: 3,
    },
    exampleOutput: {
      title: "Dicas e novidades sobre o mercado *imobiliario*",
      subtitle: "Blog",
      items: [
        { value: "Guia completo para comprar seu primeiro imovel", label: "Dicas" },
        { value: "Como escolher o bairro ideal para morar", label: "Mercado" },
        { value: "Tendencias de decoracao para 2025", label: "Tendencias" },
      ],
    },
  },

  // ── 11. CTA Accent Card (cta v1) ──
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 70, description: "Titulo grande centralizado em branco" },
      { key: "subtitle", type: "string", maxLength: 40, description: "Subtitulo acima do titulo (ex: 'Quer agendar uma visita?')" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao branco" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
    ],
    contentGuidance:
      "Card grande com fundo na cor accent, texto branco centralizado. Subtitulo menor no topo, titulo grande (50px) e botao branco pill. Use como call-to-action final da pagina.",
    exampleOutput: {
      title: "Pronto para dar o proximo passo? Fale conosco.",
      subtitle: "Quer agendar uma visita?",
      ctaText: "Ver imoveis",
      ctaLink: "#imoveis",
    },
  },

  // ── 12. Grid Footer ──
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa" },
      { key: "tagline", type: "string", maxLength: 80, description: "Frase de impacto para o footer. Use *asteriscos* para accent." },
      { key: "copyrightText", type: "string", maxLength: 60, description: "Texto de copyright (ex: 'Copyright @2025')" },
    ],
    contentGuidance:
      "Footer 2 colunas: esquerda tem heading grande com tagline + icones sociais em bg accent-light. Direita tem 3 colunas de links de navegacao. Barra inferior com copyright e links rapidos.",
  },
];
