'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { db } from '@/db'
import { pageview, store } from '@/db/schema'
import { eq, and, desc, gte, lte, count, ilike, or, isNotNull, ne } from 'drizzle-orm'

const getPageviewsPaginatedSchema = z.object({
  storeId: z.string().uuid(),
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
  device: z.enum(['mobile', 'desktop', 'all']).optional(),
  referrer: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  search: z.string().optional(),
})

export const getPageviewsPaginatedAction = authActionClient
  .schema(getPageviewsPaginatedSchema)
  .action(async ({ parsedInput, ctx }) => {
    const [storeResult] = await db
      .select({ id: store.id })
      .from(store)
      .where(and(eq(store.id, parsedInput.storeId), eq(store.userId, ctx.userId)))
      .limit(1)

    if (!storeResult) {
      throw new Error('Loja não encontrada')
    }

    const conditions = [eq(pageview.storeId, parsedInput.storeId)]

    if (parsedInput.device && parsedInput.device !== 'all') {
      conditions.push(eq(pageview.device, parsedInput.device))
    }

    if (parsedInput.referrer) {
      conditions.push(eq(pageview.referrer, parsedInput.referrer))
    }

    if (parsedInput.startDate) {
      conditions.push(gte(pageview.createdAt, new Date(parsedInput.startDate)))
    }

    if (parsedInput.endDate) {
      conditions.push(lte(pageview.createdAt, new Date(parsedInput.endDate)))
    }

    if (parsedInput.utmSource) {
      conditions.push(eq(pageview.utmSource, parsedInput.utmSource))
    }

    if (parsedInput.utmMedium) {
      conditions.push(eq(pageview.utmMedium, parsedInput.utmMedium))
    }

    if (parsedInput.utmCampaign) {
      conditions.push(eq(pageview.utmCampaign, parsedInput.utmCampaign))
    }

    if (parsedInput.search) {
      conditions.push(
        or(
          ilike(pageview.location, `%${parsedInput.search}%`),
          ilike(pageview.utmCampaign, `%${parsedInput.search}%`),
          ilike(pageview.utmSource, `%${parsedInput.search}%`)
        )!
      )
    }

    const whereClause = and(...conditions)

    const [totalResult] = await db
      .select({ count: count() })
      .from(pageview)
      .where(whereClause)

    const totalCount = totalResult?.count || 0
    const totalPages = Math.ceil(totalCount / parsedInput.pageSize)
    const offset = (parsedInput.page - 1) * parsedInput.pageSize

    const data = await db
      .select({
        id: pageview.id,
        device: pageview.device,
        referrer: pageview.referrer,
        location: pageview.location,
        sessionId: pageview.sessionId,
        utmSource: pageview.utmSource,
        utmMedium: pageview.utmMedium,
        utmCampaign: pageview.utmCampaign,
        createdAt: pageview.createdAt,
      })
      .from(pageview)
      .where(whereClause)
      .orderBy(desc(pageview.createdAt))
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

export const getPageviewsStatsAction = authActionClient
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
      totalPageviews,
      mobilePageviews,
      desktopPageviews,
      pageviewsLast30Days,
    ] = await Promise.all([
      db.select({ count: count() }).from(pageview).where(eq(pageview.storeId, parsedInput.storeId)),
      db.select({ count: count() }).from(pageview).where(
        and(eq(pageview.storeId, parsedInput.storeId), eq(pageview.device, 'mobile'))
      ),
      db.select({ count: count() }).from(pageview).where(
        and(eq(pageview.storeId, parsedInput.storeId), eq(pageview.device, 'desktop'))
      ),
      db.select({ count: count() }).from(pageview).where(
        and(eq(pageview.storeId, parsedInput.storeId), gte(pageview.createdAt, thirtyDaysAgo))
      ),
    ])

    const referrerStats = await db
      .select({
        referrer: pageview.referrer,
        count: count(),
      })
      .from(pageview)
      .where(eq(pageview.storeId, parsedInput.storeId))
      .groupBy(pageview.referrer)
      .orderBy(desc(count()))
      .limit(10)

    const utmStats = await db
      .select({
        utmSource: pageview.utmSource,
        count: count(),
      })
      .from(pageview)
      .where(and(
        eq(pageview.storeId, parsedInput.storeId),
        isNotNull(pageview.utmSource),
        ne(pageview.utmSource, '')
      ))
      .groupBy(pageview.utmSource)
      .orderBy(desc(count()))
      .limit(10)

    return {
      total: totalPageviews[0]?.count || 0,
      mobile: mobilePageviews[0]?.count || 0,
      desktop: desktopPageviews[0]?.count || 0,
      last30Days: pageviewsLast30Days[0]?.count || 0,
      byReferrer: referrerStats,
      byUtmSource: utmStats,
    }
  })
