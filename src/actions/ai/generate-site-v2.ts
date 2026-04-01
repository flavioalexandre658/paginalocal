"use server";

import { authActionClient } from "@/lib/safe-action";
import { anthropic } from "@/lib/anthropic";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  BusinessContextSchema,
  type BusinessContext,
  type SiteBlueprint,
} from "@/types/ai-generation";
import { getBestTemplate } from "@/config/template-catalog";
import { getFontRecommendations } from "@/config/niche-font-recommendations";
import { fetchAndSaveUnsplashImages } from "@/lib/unsplash-fallback";
import { getImageFields, blockNeedsImages } from "@/config/block-image-fields";
import { getContentMapForTemplate } from "@/templates/content-maps";
import { buildSectionPrompt } from "@/templates/content-map-utils";
import { generateAndFillImages } from "@/lib/ai-image-pipeline";
import { createTracker, trackContent, trackImages, trackTemplate, persistMetrics } from "@/lib/generation-tracker";
import type { ContentUsage } from "@/lib/generation-tracker";

export type GenerationModel = "sonnet" | "opus" | "gemini";

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
};

export const generateSiteV2 = authActionClient
  .schema(BusinessContextSchema)
  .action(async ({ parsedInput: ctx, ctx: { userId } }) => {
    const blueprint = await generateAndPersistBlueprint(ctx, userId);
    return { success: true, blueprint };
  });

export async function generateAndPersistBlueprint(
  ctx: BusinessContext,
  userId: string,
  model: GenerationModel = "sonnet"
): Promise<SiteBlueprint> {
  const tracker = createTracker();

  const template = await getBestTemplate(ctx.category);
  const fontRecs = getFontRecommendations(ctx.category);
  trackTemplate(tracker, template.id, template.name, template.defaultSections.length);

  const contentPrompt = buildContentPrompt(ctx, template, fontRecs);
  const { content: aiContent, usage: contentUsage } = await generateContentWithClaude(contentPrompt, model);
  trackContent(tracker, contentUsage);

  const design = aiContent.design || {};
  const headingFont =
    (design.headingFont as string) ||
    template.recommendedHeadingFont ||
    "dm-serif-display";
  const bodyFont =
    (design.bodyFont as string) || template.recommendedBodyFont || "dm-sans";

  const blueprint = assembleBlueprint({
    ctx,
    template,
    headingFont,
    bodyFont,
    aiContent,
  });

  // Gera imagens via Banana Nano 2 (primary) + Unsplash (fallback)
  const imageQueries = (aiContent as any).imageQueries || {};
  const contentMap = getContentMapForTemplate(template.id);
  if (contentMap) {
    template.defaultSections.forEach((s, i) => {
      const hint = contentMap[i]?.imageQueryHint;
      if (hint && blockNeedsImages(s.blockType) && !imageQueries[s.blockType]) {
        imageQueries[s.blockType] = `${ctx.category} ${hint}`;
      }
    });
  }
  const imageResult = await generateAndFillImages({
    blueprint,
    businessContext: ctx,
    storeId: ctx.storeId,
    contentMap,
    imageQueries,
  });
  trackImages(tracker, {
    totalCount: imageResult.totalImages,
    successCount: imageResult.bananaSuccessCount,
    fallbackCount: imageResult.unsplashFallbackCount,
    failedCount: imageResult.failedCount,
    durationMs: imageResult.durationMs,
    costUsd: imageResult.costUsd,
  });

  await db
    .update(store)
    .set({
      siteBlueprintV2: blueprint,
      siteBlueprintV2GeneratedAt: new Date(),
      useV2Renderer: true,
    })
    .where(and(eq(store.id, ctx.storeId), eq(store.userId, userId)));

  await persistMetrics(tracker, ctx.storeId);

  return blueprint;
}

// ════════════════════════════════════════════════════════════════
// SYSTEM PROMPT — Cacheable, identidade criativa fixa
// ════════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Você é o diretor criativo de uma agência de design premiada. Seu trabalho é criar sites que parecem feitos sob medida por um estúdio — nunca genéricos, nunca "cara de template".

## SUA FILOSOFIA

