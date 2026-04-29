import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const IMAGE_MODEL = "gemini-3.1-flash-image-preview";
const BATCH_TIMEOUT = parseInt(process.env.IMAGE_GEN_BATCH_TIMEOUT_MS || "45000");
const IMAGE_GEN_ENABLED = process.env.IMAGE_GEN_ENABLED !== "false";

export interface BananaImageRequest {
  id: string;
  prompt: string;
  width: number;
  height: number;
}

export interface BananaImageResponse {
  id: string;
  imageData: Buffer | null;
  mimeType: string;
  status: "success" | "failed";
  error?: string;
}

export interface BananaBatchResult {
  results: BananaImageResponse[];
  costUsd: number;
  durationMs: number;
}

export const ASPECT_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "16:9": { width: 1600, height: 900 },
  "1:1": { width: 1024, height: 1024 },
  "4:3": { width: 1200, height: 900 },
  "3:4": { width: 900, height: 1200 },
};

export function isBananaEnabled(): boolean {
  return IMAGE_GEN_ENABLED && !!GEMINI_API_KEY;
}

/**
 * Custo por imagem do Gemini 3.1 Flash Image (preview), conforme a tabela
 * oficial do Google AI:
 *   - Equivalente $0.045 por imagem ~0.5K tokens (≤ ~0.7MP)
 *   - Equivalente $0.067 por imagem ~1K tokens (≤ ~1.5MP)
 *   - Equivalente $0.101 por imagem ~2K tokens (≤ ~4MP)
 *   - Equivalente $0.151 por imagem ~4K tokens (> 4MP)
 *
 * Mapeamos pelo total de pixels (width × height) da request.
 *
 * Atualizado: 2026-04-29 com os preços oficiais publicados pelo Google AI.
 */
export function estimateGeminiImageCostUsd(width: number, height: number): number {
  const megapixels = (width * height) / 1_000_000;
  if (megapixels <= 0.7) return 0.045;
  if (megapixels <= 1.5) return 0.067;
  if (megapixels <= 4) return 0.101;
  return 0.151;
}

