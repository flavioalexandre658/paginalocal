/**
 * Font recommendations per business niche.
 * Used by the AI prompt builder to suggest appropriate fonts.
 * Slugs must match AVAILABLE_FONTS in src/lib/fonts.ts.
 */
export const NICHE_FONT_RECOMMENDATIONS: Record<
  string,
  { heading: string[]; body: string[] }
> = {
  // === AUTOMOTIVO ===
  "lava-car": {
    heading: ["oswald", "barbatri", "block", "swat", "bison-bold", "above"],
    body: ["roboto", "open-sans", "general-sans", "montserrat", "inter"],
  },
  "oficina-mecanica": {
    heading: ["oswald", "barbatri", "block", "swat", "bison-bold", "above"],
    body: ["roboto", "open-sans", "montserrat", "inter"],
  },
  "estetica-automotiva": {
    heading: ["oswald", "barbatri", "block", "bison-bold", "ganton"],
    body: ["roboto", "montserrat", "open-sans", "dm-sans"],
  },

  // === BARBEARIA ===
  barbearia: {
    heading: ["oswald", "barbatri", "block", "swat", "bison-bold", "futura-bold", "above"],
    body: ["roboto", "open-sans", "general-sans", "montserrat"],
  },

  // === BELEZA & ESTETICA ===
  "salao-de-beleza": {
    heading: ["playfair-display", "sacramento", "magnolia-script", "quesha", "cookie", "lobster"],
    body: ["dm-sans", "poppins", "open-sans", "raleway", "lora"],
  },
  estetica: {
    heading: ["playfair-display", "sacramento", "magnolia-script", "quesha", "dm-serif-display"],
    body: ["dm-sans", "raleway", "lora", "poppins", "inter"],
  },
  spa: {
    heading: ["playfair-display", "sacramento", "magnolia-script", "quesha"],
    body: ["dm-sans", "raleway", "lora", "poppins"],
  },

  // === GASTRONOMIA ===
  restaurante: {
    heading: ["playfair-display", "lobster", "pacifico", "cookie", "fabada", "fredoka"],
    body: ["open-sans", "roboto", "poppins", "dm-sans", "lora"],
  },
  pizzaria: {
    heading: ["lobster", "fredoka", "chewy", "spicy-rice", "titan-one", "concert"],
    body: ["open-sans", "roboto", "poppins", "nunito"],
  },
  hamburgueria: {
    heading: ["fredoka", "chewy", "titan-one", "burger-frog", "bungee", "concert"],
    body: ["open-sans", "roboto", "poppins", "nunito"],
  },
  "cafe-padaria": {
    heading: ["playfair-display", "cookie", "pacifico", "lobster", "playball", "sacramento"],
    body: ["poppins", "dm-sans", "nunito", "open-sans"],
  },
  bar: {
    heading: ["oswald", "bison-bold", "block", "above", "barbatri"],
    body: ["roboto", "open-sans", "montserrat", "inter"],
  },

  // === SAUDE ===
  clinica: {
    heading: ["inter", "dm-sans", "montserrat", "raleway", "plus-jakarta-sans"],
    body: ["inter", "open-sans", "roboto", "dm-sans", "nunito"],
  },
  dentista: {
    heading: ["inter", "dm-sans", "montserrat", "raleway", "plus-jakarta-sans"],
    body: ["inter", "open-sans", "roboto", "dm-sans"],
  },
  psicologia: {
    heading: ["playfair-display", "dm-serif-display", "lora", "raleway"],
    body: ["inter", "dm-sans", "open-sans", "poppins"],
  },
  veterinaria: {
    heading: ["fredoka", "nunito", "poppins", "baloo", "chewy"],
    body: ["nunito", "open-sans", "roboto", "poppins"],
  },

  // === SERVICOS PROFISSIONAIS ===
  advocacia: {
    heading: ["playfair-display", "dm-serif-display", "merriweather", "crimson-text", "lora"],
    body: ["inter", "dm-sans", "open-sans", "roboto", "source-sans"],
  },
  contabilidade: {
    heading: ["inter", "dm-sans", "montserrat", "raleway", "work-sans"],
    body: ["inter", "open-sans", "roboto", "dm-sans"],
  },
  consultoria: {
    heading: ["inter", "dm-sans", "space-grotesk", "plus-jakarta-sans", "outfit"],
    body: ["inter", "open-sans", "dm-sans", "roboto"],
  },
  arquitetura: {
    heading: ["space-grotesk", "outfit", "dm-sans", "montserrat", "raleway"],
    body: ["inter", "dm-sans", "open-sans", "work-sans"],
  },

  // === EDUCACAO ===
  escola: {
    heading: ["fredoka", "nunito", "poppins", "chewy", "baloo"],
    body: ["nunito", "poppins", "open-sans", "roboto"],
  },
  cursos: {
    heading: ["inter", "dm-sans", "montserrat", "space-grotesk", "outfit"],
    body: ["inter", "open-sans", "dm-sans", "poppins"],
  },

  // === FITNESS ===
  academia: {
    heading: ["oswald", "bison-bold", "block", "above", "swat", "barbatri"],
    body: ["roboto", "montserrat", "open-sans", "inter"],
  },
  crossfit: {
    heading: ["oswald", "bison-bold", "block", "swat", "above"],
    body: ["roboto", "montserrat", "open-sans"],
  },

  // === IMOBILIARIO ===
  imobiliaria: {
    heading: ["playfair-display", "dm-serif-display", "raleway", "montserrat"],
    body: ["inter", "dm-sans", "open-sans", "roboto", "lora"],
  },

  // === TECNOLOGIA ===
  tecnologia: {
    heading: ["space-grotesk", "outfit", "inter", "dm-sans", "plus-jakarta-sans"],
    body: ["inter", "dm-sans", "open-sans", "source-sans"],
  },
  saas: {
    heading: ["inter", "space-grotesk", "outfit", "dm-sans", "plus-jakarta-sans"],
    body: ["inter", "dm-sans", "open-sans"],
  },

  // === VAREJO ===
  loja: {
    heading: ["montserrat", "poppins", "outfit", "dm-sans", "raleway"],
    body: ["open-sans", "roboto", "inter", "nunito"],
  },
  "loja-roupas": {
    heading: ["playfair-display", "dm-serif-display", "raleway", "outfit", "montserrat"],
    body: ["dm-sans", "inter", "open-sans", "poppins"],
  },
  "pet-shop": {
    heading: ["fredoka", "chewy", "baloo", "nunito", "bubble"],
    body: ["nunito", "poppins", "open-sans", "roboto"],
  },

  // === EVENTOS ===
  "casa-de-festas": {
    heading: ["lobster", "pacifico", "playball", "cookie", "fredoka", "sacramento"],
    body: ["poppins", "nunito", "open-sans", "roboto"],
  },
  fotografia: {
    heading: ["playfair-display", "dm-serif-display", "sacramento", "lora", "crimson-text"],
    body: ["inter", "dm-sans", "open-sans", "lora"],
  },

  // === RELIGIAO ===
  igreja: {
    heading: ["playfair-display", "lora", "merriweather", "crimson-text", "dm-serif-display"],
    body: ["open-sans", "roboto", "nunito", "lora"],
  },
}

/**
 * Finds font recommendations for a given category string.
 * Tries exact match first, then partial match on category words.
 * Returns a default set if no match found.
 */
export function getFontRecommendations(category: string): { heading: string[]; body: string[] } {
  const normalized = category.toLowerCase().trim()

  // Exact match
  if (NICHE_FONT_RECOMMENDATIONS[normalized]) {
    return NICHE_FONT_RECOMMENDATIONS[normalized]
  }

  // Partial match on keywords
  for (const [key, value] of Object.entries(NICHE_FONT_RECOMMENDATIONS)) {
    const keyWords = key.split("-")
    if (keyWords.some((w) => normalized.includes(w) || w.includes(normalized))) {
      return value
    }
  }

  // Default: versatile fonts
  return {
    heading: [
      "inter", "montserrat", "playfair-display", "dm-sans", "oswald",
      "raleway", "poppins", "space-grotesk", "outfit", "lobster",
      "fredoka", "dm-serif-display", "lora", "bison-bold",
    ],
    body: [
      "inter", "open-sans", "roboto", "dm-sans", "poppins",
      "lora", "nunito", "raleway", "merriweather", "source-sans",
    ],
  }
}
