import { pgTable, uuid, varchar, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const testimonial = pgTable('testimonial', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  authorName: varchar('author_name', { length: 255 }).notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5).notNull(),
  imageUrl: text('image_url'),
  isGoogleReview: boolean('is_google_review').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