async function generateSingleImage(
  ai: GoogleGenAI,
  request: BananaImageRequest
): Promise<BananaImageResponse> {
  try {
    console.log(`[Gemini Image] Generating image ${request.id}...`);
    console.log(`[Gemini Image] Prompt: ${request.prompt.substring(0, 150)}...`);
    console.log(`[Gemini Image] Model: ${IMAGE_MODEL}, API Key present: ${!!GEMINI_API_KEY}`);

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: request.prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    console.log(`[Gemini Image] Response received for ${request.id}`);
    console.log(`[Gemini Image] Candidates: ${response.candidates?.length ?? 0}`);
    console.log(`[Gemini Image] Parts: ${response.candidates?.[0]?.content?.parts?.length ?? 0}`);

    // Log response structure for debugging
    if (response.candidates?.[0]?.content?.parts) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      response.candidates[0].content.parts.forEach((p: any, i: number) => {
        const keys = Object.keys(p);
        console.log(`[Gemini Image] Part ${i} keys: ${keys.join(", ")}`);
        if (p.inlineData) {
          console.log(`[Gemini Image] Part ${i} inlineData mimeType: ${p.inlineData.mimeType}, data length: ${p.inlineData.data?.length ?? 0}`);
        }
        if (p.text) {
          console.log(`[Gemini Image] Part ${i} text: ${p.text.substring(0, 100)}`);
        }
      });
    } else {
      console.log(`[Gemini Image] Full response:`, JSON.stringify(response).substring(0, 500));
    }

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts || parts.length === 0) {
      console.error(`[Gemini Image] FAILED ${request.id}: No parts in response`);
      return { id: request.id, imageData: null, mimeType: "", status: "failed", error: "No image in response" };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imagePart = parts.find((p: any) => p.inlineData);
    if (!imagePart?.inlineData) {
      console.error(`[Gemini Image] FAILED ${request.id}: No inlineData found in parts`);
      return { id: request.id, imageData: null, mimeType: "", status: "failed", error: "No inline data" };
    }

    const buffer = Buffer.from(imagePart.inlineData.data as string, "base64");
    const mimeType = (imagePart.inlineData.mimeType as string) || "image/png";

    console.log(`[Gemini Image] SUCCESS ${request.id}: ${buffer.length} bytes, ${mimeType}`);
    return { id: request.id, imageData: buffer, mimeType, status: "success" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Gemini Image] ERROR ${request.id}: ${message}`);
    if (err instanceof Error && err.stack) {
      console.error(`[Gemini Image] Stack: ${err.stack.substring(0, 300)}`);
    }
    return { id: request.id, imageData: null, mimeType: "", status: "failed", error: message };
  }
}

export async function bananaBatchGenerate(
  requests: BananaImageRequest[],
  options?: { timeoutMs?: number; retryFailedOnce?: boolean }
): Promise<BananaBatchResult> {
  const startTime = Date.now();
  const timeout = options?.timeoutMs ?? BATCH_TIMEOUT;

  console.log(`[Gemini Batch] Starting batch of ${requests.length} images, timeout: ${timeout}ms`);
  console.log(`[Gemini Batch] Enabled: ${IMAGE_GEN_ENABLED}, API Key present: ${!!GEMINI_API_KEY}, API Key length: ${GEMINI_API_KEY.length}`);

  if (!GEMINI_API_KEY) {
    console.error("[Gemini Batch] ABORTED: No GEMINI_API_KEY");
    return {
      results: requests.map((r) => ({ id: r.id, imageData: null, mimeType: "", status: "failed" as const, error: "No API key" })),
      costUsd: 0,
      durationMs: Date.now() - startTime,
    };
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const CONCURRENCY = parseInt(process.env.IMAGE_GEN_CONCURRENCY || "2");
  const DELAY_BETWEEN_MS = parseInt(process.env.IMAGE_GEN_DELAY_MS || "2000");

  console.log(`[Gemini Batch] Concurrency: ${CONCURRENCY}, delay between chunks: ${DELAY_BETWEEN_MS}ms`);

  try {
    const results: BananaImageResponse[] = [];
    const startedAt = Date.now();

    for (let i = 0; i < requests.length; i += CONCURRENCY) {
      if (Date.now() - startedAt > timeout) {
        console.warn(`[Gemini Batch] Timeout reached after ${i} images, stopping`);
        for (let j = i; j < requests.length; j++) {
          results.push({ id: requests[j].id, imageData: null, mimeType: "", status: "failed", error: "Timeout" });
        }
        break;
      }

      const chunk = requests.slice(i, i + CONCURRENCY);
      console.log(`[Gemini Batch] Processing chunk ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(requests.length / CONCURRENCY)} (${chunk.length} images)`);

      const chunkResults = await Promise.all(
        chunk.map((req) => generateSingleImage(ai, req))
      );
      results.push(...chunkResults);

      const hasSuccess = chunkResults.some((r) => r.status === "success");
      if (i + CONCURRENCY < requests.length) {
        const delay = hasSuccess ? DELAY_BETWEEN_MS : DELAY_BETWEEN_MS * 2;
        console.log(`[Gemini Batch] Waiting ${delay}ms before next chunk...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    const successCount = results.filter((r) => r.status === "success").length;
    // Custo real por imagem com base no width × height de cada request bem-sucedida.
    let costUsd = 0;
    const reqMap = new Map(requests.map((r) => [r.id, r]));
    for (const r of results) {
      if (r.status !== "success") continue;
      const req = reqMap.get(r.id);
      if (!req) continue;
      costUsd += estimateGeminiImageCostUsd(req.width, req.height);
    }
    console.log(
      `[Gemini Batch] Complete: ${successCount}/${requests.length} succeeded | costUsd=$${costUsd.toFixed(4)}`
    );

    return {
      results,
      costUsd,
      durationMs: Date.now() - startTime,
    };
  } catch (err) {
    console.error("[Gemini Batch] Fatal error:", err);
    return {
      results: requests.map((r) => ({ id: r.id, imageData: null, mimeType: "", status: "failed" as const, error: "Batch failed" })),
      costUsd: 0,
      durationMs: Date.now() - startTime,
    };
  }
}
