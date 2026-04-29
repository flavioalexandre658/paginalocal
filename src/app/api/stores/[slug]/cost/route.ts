import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { siteGenerationLog } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Custo de geração de um site específico.
 *
 * Retorna a última linha de site_generation_log para o storeId, com
 * tokens, custos e durações. Se ainda não houver registro consolidado
 * (geração em andamento), retorna `{ ready: false }`.
 *
 * Acessível via navegador autenticado por:
 *  - dono da loja
 *  - usuário com role=admin
 *
 * Não exposto na UI nesta versão — destinado a operação interna.
 */
export async function GET(
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
        columns: { id: true },
      })
    : await db.query.store.findFirst({
        where: (s, { and, eq }) =>
          and(eq(s.slug, slug), eq(s.userId, session.user.id)),
        columns: { id: true },
      });

  if (!storeData) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [log] = await db
    .select()
    .from(siteGenerationLog)
    .where(eq(siteGenerationLog.storeId, storeData.id))
    .orderBy(desc(siteGenerationLog.createdAt))
    .limit(1);

  if (!log) {
    return NextResponse.json({ ready: false });
  }

  return NextResponse.json({
    ready: true,
    totalCostUsd: log.totalCostUsd ?? 0,
    contentCostUsd: log.contentCostUsd ?? 0,
    imageCostUsd: log.imageCostUsd ?? 0,
    classificationCostUsd: log.classificationCostUsd ?? 0,
    contentInputTokens: log.contentInputTokens ?? 0,
    contentOutputTokens: log.contentOutputTokens ?? 0,
    contentModel: log.contentModel,
    imageModel: log.imageModel,
    imageTotalCount: log.imageTotalCount ?? 0,
    imageSuccessCount: log.imageSuccessCount ?? 0,
    imageFallbackCount: log.imageFallbackCount ?? 0,
    classificationModel: log.classificationModel,
    classificationTokens: log.classificationTokens ?? 0,
    totalDurationMs: log.totalDurationMs,
    contentDurationMs: log.contentDurationMs,
    imageDurationMs: log.imageDurationMs,
    classificationDurationMs: log.classificationDurationMs,
    templateId: log.templateId,
    templateName: log.templateName,
    sectionsCount: log.sectionsCount,
    metadata: log.metadata,
    generatedAt: log.createdAt.toISOString(),
  });
}
