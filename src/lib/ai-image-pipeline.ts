import type { SiteBlueprint, BusinessContext } from "@/types/ai-generation";
import type { SectionContentMap, ImageSpec } from "@/templates/types";
import { getImageFields, blockNeedsImages } from "@/config/block-image-fields";
import { isBananaEnabled, bananaBatchGenerate } from "./banana-nano";
import type { BananaImageRequest } from "./banana-nano";
import { buildImagePrompts } from "./banana-prompt-builder";
import type { ImagePromptRequest } from "./banana-prompt-builder";
import { fetchUnsplashForSlots } from "./unsplash-fallback";
import { optimizeHeroImage, optimizeGalleryImage } from "./image-optimizer";
import { uploadToS3 } from "./s3";
import { IMAGE_PENDING_TOKEN } from "./image-pending-token";
import {
  getPrimaryImageSource,
  isFallbackEnabled,
  isImageSourceEnabled,
  describeImageSourceConfig,
  type ImageSource,
} from "./image-source-config";
import { db } from "@/db";
import { imageGenerationLog } from "@/db/schema";

export interface AiImagePipelineOptions {
  blueprint: SiteBlueprint;
  businessContext: BusinessContext;
  storeId: string;
  contentMap: SectionContentMap[] | undefined;
  imageQueries?: Record<string, string | string[]>;
  /** If provided, only sections at these indices will have their slots considered. */
  sectionIndicesFilter?: number[];
  /**
   * Called incrementally each time a slot finishes (S3 upload completed).
   * Lets the caller persist the URL into the blueprint progressively, so
   * the section can show a real image as soon as it's ready, without
   * waiting for the whole batch.
   */
  onSlotComplete?: (slot: {
    sectionOrder: number;
    fieldType: "single" | "array-items" | "array-images";
    fieldPath: string;
    url: string;
  }) => Promise<void> | void;
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
  const { blueprint, businessContext: ctx, storeId, contentMap, imageQueries, sectionIndicesFilter, onSlotComplete } = options;

  async function notifySlotComplete(slot: ImageSlot, url: string): Promise<void> {
    if (!onSlotComplete) return;
    try {
      const sectionOrder = blueprint.pages?.[0]?.sections?.[slot.sectionIndex]?.order ?? slot.sectionIndex;
      await onSlotComplete({
        sectionOrder,
        fieldType: slot.fieldType,
        fieldPath: slot.fieldPath,
        url,
      });
    } catch (err) {
      console.error("[ai-image-pipeline] onSlotComplete callback failed:", err);
    }
  }

  const homepage = blueprint.pages?.find((p) => p.isHomepage) ?? blueprint.pages?.[0];
  if (!homepage?.sections) {
    return { totalImages: 0, bananaSuccessCount: 0, unsplashFallbackCount: 0, failedCount: 0, costUsd: 0, durationMs: 0 };
  }

  // Debug: log all sections in blueprint
  console.log(`[ImagePipeline] Blueprint sections: ${homepage.sections.length} | filter=${sectionIndicesFilter ? sectionIndicesFilter.join(",") : "all"}`);
  homepage.sections.forEach((s, i) => {
    console.log(`[ImagePipeline]   [${i}] ${s.blockType} v${s.variant} — needsImages: ${blockNeedsImages(s.blockType)}`);
  });

  const slots = collectImageSlots(homepage.sections, contentMap, sectionIndicesFilter);
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

  const primary = getPrimaryImageSource();
  const fallbackOn = isFallbackEnabled();
  const fallback: ImageSource = primary === "unsplash" ? "gemini" : "unsplash";
  console.log(
    `[ImagePipeline] config: ${describeImageSourceConfig()} | total slots=${slots.length}`
  );

  async function runSource(
    source: ImageSource,
    pendingSlots: ImageSlot[]
  ): Promise<void> {
    if (pendingSlots.length === 0) return;
    if (!isImageSourceEnabled(source)) {
      console.warn(
        `[ImagePipeline] ⚠ ${source} desabilitada (sem API key ou IMAGE_GEN_ENABLED=false) — pulando ${pendingSlots.length} slot(s)`
      );
      return;
    }
    console.log(
      `[ImagePipeline] → executando ${source} para ${pendingSlots.length} slot(s)`
    );
    if (source === "gemini") {
      const result = await runGeminiBatch(
        pendingSlots,
        blueprint,
        ctx,
        storeId,
        imageQueries,
        urlMap,
        notifySlotComplete
      );
      bananaSuccessCount += result.success;
      costUsd += result.costUsd;
    } else {
      const result = await runUnsplashBatch(
        pendingSlots,
        ctx,
        storeId,
        imageQueries,
        urlMap,
        notifySlotComplete
      );
      unsplashFallbackCount += result.success;
    }
    const got = pendingSlots.filter((s) => urlMap[slotId(s)]).length;
    console.log(
      `[ImagePipeline] ← ${source}: ${got}/${pendingSlots.length} preenchidos`
    );
  }

  await runSource(primary, slots);

  if (fallbackOn) {
    const stillPending = slots.filter((s) => !urlMap[slotId(s)]);
    if (stillPending.length > 0) {
      console.log(
        `[ImagePipeline] ${stillPending.length} slot(s) sem URL após ${primary} — tentando fallback ${fallback}`
      );
      await runSource(fallback, stillPending);
    } else {
      console.log(`[ImagePipeline] todos slots preenchidos por ${primary} ✓`);
    }
  }

