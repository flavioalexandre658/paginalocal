import type { SectionContentMap } from "../types";

export const STRATEX_CONTENT_MAP: SectionContentMap[] = [
  // ── 1. Header ──
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do CTA pill (ex: 'Fale conosco')" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
    ],
    contentGuidance: "Nav serif com logo green square + links + CTA pill com arrow icon.",
  },

  // ── 2. Dark Hero ──
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 80, description: "Titulo grande serif. Use *asteriscos* para accent." },
      { key: "subheadline", type: "string", maxLength: 160, description: "Subtitulo descritivo" },
      { key: "tagline", type: "string", maxLength: 30, description: "Texto junto ao rating (ex: 'Avaliacao 4.9/5')" },
      { key: "ctaText", type: "string", maxLength: 25, description: "CTA primario" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link do CTA" },
    ],
    contentGuidance: "Hero ESCURO com bg accent. Stars + rating text no topo, H1 serif grande, subtitulo, 2 botoes. Imagem grande abaixo.",
    imageSpec: { aspectRatio: "16:9", style: "professional business consulting", subject: "Equipe em reuniao, escritorio moderno", avoid: ["texto", "logos"] },
    exampleOutput: {
      headline: "Consultoria especializada que impulsiona *resultados* reais",
      subheadline: "Eleve seu negocio com insights especializados, estrategias sob medida e suporte dedicado.",
      tagline: "Avaliacao 4.9/5",
      ctaText: "Fale conosco",
      ctaLink: "#contato",
    },
  },

  // ── 3. Partners Bar ──
  {
    blockType: "stats",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 40, description: "Titulo da barra (ex: 'Reconhecido por:', 'Parceiros:')" },
      { key: "items", type: "array", count: { min: 4, max: 6 }, children: [
        { key: "value", type: "string", maxLength: 30, description: "Nome da marca, certificacao ou parceiro (ex: 'OAB/SP', 'Google Partner', 'ISO 9001'). NAO gerar imagem — o texto e o elemento principal." },
        { key: "label", type: "string", maxLength: 20, description: "Tipo (ex: 'parceiro', 'certificacao')" },
      ], description: "Nomes de parceiros/certificacoes em marquee horizontal de TEXTO. O usuario pode adicionar icone opcionalmente no editor." },
    ],
    contentGuidance: "Barra horizontal de nomes de parceiros/certificacoes em scroll infinito. Renderiza como TEXTO (nao imagens). O usuario pode opcionalmente adicionar icone ao lado de cada nome no editor.",
  },

  // ── 4. Comparison Grid (Why Us) ──
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag da secao (ex: 'Por que nos escolher')" },
      { key: "items", type: "array", count: { min: 5, max: 5 }, children: [
        { key: "name", type: "string", maxLength: 40, description: "Vantagem da NOSSA empresa" },
        { key: "description", type: "string", maxLength: 100, description: "Descricao da vantagem" },
      ], description: "5 diferenciais da empresa (coluna verde, direita)" },
      { key: "paragraphs", type: "array", count: { min: 5, max: 5 }, children: [
        { key: "", type: "string", maxLength: 40, description: "Desvantagem do concorrente" },
      ], description: "5 itens de concorrentes (coluna branca, esquerda)" },
    ],
    contentGuidance: "Grid 2 colunas: esquerda 'Outras empresas' (branco) vs direita 'Nossa empresa' (verde accent). Cada lado com 5 checklist items.",
    exampleOutput: {
      title: "Consultoria especializada para o *sucesso* do seu negocio",
      subtitle: "Por que nos escolher",
      items: [
        { name: "Estrategias Personalizadas", description: "Solucoes sob medida para cada cliente" },
        { name: "Solucoes Escalaveis", description: "Crescimento sustentavel e planejado" },
        { name: "Inovacao Proativa", description: "Antecipamos tendencias do mercado" },
        { name: "Analise Aprofundada", description: "Dados e metricas para decisoes certeiras" },
        { name: "Metodologia Agil", description: "Processos flexiveis e eficientes" },
      ],
      paragraphs: ["Estrategias Genericas", "Escalabilidade Limitada", "Abordagem Reativa", "Relatorios Padrao", "Processos Rigidos"],
    },
  },

  // ── 5. Service Cards ──
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Servicos')" },
      { key: "items", type: "array", count: { min: 3, max: 5 }, children: [
        { key: "name", type: "string", maxLength: 40, description: "Nome do servico" },
        { key: "description", type: "string", maxLength: 120, description: "Descricao" },
      ], description: "Cards de servico com imagem bg + gradient overlay" },
    ],
    contentGuidance: "Slideshow de cards grandes com imagem de fundo + gradient escuro + texto branco na base.",
    imageSpec: { aspectRatio: "4:3", style: "professional business", subject: "Cenario de negocios relacionado ao servico", avoid: ["texto"], count: 5 },
  },

  // ── 6. Dark Testimonial Carousel ──
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag" },
      { key: "items", type: "array", count: { min: 3, max: 5 }, children: [
        { key: "text", type: "string", maxLength: 200, description: "Depoimento" },
        { key: "author", type: "string", maxLength: 40, description: "Nome" },
        { key: "role", type: "string", maxLength: 40, description: "Cargo" },
        { key: "rating", type: "string", maxLength: 3, description: "Nota 1-5" },
      ], description: "Depoimentos em carousel escuro" },
    ],
    contentGuidance: "Stars rating no topo + H2 + carousel de cards escuros com quote serif + avatar + nome/cargo.",
    imageSpecs: { "items.*.image": { aspectRatio: "1:1", style: "headshot portrait", subject: "Retrato profissional", avoid: ["casual"], count: 5 } },
    exampleOutput: {
      title: "O que nossos clientes dizem sobre a *experiencia* conosco",
      subtitle: "Depoimentos",
      items: [
        { text: "Revolucionaram nossa compreensao do cliente. Equipe excepcional!", author: "Maria Santos", role: "CEO, TechCorp", rating: "5" },
        { text: "Resultados impressionantes desde o primeiro mes. Estrategias que funcionam.", author: "Joao Lima", role: "Diretor, DataFlow", rating: "5" },
        { text: "Profissionalismo e dedicacao em cada etapa. Altamente recomendado.", author: "Ana Costa", role: "Fundadora, CloudBase", rating: "5" },
      ],
    },
  },

  // ── 7. Feature Grid (services v1) ──
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo centralizado com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Diferenciais')" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 6 },
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Titulo da feature" },
          { key: "description", type: "string", maxLength: 100, description: "Descricao curta centralizada" },
        ],
        description: "3 a 6 features em grid 3 colunas com icone accent square + titulo + descricao",
      },
    ],
    contentGuidance: "Grid 3x2 de features. Cada card: icone accent quadrado (radius 16px, shadow inset) + titulo centralizado + descricao muted centralizada. Foco em beneficios do servico.",
    exampleOutput: {
      title: "Beneficios que nos diferenciam das outras *empresas*",
      subtitle: "Diferenciais",
      items: [
        { name: "Consultorias Ilimitadas", description: "Agende quantas sessoes estrategicas forem necessarias para o seu negocio." },
        { name: "Solucoes Personalizadas", description: "Estrategias sob medida para seus objetivos unicos." },
        { name: "Insights Especializados", description: "Expertise do setor para decisoes fundamentadas." },
        { name: "Estrategias com Dados", description: "Decisoes seguras baseadas em pesquisa e analise." },
        { name: "Suporte Continuo", description: "Orientacao constante e recomendacoes atualizadas." },
        { name: "Execucao Impecavel", description: "Do planejamento a implementacao, garantimos processos fluidos." },
      ],
    },
  },

  // ── 8. Pricing ──
  {
    blockType: "pricing",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Precos')" },
      { key: "plans", type: "array", count: { min: 2, max: 3 }, children: [
        { key: "name", type: "string", maxLength: 20, description: "Nome do plano" },
        { key: "price", type: "string", maxLength: 15, description: "Preco (ex: 'R$299')" },
        { key: "period", type: "string", maxLength: 10, description: "/mes" },
        { key: "description", type: "string", maxLength: 80, description: "Descricao curta" },
        { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botao" },
        { key: "features", type: "array", count: { min: 3, max: 6 }, children: [
          { key: "", type: "string", maxLength: 40, description: "Feature" },
        ], description: "Lista de features com check" },
      ], description: "2-3 planos de preco" },
    ],
    contentGuidance: "2-3 cards de preco. Standard (outline) e Premium (filled green). Cada um com nome, preco grande serif, descricao, botao e lista de features com checkmarks.",
  },

  // ── 8. Numbered Steps (How it Works) ──
  {
    blockType: "services",
    variant: 3,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Como funciona')" },
      { key: "ctaText", type: "string", maxLength: 25, description: "CTA button" },
      { key: "ctaLink", type: "string", maxLength: 100, description: "Link" },
      { key: "items", type: "array", count: { min: 3, max: 3 }, children: [
        { key: "name", type: "string", maxLength: 40, description: "Titulo da etapa" },
        { key: "description", type: "string", maxLength: 120, description: "Descricao" },
      ], description: "3 etapas numeradas (01, 02, 03) com imagem + titulo + descricao" },
    ],
    contentGuidance: "3 steps numerados: imagem + numero grande (01/02/03) + titulo + descricao. CTA button junto ao header.",
    imageSpec: { aspectRatio: "4:3", style: "professional business", subject: "Processo de trabalho", avoid: ["texto"], count: 3 },
  },

  // ── 9. Impact Stats ──
  {
    blockType: "stats",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Impacto')" },
      { key: "items", type: "array", count: { min: 4, max: 4 }, children: [
        { key: "value", type: "string", maxLength: 10, description: "Numero grande (ex: '500+', '98%')" },
        { key: "label", type: "string", maxLength: 30, description: "Descricao do numero" },
      ], description: "4 stats em grid com numeros grandes" },
    ],
    contentGuidance: "Grid 2x2 ou 4-col com numeros grandes em accent + label descritivo abaixo.",
    exampleOutput: {
      title: "Resultados reais que geram impacto *duradouro*",
      subtitle: "Impacto",
      items: [
        { value: "500+", label: "Projetos Concluidos" },
        { value: "98%", label: "Clientes Satisfeitos" },
        { value: "15+", label: "Anos de Experiencia" },
        { value: "24/7", label: "Suporte Dedicado" },
      ],
    },
  },

  // ── 10. Team Carousel ──
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Nossa equipe')" },
      { key: "items", type: "array", count: { min: 3, max: 6 }, children: [
        { key: "name", type: "string", maxLength: 40, description: "Nome do membro" },
        { key: "description", type: "string", maxLength: 40, description: "Cargo" },
      ], description: "Membros da equipe com foto + nome + cargo" },
    ],
    contentGuidance: "Carousel horizontal de cards de equipe com foto grande + nome/cargo em overlay na base.",
    imageSpecs: { "items.*.image": { aspectRatio: "3:4", style: "professional headshot", subject: "Retrato profissional em escritorio", avoid: ["casual", "selfie"], count: 6 } },
  },

  // ── 11. FAQ Accordion ──
  {
    blockType: "faq",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo com *accent*" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'FAQ')" },
      { key: "items", type: "array", count: { min: 4, max: 6 }, children: [
        { key: "question", type: "string", maxLength: 80, description: "Pergunta" },
        { key: "answer", type: "string", maxLength: 250, description: "Resposta" },
      ], description: "Perguntas frequentes em accordion" },
    ],
    contentGuidance: "Accordion simples full-width. Primeiro item aberto. Chevron rotaciona ao abrir.",
  },

  // ── 12. Contact Form ──
  {
    blockType: "contact",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo (branco sobre fundo escuro)" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag (ex: 'Fale conosco')" },
    ],
    contentGuidance: "Secao ESCURA (bg accent) com form de contato: nome, email, mensagem. Botao branco 'Enviar mensagem'.",
  },

  // ── 13. Footer ──
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa" },
      { key: "tagline", type: "string", maxLength: 80, description: "Descricao curta" },
      { key: "copyrightText", type: "string", maxLength: 60, description: "Texto de copyright" },
    ],
    contentGuidance: "Footer 4 colunas: brand (logo+tagline+social) + 3 colunas de links + bottom bar copyright.",
  },
];
