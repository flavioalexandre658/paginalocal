"use server";

import { db } from "@/db";
import { siteTemplate } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getTemplatesAction() {
  const rows = await db
    .select({
      id: siteTemplate.id,
      name: siteTemplate.name,
      description: siteTemplate.description,
      thumbnailUrl: siteTemplate.thumbnailUrl,
      previewUrl: siteTemplate.previewUrl,
      bestFor: siteTemplate.bestFor,
      forceStyle: siteTemplate.forceStyle,
      forceRadius: siteTemplate.forceRadius,
    })
    .from(siteTemplate)
    .where(eq(siteTemplate.isActive, true))
    .orderBy(asc(siteTemplate.sortOrder));

  return rows;
}
