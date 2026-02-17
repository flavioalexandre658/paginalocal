import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const storeProductCollection = pgTable('store_product_collection', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .references(() => store.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),

  // SEO (gerado via IA)
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),

  isActive: boolean('is_active').default(true).notNull(),
  position: integer('position').default(0).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
