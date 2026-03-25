export type BlockVariantMeta = {
  name: string;
  description: string;
  bestFor: string[];
};

export type BlockVariantMap = Record<number, BlockVariantMeta>;

export const BLOCK_VARIANTS: Record<string, BlockVariantMap> = {
  hero: {
    1: {
      name: "centered",
      description: "Fullscreen com imagem de fundo e texto alinhado à esquerda. Profissional e versátil.",
      bestFor: ["lava-car", "barbearia", "restaurante", "clinica", "oficina", "salao", "hotel", "academia"],
    },
    2: {
      name: "split-image",
      description: "Texto na esquerda, imagem na direita em grid. Bom quando tem fotos boas do negócio.",
      bestFor: ["restaurante", "salao", "barbearia", "floricultura", "pet-shop"],
    },
    3: {
      name: "video-background",
      description: "Vídeo de fundo com overlay escuro e texto. Impactante.",
      bestFor: ["academia", "acqua-parque", "evento"],
    },
    4: {
      name: "minimal-text",
      description: "Apenas texto, sem imagem. Elegante e limpo.",
      bestFor: ["consultoria", "advocacia", "saas", "contabilidade"],
    },
    5: {
      name: "gradient-bold",
      description: "Background com gradiente bold. Ideal para tech/startup.",
      bestFor: ["tech", "startup", "saas"],
    },
  },

  services: {
    1: {
      name: "clean-grid",
      description: "Grid 2x2 com hover escuro e numeração. Bom para 4+ serviços.",
      bestFor: ["clinica", "consultorio", "oficina", "lava-car", "academia", "salao"],
    },
    2: {
      name: "alternating",
      description: "Texto e imagem alternados esquerda/direita. Bom com fotos.",
      bestFor: ["restaurante", "salao", "hotel", "floricultura"],
    },
    3: {
      name: "list-with-prices",
      description: "Lista vertical com preço à direita. IDEAL para serviços com preço (barbearia, lava car, salão).",
      bestFor: ["barbearia", "salao", "estetica", "lava-car", "borracharia"],
    },
    4: {
      name: "accordion",
      description: "Acordeão expansível com detalhes por serviço.",
      bestFor: ["consultoria", "advocacia", "clinica"],
    },
  },

  about: {
    1: {
      name: "story-block",
      description: "Narrativa da história do negócio com imagem lateral.",
      bestFor: ["restaurante", "barbearia", "tradicional"],
    },
    2: {
      name: "mission-values",
      description: "Missão, visão e valores em cards separados.",
      bestFor: ["clinica", "consultoria", "empresa"],
    },
    3: {
      name: "timeline",
      description: "Linha do tempo com marcos importantes.",
      bestFor: ["empresa-antiga", "tradicional"],
    },
  },

  testimonials: {
    1: {
      name: "carousel",
      description: "Carrossel de depoimentos com navegação. Bom com muitos reviews.",
      bestFor: ["muitos-reviews"],
    },
    2: {
      name: "grid",
      description: "Grid de cards de depoimento estáticos.",
      bestFor: ["muitos-reviews"],
    },
    3: {
      name: "featured-quote",
      description: "Um depoimento em destaque grande + menores abaixo. Ideal com poucos reviews de qualidade.",
      bestFor: ["qualquer", "poucos-reviews", "lava-car", "barbearia", "salao", "clinica"],
    },
  },

  gallery: {
    1: {
      name: "masonry",
      description: "Layout masonry irregular com lightbox.",
      bestFor: ["restaurante", "salao", "hotel"],
    },
    2: {
      name: "grid-uniform",
      description: "Grid uniforme com hover reveal.",
      bestFor: ["oficina", "barbearia"],
    },
    3: {
      name: "carousel-full",
      description: "Carrossel fullwidth com thumbnails.",
      bestFor: ["acqua-parque", "evento"],
    },
    4: {
      name: "before-after",
      description: "Slider de antes/depois. Perfeito para transformações.",
      bestFor: ["salao", "estetica", "reforma"],
    },
  },

  faq: {
    1: {
      name: "accordion-simple",
      description: "Acordeão simples com toggle.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "two-columns",
      description: "Perguntas em duas colunas lado a lado.",
      bestFor: ["muitas-perguntas"],
    },
  },

  contact: {
    1: {
      name: "form-and-info",
      description: "Layout split: info de contato na esquerda, formulário na direita. Completo para negócios locais.",
      bestFor: ["qualquer", "lava-car", "barbearia", "salao", "clinica", "oficina"],
    },
    2: {
      name: "split-map",
      description: "Mapa grande + info de contato sobreposta. Bom para negócios com endereço fixo.",
      bestFor: ["negocio-fisico", "restaurante", "hotel"],
    },
    3: {
      name: "minimal-card",
      description: "Card centralizado com telefone, email e WhatsApp. Para negócios sem formulário.",
      bestFor: ["online", "servico-digital"],
    },
  },

  cta: {
    1: {
      name: "banner-simple",
      description: "Banner com fundo colorido, texto e botão.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "gradient-full",
      description: "Full-width com gradiente do primary ao secondary.",
      bestFor: ["bold", "academia"],
    },
    3: {
      name: "card-floating",
      description: "Card centralizado flutuando sobre background sutil.",
      bestFor: ["minimal", "elegant"],
    },
  },

  catalog: {
    1: {
      name: "category-grid",
      description: "Grid de categorias com imagem e nome.",
      bestFor: ["loja-roupas", "pet-shop"],
    },
    2: {
      name: "product-grid",
      description: "Grid de produtos com preço e CTA.",
      bestFor: ["floricultura", "artesanato"],
    },
    3: {
      name: "carousel-showcase",
      description: "Carrossel de produtos em destaque.",
      bestFor: ["loja-premium"],
    },
    4: {
      name: "list-categorized",
      description: "Lista agrupada por categoria com filtros.",
      bestFor: ["muitos-produtos"],
    },
    5: {
      name: "masonry-showcase",
      description: "Masonry com cards de tamanho variado e destaque para featured.",
      bestFor: ["loja-premium", "artesanato", "floricultura"],
    },
  },

  "featured-products": {
    1: {
      name: "horizontal-scroll",
      description: "Scroll horizontal com cards de produto.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "highlight-grid",
      description: "Grid 2x2 com badges de destaque.",
      bestFor: ["promocoes"],
    },
  },

  pricing: {
    1: {
      name: "cards-side-by-side",
      description: "Cards de plano lado a lado com destaque no recomendado.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "comparison-table",
      description: "Tabela comparativa com check/cross por feature.",
      bestFor: ["muitas-features"],
    },
    3: {
      name: "simple-list",
      description: "Lista simples com nome, preço e features.",
      bestFor: ["poucos-planos"],
    },
    4: {
      name: "toggle-cards",
      description: "Cards com toggle mensal/anual e animação de preço.",
      bestFor: ["saas", "academia", "coworking"],
    },
    5: {
      name: "feature-matrix",
      description: "Grid detalhado de features com check/x por plano.",
      bestFor: ["saas", "muitas-features"],
    },
  },

  menu: {
    1: {
      name: "categorized-list",
      description: "Lista por categoria com preço alinhado.",
      bestFor: ["restaurante-casual"],
    },
    2: {
      name: "cards-with-images",
      description: "Cards com foto do prato.",
      bestFor: ["restaurante-visual"],
    },
    3: {
      name: "tabs-by-category",
      description: "Tabs para navegar entre categorias.",
      bestFor: ["muitas-categorias"],
    },
  },

  team: {
    1: {
      name: "grid-cards",
      description: "Grid de cards com foto, nome e cargo.",
      bestFor: ["empresa-media"],
    },
    2: {
      name: "list-horizontal",
      description: "Lista horizontal com foto circular e info.",
      bestFor: ["equipe-pequena"],
    },
    3: {
      name: "featured-single",
      description: "Um membro destaque grande + demais menores.",
      bestFor: ["profissional-solo"],
    },
  },

  stats: {
    1: {
      name: "counters-row",
      description: "Números grandes em linha com animação de contagem.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "cards-with-icons",
      description: "Cards com ícone e número.",
      bestFor: ["mais-detalhado"],
    },
  },

  location: {
    1: {
      name: "map-full",
      description: "Mapa fullwidth com pin.",
      bestFor: ["negocio-fisico"],
    },
    2: {
      name: "map-and-directions",
      description: "Mapa + instruções de como chegar.",
      bestFor: ["local-dificil-de-achar"],
    },
  },

  hours: {
    1: {
      name: "table-simple",
      description: "Tabela simples com dias e horários.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "visual-timeline",
      description: "Barra visual mostrando horários abertos/fechados.",
      bestFor: ["visual"],
    },
  },

  "whatsapp-float": {
    1: {
      name: "circle-bottom-right",
      description: "Botão circular verde no canto inferior direito.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "pill-with-text",
      description: "Pill com 'Fale conosco' expandido.",
      bestFor: ["quer-mais-destaque"],
    },
  },

  header: {
    1: {
      name: "transparent",
      description: "Transparente sobre o hero, blur no scroll. Profissional.",
      bestFor: ["lava-car", "restaurante", "hotel", "academia"],
    },
    2: {
      name: "solid",
      description: "Fundo sólido primary. Presença forte.",
      bestFor: ["oficina", "borracharia", "seguranca"],
    },
    3: {
      name: "minimal",
      description: "Apenas logo + hamburger. Ultra-clean.",
      bestFor: ["fotografo", "salao", "spa", "minimal"],
    },
    4: {
      name: "centered",
      description: "Logo centralizada com nav abaixo. Elegante.",
      bestFor: ["salao", "floricultura", "hotel", "elegant"],
    },
    5: {
      name: "split",
      description: "Logo esquerda, nav centro, CTA direita. Equilibrado.",
      bestFor: ["clinica", "advocacia", "contabilidade"],
    },
  },

  footer: {
    1: {
      name: "columns",
      description: "3-4 colunas com brand, nav, contato. Clássico.",
      bestFor: ["qualquer"],
    },
    2: {
      name: "minimal",
      description: "Uma linha compacta com links inline.",
      bestFor: ["minimal", "fotografo"],
    },
    3: {
      name: "dark-premium",
      description: "Dark bg com dot pattern, social links, newsletter.",
      bestFor: ["industrial", "bold", "hotel"],
    },
    4: {
      name: "centered",
      description: "Tudo centralizado, compacto e limpo.",
      bestFor: ["elegant", "salao", "spa"],
    },
    5: {
      name: "split",
      description: "Brand esquerda, nav+contato direita.",
      bestFor: ["advocacia", "clinica", "consultoria"],
    },
  },
};
