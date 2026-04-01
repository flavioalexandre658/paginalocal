import type { TemplateConfig } from "@/templates/types";

export const GROVIA_CONFIG: TemplateConfig = {
  id: "aurora",
  name: "Aurora",
  description:
    "Design premium SaaS. Cantos arredondados grandes, fundo creme quente, glassmorphism, botoes pill, tipografia leve e sofisticada.",
  thumbnail: "/templates/grovia/thumbnail.png",
  bestFor: [
    "saas", "tech", "startup", "fintech", "consultoria", "agencia",
    "b2b", "software", "plataforma", "app", "tecnologia", "digital",
    "marketing-digital", "automacao", "inteligencia-artificial", "ia",
    "desenvolvimento", "sistemas", "ti", "informatica",
  ],
  forceStyle: "elegant",
  forceRadius: "lg",
  recommendedHeadingFont: "inter",
  recommendedBodyFont: "inter",
  defaultSections: [
    { blockType: "header", variant: 1, name: "Header Pill", description: "Nav flutuante pill-shaped" },
    { blockType: "hero", variant: 1, name: "Hero Dashboard", description: "Split com imagem/mockup" },
    { blockType: "services", variant: 1, name: "Process Steps", description: "Steps numerados com imagem" },
    { blockType: "services", variant: 2, name: "Feature Tabs", description: "Tabs com preview de feature" },
    { blockType: "stats", variant: 1, name: "Integration Grid", description: "Grid de integracoes com steps numerados" },
    { blockType: "pricing", variant: 1, name: "Glassmorphism", description: "Cards com glassmorphism escuro" },
    { blockType: "testimonials", variant: 1, name: "Case Studies", description: "Cases + depoimentos" },
    { blockType: "faq", variant: 1, name: "Split Clean", description: "FAQ split com sticky title" },
    { blockType: "footer", variant: 1, name: "Newsletter Grid", description: "Footer com newsletter e 4 colunas" },
  ],
  availableVariants: {
    header: [1],
    hero: [1],
    services: [1, 2],
    stats: [1],
    pricing: [1],
    testimonials: [1],
    faq: [1],
    footer: [1],
    about: [1],
    contact: [1],
    cta: [1],
    "whatsapp-float": [1],
  },
};
