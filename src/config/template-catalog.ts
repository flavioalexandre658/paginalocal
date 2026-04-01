import { db } from "@/db";
import { siteTemplate } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import type { TemplateConfig } from "@/templates/types";

/**
 * Busca todos os templates ativos do banco.
 */
export async function getTemplates(): Promise<TemplateConfig[]> {
  const rows = await db
    .select()
    .from(siteTemplate)
    .where(eq(siteTemplate.isActive, true))
    .orderBy(asc(siteTemplate.sortOrder));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description || "",
    thumbnail: row.thumbnailUrl || "",
    bestFor: row.bestFor || [],
    forceStyle: (row.forceStyle || "elegant") as TemplateConfig["forceStyle"],
    forceRadius: (row.forceRadius || "lg") as TemplateConfig["forceRadius"],
    recommendedHeadingFont: row.recommendedHeadingFont || undefined,
    recommendedBodyFont: row.recommendedBodyFont || undefined,
    defaultSections: row.defaultSections || [],
    availableVariants: row.availableVariants || {},
  }));
}

/**
 * Busca template por ID.
 */
export async function getTemplateById(id: string): Promise<TemplateConfig | undefined> {
  const rows = await db
    .select()
    .from(siteTemplate)
    .where(eq(siteTemplate.id, id))
    .limit(1);

  if (!rows[0]) return undefined;
  const row = rows[0];

  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    thumbnail: row.thumbnailUrl || "",
    bestFor: row.bestFor || [],
    forceStyle: (row.forceStyle || "elegant") as TemplateConfig["forceStyle"],
    forceRadius: (row.forceRadius || "lg") as TemplateConfig["forceRadius"],
    recommendedHeadingFont: row.recommendedHeadingFont || undefined,
    recommendedBodyFont: row.recommendedBodyFont || undefined,
    defaultSections: row.defaultSections || [],
    availableVariants: row.availableVariants || {},
  };
}

/**
 * Remove acentos e caracteres especiais para matching.
 * "Climatização" → "climatizacao", "manutenção" → "manutencao"
 */
function normalizeForMatch(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "");
}

/**
 * Encontra o melhor template para uma categoria de negocio.
 * Faz scoring por match no bestFor.
 * Normaliza acentos para matching (ex: "climatização" → "climatizacao").
 * FALLBACK: retorna "aurora" se nenhum match.
 */
export async function getBestTemplate(category: string): Promise<TemplateConfig> {
  const templates = await getTemplates();
  if (templates.length === 0) {
    return FALLBACK_TEMPLATE;
  }

  const normalized = normalizeForMatch(category);
  const words = normalized.split(/[\s,]+/).filter((w) => w.length > 2);
  let bestScore = 0;
  let bestTemplate = templates[0];

  for (const template of templates) {
    let score = 0;
    for (const niche of template.bestFor) {
      const nicheNorm = normalizeForMatch(niche);

      // Exact match: "climatizacao" in "climatizacao"
      if (normalized.includes(nicheNorm) || nicheNorm.includes(normalized)) {
        score += 3;
      }

      // Word-level match: "ar" in "ar-condicionado"
      const nicheWords = nicheNorm.split(/[-\s]+/);
      for (const nw of nicheWords) {
        if (nw.length > 2 && normalized.includes(nw)) {
          score += 1;
        }
      }

      // Input words match against niche: "manutencao" matches "manutencao"
      for (const w of words) {
        if (nicheNorm.includes(w)) {
          score += 2;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTemplate = template;
    }
  }

  return bestTemplate;
}

/**
 * Fallback hardcoded caso o banco esteja vazio.
 * Usar APENAS como emergencia — o seed deve popular a tabela.
 */
const FALLBACK_TEMPLATE: TemplateConfig = {
  id: "aurora",
  name: "Aurora",
  description: "Design premium para empresas de tecnologia e SaaS.",
  thumbnail: "",
  bestFor: ["saas", "tech", "startup", "software", "consultoria", "agencia"],
  forceStyle: "elegant",
  forceRadius: "lg",
  recommendedHeadingFont: "inter",
  recommendedBodyFont: "inter",
  defaultSections: [
    { blockType: "header", variant: 1, name: "Header Pill", description: "Nav flutuante" },
    { blockType: "hero", variant: 1, name: "Hero", description: "Hero com imagem" },
    { blockType: "services", variant: 1, name: "Process", description: "Steps numerados" },
    { blockType: "faq", variant: 1, name: "FAQ", description: "FAQ split" },
    { blockType: "footer", variant: 1, name: "Footer", description: "Footer newsletter" },
  ],
  availableVariants: {
    header: [1], hero: [1], services: [1, 2], stats: [1],
    pricing: [1], testimonials: [1], faq: [1], footer: [1],
    about: [1], contact: [1], cta: [1], "whatsapp-float": [1],
  },
};
