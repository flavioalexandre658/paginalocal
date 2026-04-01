import { pgTable, uuid, varchar, timestamp, integer, real, jsonb } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const imageGenerationLog = pgTable('image_generation_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  provider: varchar('provider', { length: 20 }).notNull(), // "banana" | "unsplash" | "mixed"
  imageCount: integer('image_count').notNull(),
  costUsd: real('cost_usd'),
  durationMs: integer('duration_ms'),
  bananaSuccessCount: integer('banana_success_count').default(0),
  unsplashFallbackCount: integer('unsplash_fallback_count').default(0),
  failedCount: integer('failed_count').default(0),
  metadata: jsonb('metadata'), // prompts, errors, etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
