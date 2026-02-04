import { pgTable, uuid, varchar, timestamp, boolean } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type LeadSource = 'whatsapp' | 'phone' | 'call' | 'form' | 'map' | 'blocked_whatsapp' | 'blocked_phone'

export const lead = pgTable('lead', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  source: varchar('source', { length: 50 }).default('whatsapp').notNull().$type<LeadSource>(),
  device: varchar('device', { length: 50 }),
  referrer: varchar('referrer', { length: 255 }),
  isFromBlockedSite: boolean('is_from_blocked_site').default(false).notNull(),
  isViewed: boolean('is_viewed').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
