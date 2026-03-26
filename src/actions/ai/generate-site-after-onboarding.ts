"use server";

import { authActionClient } from "@/lib/safe-action";
import { z } from "zod";
import { db } from "@/db";
import type { BusinessContext } from "@/types/ai-generation";
import { generateAndPersistBlueprint } from "./generate-site-v2";

export const generateSiteAfterOnboarding = authActionClient
  .schema(
    z.object({
      storeId: z.string().uuid(),
    })
  )
  .action(async ({ parsedInput: { storeId }, ctx: { userId } }) => {
    const storeData = await db.query.store.findFirst({
      where: (s, { and, eq }) =>
        and(eq(s.id, storeId), eq(s.userId, userId)),
    });

    if (!storeData) throw new Error("Loja não encontrada");

    const [services, testimonials, storeImages] =
      await Promise.all([
        db.query.service.findMany({
          where: (s, { eq }) => eq(s.storeId, storeId),
          columns: { name: true, description: true },
        }),
        db.query.testimonial.findMany({
          where: (t, { eq }) => eq(t.storeId, storeId),
          columns: { content: true, rating: true, authorName: true },
        }),
        db.query.storeImage.findMany({
          where: (img, { eq }) => eq(img.storeId, storeId),
          columns: { url: true, role: true, order: true },
          orderBy: (img, { asc }) => asc(img.order),
        }),
      ]);

    const neighborhoods = storeData.neighborhoods as string[] | null;

    const ctx: BusinessContext = {
      storeId: storeData.id,
      name: storeData.name,
      category: storeData.category,
      city: storeData.city,
      state: storeData.state,
      neighborhood: neighborhoods?.[0] ?? undefined,
      fullAddress: storeData.address ?? undefined,
      siteType: (storeData.mode ?? "LOCAL_BUSINESS") as BusinessContext["siteType"],
      tone: "friendly",
      pronoun: storeData.termGender === "MASCULINE" ? "o" : "a",
      plurality: storeData.termNumber === "PLURAL" ? "plural" : "singular",
      phone: storeData.phone ?? undefined,
      whatsapp: storeData.whatsapp ?? undefined,
      email: storeData.email ?? undefined,
      website: storeData.website ?? undefined,
      primaryColor: storeData.primaryColor ?? undefined,
      secondaryColor: storeData.secondaryColor ?? undefined,
      accentColor: storeData.accentColor ?? undefined,
      description: storeData.description ?? undefined,
      googlePlaceId: storeData.googlePlaceId ?? undefined,
      services: services.map((s) => s.name),
      differentials: storeData.differential
        ? [storeData.differential as string]
        : [],
      photos: storeImages.map((img) => img.url),
      reviews: testimonials.map((t) => ({
        text: t.content,
        rating: t.rating,
        author: t.authorName,
      })),
      hours:
        (storeData.openingHours as Record<string, string> | undefined) ??
        undefined,
    };

    const blueprint = await generateAndPersistBlueprint(ctx, userId, "sonnet");
    return { success: true, blueprint };
  });
