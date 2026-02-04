import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const category = pgTable('category', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  icon: varchar('icon', { length: 50 }),
  description: text('description'),
  suggestedServices: jsonb('suggested_services').$type<string[]>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
