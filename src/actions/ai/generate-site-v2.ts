"use server";

import { authActionClient } from "@/lib/safe-action";
import { anthropic } from "@/lib/anthropic";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import {
  BusinessContextSchema,
  SiteBlueprintSchema,
  type BusinessContext,
  type SiteBlueprint,
} from "@/types/ai-generation";
import { buildPrompt } from "./prompt-builder";
import { fetchAndSaveUnsplashImages } from "@/lib/unsplash-fallback";
import { getFontBySlug } from "@/lib/fonts"
import { migrateFontPairing } from "@/lib/font-migration"

export type GenerationModel = "sonnet" | "gpt-5.4-nano" | "gemini";

export const generateSiteV2 = authActionClient
  .schema(BusinessContextSchema)
  .action(async ({ parsedInput: ctx, ctx: { userId } }) => {
    const existingStore = await db.query.store.findFirst({
      where: (s, { and, eq }) =>
        and(eq(s.id, ctx.storeId), eq(s.userId, userId)),
      columns: { id: true },
    });

    if (!existingStore) {
      throw new Error("Loja não encontrada ou sem permissão");
    }

    const blueprint = await generateAndPersistBlueprint(ctx, userId);
    return { success: true, blueprint };
  });

export async function generateAndPersistBlueprint(
  ctx: BusinessContext,
  userId: string,
  model: GenerationModel = "sonnet"
): Promise<SiteBlueprint> {
  let blueprint: SiteBlueprint;

  switch (model) {
    case "gpt-5.4-nano":
      blueprint = await generateWithOpenAI(ctx);
      break;
    case "gemini":
      blueprint = await generateWithGemini(ctx);
      break;
    default:
      blueprint = await generateWithClaude(ctx);
  }

  await db
    .update(store)
    .set({
      siteBlueprintV2: blueprint,
      siteBlueprintV2GeneratedAt: new Date(),
    })
    .where(and(eq(store.id, ctx.storeId), eq(store.userId, userId)));

  return blueprint;
}

