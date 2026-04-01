import type { SiteBlueprint, BusinessContext } from "@/types/ai-generation";
import type { SectionContentMap, ImageSpec } from "@/templates/types";
import { getImageFields, blockNeedsImages } from "@/config/block-image-fields";
import { isBananaEnabled, bananaBatchGenerate } from "./banana-nano";
import type { BananaImageRequest } from "./banana-nano";
import { buildImagePrompts } from "./banana-prompt-builder";
import type { ImagePromptRequest } from "./banana-prompt-builder";
import { fetchAndSaveUnsplashImages } from "./unsplash-fallback";
import { optimizeHeroImage, optimizeGalleryImage } from "./image-optimizer";
import { uploadToS3 } from "./s3";
import { db } from "@/db";
import { imageGenerationLog } from "@/db/schema";

export interface AiImagePipelineOptions {
  blueprint: SiteBlueprint;
  businessContext: BusinessContext;
  storeId: string;
  contentMap: SectionContentMap[] | undefined;
  imageQueries?: Record<string, string | string[]>;
}

export interface AiImagePipelineResult {
  totalImages: number;
  bananaSuccessCount: number;
  unsplashFallbackCount: number;
  failedCount: number;
  costUsd: number;
  durationMs: number;
}

const DEFAULT_IMAGE_SPEC: ImageSpec = {
  aspectRatio: "4:3",
  style: "professional photo, natural lighting",
  subject: "business environment, professional setting",
  avoid: ["stock photo feel", "clipart", "text overlays", "blurry", "low quality"],
};

interface ImageSlot {
  sectionIndex: number;
  blockType: string;
  fieldPath: string;
  fieldType: "single" | "array-items" | "array-images";
  arrayIndex?: number;
  imageSpec: ImageSpec;
}

export async function generateAndFillImages(
  options: AiImagePipelineOptions
): Promise<AiImagePipelineResult> {
  const startTime = Date.now();
  const { blueprint, businessContext: ctx, storeId, contentMap, imageQueries } = options;

  const homepage = blueprint.pages?.find((p) => p.isHomepage) ?? blueprint.pages?.[0];
  if (!homepage?.sections) {
    return { totalImages: 0, bananaSuccessCount: 0, unsplashFallbackCount: 0, failedCount: 0, costUsd: 0, durationMs: 0 };
  }

  // Debug: log all sections in blueprint
  console.log(`[ImagePipeline] Blueprint sections: ${homepage.sections.length}`);
  homepage.sections.forEach((s, i) => {
    console.log(`[ImagePipeline]   [${i}] ${s.blockType} v${s.variant} — needsImages: ${blockNeedsImages(s.blockType)}`);
  });

  const slots = collectImageSlots(homepage.sections, contentMap);
  console.log(`[ImagePipeline] Image slots collected: ${slots.length}`);
  slots.forEach((s) => {
    console.log(`[ImagePipeline]   slot: ${slotId(s)} (${s.imageSpec.aspectRatio})`);
  });

  if (slots.length === 0) {
    console.log("[ImagePipeline] No image slots — skipping");
    return { totalImages: 0, bananaSuccessCount: 0, unsplashFallbackCount: 0, failedCount: 0, costUsd: 0, durationMs: 0 };
  }

  const urlMap: Record<string, string> = {};
  let bananaSuccessCount = 0;
  let unsplashFallbackCount = 0;
  let failedCount = 0;
  let costUsd = 0;

  console.log(`[ImagePipeline] Gemini image gen enabled: ${isBananaEnabled()}`);
  if (isBananaEnabled()) {
    const promptCtx = {
      businessName: ctx.name,
      category: ctx.category,
      city: ctx.city,
      templateStyle: blueprint.designTokens?.style || "modern",
      palette: {
        primary: blueprint.designTokens?.palette?.primary || "#000",
        accent: blueprint.designTokens?.palette?.accent || "#0066ff",
      },
    };

    const promptRequests: ImagePromptRequest[] = slots.map((slot) => ({
      id: slotId(slot),
      sectionIndex: slot.sectionIndex,
      blockType: slot.blockType,
      fieldPath: slot.fieldPath,
      imageSpec: slot.imageSpec,
      overrideSubject: getOverrideSubject(slot, imageQueries),
    }));

    const prompts = buildImagePrompts(promptCtx, promptRequests);

    const bananaRequests: BananaImageRequest[] = prompts.map((p) => ({
      id: p.id,
      prompt: p.prompt,
      width: p.width,
      height: p.height,
    }));

    try {
      const batchResult = await bananaBatchGenerate(bananaRequests, { timeoutMs: 120000 });
      costUsd = batchResult.costUsd;

      for (const result of batchResult.results) {
        if (result.status === "success" && result.imageData) {
          try {
            const slot = slots.find((s) => slotId(s) === result.id);
            const isHero = slot?.imageSpec.aspectRatio === "16:9";
            const optimized = isHero
              ? await optimizeHeroImage(result.imageData)
              : await optimizeGalleryImage(result.imageData);

            const s3Key = `stores/${storeId}/${Date.now()}-gemini-${result.id}.webp`;
            const { url } = await uploadToS3(optimized.buffer, s3Key);
            urlMap[result.id] = url;
            bananaSuccessCount++;
          } catch {
            // Optimize/upload failed — will fallback
          }
        }
      }
    } catch (err) {
      console.error("[ai-image-pipeline] Banana batch failed:", err);
    }
  }

  // Fallback: Unsplash for any slots without URLs
  const failedSlots = slots.filter((s) => !urlMap[slotId(s)]);
  if (failedSlots.length > 0) {
    try {
      const query = imageQueries?.hero as string || ctx.category;
      const unsplash = await fetchAndSaveUnsplashImages(storeId, query, Math.min(failedSlots.length + 2, 10));

      const allUnsplashUrls = [unsplash.hero, ...unsplash.gallery].filter(Boolean) as string[];
      let unsplashIdx = 0;

      for (const slot of failedSlots) {
        if (unsplashIdx < allUnsplashUrls.length) {
          urlMap[slotId(slot)] = allUnsplashUrls[unsplashIdx++];
          unsplashFallbackCount++;
        } else {
          failedCount++;
        }
      }
    } catch {
      failedCount += failedSlots.length;
    }
  }

  fillBlueprintWithUrls(homepage.sections, slots, urlMap);

  const durationMs = Date.now() - startTime;

  try {
    await db.insert(imageGenerationLog).values({
      storeId,
      provider: bananaSuccessCount > 0 && unsplashFallbackCount > 0 ? "mixed" : bananaSuccessCount > 0 ? "banana" : "unsplash",
      imageCount: slots.length,
      costUsd,
      durationMs,
      bananaSuccessCount,
      unsplashFallbackCount,
      failedCount,
      metadata: { totalSlots: slots.length },
    });
  } catch {
    // Log failure is non-critical
  }

  return {
    totalImages: slots.length,
    bananaSuccessCount,
    unsplashFallbackCount,
    failedCount,
    costUsd,
    durationMs,
  };
}