### COR
Cada negócio tem uma alma cromática. Você não "escolhe cores" — você traduz a ESSÊNCIA do negócio em linguagem visual.

Regras invioláveis:
- Primary deve ter contraste WCAG AA com texto branco (ratio ≥ 4.5:1). Cores escuras e ricas.
- Background NUNCA é #ffffff. Use tons com temperatura: warm (#faf8f5, #f5f0eb), cool (#f8fafc, #f1f5f9), ou tinted com undertone da primary.
- Surface cria separação sutil do background: 3-8% de diferença de luminosidade, com tint da primary.
- PROIBIDO usar cores genéricas de framework CSS: #3b82f6, #8b5cf6, #10b981, #6366f1, #f59e0b, #ef4444, #0ea5e9. Essas são "cores de template" — você cria cores com ALMA.
- Accent é vibrante e intencional — usada em CTAs, badges e destaques. Deve CONTRASTAR com a primary, não ser mais uma variação dela.

### TIPOGRAFIA
A combinação de fontes deve criar TENSÃO VISUAL controlada.
- Heading: expressa personalidade (Playfair Display = elegância, Space Grotesk = tech, DM Serif Display = editorial, Sora = moderno geométrico, Clash Display = bold contemporâneo).
- Body: legibilidade com caráter (DM Sans = clean, Source Serif 4 = editorial, Outfit = geométrico, Plus Jakarta Sans = humanista moderno).
- PROIBIDO: mesma família nos dois. PROIBIDO: Montserrat + Open Sans, Inter + Inter, Roboto + Roboto.

### COPY
- Headlines: MÁXIMO 8 palavras. Magnéticas, não descritivas. Use *asteriscos* para destacar 1-2 palavras.
- Subheadlines: benefício concreto em 2 linhas. Zero floreios.
- CTAs: verbo + resultado ("Agende sua transformação", "Garanta sua vaga"). PROIBIDO: "Saiba mais", "Clique aqui", "Entre em contato".
- Adapte vocabulário e ritmo ao negócio: advogado ≠ pet shop ≠ startup.

### IMAGENS
Quando gerar imageQueries, pense em CENAS e EMOÇÕES, não em termos genéricos:
- Barbearia: "barber chair vintage leather", "straight razor shaving cream"
- Restaurante: "chef plating dish warm light", "rustic table dinner setting"
- SaaS: "minimal dashboard dark mode", "team collaboration whiteboard"
NUNCA: "office", "business meeting", "professional team", "happy people"

