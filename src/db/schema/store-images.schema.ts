import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const storeImage = pgTable('store_image', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .notNull()
    .references(() => store.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: text('alt').notNull(),
  role: text('role', { enum: ['hero', 'gallery'] }).notNull().default('gallery'),
  order: integer('order').notNull().default(0),
  width: integer('width'),
  height: integer('height'),
  originalGoogleRef: text('original_google_ref'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
