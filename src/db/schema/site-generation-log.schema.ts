import { pgTable, uuid, varchar, timestamp, integer, real, jsonb } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const siteGenerationLog = pgTable('site_generation_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),

  totalDurationMs: integer('total_duration_ms').notNull(),
  contentDurationMs: integer('content_duration_ms'),
  imageDurationMs: integer('image_duration_ms'),
  classificationDurationMs: integer('classification_duration_ms'),

  contentModel: varchar('content_model', { length: 50 }),
  contentInputTokens: integer('content_input_tokens'),
  contentOutputTokens: integer('content_output_tokens'),
  contentStopReason: varchar('content_stop_reason', { length: 20 }),

  imageModel: varchar('image_model', { length: 50 }),
  imageTotalCount: integer('image_total_count'),
  imageSuccessCount: integer('image_success_count'),
  imageFallbackCount: integer('image_fallback_count'),

  classificationModel: varchar('classification_model', { length: 50 }),
  classificationTokens: integer('classification_tokens'),

  contentCostUsd: real('content_cost_usd'),
  imageCostUsd: real('image_cost_usd'),
  classificationCostUsd: real('classification_cost_usd'),
  totalCostUsd: real('total_cost_usd'),

  templateId: varchar('template_id', { length: 50 }),
  templateName: varchar('template_name', { length: 100 }),
  sectionsCount: integer('sections_count'),

  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
