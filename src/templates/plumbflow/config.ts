import type { TemplateConfig } from "../types";

export const PLUMBFLOW_CONFIG: TemplateConfig = {
  id: "plumbflow",
  name: "Plumbflow",
  description: "Design profissional para serviços. Dark navy com accent orange, tipografia Satoshi bold, botões pill com efeito glossy.",
  thumbnail: "/templates/plumbflow/thumbnail.png",
  bestFor: [
    "encanamento", "encanador", "plumbing",
    "eletricista", "electrician",
    "manutencao", "maintenance",
    "climatizacao", "hvac",
    "pintura", "painting",
    "reformas", "construction",
    "desentupidora", "limpeza",
    "servicos-domesticos", "home-services",
    "serralheria", "vidracaria",
    "dedetizacao", "pest-control",
  ],

  forceStyle: "bold" as const,
  forceRadius: "full" as const,
  recommendedHeadingFont: "satoshi",
  recommendedBodyFont: "satoshi",

  defaultSections: [
    { blockType: "header", variant: 1, name: "Header + Top Bar", description: "Nav escuro com barra de contato, logo, links e CTA pill orange" },
    { blockType: "hero", variant: 1, name: "Hero", description: "Hero com titulo grande, 2 CTAs, stat badge e imagem de fundo" },
    { blockType: "about", variant: 1, name: "Our Mission (Tabs)", description: "Seção about com 3 tabs (Mission/Expertise/Values) e imagem" },
    { blockType: "stats", variant: 1, name: "Counter Stats", description: "4 counters animados (anos, satisfação, prêmios, 24/7)" },
    { blockType: "services", variant: 1, name: "Our Services (Tabs)", description: "5 serviços com tabs, descrição e imagem por tab" },
    { blockType: "services", variant: 2, name: "Our Process (Timeline)", description: "Timeline de 5 passos numerados com CTA" },
    { blockType: "services", variant: 3, name: "Why Choose Us", description: "3 cards de features/benefícios" },
    { blockType: "testimonials", variant: 1, name: "Testimonials", description: "Cards de depoimento com estrelas, texto e autor" },
    { blockType: "gallery", variant: 1, name: "Our Work", description: "Grid masonry de fotos de trabalhos realizados" },
    { blockType: "cta", variant: 1, name: "Call To Action", description: "CTA dark com 24/7 badge, texto longo e imagem de encanador" },
    { blockType: "footer", variant: 1, name: "Footer", description: "Footer dark com links, áreas de serviço, contato e social" },
  ],

  availableVariants: {
    header: [1],
    hero: [1],
    about: [1],
    stats: [1],
    services: [1, 2, 3],
    testimonials: [1],
    gallery: [1],
    cta: [1],
    footer: [1],
  },
};
