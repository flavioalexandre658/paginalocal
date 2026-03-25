"use server";

import { z } from "zod";
import { authActionClient } from "@/lib/safe-action";
import { db } from "@/db";
import { store } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { uploadToS3, generateS3Key } from "@/lib/s3";
import { optimizeImage } from "@/lib/image-optimizer";

const ROLE_CONFIG = {
  hero: { maxWidth: 1600, maxHeight: 900, quality: 75 },
  gallery: { maxWidth: 800, maxHeight: 600, quality: 70 },
  logo: { maxWidth: 400, maxHeight: 400, quality: 80 },
  general: { maxWidth: 800, maxHeight: 800, quality: 70 },
} as const;

const uploadEditorImageSchema = z.object({
  storeId: z.string().uuid(),
  imageData: z.string().min(1),
  role: z.enum(["hero", "gallery", "logo", "general"]).default("general"),
  filename: z.string().default("editor-image"),
});

export const uploadEditorImageAction = authActionClient
  .schema(uploadEditorImageSchema)
  .action(async ({ parsedInput: { storeId, imageData, role, filename }, ctx }) => {
    const isAdmin = ctx.userRole === "admin";

    const [storeData] = await db
      .select({ id: store.id })
      .from(store)
      .where(
        isAdmin
          ? eq(store.id, storeId)
          : and(eq(store.id, storeId), eq(store.userId, ctx.userId))
      )
      .limit(1);

    if (!storeData) throw new Error("Loja nao encontrada");

    // Decode base64
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Optimize
    const config = ROLE_CONFIG[role];
    const optimized = await optimizeImage(buffer, config);

    // Upload to S3
    const key = generateS3Key(storeId, `${role}-${filename}`);
    const { url } = await uploadToS3(optimized.buffer, key, "image/webp");

    return { url };
  });
