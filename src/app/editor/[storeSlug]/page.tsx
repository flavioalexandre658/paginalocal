import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import type { SiteBlueprint } from "@/types/ai-generation";
import { EditorShell } from "./_components/editor-shell";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function EditorPage({ params }: Props) {
  const { storeSlug } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/entrar");

  const isAdmin = (session.user as { role?: string }).role === "admin";

  const storeData = isAdmin
    ? await db.query.store.findFirst({
        where: (s, { eq }) => eq(s.slug, storeSlug),
        columns: { id: true, name: true, slug: true, siteBlueprintV2: true },
      })
    : await db.query.store.findFirst({
        where: (s, { and, eq }) =>
          and(eq(s.slug, storeSlug), eq(s.userId, session.user.id)),
        columns: { id: true, name: true, slug: true, siteBlueprintV2: true },
      });

  if (!storeData) redirect("/painel");

  if (!storeData.siteBlueprintV2) {
    redirect(`/painel/${storeSlug}`);
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
    />
  );
}
