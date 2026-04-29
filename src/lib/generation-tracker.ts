import { db } from "@/db";
import { siteGenerationLog, store } from "@/db/schema";
import { eq } from "drizzle-orm";
import type {
  CostTrackingState,
  CostTrackingContentEntry,
  CostTrackingImageEntry,
} from "@/db/schema/stores.schema";

// Custos por 1.000 tokens (USD).  Atualizados com os preços oficiais
// publicados pelos provedores (verificados em 2026-04-29).
//
// Gemini 3.1 Flash Image (preview) — preços reais publicados pelo Google AI:
//   Input (texto/imagem):  $0.50 / 1M tokens   = $0.0005 / 1K
//   Output (texto):        $3    / 1M tokens   = $0.003  / 1K
//   Output (imagem):       $60   / 1M tokens   = $0.06   / 1K
//
// Para imagens geradas, o custo NÃO é calculado por essa tabela — é
// computado por imagem em `estimateGeminiImageCostUsd` (banana-nano.ts),
// usando os tiers oficiais por tamanho ($0.045 / $0.067 / $0.101 / $0.151).
// O `output` aqui (0.06) cobre o caso teórico de billing por tokens de
// imagem; na prática usamos o valor já vindo no `result.costUsd`.
const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  "claude-sonnet-4-6": { input: 0.003, output: 0.015 },
  "claude-opus-4-6": { input: 0.015, output: 0.075 },
  "gemini-3.1-flash-image-preview": { input: 0.0005, output: 0.06 },
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

// ════════════════════════════════════════════════════════════════
// INCREMENTAL TRACKING — para a geração progressiva (3 fases)
// ════════════════════════════════════════════════════════════════
// Cada fase pode rodar em uma invocação serverless diferente, então o
// estado parcial vive em store.generation_cost_tracking (jsonb). Quando
// done=true a função finalizeMetrics consolida em site_generation_log.

async function readTracking(storeId: string): Promise<CostTrackingState | null> {
  const row = await db.query.store.findFirst({
    where: (s, { eq }) => eq(s.id, storeId),
    columns: { generationCostTracking: true },
  });
  return (row?.generationCostTracking as CostTrackingState | null) ?? null;
}

async function writeTracking(
  storeId: string,
  next: CostTrackingState
): Promise<void> {
  await db
    .update(store)
    .set({ generationCostTracking: next })
    .where(eq(store.id, storeId));
}

export async function initCostTracking(
  storeId: string,
  init: { templateId?: string; templateName?: string; sectionsCount?: number }
): Promise<void> {
  const next: CostTrackingState = {
    startedAt: new Date().toISOString(),
    templateId: init.templateId,
    templateName: init.templateName,
    sectionsCount: init.sectionsCount,
    content: [],
    images: [],
  };
  await writeTracking(storeId, next);
}

export async function appendContentUsageToStore(
  storeId: string,
  phase: 1 | 2 | 3,
  usage: ContentUsage
): Promise<void> {
  const current =
    (await readTracking(storeId)) ?? {
      startedAt: new Date().toISOString(),
      content: [],
      images: [],
    };
  const entry: CostTrackingContentEntry = {
    phase,
    model: usage.model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    stopReason: usage.stopReason,
    durationMs: usage.durationMs,
  };
  current.content = [...current.content, entry];
  await writeTracking(storeId, current);
}

export async function appendImageUsageToStore(
  storeId: string,
  phase: 1 | 2 | 3,
  result: {
    totalImages: number;
    bananaSuccessCount: number;
    unsplashFallbackCount: number;
    failedCount: number;
    costUsd: number;
    durationMs: number;
  }
): Promise<void> {
  const current =
    (await readTracking(storeId)) ?? {
      startedAt: new Date().toISOString(),
      content: [],
      images: [],
    };
  const entry: CostTrackingImageEntry = {
    phase,
    totalCount: result.totalImages,
    successCount: result.bananaSuccessCount,
    fallbackCount: result.unsplashFallbackCount,
    failedCount: result.failedCount,
    costUsd: result.costUsd,
    durationMs: result.durationMs,
  };
  current.images = [...current.images, entry];
  await writeTracking(storeId, current);
}