## OUTPUT
Responda APENAS com JSON válido. Zero markdown, zero backticks. Texto em pt-BR.`;

// ════════════════════════════════════════════════════════════════
// CONTENT PROMPT — Briefing do negócio + instruções por seção
// ════════════════════════════════════════════════════════════════

function buildContentPrompt(
  ctx: BusinessContext,
  template: Awaited<ReturnType<typeof getBestTemplate>>,
  fontRecs?: { heading: string[]; body: string[] }
): string {
  const toneDesc: Record<string, string> = {
    formal: "corporativo e confiável — vocabulário técnico, frases assertivas, zero informalidade",
    premium: "luxuoso e exclusivo — palavras sensoriais, ritmo lento, elegância contida",
    casual: "descontraído e próximo — linguagem do dia a dia, leve e acessível",
    friendly: "acolhedor e empático — tom de conversa com alguém que você confia",
  };

  const contentMap = getContentMapForTemplate(template.id);

  const sectionInstructions = template.defaultSections
    .map((s, i) => {
      const mapEntry = contentMap?.[i];
      if (mapEntry) {
        return buildSectionPrompt(mapEntry, i);
      }

      const idx = `[${i}] ${s.blockType.toUpperCase()}`;
      switch (s.blockType) {
        case "header":
          return `${idx}: {storeName: "${ctx.name}", ctaText (verbo+resultado), ctaLink}`;
        case "hero":
          return `${idx}: {headline (max 8 palavras, *destaque*), subheadline (benefício, 2 linhas), badgeText ("✦ ..."), ctaText (verbo+resultado, max 4 palavras), ctaLink, secondaryCtaText, secondaryCtaLink, brands: [{name: "Nome da Marca"}] (4-6 nomes de marcas/clientes fictícios ou reais)}`;
        case "services":
          return `${idx}: {title (*destaque*), subtitle, items[3-6]: {name, description (benefício > feature, 2-3 linhas)}}`;
        case "pricing":
          return `${idx}: {title (*destaque*), subtitle, plans[2-3]: {name, price, description, features[4-6], ctaText, highlighted: bool}}`;
        case "faq":
          return `${idx}: {title (*destaque*), subtitle, items[5-6]: {question, answer}}`;
        case "footer":
          return `${idx}: {copyrightText: "© ${new Date().getFullYear()} ${ctx.name}. Todos os direitos reservados.", storeName: "${ctx.name}", tagline, navLinks: [{label, href}]}`;
        default:
          return `${idx}: gere conteúdo adequado`;
      }
    })
    .join("\n\n");

  const headingFonts = fontRecs?.heading.join(", ") ||
    "playfair-display, dm-serif-display, space-grotesk, sora, oswald, raleway, clash-display";
  const bodyFonts = fontRecs?.body.join(", ") ||
    "dm-sans, outfit, plus-jakarta-sans, source-sans-3, inter, nunito";

  // Seed aleatorio para forcar variacao entre geracoes identicas
  const colorMoods = [
    "quente e terroso — marrons, terracota, dourado envelhecido",
    "frio e sofisticado — azul-petróleo, grafite, prata",
    "vibrante e energético — laranja profundo, verde-limão escuro, coral",
    "minimalista e neutro — carvão, areia, cobre sutil",
    "luxuoso e escuro — preto fosco, burgundy, bronze",
    "natural e orgânico — verde-musgo, terra, mel",
    "tech e futurista — índigo escuro, ciano, roxo elétrico",
    "acolhedor e convidativo — vinho, caramelo, creme rosado",
    "ousado e marcante — vermelho-escuro, preto, amarelo mostarda",
    "clean e confiável — navy, branco-gelo, verde-água",
  ];
  const randomMood = colorMoods[Math.floor(Math.random() * colorMoods.length)];
  const randomSeed = Math.random().toString(36).substring(2, 8);

  return `## BRIEFING

Nome: ${ctx.name}
Categoria: ${ctx.category}
Local: ${ctx.city}, ${ctx.state}
Tom: ${toneDesc[ctx.tone || "friendly"]}
${ctx.description ? `Sobre: ${ctx.description}` : ""}
${ctx.services.length > 0 ? `Serviços: ${ctx.services.join(", ")}` : ""}
${ctx.differentials.length > 0 ? `Diferenciais: ${ctx.differentials.join(", ")}` : ""}
${ctx.whatsapp ? `WhatsApp: ${ctx.whatsapp}` : ""}
${ctx.phone ? `Tel: ${ctx.phone}` : ""}

## DESIGN

Seed criativo: ${randomSeed}
Direção cromática para ESTA geração: ${randomMood}
(Use essa direção como ponto de partida. NUNCA repita a mesma paleta de gerações anteriores.)

Heading fonts: ${headingFonts}
Body fonts: ${bodyFonts}
${ctx.primaryColor ? `O cliente SUGERE a cor ${ctx.primaryColor} — use como inspiração, mas crie algo ÚNICO.` : "Escolha a paleta do zero."}

Pense: qual é a PERSONALIDADE VISUAL de uma ${ctx.category} em ${ctx.city}?
Que emoção o visitante deve sentir ao abrir o site?

## SEÇÕES (EXATAMENTE ${template.defaultSections.length} seções, nesta ordem)

REGRA CRÍTICA: Gere EXATAMENTE ${template.defaultSections.length} objetos no array "sections", UM para CADA seção listada abaixo, NA MESMA ORDEM. Se o template pede 11 seções, o array DEVE ter 11 objetos. NUNCA pule, omita ou agrupe seções.

${sectionInstructions}

## JSON ESPERADO

IMPORTANTE: "sections" DEVE ser um array com EXATAMENTE ${template.defaultSections.length} objetos, um por seção acima.

