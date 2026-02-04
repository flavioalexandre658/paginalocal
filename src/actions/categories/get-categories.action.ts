'use server'

import { db } from '@/db'
import { category } from '@/db/schema'
import { actionClient } from '@/lib/safe-action'
import { asc } from 'drizzle-orm'

export const getCategoriesAction = actionClient.action(async () => {
  const categories = await db
    .select()
    .from(category)
    .orderBy(asc(category.name))

  return categories
})