function collectImageSlots(
  sections: SiteBlueprint["pages"][0]["sections"],
  contentMap: SectionContentMap[] | undefined
): ImageSlot[] {
  const slots: ImageSlot[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (!blockNeedsImages(section.blockType)) continue;

    const fields = getImageFields(section.blockType);
    const mapEntry = contentMap?.[i];
    const baseSpec = mapEntry?.imageSpec || DEFAULT_IMAGE_SPEC;

    for (const field of fields) {
      const content = section.content as Record<string, unknown>;

      if (field.type === "single") {
        const existing = content[field.path] as string | undefined;
        if (!existing) {
          slots.push({
            sectionIndex: i,
            blockType: section.blockType,
            fieldPath: field.path,
            fieldType: "single",
            imageSpec: { ...baseSpec, aspectRatio: field.imageType === "hero" ? "16:9" : baseSpec.aspectRatio },
          });
        }
      } else if (field.type === "array-items") {
        const items = content[field.path] as Record<string, unknown>[] | undefined;
        if (items) {
          items.forEach((item, idx) => {
            if (!item.image) {
              slots.push({
                sectionIndex: i,
                blockType: section.blockType,
                fieldPath: `${field.path}.${idx}.image`,
                fieldType: "array-items",
                arrayIndex: idx,
                imageSpec: baseSpec,
              });
            }
          });
        }
      } else if (field.type === "array-images") {
        const images = content[field.path] as Record<string, unknown>[] | undefined;
        if (images) {
          images.forEach((img, idx) => {
            if (!img.url) {
              slots.push({
                sectionIndex: i,
                blockType: section.blockType,
                fieldPath: `${field.path}.${idx}.url`,
                fieldType: "array-images",
                arrayIndex: idx,
                imageSpec: baseSpec,
              });
            }
          });
        }
      }
    }
  }

  return slots;
}

function fillBlueprintWithUrls(
  sections: SiteBlueprint["pages"][0]["sections"],
  slots: ImageSlot[],
  urlMap: Record<string, string>
) {
  for (const slot of slots) {
    const url = urlMap[slotId(slot)];
    if (!url) continue;

    const content = sections[slot.sectionIndex].content as Record<string, unknown>;

    if (slot.fieldType === "single") {
      content[slot.fieldPath] = url;
    } else if (slot.fieldType === "array-items") {
      const parts = slot.fieldPath.split(".");
      const arrayKey = parts[0];
      const idx = parseInt(parts[1]);
      const items = content[arrayKey] as Record<string, unknown>[];
      if (items?.[idx]) items[idx].image = url;
    } else if (slot.fieldType === "array-images") {
      const parts = slot.fieldPath.split(".");
      const arrayKey = parts[0];
      const idx = parseInt(parts[1]);
      const images = content[arrayKey] as Record<string, unknown>[];
      if (images?.[idx]) images[idx].url = url;
    }
  }
}

function slotId(slot: ImageSlot): string {
  return `${slot.blockType}-${slot.sectionIndex}-${slot.fieldPath}`;
}

function getOverrideSubject(
  slot: ImageSlot,
  imageQueries?: Record<string, string | string[]>
): string | undefined {
  if (!imageQueries) return undefined;

  const query = imageQueries[slot.blockType];
  if (typeof query === "string") return query;
  if (Array.isArray(query) && slot.arrayIndex !== undefined) {
    return query[slot.arrayIndex % query.length];
  }
  return undefined;
}

