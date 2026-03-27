import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function PainelPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/entrar");

  const stores = await db
    .select({ slug: store.slug })
    .from(store)
    .where(eq(store.userId, session.user.id))
    .orderBy(desc(store.createdAt))
    .limit(1);

  if (stores.length === 0) {
    redirect("/onboarding");
  }

  redirect(`/negocio/${stores[0].slug}`);
}
