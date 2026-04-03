import type { TemplateConfig } from "../types";

export const LARKO_CONFIG: TemplateConfig = {
  id: "larko",
  name: "Larko",
  description: "Marketing e consultoria com palette verde escuro + lime accent. Geist/Newsreader fonts, cards 6px radius, botoes pill 50px. Ideal para consultorias, agencias de marketing e negocios B2B.",
  thumbnail: "/templates/larko/thumbnail.png",
  bestFor: [
    "consultoria", "consulting", "consultoria-empresarial",
    "marketing", "marketing-digital", "agencia-marketing",
    "agencia", "agency", "agencia-digital",
    "negocios", "business", "b2b",
    "estrategia", "strategy",
    "gestao", "management",
    "financeiro", "financial", "contabilidade",
    "juridico", "law", "advocacia", "advogado",
    "rh", "recursos-humanos", "recrutamento",
    "coaching", "mentoria", "treinamento",
    "tecnologia", "ti", "software",
    "logistica", "supply-chain",
  ],

  forceStyle: "elegant" as const,
  forceRadius: "sm" as const,
  recommendedHeadingFont: "geist",
  recommendedBodyFont: "geist",

  defaultSections: [
    { blockType: "header", variant: 1, name: "Header Larko", description: "Nav branco com logo texto, links e CTA pill verde" },
    { blockType: "hero", variant: 1, name: "Hero Banner", description: "Hero com headline grande, logos de clientes e stats" },
    { blockType: "services", variant: 1, name: "Cards Services", description: "4 cards de servicos com icones lime e numeros" },
    { blockType: "gallery", variant: 1, name: "Portfolio Cases", description: "3 cases de portfolio com imagens e descricao" },
    { blockType: "about", variant: 1, name: "About Carousel", description: "Sobre nos com slider e 4 vantagens com icones" },
    { blockType: "cta", variant: 1, name: "CTA Green", description: "CTA escuro com gradiente, headline e slider de depoimentos" },
    { blockType: "services", variant: 2, name: "Solutions Grid", description: "3 colunas de solucoes com categorias e outputs" },
    { blockType: "testimonials", variant: 1, name: "Testimonials Slider", description: "Slider de depoimentos com nomes e cargos" },
    { blockType: "contact", variant: 1, name: "Contact Form", description: "Formulario de contato com bg verde escuro, circulos animados e mapa" },
    { blockType: "footer", variant: 1, name: "Footer Dark Green", description: "Footer verde escuro com form, links, social e copyright" },
  ],

  availableVariants: {
    header: [1],
    hero: [1],
    services: [1, 2],
    gallery: [1],
    about: [1],
    cta: [1],
    testimonials: [1],
    contact: [1],
    footer: [1],
  },
};
