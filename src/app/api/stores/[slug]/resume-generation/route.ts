import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import type { SiteBlueprint } from "@/types/ai-generation";
import type { GenerationStatus } from "@/db/schema/stores.schema";
import { runFollowUpPhase } from "@/actions/ai/generate-site-v2";
import { planPhases } from "@/lib/site-generation/phases";
import { loadBusinessContext } from "@/lib/site-generation/load-business-context";
import { finalizeMetrics } from "@/lib/generation-tracker";
import { getBestTemplate } from "@/config/template-catalog";
import { getFontRecommendations } from "@/config/niche-font-recommendations";

export const maxDuration = 300;

/**
 * Retomada idempotente da geração de um site.
 * Chamada manual ou pelo cliente quando detecta progresso parado por > 90s.
 *
 * - Se generationStatus.done = true → 200 OK sem trabalho.
 * - Senão, identifica os índices ainda com { __generating: true } no
 *   blueprint persistido e dispara runFollowUpPhase para cada grupo
 *   (phase 2 e/ou phase 3, conforme planPhases).
 * - Idempotente: chamadas concorrentes só encontram índices remanescentes,
 *   não corrompem nada.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const isAdmin = (session.user as { role?: string }).role === "admin";

  const storeData = isAdmin
    ? await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, slug),
        columns: {
          id: true,
          userId: true,
          siteBlueprintV2: true,
          generationStatus: true,
        },
      })
    : await db.query.store.findFirst({
        where: (s, { and, eq }) =>
          and(eq(s.slug, slug), eq(s.userId, session.user.id)),
        columns: {
          id: true,
          userId: true,
          siteBlueprintV2: true,
          generationStatus: true,
        },
      });

  if (!storeData) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const status = storeData.generationStatus as GenerationStatus | null;
  if (status?.done) {
    return NextResponse.json({ resumed: false, reason: "already_done" });
  }

  const blueprint = storeData.siteBlueprintV2 as SiteBlueprint | null;
  if (!blueprint) {
    return NextResponse.json(
      { resumed: false, reason: "no_blueprint" },
      { status: 409 }
    );
  }

  const homepage =
    blueprint.pages?.find((p) => p.isHomepage) ?? blueprint.pages?.[0];
  const pendingIndices: number[] = [];
  if (homepage?.sections) {
    for (const sec of homepage.sections) {
      const isPlaceholder =
        (sec.content as Record<string, unknown> | undefined)?.__generating ===
        true;
      if (isPlaceholder) pendingIndices.push(sec.order);
    }
  }

  if (pendingIndices.length === 0) {
    return NextResponse.json({ resumed: false, reason: "nothing_pending" });
  }

  const ctx = await loadBusinessContext(storeData.id, storeData.userId);
  const template = await getBestTemplate(ctx.category);
  const fontRecs = getFontRecommendations(ctx.category);
  const totalSections = template.defaultSections.length;
  const plan = planPhases(totalSections);

  const phase2Set = new Set(plan.phase2);
  const phase3Set = new Set(plan.phase3);
  const pendingPhase2 = pendingIndices.filter((i) => phase2Set.has(i));
  const pendingPhase3 = pendingIndices.filter((i) => phase3Set.has(i));

  const designContext = {
    palette: blueprint.designTokens.palette as Record<string, string>,
    headingFont: blueprint.designTokens.headingFont,
    bodyFont: blueprint.designTokens.bodyFont,
    highlightStyle: blueprint.designTokens.highlightStyle,
    brandVoice: blueprint.globalContent?.brandVoice,
    tone: ctx.tone,
  };

  after(async () => {
    try {
      if (pendingPhase2.length > 0) {
        await runFollowUpPhase({
          ctx,
          userId: storeData.userId,
          template,
          fontRecs,
          designContext,
          phase: 2,
          sectionIndices: pendingPhase2,
          totalSections,
        });
      }
      if (pendingPhase3.length > 0) {
        await runFollowUpPhase({
          ctx,
          userId: storeData.userId,
          template,
          fontRecs,
          designContext,
          phase: 3,
          sectionIndices: pendingPhase3,
          totalSections,
        });
      }
    } catch (err) {
      console.error("[resume-generation] background failed:", err);
    } finally {
      await finalizeMetrics(storeData.id);
    }
  });

  return NextResponse.json({
    resumed: true,
    pendingPhase2: pendingPhase2.length,
    pendingPhase3: pendingPhase3.length,
  });
}