{
  "design": {
    "headingFont": "da-lista",
    "bodyFont": "da-lista",
    "highlightStyle": "inherit | script",
    "palette": {
      "primary": "#hex (escura, rica, com personalidade)",
      "secondary": "#hex (complementar, mesma família)",
      "accent": "#hex (vibrante, contrasta com primary)",
      "background": "#hex (off-white com temperatura, NUNCA #ffffff)",
      "surface": "#hex (3-8% diferente do background)",
      "text": "#hex (quase-preto com undertone)",
      "textMuted": "#hex (40-50% mais claro que text)"
    }
  },
  "sections": [ /* EXATAMENTE ${template.defaultSections.length} objetos, um por seção */ ],
  "globalContent": {
    "brandVoice": "tom em 1 frase",
    "tagline": "slogan curto e memorável",
    "ctaDefaultText": "CTA padrão",
    "ctaDefaultType": "whatsapp"
  },
  "seo": {
    "title": "Keyword + Nome | Cidade (max 60 chars)",
    "metaDescription": "Frase persuasiva com CTA (max 155 chars)",
    "ogTitle": "Título social",
    "ogDescription": "Descrição social (max 200 chars)",
    "keywords": ["5 termos reais de busca"]
  },
  "jsonLd": {
    "type": "${ctx.fullAddress ? "LocalBusiness" : "Organization"}",
    "description": "2-3 frases para schema.org",
    "priceRange": "$$",
    "areaServed": "${ctx.city}, ${ctx.state}",
    "knowsAbout": ["competência1", "competência2", "competência3"]
  },
  "imageQueries": {
    "hero": "query em inglês — cena emocional que representa o negócio",
    "gallery": ["6 queries variadas — cenas, objetos, ambientes do nicho. NUNCA: office, business, professional, team meeting"]
  }
}`;
}

// ════════════════════════════════════════════════════════════════
// GERAR CONTEÚDO COM CLAUDE (com prompt caching)
// ════════════════════════════════════════════════════════════════

interface AIContent {
  design?: Record<string, unknown>;
  sections: Record<string, unknown>[];
  globalContent?: Record<string, unknown>;
  seo?: { title?: string; metaDescription?: string };
  imageQueries?: { hero?: string; gallery?: string[] };
}

interface ContentGenerationResult {
  content: AIContent;
  usage: ContentUsage;
}

async function generateContentWithClaude(
  prompt: string,
  model: GenerationModel = "sonnet"
): Promise<ContentGenerationResult> {
  const modelId = MODEL_MAP[model] || MODEL_MAP.sonnet;
  const startMs = Date.now();

  const response = await anthropic.messages.create({
    model: modelId,
    max_tokens: 8000,
    temperature: 0.8,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const durationMs = Date.now() - startMs;

  console.log(
    "[generateContent] model:",
    modelId,
    "| stop_reason:",
    response.stop_reason,
    "| input_tokens:",
    response.usage.input_tokens,
    "| output_tokens:",
    response.usage.output_tokens,
    "| duration:",
    durationMs + "ms"
  );

  const usage: ContentUsage = {
    model: modelId,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    stopReason: response.stop_reason || "unknown",
    durationMs,
  };

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as AIContent;

    // Debug: log section structure
    console.log("[generateContent] sections count:", parsed.sections?.length);
    if (parsed.sections?.[0]) {
      const firstKeys = Object.keys(parsed.sections[0]);
      console.log("[generateContent] first section keys:", firstKeys.join(", "));
      if (parsed.sections[0].data) {
        console.log("[generateContent] WARNING: sections have wrapper (data/type/id) — will normalize");
      }
    }

    // Validar paleta — rejeitar cores genéricas de template
    const palette = (parsed.design?.palette as Record<string, string>) || {};
    if (!validatePalette(palette)) {
      console.warn("[generateContent] Paleta genérica detectada, será corrigida no assembler");
    }

    return { content: parsed, usage };
  } catch (e) {
    console.error("[generateContent] JSON parse failed:", e);
    console.error("[generateContent] raw:", cleaned.slice(0, 500));
    return {
      content: {
        sections: [],
        globalContent: {
          brandVoice: "Profissional e acolhedor",
          tagline: "Seu negócio merece destaque",
          ctaDefaultText: "Fale conosco",
          ctaDefaultType: "whatsapp",
        },
      },
      usage,
    };
  }
}

// ════════════════════════════════════════════════════════════════
// VALIDAÇÃO DE PALETA — Rejeita cores de template
// ════════════════════════════════════════════════════════════════

const BANNED_COLORS: Record<string, string[]> = {
  primary: [
    "#3b82f6", "#2563eb", "#1d4ed8", // Tailwind blue
    "#8b5cf6", "#7c3aed", "#6d28d9", // Tailwind violet
    "#6366f1", "#4f46e5",            // Tailwind indigo
    "#0ea5e9", "#0284c7",            // Tailwind sky
  ],
  accent: [
    "#f59e0b", "#d97706",            // Tailwind amber
    "#eab308", "#ca8a04",            // Tailwind yellow
    "#10b981", "#059669",            // Tailwind emerald
    "#ef4444", "#dc2626",            // Tailwind red
  ],
};

function validatePalette(palette: Record<string, string>): boolean {
  for (const [role, bannedList] of Object.entries(BANNED_COLORS)) {
    const color = palette[role]?.toLowerCase();
    if (color && bannedList.includes(color)) {
      return false;
    }
  }

  // Rejeitar background branco puro
  if (palette.background?.toLowerCase() === "#ffffff" || palette.background?.toLowerCase() === "#fff") {
    return false;
  }

  return true;
}

// ════════════════════════════════════════════════════════════════
// MONTAR BLUEPRINT
// ════════════════════════════════════════════════════════════════

function assembleBlueprint({
  ctx,
  template,
  headingFont,
  bodyFont,
  aiContent,
}: {
  ctx: BusinessContext;
  template: Awaited<ReturnType<typeof getBestTemplate>>;
  headingFont: string;
  bodyFont: string;
  aiContent: AIContent;
}): SiteBlueprint {
  const design = (aiContent.design || {}) as Record<string, unknown>;
  const palette = (design.palette as Record<string, string>) || {};
  const paletteIsValid = validatePalette(palette);

  const whatsappLink = ctx.whatsapp
    ? `https://wa.me/${ctx.whatsapp.replace(/\D/g, "")}`
    : "#contact";

  console.log(`[assembleBlueprint] Template has ${template.defaultSections.length} sections, AI generated ${aiContent.sections.length} sections`);

  // Pad sections array if AI generated fewer than expected
  while (aiContent.sections.length < template.defaultSections.length) {
    const missingIdx = aiContent.sections.length;
    const missingType = template.defaultSections[missingIdx]?.blockType || "unknown";
    console.warn(`[assembleBlueprint] Padding missing section [${missingIdx}] ${missingType} with empty object`);
    aiContent.sections.push({});
  }

  template.defaultSections.forEach((s, i) => {
    const hasContent = !!aiContent.sections[i] && Object.keys(aiContent.sections[i]).length > 0;
    console.log(`[assembleBlueprint]   [${i}] ${s.blockType} v${s.variant}: ${hasContent ? "✓" : "✗ EMPTY"}`);
  });

  const sections = template.defaultSections.map((tplSection, i) => {
    let aiSection = aiContent.sections[i] || {};

    // Normalize: if AI wrapped content in { data: {...}, type: "...", id: ... }
    if (aiSection.data && typeof aiSection.data === "object") {
      aiSection = { ...aiSection.data as Record<string, unknown> };
    }
    // Also handle { content: {...} } wrapper
    if (aiSection.content && typeof aiSection.content === "object" && !aiSection.title && !aiSection.headline && !aiSection.storeName) {
      aiSection = { ...aiSection.content as Record<string, unknown> };
    }

    // Normalize paragraphs: AI sometimes sends [{text:"..."}, ...] instead of ["..."]
    if (Array.isArray(aiSection.paragraphs)) {
      aiSection.paragraphs = (aiSection.paragraphs as unknown[]).map((p) =>
        typeof p === "string" ? p : typeof p === "object" && p !== null && "text" in (p as Record<string, unknown>) ? String((p as Record<string, unknown>).text) : String(p)
      );
    }

    // Normalize rating: AI sends "5" (string) instead of 5 (number)
    if (Array.isArray(aiSection.items)) {
      (aiSection.items as Record<string, unknown>[]).forEach((item) => {
        if (typeof item.rating === "string") {
          item.rating = parseInt(item.rating as string, 10) || 5;
        }
      });
    }

    if (typeof aiSection.ctaLink === "string" && aiSection.ctaLink === "") {
      aiSection.ctaLink = whatsappLink;
    }
    if (
      !aiSection.ctaLink &&
      (tplSection.blockType === "hero" || tplSection.blockType === "header")
    ) {
      aiSection.ctaLink = whatsappLink;
    }
    if (tplSection.blockType === "header") {
      aiSection.storeName = aiSection.storeName || ctx.name;
      aiSection.logoUrl = aiSection.logoUrl || "";
    }

    return {
      id: crypto.randomUUID(),
      blockType: tplSection.blockType,
      variant: tplSection.variant,
      order: i,
      visible: true,
      content: aiSection as Record<string, unknown>,
    };
  });

  sections.push({
    id: crypto.randomUUID(),
    blockType: "whatsapp-float",
    variant: 1,
    order: sections.length,
    visible: true,
    content: {
      number: ctx.whatsapp?.replace(/\D/g, "") || "",
      message: `Olá, gostaria de saber mais sobre ${ctx.name}!`,
      position: "bottom-right",
    },
  });

  const seo = (aiContent.seo || {}) as Record<string, unknown>;
  const gc = aiContent.globalContent || {};
  const aiJsonLd =
    ((aiContent as unknown as Record<string, unknown>).jsonLd as Record<string, unknown>) || {};

  const footerIdx = template.defaultSections.findIndex((s) => s.blockType === "footer");
  const footerSection = footerIdx >= 0 ? aiContent.sections[footerIdx] || {} : {};
  const navLinks = (footerSection.navLinks as Array<{ label: string; href: string }>) || [
    { label: "Início", href: "#hero" },
    { label: "Serviços", href: "#services" },
    { label: "Dúvidas", href: "#faq" },
  ];

  // ══ PALETA: IA decide, NÃO o usuário ══
  // A cor do usuário já foi enviada como SUGESTÃO no prompt.
  // Aqui respeitamos a decisão final da IA, com fallback pro niche.
  const finalPalette = {
    primary: paletteIsValid
      ? palette.primary || generateNicheColor(ctx.category, "primary")
      : generateNicheColor(ctx.category, "primary"),
    secondary: paletteIsValid
      ? palette.secondary || generateNicheColor(ctx.category, "secondary")
      : generateNicheColor(ctx.category, "secondary"),
    accent: paletteIsValid
      ? palette.accent || generateNicheColor(ctx.category, "accent")
      : generateNicheColor(ctx.category, "accent"),
    background: palette.background?.toLowerCase() === "#ffffff"
      ? "#faf8f5"
      : palette.background || "#faf8f5",
    surface: palette.surface || "#f0ece6",
    text: palette.text || "#1c1917",
    textMuted: palette.textMuted || "#57534e",
  };

  const highlightStyle = (design.highlightStyle as string) || "inherit";

  const blueprint: SiteBlueprint = {
    version: "3.0",
    templateId: template.id,
    generatedAt: new Date().toISOString(),
    siteType: ctx.siteType,
    designTokens: {
      palette: finalPalette,
      headingFont,
      bodyFont,
      highlightStyle, // novo: controla como *destaques* são renderizados
      style: template.forceStyle,
      borderRadius: template.forceRadius,
      spacing: "spacious",
    },
    globalContent: {
      brandVoice: (gc.brandVoice as string) || "Profissional e acolhedor",
      tagline: (gc.tagline as string) || ctx.name,
      ctaDefaultText: (gc.ctaDefaultText as string) || "Fale conosco",
      ctaDefaultType: ((gc.ctaDefaultType as string) || "whatsapp") as
        | "whatsapp"
        | "link"
        | "scroll",
    },
    pages: [
      {
        id: crypto.randomUUID(),
        slug: "/",
        title: (seo.title as string) || `${ctx.name} — ${ctx.category}`,
        metaDescription: (
          (seo.metaDescription as string) ||
          `${ctx.name} — ${ctx.category}. Conheça nossos serviços.`
        ).slice(0, 160),
        isHomepage: true,
        ogTitle: (seo.ogTitle as string) || undefined,
        ogDescription: (seo.ogDescription as string) || undefined,
        sections: sections as SiteBlueprint["pages"][0]["sections"],
      },
    ],
    navigation: navLinks.map((n) => ({ ...n, isExternal: false })),
    jsonLd: {
      type:
        (aiJsonLd.type as string) ||
        (ctx.fullAddress ? "LocalBusiness" : "Organization"),
      name: ctx.name,
      description:
        (aiJsonLd.description as string) ||
        ctx.description ||
        `${ctx.name} — ${ctx.category}`,
      telephone: ctx.phone || ctx.whatsapp,
      ...(ctx.fullAddress
        ? {
            address: {
              streetAddress: ctx.fullAddress,
              addressLocality: ctx.city,
              addressRegion: ctx.state,
              addressCountry: "BR",
            },
          }
        : {}),
      priceRange: (aiJsonLd.priceRange as string) || "$$",
      ...(aiJsonLd.areaServed ? { areaServed: aiJsonLd.areaServed } : {}),
      ...(Array.isArray(aiJsonLd.knowsAbout)
        ? { knowsAbout: aiJsonLd.knowsAbout as string[] }
        : {}),
    },
  };

  return blueprint;
}

