import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";

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
        columns: { generationStatus: true, siteBlueprintV2: true },
      })
    : await db.query.store.findFirst({
        where: (s, { and, eq }) =>
          and(eq(s.slug, slug), eq(s.userId, session.user.id)),
        columns: { generationStatus: true, siteBlueprintV2: true },
      });

  if (!storeData) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    status: storeData.generationStatus ?? null,
    blueprint: storeData.siteBlueprintV2 ?? null,
  });
}