/** Clean markdown fences and normalize raw JSON into a valid SiteBlueprint */
async function normalizeAndValidate(
  rawText: string,
  label: string,
  category: string = "",
  storeId: string = "",
  storeName: string = ""
): Promise<SiteBlueprint> {
  const cleaned = rawText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const raw = JSON.parse(cleaned) as Record<string, unknown>;
  raw.generatedAt = new Date().toISOString();

  // pages: object → array
  if (raw.pages && !Array.isArray(raw.pages)) {
    raw.pages = Object.values(raw.pages as Record<string, unknown>);
  }

  // jsonLd may be nested in seo.jsonLd
  if (!raw.jsonLd && (raw as Record<string, unknown>).seo) {
    const seo = (raw as Record<string, unknown>).seo as Record<
      string,
      unknown
    >;
    if (seo.jsonLd) raw.jsonLd = seo.jsonLd;
  }

  if (!raw.navigation) raw.navigation = [];

  if (!raw.globalContent) {
    raw.globalContent = {
      brandVoice: "",
      tagline: "",
      ctaDefaultText: "Fale Conosco",
      ctaDefaultType: "whatsapp",
    };
  }

  // jsonLd.openingHours: normalize object array → string array
  if (raw.jsonLd) {
    const ld = raw.jsonLd as Record<string, unknown>;
    if (Array.isArray(ld.openingHours)) {
      ld.openingHours = (ld.openingHours as unknown[]).map((h) => {
        if (typeof h === "string") return h;
        if (typeof h === "object" && h !== null) {
          const spec = h as Record<string, unknown>;
          const days = Array.isArray(spec.dayOfWeek) ? spec.dayOfWeek : [];
          const dayAbbr: Record<string, string> = {
            Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th",
            Friday: "Fr", Saturday: "Sa", Sunday: "Su",
          };
          const abbrs = days.map((d) => dayAbbr[d as string] ?? d).join(",");
          return `${abbrs} ${spec.opens ?? "00:00"}-${spec.closes ?? "23:59"}`;
        }
        return String(h);
      });
    }
  }

  const pages = raw.pages as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(pages)) {
    pages.forEach((page) => {
      page.id = crypto.randomUUID();

      // Truncate metaDescription to 160 chars
      if (typeof page.metaDescription === "string" && page.metaDescription.length > 160) {
        page.metaDescription = page.metaDescription.slice(0, 157) + "...";
      }

      const sections = page.sections as
        | Array<Record<string, unknown>>
        | undefined;
      if (!Array.isArray(sections)) {
        page.sections = [];
        return;
      }
      sections.forEach((section) => {
        section.id = crypto.randomUUID();
        if (!section.blockType && section.type) {
          section.blockType = section.type;
        }
        // Inject storeName into header content if missing
        if (section.blockType === "header" && storeName) {
          const c = (section.content ?? {}) as Record<string, unknown>;
          if (!c.storeName) c.storeName = storeName;
          section.content = c;
        }
      });
    });
  }

  // Normalize font fields: migrate old fontPairing → headingFont/bodyFont
  const dt = raw.designTokens as Record<string, unknown> | undefined;
  if (dt) {
    // If AI returns old fontPairing format, migrate
    if (dt.fontPairing && !dt.headingFont) {
      const migrated = migrateFontPairing(dt as any);
      dt.headingFont = (migrated as any).headingFont;
      dt.bodyFont = (migrated as any).bodyFont;
    }
    // Validate font slugs exist, fallback to "inter"
    if (dt.headingFont && !getFontBySlug(dt.headingFont as string)) {
      dt.headingFont = "inter";
    }
    if (dt.bodyFont && !getFontBySlug(dt.bodyFont as string)) {
      dt.bodyFont = "inter";
    }
    // Ensure defaults
    if (!dt.headingFont) dt.headingFont = "inter";
    if (!dt.bodyFont) dt.bodyFont = "inter";
  }

  try {
    const blueprint = SiteBlueprintSchema.parse(raw);

    // Fill missing images with Unsplash (download → optimize → S3)
    if (category && storeId) {
      const needsImages = blueprint.pages.some((page) =>
        page.sections.some((s) => {
          const c = s.content as Record<string, unknown>;
          return (
            (s.blockType === "hero" && !c.backgroundImage) ||
            (s.blockType === "about" && !c.image) ||
            (s.blockType === "cta" && !c.backgroundImage) ||
            (s.blockType === "gallery" &&
              (!c.images || (c.images as unknown[]).length === 0))
          );
        })
      );

      if (needsImages) {
        try {
          const unsplash = await fetchAndSaveUnsplashImages(
            storeId,
            category,
            8
          );

          let galleryIdx = 0;
          for (const page of blueprint.pages) {
            for (const section of page.sections) {
              const c = section.content as Record<string, unknown>;

              if (
                section.blockType === "hero" &&
                !c.backgroundImage &&
                unsplash.hero
              ) {
                c.backgroundImage = unsplash.hero;
              }
              if (
                section.blockType === "about" &&
                !c.image &&
                unsplash.gallery[0]
              ) {
                c.image = unsplash.gallery[galleryIdx++] || unsplash.hero;
              }
              if (
                section.blockType === "cta" &&
                !c.backgroundImage &&
                unsplash.hero
              ) {
                c.backgroundImage = unsplash.hero;
              }
              if (section.blockType === "gallery") {
                const images = c.images as unknown[];
                if (!images || images.length === 0) {
                  c.images = unsplash.gallery.map((url, i) => ({
                    url,
                    alt: `Imagem ${i + 1} do negócio`,
                    caption: "",
                  }));
                }
              }
            }
          }
        } catch (error) {
          console.error(
            `[${label}] Unsplash fallback failed:`,
            error instanceof Error ? error.message : error
          );
        }
      }
    }

    return blueprint;
  } catch (e) {
    console.error(`[${label}] ZodError:`, JSON.stringify(e, null, 2));
    console.error(`[${label}] raw JSON:`, JSON.stringify(raw, null, 2));
    throw e;
  }
}

// ─── Claude (Sonnet) ────────────────────────────────────────────────

async function generateWithClaude(
  ctx: BusinessContext
): Promise<SiteBlueprint> {
  const { systemPrompt, userMessage } = buildPrompt(ctx);

  const response = await anthropic.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    temperature: 0.8,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  console.log(
    "[generateWithClaude] stop_reason:",
    response.stop_reason,
    "| output_tokens:",
    response.usage.output_tokens
  );

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return normalizeAndValidate(text, "generateWithClaude", ctx.category, ctx.storeId, ctx.name);
}

// ─── OpenAI (gpt-5.4-nano) ──────────────────────────────────────────

async function generateWithOpenAI(
  ctx: BusinessContext
): Promise<SiteBlueprint> {
  const { systemPrompt, userMessage } = buildPrompt(ctx);

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4-nano",
    max_completion_tokens: 16000,
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
  });

  const text = completion.choices[0]?.message?.content ?? "";

  console.log(
    "[generateWithOpenAI] finish_reason:",
    completion.choices[0]?.finish_reason,
    "| tokens:",
    completion.usage?.completion_tokens
  );

  return normalizeAndValidate(text, "generateWithOpenAI", ctx.category, ctx.storeId, ctx.name);
}

// ─── Google Gemini (1.5 Flash) ──────────────────────────────────────

async function generateWithGemini(
  ctx: BusinessContext
): Promise<SiteBlueprint> {
  const { systemPrompt, userMessage } = buildPrompt(ctx);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.1-pro-preview",
    generationConfig: { maxOutputTokens: 16000, temperature: 0.7 },
  });

  const result = await model.generateContent(
    `${systemPrompt}\n\n---\n\n${userMessage}`
  );
  const text = result.response.text();

  console.log("[generateWithGemini] response length:", text.length);

  return normalizeAndValidate(text, "generateWithGemini", ctx.category, "", ctx.name);
}
