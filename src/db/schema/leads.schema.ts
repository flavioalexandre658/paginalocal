import { pgTable, uuid, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type LeadSource = 'whatsapp' | 'phone' | 'call' | 'form' | 'map' | 'blocked_whatsapp' | 'blocked_phone'

export type LeadTouchpoint =
  | 'hero_whatsapp'
  | 'hero_call'
  | 'floating_whatsapp'
  | 'contact_call'
  | 'floating_bar_whatsapp'
  | 'floating_bar_call'

export const lead = pgTable('lead', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  source: varchar('source', { length: 50 }).default('whatsapp').notNull().$type<LeadSource>(),
  device: varchar('device', { length: 50 }),
  referrer: varchar('referrer', { length: 255 }),
  location: varchar('location', { length: 100 }),
  touchpoint: varchar('touchpoint', { length: 50 }).$type<LeadTouchpoint>(),
  sessionId: varchar('session_id', { length: 100 }),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmTerm: varchar('utm_term', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  pageviewsBeforeConversion: integer('pageviews_before_conversion'),
  isFromBlockedSite: boolean('is_from_blocked_site').default(false).notNull(),
  isViewed: boolean('is_viewed').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