// ════════════════════════════════════════════════════════════════
// PALETA POR NICHO (fallback quando IA falha)
// ════════════════════════════════════════════════════════════════

function generateNicheColor(
  category: string,
  role: "primary" | "secondary" | "accent"
): string {
  const cat = category.toLowerCase();

  const palettes: Record<string, { primary: string; secondary: string; accent: string }> = {
    barbearia: { primary: "#1a1714", secondary: "#2e2519", accent: "#c4973b" },
    salao: { primary: "#3d1f2e", secondary: "#5c2d4a", accent: "#d4a07a" },
    estetica: { primary: "#2d2632", secondary: "#453a4f", accent: "#c9a87c" },
    manicure: { primary: "#4a2040", secondary: "#6b3a5c", accent: "#e8b4b8" },
    restaurante: { primary: "#2c1810", secondary: "#4a2c1a", accent: "#c45d2c" },
    padaria: { primary: "#3e2a1a", secondary: "#5c3d24", accent: "#d4883c" },
    pizzaria: { primary: "#441c1c", secondary: "#5c2424", accent: "#d45c2c" },
    cafeteria: { primary: "#2c2420", secondary: "#4a3c34", accent: "#a67c5a" },
    clinica: { primary: "#1a2e3a", secondary: "#24404f", accent: "#3c9c8c" },
    dentista: { primary: "#1c3040", secondary: "#2a4458", accent: "#4ca4a0" },
    psicologia: { primary: "#2e3040", secondary: "#3c4058", accent: "#7c8cc4" },
    fisioterapia: { primary: "#1c3430", secondary: "#2a4c44", accent: "#4cb4a0" },
    academia: { primary: "#141418", secondary: "#1c1c24", accent: "#dc3c2c" },
    yoga: { primary: "#2a2c24", secondary: "#3c4034", accent: "#a4945c" },
    advocacia: { primary: "#1c2030", secondary: "#2c3448", accent: "#8c7c5c" },
    contabilidade: { primary: "#202430", secondary: "#2c3444", accent: "#5c8ca4" },
    consultoria: { primary: "#1c2028", secondary: "#2a3440", accent: "#5490b4" },
    arquitetura: { primary: "#1c1c1c", secondary: "#2c2c28", accent: "#b48c5c" },
    saas: { primary: "#0c0c14", secondary: "#141420", accent: "#5c5ce4" },
    tech: { primary: "#0c1018", secondary: "#141c28", accent: "#2cacb4" },
    startup: { primary: "#101014", secondary: "#1c1c24", accent: "#7c5cd4" },
    agencia: { primary: "#0c0c0c", secondary: "#1c1c1c", accent: "#e45c2c" },
    loja: { primary: "#2c241c", secondary: "#3c342c", accent: "#c48c3c" },
    pet: { primary: "#1c3424", secondary: "#2c4c34", accent: "#5cb47c" },
    hotel: { primary: "#1a2030", secondary: "#243040", accent: "#b4944c" },
    imobiliaria: { primary: "#1c2430", secondary: "#2c3c4c", accent: "#3c84a4" },
    fotografia: { primary: "#141414", secondary: "#1c1c1c", accent: "#e4a4b4" },
    educacao: { primary: "#1c2840", secondary: "#2c3c58", accent: "#4c8cd4" },
    floricultura: { primary: "#1c2c20", secondary: "#2c4430", accent: "#d47ca4" },
    mecanica: { primary: "#1c1c20", secondary: "#2c2c34", accent: "#dc6c2c" },
    rifa: { primary: "#1c1030", secondary: "#2c1c48", accent: "#d4a43c" },
    sorteio: { primary: "#1c1030", secondary: "#2c1c48", accent: "#d4a43c" },
  };

  for (const [key, colors] of Object.entries(palettes)) {
    if (cat.includes(key)) return colors[role];
  }

  return { primary: "#1c2028", secondary: "#2c3440", accent: "#5c7ca4" }[role];
}

