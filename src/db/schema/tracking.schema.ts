import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type TrackingPlatform =
  | 'GTM'
  | 'GOOGLE_ANALYTICS'
  | 'GOOGLE_ADS'
  | 'META_PIXEL'
  | 'KWAI'
  | 'TIKTOK'

export const tracking = pgTable('tracking', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .references(() => store.id, { onDelete: 'cascade' })
    .notNull(),
  platform: varchar('platform', { length: 20 }).notNull().$type<TrackingPlatform>(),
  trackingId: varchar('tracking_id', { length: 100 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
