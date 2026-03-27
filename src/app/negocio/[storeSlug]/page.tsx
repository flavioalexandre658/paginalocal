import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NegocioHomeContent } from "./_components/negocio-home-content";

interface Props {
  params: Promise<{ storeSlug: string }>;
}

export default async function NegocioHomePage({ params }: Props) {
  const { storeSlug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) notFound();

  const storeData = await db
    .select({
      id: store.id,
      name: store.name,
      slug: store.slug,
      isActive: store.isActive,
      customDomain: store.customDomain,
    })
    .from(store)
    .where(and(eq(store.slug, storeSlug), eq(store.userId, session.user.id)))
    .limit(1);

  if (!storeData[0]) notFound();

  const s = storeData[0];

  return (
    <NegocioHomeContent
      storeId={s.id}
      storeName={s.name}
      storeSlug={s.slug}
      isActive={s.isActive}
      customDomain={s.customDomain}
    />
  );
}
