"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { after } from "next/server";
import type { BusinessContext } from "@/types/ai-generation";
import { runPhase1, runFollowUpPhase, generatePhase1Images } from "./generate-site-v2";
import { planPhases } from "@/lib/site-generation/phases";
import { loadBusinessContext } from "@/lib/site-generation/load-business-context";
import { finalizeMetrics } from "@/lib/generation-tracker";

// NOTE: `maxDuration` NÃO pode ser exportado de um arquivo "use server"
// (Next 15 só aceita async functions como export aqui).  O timeout precisa
// ser definido no Route Segment Config da página/rota que invoca a action
// (ex.: src/app/onboarding/manual/page.tsx) ou via vercel.json.

/**
 * Bootstrap site generation:
 *  - Phase 1 (sync, ~5–10s): generates design + first 2 sections + hero image,
 *    persists blueprint with placeholders { __generating: true } for the rest.
 *  - Phases 2 + 3 (background, fire-and-forget): generated content for the
 *    remaining sections + their images, merged into the blueprint as they
 *    complete. Status is exposed via store.generationStatus and polled by
 *    the editor.
 *
 *  Returning quickly avoids Cloudflare 524 / Vercel function timeouts that
 *  used to break onboarding when we awaited the full ~60–130s generation.
 */
export const bootstrapSiteV2 = authActionClient
  .schema(z.object({ storeId: z.string().uuid() }))
  .action(async ({ parsedInput: { storeId }, ctx: { userId } }) => {
    const ctx = await loadBusinessContext(storeId, userId);

    const phase1Result = await runPhase1({ ctx, userId });

    // Phases 2/3 rodam fora do request via after().  No Vercel, mantém a
    // função viva até maxDuration ou até o callback terminar — é o que evita
    // o 524 do Cloudflare.  finalizeMetrics consolida o tracking parcial em
    // site_generation_log, mesmo se uma fase falhar (parcial).
    after(async () => {
      try {
        await runBackgroundPhases({ ctx, userId, phase1Result });
      } finally {
        await finalizeMetrics(ctx.storeId);
      }
    });

    return {
      success: true,
      storeId,
      generationStatus: {
        phase: 1,
        sectionsReady: planPhases(phase1Result.totalSections).phase1.length,
        totalSections: phase1Result.totalSections,
        totalPhases: 3,
        done: false,
      },
    };
  });

async function runBackgroundPhases({
  ctx,
  userId,
  phase1Result,
}: {
  ctx: BusinessContext;
  userId: string;
  phase1Result: Awaited<ReturnType<typeof runPhase1>>;
}) {
  const { template, fontRecs, designContext, totalSections, phase1ImageQueries } = phase1Result;
  const plan = planPhases(totalSections);

  // Phase 1 hero image — primeiro, para o usuário ver o hero pronto rápido.
  try {
    await generatePhase1Images({
      ctx,
      userId,
      template,
      imageQueries: phase1ImageQueries,
    });
  } catch (err) {
    console.error("[bootstrapSiteV2] phase 1 images failed:", err);
  }

  // Phase 2: text + images sequenciais (cada fase aguarda suas imagens)
  try {
    await runFollowUpPhase({
      ctx,
      userId,
      template,
      fontRecs,
      designContext,
      phase: 2,
      sectionIndices: plan.phase2,
      totalSections,
    });
  } catch (err) {
    console.error("[bootstrapSiteV2] phase 2 failed:", err);
  }

  // Phase 3
  try {
    await runFollowUpPhase({
      ctx,
      userId,
      template,
      fontRecs,
      designContext,
      phase: 3,
      sectionIndices: plan.phase3,
      totalSections,
    });
  } catch (err) {
    console.error("[bootstrapSiteV2] phase 3 failed:", err);
  }
}