export async function appendClassificationToStore(
  storeId: string,
  usage: ClassificationUsage
): Promise<void> {
  const current =
    (await readTracking(storeId)) ?? {
      startedAt: new Date().toISOString(),
      content: [],
      images: [],
    };
  current.classification = {
    model: usage.model,
    tokens: usage.tokens,
    durationMs: usage.durationMs,
  };
  await writeTracking(storeId, current);
}

/**
 * Soma o jsonb parcial e grava uma linha em site_generation_log.
 * Limpa o jsonb na store (deixa null) para indicar que o tracking
 * desta geração foi consolidado.
 */
export async function finalizeMetrics(storeId: string): Promise<void> {
  const tracking = await readTracking(storeId);
  if (!tracking) {
    console.warn(`[GenerationTracker] finalizeMetrics: no tracking for store=${storeId}`);
    return;
  }

  const totalDurationMs = Date.now() - new Date(tracking.startedAt).getTime();

  // Some todos os contents — mesmo se vieram modelos diferentes, somamos
  // tokens por modelo e calculamos custo proporcional.
  let contentInputTokens = 0;
  let contentOutputTokens = 0;
  let contentDurationMs = 0;
  let contentCostUsd = 0;
  let primaryContentModel: string | null = null;
  let lastStopReason: string | null = null;
  for (const c of tracking.content) {
    contentInputTokens += c.inputTokens;
    contentOutputTokens += c.outputTokens;
    contentDurationMs += c.durationMs;
    contentCostUsd += estimateCost(c.model, c.inputTokens, c.outputTokens);
    primaryContentModel = c.model;
    lastStopReason = c.stopReason;
  }

  let imageTotal = 0;
  let imageSuccess = 0;
  let imageFallback = 0;
  let imageFailed = 0;
  let imageDurationMs = 0;
  let imageCostUsd = 0;
  for (const i of tracking.images) {
    imageTotal += i.totalCount;
    imageSuccess += i.successCount;
    imageFallback += i.fallbackCount;
    imageFailed += i.failedCount;
    imageDurationMs += i.durationMs;
    imageCostUsd += i.costUsd;
  }

  const classificationCostUsd = tracking.classification
    ? estimateCost(tracking.classification.model, tracking.classification.tokens, 0)
    : 0;

  const totalCostUsd = contentCostUsd + imageCostUsd + classificationCostUsd;

  try {
    await db.insert(siteGenerationLog).values({
      storeId,
      totalDurationMs,
      contentDurationMs: contentDurationMs || null,
      imageDurationMs: imageDurationMs || null,
      classificationDurationMs: tracking.classification?.durationMs ?? null,

      contentModel: primaryContentModel,
      contentInputTokens: contentInputTokens || null,
      contentOutputTokens: contentOutputTokens || null,
      contentStopReason: lastStopReason,

      imageModel: tracking.images.length > 0 ? "gemini-3.1-flash-image-preview" : null,
      imageTotalCount: imageTotal || null,
      imageSuccessCount: imageSuccess || null,
      imageFallbackCount: imageFallback || null,

      classificationModel: tracking.classification?.model ?? null,
      classificationTokens: tracking.classification?.tokens ?? null,

      contentCostUsd,
      imageCostUsd,
      classificationCostUsd,
      totalCostUsd,

      templateId: tracking.templateId ?? null,
      templateName: tracking.templateName ?? null,
      sectionsCount: tracking.sectionsCount ?? null,

      metadata: {
        contentByPhase: tracking.content,
        imagesByPhase: tracking.images,
        imagesFailed: imageFailed,
      },
    });

    await db
      .update(store)
      .set({ generationCostTracking: null })
      .where(eq(store.id, storeId));

    console.log(
      `[GenerationTracker] Finalized store=${storeId}: ${totalDurationMs}ms total | ` +
      `Content: ${contentInputTokens}+${contentOutputTokens} tokens ($${contentCostUsd.toFixed(4)}) | ` +
      `Images: ${imageSuccess}/${imageTotal} ($${imageCostUsd.toFixed(4)}) | ` +
      `Total: $${totalCostUsd.toFixed(4)}`
    );
  } catch (err) {
    console.error("[GenerationTracker] finalizeMetrics failed:", err);
  }
}
