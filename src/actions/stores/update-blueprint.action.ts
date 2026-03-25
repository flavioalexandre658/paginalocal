"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SiteBlueprintSchema } from "@/types/ai-generation";
import { revalidateStoreCache } from "@/lib/sitemap-revalidation";

const updateBlueprintSchema = z.object({
  storeId: z.string().uuid(),
  blueprint: SiteBlueprintSchema,
});

export const updateBlueprintAction = authActionClient
  .schema(updateBlueprintSchema)
  .action(async ({ parsedInput: { storeId, blueprint }, ctx }) => {
    const isAdmin = ctx.userRole === "admin";

    const [storeData] = await db
      .select({ id: store.id, slug: store.slug })
      .from(store)
      .where(
        isAdmin
          ? eq(store.id, storeId)
          : and(eq(store.id, storeId), eq(store.userId, ctx.userId))
      )
      .limit(1);

    if (!storeData) throw new Error("Loja nao encontrada");

    await db
      .update(store)
      .set({
        siteBlueprintV2: blueprint,
        updatedAt: new Date(),
      })
      .where(eq(store.id, storeId));

    revalidateStoreCache(storeData.slug);

    return { success: true };
  });
