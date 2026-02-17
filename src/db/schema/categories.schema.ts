import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import type { StoreMode } from './stores.schema'

export interface CategoryFAQ {
  question: string
  answer: string
}

export const category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 50 }),
  description: text('description'),
  suggestedServices: jsonb('suggested_services').$type<string[]>(),
  
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: jsonb('seo_keywords').$type<string[]>(),
  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),
  longDescription: text('long_description'),
  faqs: jsonb('faqs').$type<CategoryFAQ[]>(),

  // Google Places API primaryType values que mapeiam para esta categoria
  // Ex: ["restaurant", "brazilian_restaurant", "japanese_restaurant"]
  typeGooglePlace: jsonb('type_google_place').$type<string[]>(),

  // Novos campos para v3
  applicableModes: jsonb('applicable_modes')
    .$type<StoreMode[]>()
    .default(['LOCAL_BUSINESS'])
    .notNull(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
