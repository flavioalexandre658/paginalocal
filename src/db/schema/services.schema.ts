import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const service = pgTable('service', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }),
  description: text('description'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  longDescription: text('long_description'),
  priceInCents: integer('price_in_cents'),
  imageUrl: text('image_url'),
  heroImageUrl: text('hero_image_url'),
  position: integer('position').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
