import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

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
  
  seoTitle: varchar('seo_title', { length: 70 }),
  seoDescription: varchar('seo_description', { length: 160 }),
  seoKeywords: jsonb('seo_keywords').$type<string[]>(),
  heroTitle: varchar('hero_title', { length: 100 }),
  heroSubtitle: text('hero_subtitle'),
  longDescription: text('long_description'),
  faqs: jsonb('faqs').$type<CategoryFAQ[]>(),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
