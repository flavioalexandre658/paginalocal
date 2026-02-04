'use server'

import { z } from 'zod'
import { actionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { service } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

const getServicesSchema = z.object({
  storeId: z.string().uuid(),
  onlyActive: z.boolean().optional().default(false),
})

export const getServicesAction = actionClient
  .schema(getServicesSchema)
  .action(async ({ parsedInput }) => {
    const result = await db
      .select()
      .from(service)
      .where(eq(service.storeId, parsedInput.storeId))
      .orderBy(asc(service.position))

    return result
  })
