import type { SectionContentMap } from "../types";

export const BELLEZZA_CONTENT_MAP: SectionContentMap[] = [
  // ─── [0] header v1 ────────────────────────────────────────────────
  {
    blockType: "header",
    variant: 1,
    fields: [
      { key: "storeName", type: "string", maxLength: 30, description: "Nome da loja exibido como logo texto" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA — acao de compra curta" },
    ],
    contentGuidance:
      "Header elegante com logo a esquerda, nav links centralizados, icones de busca e carrinho e botao CTA rose gold a direita. Fundo branco ou transparente com tipografia serif refinada.",
  },

  // ─── [1] hero v1 ──────────────────────────────────────────────────
  {
    blockType: "hero",
    variant: 1,
    fields: [
      { key: "headline", type: "string", maxLength: 60, description: "Titulo principal — use *palavra* para accent rose gold" },
      { key: "subheadline", type: "string", maxLength: 200, description: "Paragrafo de apoio descrevendo a marca e seus diferenciais" },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA primario — ex: 'Compre agora'" },
      {
        key: "brands",
        type: "array",
        count: { min: 3, max: 5 },
        description: "Estatisticas ou selos de confianca exibidos abaixo do hero",
        children: [
          { key: "name", type: "string", maxLength: 20, description: "Metrica ou selo (ex: '500+ Produtos', 'Frete Gratis')" },
        ],
      },
    ],
    imageQueryHint: "luxury beauty cosmetics products",
    imageSpec: {
      aspectRatio: "4:3",
      style: "editorial beauty photo, soft lighting, pastel tones",
      subject: "luxury beauty cosmetics products arranged elegantly on marble surface",
      avoid: ["stock photo feel", "clipart", "text overlays", "watermarks", "blurry"],
    },
    contentGuidance:
      "Hero com titulo grande serif a esquerda e imagem arredondada de produtos a direita. Titulo em dark com palavra-chave em accent rose gold (*destaque*). CTA 'Compre agora' em botao rose gold. Stats/badges flutuantes abaixo com numeros de confianca.",
    exampleOutput: {
      headline: "Descubra a *beleza* que voce merece",
      subheadline:
        "Cosmeticos premium selecionados para realcar sua beleza natural. Formulas veganas, cruelty-free e com ingredientes botanicos de alta performance.",
      ctaText: "Compre agora",
      brands: [
        { name: "500+ Produtos" },
        { name: "Cruelty-Free" },
        { name: "Frete Gratis" },
        { name: "4.9 Avaliacoes" },
      ],
    },
  },

  // ─── [2] about v1 ─────────────────────────────────────────────────
  {
    blockType: "about",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent rose gold" },
      { key: "subtitle", type: "string", maxLength: 50, description: "Tag uppercase de 2-4 palavras acima do titulo" },
      {
        key: "paragraphs",
        type: "array",
        count: { min: 2, max: 3 },
        description: "Paragrafos descritivos sobre a marca, historia e missao",
        children: [
          { key: "text", type: "string", maxLength: 300, description: "Paragrafo descritivo de 2-3 linhas" },
        ],
      },
      {
        key: "highlights",
        type: "array",
        count: { min: 3, max: 3 },
        description: "3 diferenciais ou features da marca",
        children: [
          { key: "label", type: "string", maxLength: 30, description: "Titulo do diferencial — 2-3 palavras" },
          { key: "value", type: "string", maxLength: 200, description: "Descricao curta do diferencial" },
        ],
      },
      { key: "ctaText", type: "string", maxLength: 25, description: "Texto do botao CTA (ex: 'Conheca nossa historia')" },
    ],
    imageQueryHint: "beauty product showcase elegant",
    imageSpec: {
      aspectRatio: "4:3",
      style: "editorial beauty photo, natural lighting, warm tones",
      subject: "beauty product showcase with flowers and natural ingredients on elegant surface",
      avoid: ["posed group photo", "generic office", "stock feel"],
    },
    contentGuidance:
      "Secao sobre a marca com layout split: imagem editorial a esquerda e texto a direita. Tag uppercase em rose gold, titulo bold serif com accent, paragrafos descritivos e highlights com icones ou numeros sobre diferenciais da marca.",
  },

  // ─── [3] catalog v1 ───────────────────────────────────────────────
  {
    blockType: "catalog",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao de categorias" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre as categorias" },
      {
        key: "categories",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Categorias de produtos com nome, descricao e imagem",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome da categoria (ex: Skincare, Maquiagem)" },
          { key: "description", type: "string", maxLength: 100, description: "Descricao curta da categoria" },
          { key: "image", type: "string", description: "URL da imagem da categoria" },
        ],
      },
    ],
    imageQueryHint: "skincare product category",
    imageSpec: {
      aspectRatio: "3:4",
      style: "clean product photography, pastel background, soft shadows",
      subject: "beauty product category display with elegant packaging",
      avoid: ["cluttered", "low quality", "text overlays"],
      count: 6,
    },
    contentGuidance:
      "Grid de cards de categorias com imagens arredondadas, nome em serif bold e descricao curta. Cards com fundo surface, hover com leve zoom na imagem. Titulo centralizado com subtitulo.",
    exampleOutput: {
      title: "Nossas Categorias",
      subtitle: "Encontre o produto perfeito para sua rotina de beleza",
      categories: [
        { name: "Skincare", description: "Cuidados diarios para uma pele radiante", image: "" },
        { name: "Maquiagem", description: "Cores e texturas para todas as ocasioes", image: "" },
        { name: "Cabelos", description: "Tratamentos e finalizadores profissionais", image: "" },
        { name: "Perfumaria", description: "Fragancias exclusivas e sofisticadas", image: "" },
        { name: "Corpo & Banho", description: "Hidratacao e cuidados corporais completos", image: "" },
      ],
    },
  },

  // ─── [4] featured-products v1 (Bestsellers) ──────────────────────
  {
    blockType: "featured-products",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent rose gold" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre os produtos em destaque" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 6 },
        description: "Produtos em destaque com nome, descricao, preco e imagem",
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome do produto" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao curta do produto" },
          { key: "price", type: "string", maxLength: 15, description: "Preco formatado (ex: R$ 89,90)" },
          { key: "image", type: "string", description: "URL da imagem do produto" },
        ],
      },
    ],
    imageQueryHint: "beauty skincare product bottle",
    imageSpec: {
      aspectRatio: "3:4",
      style: "clean product photography, soft shadows, neutral background",
      subject: "beauty skincare product bottle or jar on elegant surface",
      avoid: ["cluttered", "low quality", "text overlays", "multiple products"],
      count: 6,
    },
    contentGuidance:
      "Grid de cards de produtos bestsellers com imagem, nome serif bold, descricao curta e preco em accent rose gold. Cards com fundo surface, cantos arredondados lg, hover com elevacao. Titulo centralizado com accent e subtitulo.",
    exampleOutput: {
      title: "Mais *vendidos*",
      subtitle: "Os queridinhos das nossas clientes",
      items: [
        { name: "Serum Vitamina C", description: "Iluminador facial com acido hialuronico", price: "R$ 129,90", image: "" },
        { name: "Creme Hidratante Noturno", description: "Regeneracao celular enquanto voce dorme", price: "R$ 89,90", image: "" },
        { name: "Agua Micelar Rosas", description: "Limpeza suave com extrato de rosas", price: "R$ 49,90", image: "" },
        { name: "Protetor Solar FPS 50", description: "Protecao diaria com toque seco", price: "R$ 69,90", image: "" },
      ],
    },
  },

  // ─── [5] services v1 (Benefits) ───────────────────────────────────
  {
    blockType: "services",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent rose gold" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre os beneficios da marca" },
      {
        key: "items",
        type: "array",
        count: { min: 3, max: 4 },
        description: "Beneficios ou diferenciais com nome e descricao",
        children: [
          { key: "name", type: "string", maxLength: 30, description: "Nome do beneficio (ex: 100% Vegano)" },
          { key: "description", type: "string", maxLength: 200, description: "Descricao do beneficio em 2-3 linhas" },
        ],
      },
    ],
    contentGuidance:
      "Grid de cards de beneficios com icone rose gold no topo, titulo bold, descricao em texto muted. Cards com fundo surface, cantos arredondados lg. Titulo centralizado com accent e subtitulo. Ideal para diferenciais como vegano, cruelty-free, ingredientes naturais.",
  },

  // ─── [6] featured-products v2 (Product List) ─────────────────────
  {
    blockType: "featured-products",
    variant: 2,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao de todos os produtos" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo" },
      {
        key: "items",
        type: "array",
        count: { min: 4, max: 8 },
        description: "Lista completa de produtos com nome, descricao, preco e imagem",
        children: [
          { key: "name", type: "string", maxLength: 40, description: "Nome do produto" },
          { key: "description", type: "string", maxLength: 120, description: "Descricao curta do produto" },
          { key: "price", type: "string", maxLength: 15, description: "Preco formatado (ex: R$ 89,90)" },
          { key: "image", type: "string", description: "URL da imagem do produto" },
        ],
      },
    ],
    imageQueryHint: "beauty skincare product bottle",
    imageSpec: {
      aspectRatio: "3:4",
      style: "clean product photography, soft shadows, neutral background",
      subject: "beauty skincare product bottle or jar on elegant surface",
      avoid: ["cluttered", "low quality", "text overlays", "multiple products"],
      count: 8,
    },
    contentGuidance:
      "Grid maior de cards de produtos com imagem, nome, descricao e preco. Mesma estetica da secao bestsellers mas exibindo catalogo completo. Cards com fundo surface, cantos arredondados lg e botao 'Adicionar' sutil.",
  },

  // ─── [7] gallery v1 (Blog) ────────────────────────────────────────
  {
    blockType: "gallery",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao — use *destaque* para accent rose gold" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo descritivo sobre o blog" },
      {
        key: "images",
        type: "array",
        count: { min: 3, max: 3 },
        description: "Artigos do blog com imagem e titulo como caption",
        children: [
          { key: "url", type: "string", description: "URL da imagem do artigo" },
          { key: "caption", type: "string", maxLength: 80, description: "Titulo do artigo do blog" },
        ],
      },
    ],
    imageQueryHint: "beauty blog skincare tips",
    imageSpec: {
      aspectRatio: "16:9",
      style: "editorial beauty photo, bright natural lighting, lifestyle",
      subject: "beauty skincare routine, self-care, wellness lifestyle",
      avoid: ["text overlays", "watermarks", "low quality", "stock feel"],
      count: 3,
    },
    contentGuidance:
      "Grid de 3 cards de artigos do blog com imagem grande arredondada no topo, titulo serif bold como caption e data/tag em texto muted. Cards com fundo surface e hover com elevacao. Titulo centralizado com accent rose gold.",
  },

  // ─── [8] cta v1 (Instagram) ───────────────────────────────────────
  {
    blockType: "cta",
    variant: 1,
    fields: [
      { key: "title", type: "string", maxLength: 60, description: "Titulo da secao Instagram" },
      { key: "subtitle", type: "string", maxLength: 120, description: "Subtitulo convidando a seguir no Instagram" },
      { key: "ctaText", type: "string", maxLength: 20, description: "Texto do botao CTA — ex: 'Siga-nos'" },
    ],
    contentGuidance:
      "Secao Instagram com grid de fotos quadradas do feed, titulo centralizado com handle @loja, subtitulo convidando a seguir e botao 'Siga-nos' rose gold. Fotos com hover com overlay e icone do Instagram.",
  },

  // ─── [9] footer v1 ────────────────────────────────────────────────
  {
    blockType: "footer",
    variant: 1,
    fields: [
      { key: "copyrightText", type: "string", description: "Texto de copyright exibido na base" },
      { key: "storeName", type: "string", description: "Nome da loja no footer" },
      { key: "phone", type: "string", description: "Telefone de contato com DDD" },
      { key: "email", type: "string", description: "Email de contato" },
      { key: "address", type: "string", description: "Endereco completo da loja" },
    ],
    contentGuidance:
      "Footer elegante com newsletter subscribe no topo, logo + descricao, links rapidos organizados em colunas, contato (telefone, email, endereco), icones de redes sociais em rose gold e barra de copyright na base. Fundo surface com texto muted e tipografia serif para titulos.",
  },
];