  failedCount = slots.filter((s) => !urlMap[slotId(s)]).length;

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
  contentMap: SectionContentMap[] | undefined,
  sectionIndicesFilter?: number[]
): ImageSlot[] {
  const slots: ImageSlot[] = [];
  const filterSet = sectionIndicesFilter
    ? new Set(sectionIndicesFilter)
    : null;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    // Skip placeholder sections — content not generated yet
    const content = section.content as Record<string, unknown> | undefined;
    if (content?.__generating) continue;
    // Apply filter if provided. Filter is matched against `order` (template index),
    // not array position — use section.order to be robust.
    if (filterSet && !filterSet.has(section.order)) continue;
    if (!blockNeedsImages(section.blockType)) continue;

    const fields = getImageFields(section.blockType);
    // Use section.order to look up content map (which is keyed by template index)
    const mapEntry = contentMap?.[section.order];
    // Sections marked iconOnly use icon tokens (lucide / fa) — no image gen
    if (mapEntry?.iconOnly) continue;
    const baseSpec = mapEntry?.imageSpec || DEFAULT_IMAGE_SPEC;

    for (const field of fields) {
      const content = section.content as Record<string, unknown>;

      if (field.type === "single") {
        const existing = content[field.path] as string | undefined;
        if (!existing || existing === IMAGE_PENDING_TOKEN) {
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
            if (!item.image || item.image === IMAGE_PENDING_TOKEN) {
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
            if (!img.url || img.url === IMAGE_PENDING_TOKEN) {
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

interface SourceRunResult {
  success: number;
  costUsd: number;
}

async function runGeminiBatch(
  pendingSlots: ImageSlot[],
  blueprint: SiteBlueprint,
  ctx: BusinessContext,
  storeId: string,
  imageQueries: Record<string, string | string[]> | undefined,
  urlMap: Record<string, string>,
  notifySlotComplete: (slot: ImageSlot, url: string) => Promise<void>
): Promise<SourceRunResult> {
  if (!isBananaEnabled()) {
    console.log(`[ImagePipeline] Gemini não está habilitado (sem GEMINI_API_KEY)`);
    return { success: 0, costUsd: 0 };
  }

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

  const promptRequests: ImagePromptRequest[] = pendingSlots.map((slot) => ({
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

  let success = 0;
  let costUsd = 0;
  try {
    const batchResult = await bananaBatchGenerate(bananaRequests, {
      timeoutMs: 120000,
    });
    costUsd = batchResult.costUsd;

    for (const result of batchResult.results) {
      if (result.status === "success" && result.imageData) {
        try {
          const slot = pendingSlots.find((s) => slotId(s) === result.id);
          const isHero = slot?.imageSpec.aspectRatio === "16:9";
          const optimized = isHero
            ? await optimizeHeroImage(result.imageData)
            : await optimizeGalleryImage(result.imageData);

          const s3Key = `stores/${storeId}/${Date.now()}-gemini-${result.id}.webp`;
          const { url } = await uploadToS3(optimized.buffer, s3Key);
          urlMap[result.id] = url;
          success++;
          if (slot) await notifySlotComplete(slot, url);
        } catch (err) {
          console.error(
            `[ai-image-pipeline] gemini optimize/upload failed for slot=${result.id}:`,
            err instanceof Error ? err.message : err
          );
        }
      }
    }
    console.log(
      `[ai-image-pipeline] gemini: ${success}/${pendingSlots.length} optimized+uploaded | costUsd=$${costUsd.toFixed(4)}`
    );
  } catch (err) {
    console.error("[ai-image-pipeline] Gemini batch failed:", err);
  }
  return { success, costUsd };
}

async function runUnsplashBatch(
  pendingSlots: ImageSlot[],
  ctx: BusinessContext,
  storeId: string,
  imageQueries: Record<string, string | string[]> | undefined,
  urlMap: Record<string, string>,
  notifySlotComplete: (slot: ImageSlot, url: string) => Promise<void>
): Promise<SourceRunResult> {
  let success = 0;
  try {
    const slotInputs = pendingSlots.map((s) => ({
      id: slotId(s),
      blockType: s.blockType,
      fieldPath: s.fieldPath,
      aspectRatio: s.imageSpec.aspectRatio,
      imageHint: getOverrideSubject(s, imageQueries) ?? s.imageSpec.subject,
    }));

    const fetchedUrls = await fetchUnsplashForSlots({
      storeId,
      slots: slotInputs,
      category: ctx.category,
      businessName: ctx.name,
      services: ctx.services,
    });

    for (const slot of pendingSlots) {
      const url = fetchedUrls[slotId(slot)];
      if (url) {
        urlMap[slotId(slot)] = url;
        success++;
        await notifySlotComplete(slot, url);
      }
    }
    console.log(
      `[ai-image-pipeline] unsplash: ${success}/${pendingSlots.length} fetched+uploaded`
    );
  } catch (err) {
    console.error(
      "[ai-image-pipeline] unsplash batch failed:",
      err instanceof Error ? err.message : err
    );
  }
  return { success, costUsd: 0 };
}

