'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { lead, store } from '@/db/schema'
import { eq, and, desc, gte, lte, count, sql, ilike, or } from 'drizzle-orm'

const getLeadsPaginatedSchema = z.object({
  storeId: z.string().uuid(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  source: z.enum(['whatsapp', 'call', 'all']).optional(),
  device: z.enum(['mobile', 'desktop', 'all']).optional(),
  referrer: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  search: z.string().optional(),
})

export const getLeadsPaginatedAction = authActionClient
  .schema(getLeadsPaginatedSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const conditions = [eq(lead.storeId, parsedInput.storeId)]

    if (parsedInput.source && parsedInput.source !== 'all') {
      if (parsedInput.source === 'whatsapp') {
        conditions.push(
          or(
            eq(lead.source, 'whatsapp'),
            eq(lead.source, 'blocked_whatsapp')
          )!
        )
      } else if (parsedInput.source === 'call') {
        conditions.push(
          or(
            eq(lead.source, 'call'),
            eq(lead.source, 'phone'),
            eq(lead.source, 'blocked_phone')
          )!
        )
      }
    }

    if (parsedInput.device && parsedInput.device !== 'all') {
      conditions.push(eq(lead.device, parsedInput.device))
    }

    if (parsedInput.referrer) {
      conditions.push(eq(lead.referrer, parsedInput.referrer))
    }

    if (parsedInput.startDate) {
      conditions.push(gte(lead.createdAt, new Date(parsedInput.startDate)))
    }

    if (parsedInput.endDate) {
      conditions.push(lte(lead.createdAt, new Date(parsedInput.endDate)))
    }

    if (parsedInput.utmSource) {
      conditions.push(eq(lead.utmSource, parsedInput.utmSource))
    }

    if (parsedInput.utmCampaign) {
      conditions.push(eq(lead.utmCampaign, parsedInput.utmCampaign))
    }

    if (parsedInput.search) {
      conditions.push(
        or(
          ilike(lead.location, `%${parsedInput.search}%`),
          ilike(lead.utmCampaign, `%${parsedInput.search}%`),
          ilike(lead.utmSource, `%${parsedInput.search}%`)
        )!
      )
    }

    const whereClause = and(...conditions)

    const [totalResult] = await db
      .select({ count: count() })
      .from(lead)
      .where(whereClause)

    const totalCount = totalResult?.count || 0
    const totalPages = Math.ceil(totalCount / parsedInput.pageSize)
    const offset = (parsedInput.page - 1) * parsedInput.pageSize

    const data = await db
      .select({
        id: lead.id,
        source: lead.source,
        device: lead.device,
        referrer: lead.referrer,
        location: lead.location,
        touchpoint: lead.touchpoint,
        sessionId: lead.sessionId,
        utmSource: lead.utmSource,
        utmMedium: lead.utmMedium,
        utmCampaign: lead.utmCampaign,
        pageviewsBeforeConversion: lead.pageviewsBeforeConversion,
        isFromBlockedSite: lead.isFromBlockedSite,
        createdAt: lead.createdAt,
      })
      .from(lead)
      .where(whereClause)
      .orderBy(desc(lead.createdAt))
      .limit(parsedInput.pageSize)
      .offset(offset)

    return {
      data,
      totalCount,
      totalPages,
      page: parsedInput.page,
      pageSize: parsedInput.pageSize,
    }
  })

export const getLeadsStatsAction = authActionClient
  .schema(z.object({ storeId: z.string().uuid() }))
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalLeads,
      whatsappLeads,
      callLeads,
      mobileLeads,
      leadsLast30Days,
    ] = await Promise.all([
      db.select({ count: count() }).from(lead).where(eq(lead.storeId, parsedInput.storeId)),
      db.select({ count: count() }).from(lead).where(
        and(
          eq(lead.storeId, parsedInput.storeId),
          or(eq(lead.source, 'whatsapp'), eq(lead.source, 'blocked_whatsapp'))
        )
      ),
      db.select({ count: count() }).from(lead).where(
        and(
          eq(lead.storeId, parsedInput.storeId),
          or(eq(lead.source, 'call'), eq(lead.source, 'phone'), eq(lead.source, 'blocked_phone'))
        )
      ),
      db.select({ count: count() }).from(lead).where(
        and(eq(lead.storeId, parsedInput.storeId), eq(lead.device, 'mobile'))
      ),
      db.select({ count: count() }).from(lead).where(
        and(eq(lead.storeId, parsedInput.storeId), gte(lead.createdAt, thirtyDaysAgo))
      ),
    ])

    const referrerStats = await db
      .select({
        referrer: lead.referrer,
        count: count(),
      })
      .from(lead)
      .where(eq(lead.storeId, parsedInput.storeId))
      .groupBy(lead.referrer)
      .orderBy(desc(count()))
      .limit(10)

    return {
      total: totalLeads[0]?.count || 0,
      whatsapp: whatsappLeads[0]?.count || 0,
      call: callLeads[0]?.count || 0,
      mobile: mobileLeads[0]?.count || 0,
      last30Days: leadsLast30Days[0]?.count || 0,
      byReferrer: referrerStats,
    }
  })
