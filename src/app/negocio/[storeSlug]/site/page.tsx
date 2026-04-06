import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { SiteBlueprint } from "@/types/ai-generation";
import { EditorShell } from "@/app/editor/[storeSlug]/_components/editor-shell";
import { SiteGeneratingScreen } from "./_components/site-generating-screen";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function SiteEditorPage({ params }: Props) {
  const { storeSlug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/entrar");

  const isAdmin = (session.user as { role?: string }).role === "admin";

  const storeData = isAdmin
    ? await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, storeSlug),
        columns: { id: true, name: true, slug: true, siteBlueprintV2: true, isActive: true },
      })
    : await db.query.store.findFirst({
        where: (s, { and, eq }) =>
          and(eq(s.slug, storeSlug), eq(s.userId, session.user.id)),
        columns: { id: true, name: true, slug: true, siteBlueprintV2: true, isActive: true },
      });

  if (!storeData) redirect("/painel");

  // If blueprint not yet generated, show generating screen that polls for completion
  if (!storeData.siteBlueprintV2) {
    return (
      <SiteGeneratingScreen
        storeSlug={storeSlug}
        storeName={storeData.name}
      />
    );
  }

  const userStores = await db
    .select({ id: store.id, name: store.name, slug: store.slug })
    .from(store)
    .where(eq(store.userId, session.user.id))
    .orderBy(desc(store.createdAt));

  return (
    <EditorShell
      initialBlueprint={storeData.siteBlueprintV2 as SiteBlueprint}
      storeId={storeData.id}
      storeSlug={storeSlug}
      storeName={storeData.name}
      userStores={userStores}
      isPublished={storeData.isActive}
    />
  );
}
