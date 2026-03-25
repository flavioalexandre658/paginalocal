type SiteType = "LOCAL_BUSINESS" | "PRODUCT_CATALOG" | "SERVICE_PRICING" | "HYBRID";
type Confidence = "high" | "medium" | "low";

interface InferResult {
  siteType: SiteType;
  confidence: Confidence;
}

const SERVICE_PRICING_CATEGORIES = new Set([
  "gym", "fitness center", "health club", "yoga studio", "pilates studio",
  "crossfit gym", "martial arts school", "karate school", "boxing gym",
  "swimming pool", "sports club", "sports complex", "personal trainer",
  "dance school", "dance studio", "water park", "amusement park",
  "theme park", "trampoline park", "indoor playground", "escape room",
  "bowling alley", "paintball center", "adventure park", "skating rink",
  "school", "language school", "driving school", "music school", "art school",
  "cooking school", "tutoring service", "training center", "preschool",
  "kindergarten", "coworking space", "shared office", "business center",
  "hotel", "motel", "hostel", "resort", "inn", "bed and breakfast",
  "guest house", "vacation rental", "lodge", "campground", "spa", "day spa",
  "wellness center", "medical spa", "country club", "social club",
  "athletic club", "golf club", "tennis club", "recreation center",
  "parking lot", "parking garage", "laundromat",
  "academia", "crossfit", "pilates", "yoga", "artes marciais",
  "personal trainer", "natacao", "escola de danca", "escola de futebol",
  "parque aquatico", "casa de festas", "buffet", "escape room", "boliche",
  "escola", "curso de idiomas", "autoescola", "escola de musica",
  "reforco escolar", "treinamento profissional", "coworking",
  "hotel", "pousada", "hostel", "resort", "chale", "camping",
  "spa", "clube", "estacionamento", "lavanderia",
]);

const PRODUCT_CATALOG_CATEGORIES = new Set([
  "clothing store", "shoe store", "boutique", "jewelry store", "watch store",
  "lingerie store", "electronics store", "computer store", "mobile phone store",
  "cell phone store", "video game store", "furniture store", "home goods store",
  "home improvement store", "lighting store", "mattress store",
  "building materials store", "hardware store", "paint store", "tile store",
  "grocery store", "supermarket", "butcher shop", "fish market",
  "wine store", "liquor store", "candy store", "chocolate shop",
  "florist", "flower shop", "garden center", "plant nursery",
  "book store", "stationery store", "office supply store", "art supply store",
  "craft store", "toy store", "hobby shop", "sporting goods store",
  "bicycle shop", "baby store", "cosmetics store", "perfume store",
  "beauty supply store", "musical instrument store", "pet store",
  "optician", "optical store", "pharmacy", "drugstore", "auto parts store",
  "department store", "discount store", "thrift store", "convenience store",
  "gift shop", "fabric store", "farm supply store",
  "loja de roupas", "loja de calcados", "boutique", "loja de acessorios",
  "joalheria", "otica", "loja de moveis", "decoracao", "colchoes",
  "material de construcao", "ferragem", "floricultura", "papelaria",
  "livraria", "loja de eletronicos", "loja de brinquedos", "farmacia",
  "supermercado", "agropecuaria", "loja de cosmeticos", "pet shop",
]);

const HYBRID_CATEGORIES = new Set([
  "pet groomer", "pet grooming", "beauty salon", "hair salon", "nail salon",
  "optometrist", "compounding pharmacy", "print shop", "printing service",
  "tailor", "alteration service",
  "salao de beleza", "studio de sobrancelha", "studio de unhas",
  "depilacao", "grafica", "costura", "atelie", "autocenter",
]);

const SERVICE_PRICING_KEYWORDS = [
  "academia", "fitness", "crossfit", "pilates", "yoga", "musculacao",
  "natacao", "artes marciais", "jiu jitsu", "muay thai", "boxe",
  "acqua park", "aqua park", "parque aquatico", "clube", "resort",
  "hotel", "pousada", "hostel", "camping", "escola", "curso",
  "autoescola", "coworking", "plano mensal", "mensalidade",
  "assinatura", "diaria", "ingresso", "estacionamento",
];

const PRODUCT_CATALOG_KEYWORDS = [
  "loja de", "distribuidora", "atacado", "varejo", "roupa", "calcado",
  "tenis", "moda", "boutique", "joia", "relogio", "eletronico", "celular",
  "informatica", "movel", "moveis", "decoracao", "material de construcao",
  "ferragem", "floricultura", "papelaria", "livraria", "supermercado",
  "mercado", "acougue", "farmacia", "cosmetico", "pet shop", "agropecuaria",
  "otica",
];

const HYBRID_KEYWORDS = [
  "pet center", "pet shop e", "salao e loja", "autocenter", "auto center",
  "centro automotivo", "grafica e", "academia e suplemento",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/_/g, " ")
    .trim();
}

export function inferSiteType(
  category: string,
  businessName: string = "",
  description: string = ""
): InferResult {
  const normCategory = normalize(category);
  const normName = normalize(businessName);
  const normDesc = normalize(description);
  const combined = `${normName} ${normDesc}`;

  if (HYBRID_CATEGORIES.has(normCategory)) {
    return { siteType: "HYBRID", confidence: "high" };
  }
  if (SERVICE_PRICING_CATEGORIES.has(normCategory)) {
    return { siteType: "SERVICE_PRICING", confidence: "high" };
  }
  if (PRODUCT_CATALOG_CATEGORIES.has(normCategory)) {
    return { siteType: "PRODUCT_CATALOG", confidence: "high" };
  }

  for (const cat of HYBRID_CATEGORIES) {
    if (normCategory.includes(cat) || cat.includes(normCategory)) {
      return { siteType: "HYBRID", confidence: "high" };
    }
  }
  for (const cat of SERVICE_PRICING_CATEGORIES) {
    if (normCategory.includes(cat) || cat.includes(normCategory)) {
      return { siteType: "SERVICE_PRICING", confidence: "high" };
    }
  }
  for (const cat of PRODUCT_CATALOG_CATEGORIES) {
    if (normCategory.includes(cat) || cat.includes(normCategory)) {
      return { siteType: "PRODUCT_CATALOG", confidence: "high" };
    }
  }

  if (HYBRID_KEYWORDS.some((kw) => combined.includes(kw))) {
    return { siteType: "HYBRID", confidence: "medium" };
  }
  if (SERVICE_PRICING_KEYWORDS.some((kw) => combined.includes(kw))) {
    return { siteType: "SERVICE_PRICING", confidence: "medium" };
  }
  if (PRODUCT_CATALOG_KEYWORDS.some((kw) => combined.includes(kw))) {
    return { siteType: "PRODUCT_CATALOG", confidence: "medium" };
  }

  if (/\b(loja|store|shop|magazine)\b/.test(combined)) {
    return { siteType: "PRODUCT_CATALOG", confidence: "low" };
  }
  if (/\b(academia|escola|clube|hotel|pousada)\b/.test(combined)) {
    return { siteType: "SERVICE_PRICING", confidence: "low" };
  }

  return { siteType: "LOCAL_BUSINESS", confidence: "low" };
}
