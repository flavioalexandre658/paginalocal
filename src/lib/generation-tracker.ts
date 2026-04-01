import { db } from "@/db";
import { siteGenerationLog } from "@/db/schema";

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 0.003, output: 0.015 },
  "claude-opus-4-6": { input: 0.015, output: 0.075 },
  "gemini-3.1-flash-image-preview": { input: 0.0, output: 0.003 },
  "gemini-3.1-pro-preview": { input: 0.00125, output: 0.005 },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const rates = COST_PER_1K_TOKENS[model] || { input: 0.003, output: 0.015 };
  return (inputTokens / 1000) * rates.input + (outputTokens / 1000) * rates.output;
}

export interface ContentUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
  stopReason: string;
  durationMs: number;
}

export interface ImageUsage {
  totalCount: number;
  successCount: number;
  fallbackCount: number;
  failedCount: number;
  durationMs: number;
  costUsd: number;
}

export interface ClassificationUsage {
  model: string;
  tokens: number;
  durationMs: number;
}

export interface GenerationTracker {
  startTime: number;
  content: ContentUsage | null;
  images: ImageUsage | null;
  classification: ClassificationUsage | null;
  templateId: string;
  templateName: string;
  sectionsCount: number;
}

export function createTracker(): GenerationTracker {
  return {
    startTime: Date.now(),
    content: null,
    images: null,
    classification: null,
    templateId: "",
    templateName: "",
    sectionsCount: 0,
  };
}

export function trackContent(tracker: GenerationTracker, usage: ContentUsage) {
  tracker.content = usage;
}

export function trackImages(tracker: GenerationTracker, result: ImageUsage) {
  tracker.images = result;
}

export function trackClassification(tracker: GenerationTracker, usage: ClassificationUsage) {
  tracker.classification = usage;
}

export function trackTemplate(tracker: GenerationTracker, id: string, name: string, sectionsCount: number) {
  tracker.templateId = id;
  tracker.templateName = name;
  tracker.sectionsCount = sectionsCount;
}

export async function persistMetrics(tracker: GenerationTracker, storeId: string): Promise<void> {
  const totalDurationMs = Date.now() - tracker.startTime;

  const contentCostUsd = tracker.content
    ? estimateCost(tracker.content.model, tracker.content.inputTokens, tracker.content.outputTokens)
    : 0;

  const imageCostUsd = tracker.images?.costUsd ?? 0;

  const classificationCostUsd = tracker.classification
    ? estimateCost(tracker.classification.model, tracker.classification.tokens, 0)
    : 0;

  const totalCostUsd = contentCostUsd + imageCostUsd + classificationCostUsd;

  try {
    await db.insert(siteGenerationLog).values({
      storeId,
      totalDurationMs,
      contentDurationMs: tracker.content?.durationMs ?? null,
      imageDurationMs: tracker.images?.durationMs ?? null,
      classificationDurationMs: tracker.classification?.durationMs ?? null,

      contentModel: tracker.content?.model ?? null,
      contentInputTokens: tracker.content?.inputTokens ?? null,
      contentOutputTokens: tracker.content?.outputTokens ?? null,
      contentStopReason: tracker.content?.stopReason ?? null,

      imageModel: tracker.images ? "gemini-3.1-flash-image-preview" : null,
      imageTotalCount: tracker.images?.totalCount ?? null,
      imageSuccessCount: tracker.images?.successCount ?? null,
      imageFallbackCount: tracker.images?.fallbackCount ?? null,

      classificationModel: tracker.classification?.model ?? null,
      classificationTokens: tracker.classification?.tokens ?? null,

      contentCostUsd,
      imageCostUsd,
      classificationCostUsd,
      totalCostUsd,

      templateId: tracker.templateId || null,
      templateName: tracker.templateName || null,
      sectionsCount: tracker.sectionsCount || null,

      metadata: {
        contentInputTokens: tracker.content?.inputTokens,
        contentOutputTokens: tracker.content?.outputTokens,
        imagesFailed: tracker.images?.failedCount ?? 0,
      },
    });

    console.log(
      `[GenerationTracker] Persisted: ${totalDurationMs}ms total | ` +
      `Content: ${tracker.content?.inputTokens ?? 0}+${tracker.content?.outputTokens ?? 0} tokens ($${contentCostUsd.toFixed(4)}) | ` +
      `Images: ${tracker.images?.successCount ?? 0}/${tracker.images?.totalCount ?? 0} ($${imageCostUsd.toFixed(4)}) | ` +
      `Total: $${totalCostUsd.toFixed(4)}`
    );
  } catch (err) {
    console.error("[GenerationTracker] Failed to persist:", err);
  }
}
