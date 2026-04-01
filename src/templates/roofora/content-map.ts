import type { SectionContentMap } from "../types";

export const ROOFORA_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da empresa exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botao CTA pill — telefone com DDD ou acao curta" },
      { key: "ctaLink", type: "string", description: "Link do CTA no formato tel:+55XXXXXXXXXXX ou ancora" },
    ],
    contentGuidance:
      "Header escuro (dark surface) com logo a esquerda, nav links centralizados e botao CTA pill accent lime a direita. Fundo quase preto com texto branco e hover lime.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 60, description: "Titulo principal bold — use *palavra* para accent lime green" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Paragrafo de apoio abaixo do titulo, descrevendo o servico" },
      { key: "badgeText", type: "string", maxLength: 50, description: "Texto do badge de destaque acima do titulo" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA primario pill lime" },
      { key: "secondaryCtaText", type: "string", maxLength: 25, description: "Texto do botao CTA secundario outline" },
      { key: "tagline", type: "string", maxLength: 40, description: "Frase curta de reforco exibida abaixo dos CTAs ou nos badges" },
    ],
    imageQueryHint: "roofing construction solar panels",
    contentGuidance:
      "Hero de impacto em fundo escuro. Titulo grande em branco com palavra-chave em accent lime (*destaque*). Dois CTAs: primario pill lime e secundario outline branco. Badge flutuante e feature badges abaixo do hero com icones e metricas.",
    exampleOutput: {
      headline: "Telhados que *protegem* o que importa",
      subheadline:
        "Instalacao, reforma e manutencao de telhados com garantia real. Equipe especializada e materiais de primeira linha.",
      badgeText: "Mais de 500 projetos entregues",
      ctaText: "Solicite um orcamento",
      secondaryCtaText: "Nossos projetos",
      tagline: "Referencia em coberturas na regiao",
    },
  },

  // ─── [2] about v1 (Split) ────────────────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase de 2-4 palavras acima do titulo" },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Paragrafos descritivos sobre a empresa, historia e diferenciais",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Paragrafo descritivo de 2-3 linhas" },
        ],
      },
      {
        key: "highlights",
        type: "array",
        count: { min: 3, max: 3 },
        description: "3 itens de feature list com titulo e descricao curta",
        children: [
          { key: "label", type: "string", maxLength: 30, description: "Titulo do diferencial — 2-3 palavras" },
          { key: "value", type: "string", maxLength: 200, description: "Descricao curta do diferencial" },
        ],
      },
    ],
    imageQueryHint: "construction workers building site",
    contentGuidance:
      "Secao sobre a empresa com layout split: imagem profissional a esquerda e texto a direita. Tag uppercase em lime, titulo bold com accent, paragrafos descritivos e feature list com icones lime e fundo de card escuro.",
    exampleOutput: {
      title: "Construindo com *excelencia* desde 2010",
      subtitle: "SOBRE NOS",
      paragraphs: [
        { text: "Somos uma empresa especializada em telhados, coberturas e solucoes para construcao civil. Combinamos experiencia tecnica com materiais de alta qualidade." },
        { text: "Nossa equipe atua em projetos residenciais e comerciais, sempre com compromisso de prazos e acabamento impecavel." },
        { text: "Cada projeto recebe atencao personalizada, do orcamento a entrega final, com acompanhamento tecnico dedicado." },
      ],
      highlights: [
        { label: "Equipe Certificada", value: "Profissionais com treinamento tecnico e certificacoes atualizadas" },
        { label: "Garantia Real", value: "Garantia por escrito em todos os servicos e materiais utilizados" },
        { label: "Orcamento Gratis", value: "Visita tecnica e orcamento detalhado sem compromisso" },
      ],
    },
  },

  // ─── [3] services v1 (Grid) ──────────────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Servicos oferecidos com nome, descricao e CTA",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do servico" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao do servico em 2-3 linhas" },
          { key: "ctaText", type: "string", maxLength: 15, description: "Texto do link de acao do card" },
        ],
      },
    ],
    imageQueryHint: "roofing repair solar installation",
    contentGuidance:
      "Grid de cards escuros com icone lime no topo, titulo bold em branco, descricao em cinza claro e link accent na base. Fundo da secao escuro. Cards com borda sutil e hover com elevacao.",
  },

  // ─── [4] stats v1 (Counter) ──────────────────────────────────────
  {
    blockType: "stats",
    variant: 1,
    fields: [
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 4 },
        description: "Exatamente 4 contadores com numero e descricao",
        children: [
          { key: "value", type: "string", maxLength: 10, description: "Numero com sufixo (ex: 500+, 99%, 15+, 24h)" },
          { key: "label", type: "string", maxLength: 40, description: "Descricao curta do contador" },
        ],
      },
    ],
    contentGuidance:
      "Faixa horizontal com 4 contadores animados. Numeros grandes em accent lime com sufixo, descricao em branco abaixo. Fundo escuro com separadores ou cards individuais.",
    exampleOutput: {
      items: [
        { value: "500+", label: "Projetos entregues com sucesso" },
        { value: "15+", label: "Anos de experiencia no mercado" },
        { value: "99%", label: "Clientes satisfeitos" },
        { value: "24h", label: "Resposta garantida" },
      ],
    },
  },

  // ─── [5] gallery v1 (Projects Grid) ──────────────────────────────
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase acima do titulo" },
      {
        key: "images",
        type: "array",
        count: { min: 5, max: 6 },
        description: "Imagens do portfolio de projetos",
        children: [
          { key: "url", type: "string", description: "URL da imagem — deixar vazio para preenchimento automatico" },
          { key: "caption", type: "string", maxLength: 30, description: "Legenda curta de 2-4 palavras" },
        ],
      },
    ],
    imageQueryHint: "roofing project completed house",
    contentGuidance:
      "Grid de imagens de projetos realizados. Cada imagem com overlay escuro no hover mostrando legenda. Cantos arredondados, fundo escuro da secao. Labels com tag lime para categoria do projeto.",
  },

  // ─── [6] services v2 (How It Works) ──────────────────────────────
  {
    blockType: "services",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Subtitulo descritivo abaixo do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Exatamente 3 passos do processo",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Titulo do passo" },
          { key: "description", type: "string", maxLength: 250, description: "Descricao do passo em 2-3 linhas" },
        ],
      },
    ],
    contentGuidance:
      "Secao 'Como Funciona' com 3 passos numerados (01, 02, 03). Cada passo em card escuro com numero grande em lime, titulo bold e descricao. Layout horizontal em desktop. CTA pill lime abaixo dos passos.",
  },

  // ─── [7] testimonials v1 (Reviews Dark) ──────────────────────────
  {
    blockType: "testimonials",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 50, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 30, description: "Tag uppercase acima do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Depoimentos de clientes",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Depoimento realista em 1a pessoa" },
          { key: "author", type: "string", maxLength: 30, description: "Nome brasileiro do cliente" },
          { key: "role", type: "string", maxLength: 30, description: "Profissao ou tipo de cliente (ex: Proprietario, Empresario)" },
          { key: "rating", type: "string", description: "Avaliacao em estrelas — sempre 5" },
        ],
      },
    ],
    imageQueryHint: "happy homeowner portrait",
    contentGuidance:
      "Carrossel de depoimentos sobre fundo escuro. Cards com 5 estrelas amarelas/lime, texto entre aspas, avatar, nome em bold e profissao. Cards com borda sutil e fundo surface escuro.",
    exampleOutput: {
      title: "O que nossos *clientes* dizem",
      subtitle: "DEPOIMENTOS",
      items: [
        { text: "Fizeram o telhado da minha casa em tempo recorde e com qualidade impecavel. Super recomendo!", author: "Carlos Mendes", role: "Proprietario", rating: "5" },
        { text: "Profissionais serios e competentes. O orcamento foi justo e cumpriram o prazo combinado.", author: "Ana Beatriz", role: "Empresaria", rating: "5" },
        { text: "Instalaram os paineis solares com toda a documentacao em dia. Economia real na conta de luz.", author: "Roberto Alves", role: "Engenheiro", rating: "5" },
        { text: "Reforma do telhado ficou perfeita. Equipe educada e deixaram tudo limpo no final.", author: "Mariana Costa", role: "Proprietaria", rating: "5" },
      ],
    },
  },

  // ─── [8] faq v1 (Accordion) ──────────────────────────────────────
  {
    blockType: "faq",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 80, description: "Subtitulo descritivo abaixo do titulo" },
      {
        key: "items",
        type: "array",
        count: { min: 5, max: 6 },
        description: "Perguntas e respostas frequentes",
        children: [
          { key: "question", type: "string", maxLength: 80, description: "Pergunta frequente do cliente" },
          { key: "answer", type: "string", maxLength: 400, description: "Resposta clara e completa" },
        ],
      },
    ],
    contentGuidance:
      "FAQ com accordion escuro. Titulo com accent lime, cada pergunta em row clicavel que expande para revelar resposta. Icone de seta/plus em lime. Fundo escuro com bordas sutis entre itens.",
  },

  // ─── [9] cta v1 (Newsletter CTA) ────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo do banner — use *destaque* para accent lime" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo abaixo do titulo" },
      { key: "ctaText", type: "string", maxLength: 30, description: "Texto do botao CTA pill lime" },
    ],
    contentGuidance:
      "Banner CTA com fundo escuro ou gradiente sutil. Titulo grande centralizado com accent lime, subtitulo em cinza claro e botao pill lime abaixo. Pode incluir campo de email para newsletter.",
  },

  // ─── [10] footer v1 ─────────────────────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", description: "Texto de copyright exibido na base" },
      { key: "storeName", type: "string", description: "Nome da empresa no footer" },
      { key: "phone", type: "string", description: "Telefone de contato com DDD" },
      { key: "email", type: "string", description: "Email de contato" },
      { key: "address", type: "string", description: "Endereco completo da empresa" },
    ],
    contentGuidance:
      "Footer escuro com 4 colunas: logo + descricao curta, links rapidos, servicos e contato (telefone, email, endereco). Icones de redes sociais em lime e barra de copyright na base com fundo mais escuro.",
  },
];
