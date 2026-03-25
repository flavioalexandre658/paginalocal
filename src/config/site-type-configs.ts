import type { BlockType } from "@/types/ai-generation";

export type NicheHint = {
  style: string[];
  tone: string;
  suggestedBlocks: BlockType[];
};

export type SiteTypeConfig = {
  requiredBlocks: BlockType[];
  optionalBlocks: BlockType[];
  minSections: number;
  maxSections: number;
  seoFocus: string;
  defaultPages: string[];
  nicheHints: Record<string, NicheHint>;
};

export const SITE_TYPE_CONFIGS: Record<string, SiteTypeConfig> = {
  LOCAL_BUSINESS: {
    requiredBlocks: ["hero", "services", "contact", "whatsapp-float"],
    optionalBlocks: [
      "about",
      "testimonials",
      "gallery",
      "faq",
      "hours",
      "location",
      "team",
      "stats",
      "cta",
      "pricing",
      "catalog",
      "featured-products",
    ],
    minSections: 5,
    maxSections: 8,
    seoFocus: "serviços locais + localização geográfica",
    defaultPages: ["home", "servicos", "sobre", "contato"],
    nicheHints: {
      barbearia: { style: ["industrial", "bold", "minimal"], tone: "casual", suggestedBlocks: ["gallery", "testimonials", "stats"] },
      restaurante: { style: ["warm", "elegant", "minimal"], tone: "friendly", suggestedBlocks: ["menu", "gallery", "hours"] },
      clinica: { style: ["minimal", "elegant"], tone: "formal", suggestedBlocks: ["team", "testimonials", "faq"] },
      oficina: { style: ["industrial", "bold"], tone: "casual", suggestedBlocks: ["stats", "testimonials", "faq"] },
      salao: { style: ["elegant", "warm", "minimal"], tone: "friendly", suggestedBlocks: ["gallery", "team", "testimonials"] },
      academia: { style: ["bold", "industrial", "minimal"], tone: "casual", suggestedBlocks: ["stats", "team", "gallery"] },
      consultorio: { style: ["minimal", "elegant"], tone: "formal", suggestedBlocks: ["team", "faq", "testimonials"] },
      petshop: { style: ["warm", "elegant", "bold"], tone: "friendly", suggestedBlocks: ["gallery", "testimonials", "stats"] },
      borracharia: { style: ["industrial", "bold"], tone: "casual", suggestedBlocks: ["stats", "faq", "testimonials"] },
      "lava-car": { style: ["industrial", "bold", "minimal"], tone: "casual", suggestedBlocks: ["gallery", "stats", "testimonials"] },
      "lava-jato": { style: ["industrial", "bold", "minimal"], tone: "casual", suggestedBlocks: ["gallery", "stats", "testimonials"] },
      "estetica-automotiva": { style: ["bold", "industrial", "elegant"], tone: "premium", suggestedBlocks: ["gallery", "stats", "testimonials"] },
      pizzaria: { style: ["warm", "bold"], tone: "casual", suggestedBlocks: ["menu", "gallery", "hours"] },
      hamburgueria: { style: ["bold", "industrial", "warm"], tone: "casual", suggestedBlocks: ["menu", "gallery", "hours"] },
      cafeteria: { style: ["warm", "elegant", "minimal"], tone: "friendly", suggestedBlocks: ["menu", "gallery", "hours"] },
      padaria: { style: ["warm", "elegant"], tone: "friendly", suggestedBlocks: ["menu", "gallery", "hours"] },
      doceria: { style: ["warm", "elegant"], tone: "friendly", suggestedBlocks: ["gallery", "testimonials", "cta"] },
      bar: { style: ["bold", "industrial"], tone: "casual", suggestedBlocks: ["menu", "gallery", "hours"] },
      estetica: { style: ["elegant", "minimal", "warm"], tone: "premium", suggestedBlocks: ["gallery", "team", "testimonials"] },
      spa: { style: ["elegant", "minimal", "warm"], tone: "premium", suggestedBlocks: ["gallery", "team", "testimonials"] },
      dentista: { style: ["minimal", "elegant"], tone: "formal", suggestedBlocks: ["team", "faq", "testimonials"] },
      veterinaria: { style: ["warm", "elegant", "bold"], tone: "friendly", suggestedBlocks: ["team", "testimonials", "gallery"] },
      mecanica: { style: ["industrial", "bold"], tone: "casual", suggestedBlocks: ["stats", "faq", "testimonials"] },
      crossfit: { style: ["bold", "industrial"], tone: "casual", suggestedBlocks: ["stats", "gallery", "team"] },
      pilates: { style: ["elegant", "minimal", "warm"], tone: "friendly", suggestedBlocks: ["team", "testimonials", "gallery"] },
      yoga: { style: ["elegant", "minimal", "warm"], tone: "friendly", suggestedBlocks: ["team", "testimonials", "gallery"] },
      advocacia: { style: ["elegant", "minimal"], tone: "formal", suggestedBlocks: ["team", "faq", "testimonials"] },
      contabilidade: { style: ["minimal", "elegant"], tone: "formal", suggestedBlocks: ["team", "faq", "stats"] },
      consultoria: { style: ["minimal", "elegant", "bold"], tone: "formal", suggestedBlocks: ["team", "stats", "testimonials"] },
      imobiliaria: { style: ["minimal", "elegant", "bold"], tone: "formal", suggestedBlocks: ["stats", "testimonials", "gallery"] },
      fotografo: { style: ["minimal", "elegant", "industrial"], tone: "premium", suggestedBlocks: ["gallery", "testimonials", "about"] },
      grafica: { style: ["bold", "industrial", "minimal"], tone: "casual", suggestedBlocks: ["gallery", "stats", "faq"] },
      escola: { style: ["warm", "minimal", "elegant"], tone: "friendly", suggestedBlocks: ["team", "testimonials", "faq"] },
      curso: { style: ["minimal", "warm", "elegant"], tone: "friendly", suggestedBlocks: ["testimonials", "faq", "stats"] },
      hotel: { style: ["elegant", "minimal", "warm"], tone: "premium", suggestedBlocks: ["gallery", "testimonials", "stats"] },
      pousada: { style: ["warm", "elegant"], tone: "friendly", suggestedBlocks: ["gallery", "testimonials", "faq"] },
      farmacia: { style: ["minimal", "elegant"], tone: "formal", suggestedBlocks: ["hours", "faq", "contact"] },
      lavanderia: { style: ["minimal", "warm"], tone: "friendly", suggestedBlocks: ["faq", "hours", "testimonials"] },
      seguranca: { style: ["industrial", "bold", "minimal"], tone: "formal", suggestedBlocks: ["stats", "faq", "testimonials"] },
      mudanca: { style: ["bold", "industrial"], tone: "casual", suggestedBlocks: ["stats", "faq", "testimonials"] },
      igreja: { style: ["elegant", "warm", "minimal"], tone: "friendly", suggestedBlocks: ["about", "hours", "contact"] },
    },
  },

  PRODUCT_CATALOG: {
    requiredBlocks: ["hero", "catalog", "whatsapp-float"],
    optionalBlocks: [
      "about",
      "featured-products",
      "gallery",
      "cta",
      "testimonials",
      "faq",
      "contact",
    ],
    minSections: 4,
    maxSections: 7,
    seoFocus: "produtos + comprar + encomendar",
    defaultPages: ["home", "produtos", "sobre", "contato"],
    nicheHints: {
      "loja-roupas": { style: ["elegant", "minimal", "bold"], tone: "premium", suggestedBlocks: ["featured-products", "gallery"] },
      floricultura: { style: ["warm", "elegant"], tone: "friendly", suggestedBlocks: ["gallery", "featured-products"] },
      "pet-shop": { style: ["warm", "bold", "elegant"], tone: "friendly", suggestedBlocks: ["featured-products", "faq"] },
      "loja-calcados": { style: ["bold", "industrial", "minimal"], tone: "casual", suggestedBlocks: ["featured-products", "gallery"] },
      papelaria: { style: ["warm", "elegant"], tone: "friendly", suggestedBlocks: ["catalog", "featured-products"] },
      artesanato: { style: ["warm", "elegant", "minimal"], tone: "friendly", suggestedBlocks: ["gallery", "featured-products"] },
      eletronicos: { style: ["minimal", "bold", "industrial"], tone: "casual", suggestedBlocks: ["catalog", "faq"] },
      "material-construcao": { style: ["industrial", "bold"], tone: "casual", suggestedBlocks: ["catalog", "faq"] },
    },
  },

  SERVICE_PRICING: {
    requiredBlocks: ["hero", "pricing", "services", "cta"],
    optionalBlocks: [
      "about",
      "testimonials",
      "stats",
      "faq",
      "team",
      "contact",
      "whatsapp-float",
    ],
    minSections: 5,
    maxSections: 8,
    seoFocus: "planos + preços + assinar",
    defaultPages: ["home", "planos", "sobre", "contato"],
    nicheHints: {
      academia: { style: ["bold", "industrial", "minimal"], tone: "casual", suggestedBlocks: ["stats", "testimonials", "team"] },
      "acqua-parque": { style: ["bold", "warm", "elegant"], tone: "friendly", suggestedBlocks: ["gallery", "stats", "faq"] },
      saas: { style: ["minimal", "bold", "elegant"], tone: "formal", suggestedBlocks: ["stats", "faq", "testimonials"] },
      consultoria: { style: ["elegant", "minimal"], tone: "formal", suggestedBlocks: ["team", "testimonials", "stats"] },
      curso: { style: ["minimal", "warm", "elegant"], tone: "friendly", suggestedBlocks: ["testimonials", "faq", "stats"] },
      coworking: { style: ["minimal", "industrial", "bold"], tone: "casual", suggestedBlocks: ["gallery", "stats", "faq"] },
    },
  },

  HYBRID: {
    requiredBlocks: ["hero", "services", "catalog", "whatsapp-float"],
    optionalBlocks: [
      "pricing",
      "about",
      "featured-products",
      "gallery",
      "testimonials",
      "faq",
      "cta",
      "contact",
      "stats",
    ],
    minSections: 6,
    maxSections: 9,
    seoFocus: "serviços + produtos + planos",
    defaultPages: ["home", "servicos", "produtos", "sobre", "contato"],
    nicheHints: {
      "pet-shop-completo": {
        style: ["warm", "elegant", "bold"],
        tone: "friendly",
        suggestedBlocks: ["featured-products", "gallery", "testimonials"],
      },
      "academia-com-loja": {
        style: ["bold", "industrial", "minimal"],
        tone: "casual",
        suggestedBlocks: ["pricing", "featured-products", "stats"],
      },
    },
  },
};
