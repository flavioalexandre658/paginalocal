import { ReactNode } from "react";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { NegocioLayoutShell } from "./_components/negocio-layout-shell";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ storeSlug: string }>;
}

export default async function NegocioLayout({ children, params }: LayoutProps) {
  const { storeSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/entrar");

  const storeData = await db
    .select({ id: store.id, name: store.name, slug: store.slug })
    .from(store)
    .where(and(eq(store.slug, storeSlug), eq(store.userId, session.user.id)))
    .limit(1);

  if (!storeData[0]) notFound();

  const userStores = await db
    .select({ id: store.id, name: store.name, slug: store.slug })
    .from(store)
    .where(eq(store.userId, session.user.id))
    .orderBy(desc(store.createdAt));

  return (
    <NegocioLayoutShell
      storeId={storeData[0].id}
      storeName={storeData[0].name}
      storeSlug={storeSlug}
      userStores={userStores}
    >
      {children}
    </NegocioLayoutShell>
  );
}
