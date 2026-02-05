import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type PageviewDevice = 'mobile' | 'desktop'

export const pageview = pgTable('pageview', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  device: varchar('device', { length: 20 }).$type<PageviewDevice>(),
  referrer: varchar('referrer', { length: 255 }),
  location: varchar('location', { length: 100 }),
  userAgent: varchar('user_agent', { length: 500 }),
  sessionId: varchar('session_id', { length: 100 }),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 255 }),
  utmTerm: varchar('utm_term', { length: 255 }),
  utmContent: varchar('utm_content', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
