'use server'

import { z } from 'zod'
import { db } from '@/db'
import { category } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { eq } from 'drizzle-orm'

const getCategoryBySlugSchema = z.object({
  slug: z.string().min(1),
})

export const getCategoryBySlugAction = actionClient
  .schema(getCategoryBySlugSchema)
  .action(async ({ parsedInput }) => {
    const { slug } = parsedInput

    const [categoryData] = await db
      .select()
      .from(category)
      .where(eq(category.slug, slug))
      .limit(1)

    return categoryData || null
  })

export async function getCategoryBySlug(slug: string) {
  const [categoryData] = await db
    .select()
    .from(category)
    .where(eq(category.slug, slug))
    .limit(1)

  return categoryData || null
}
