'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead } from '@/db/schema'
import { eq, and, gte, sql } from 'drizzle-orm'

const getStoreMetricsSchema = z.object({
  storeId: z.string().uuid(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const getStoreMetricsAction = authActionClient
  .schema(getStoreMetricsSchema)
  .action(async ({ parsedInput }) => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startDate = parsedInput.startDate ? new Date(parsedInput.startDate) : startOfMonth

    const metrics = await db
      .select({
        total: sql<number>`count(*)::int`,
        whatsapp: sql<number>`count(*) filter (where ${lead.source} = 'whatsapp')::int`,
        call: sql<number>`count(*) filter (where ${lead.source} = 'call')::int`,
        form: sql<number>`count(*) filter (where ${lead.source} = 'form')::int`,
        mobile: sql<number>`count(*) filter (where ${lead.device} = 'mobile')::int`,
        desktop: sql<number>`count(*) filter (where ${lead.device} = 'desktop')::int`,
      })
      .from(lead)
      .where(
        and(
          eq(lead.storeId, parsedInput.storeId),
          gte(lead.createdAt, startDate)
        )
      )

    return metrics[0]
  })
