export const maxDuration = 300;

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { PageRenderer } from "@/components/site-renderer/page-renderer";
import { GenerateV2Button } from "./_components/generate-v2-button";
import type { SiteBlueprint } from "@/types/ai-generation";

export default async function PreviewV2Page({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/entrar");

  const isAdmin = (session.user as { role?: string }).role === "admin";

  const storeData = await db.query.store.findFirst({
    where: (s, { and, eq }) =>
      isAdmin
        ? eq(s.slug, storeSlug)
        : and(eq(s.slug, storeSlug), eq(s.userId, session.user.id)),
    columns: { id: true, name: true, siteBlueprintV2: true },
  });

  if (!storeData) redirect("/painel");

  const blueprint = storeData.siteBlueprintV2 as SiteBlueprint | null;
  const homepage =
    blueprint?.pages.find((p) => p.isHomepage) ?? blueprint?.pages[0];

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Preview V2 — {storeData.name}
        </span>
        <GenerateV2Button storeSlug={storeSlug} hasBlueprint={!!blueprint} />
      </div>

      {blueprint && homepage ? (
        <PageRenderer
          page={homepage}
          designTokens={blueprint.designTokens}
          isPreview
        />
      ) : (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-slate-500">
          <p>Nenhum blueprint gerado ainda.</p>
          <GenerateV2Button storeSlug={storeSlug} hasBlueprint={false} />
        </div>
      )}
    </div>
  );
}