// ════════════════════════════════════════════════════════════════
// PREENCHER IMAGENS — Com queries contextuais da IA
// ════════════════════════════════════════════════════════════════

async function fillImages(
  blueprint: SiteBlueprint,
  category: string,
  storeId: string,
  imageQueries?: { hero?: string; gallery?: string[] }
) {
  if (!category || !storeId) return;

  const needsImages = blueprint.pages.some((page) =>
    page.sections.some((s) => {
      if (!blockNeedsImages(s.blockType)) return false;
      const c = s.content as Record<string, unknown>;
      const fields = getImageFields(s.blockType);
      return fields.some((field) => {
        if (field.type === "single") return !c[field.path];
        if (field.type === "array-items") {
          const items = c[field.path] as Array<Record<string, unknown>> | undefined;
          return Array.isArray(items) && items.some((item) => !item.image);
        }
        if (field.type === "array-images") {
          const images = c[field.path] as unknown[];
          return !images || images.length === 0;
        }
        return false;
      });
    })
  );

  if (!needsImages) return;

  try {
    // Usa a query contextual da IA se disponível, senão fallback
    const searchQuery = imageQueries?.hero || category;
    const unsplash = await fetchAndSaveUnsplashImages(storeId, searchQuery, 8);
    let galleryIdx = 0;

    const getNextImage = (type: "hero" | "gallery"): string | undefined => {
      if (type === "hero") return unsplash.hero ?? undefined;
      const img = unsplash.gallery[galleryIdx % unsplash.gallery.length];
      if (img) galleryIdx++;
      return img ?? undefined;
    };

    for (const page of blueprint.pages) {
      for (const section of page.sections) {
        const c = section.content as Record<string, unknown>;
        const fields = getImageFields(section.blockType);

        for (const field of fields) {
          if (field.type === "single") {
            if (!c[field.path]) {
              const img = getNextImage(field.imageType);
              if (img) c[field.path] = img;
            }
          } else if (field.type === "array-items") {
            const items = c[field.path] as Array<Record<string, unknown>> | undefined;
            if (Array.isArray(items)) {
              items.forEach((item) => {
                if (!item.image) {
                  const img = getNextImage(field.imageType);
                  if (img) item.image = img;
                }
              });
            }
          } else if (field.type === "array-images") {
            const images = c[field.path] as unknown[];
            if (!images || images.length === 0) {
              c[field.path] = unsplash.gallery.map((url, i) => ({
                url,
                alt: `Imagem ${i + 1} do negócio`,
                caption: "",
              }));
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(
      "[fillImages] Unsplash failed:",
      error instanceof Error ? error.message : error
    );
  }
}