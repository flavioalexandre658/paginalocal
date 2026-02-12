import { pgTable, uuid, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type StorePageType = 'ABOUT' | 'CONTACT'

export const storePage = pgTable('store_page', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  type: varchar('type', { length: 30 }).notNull().$type<StorePageType>(),
  slug: varchar('slug', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
