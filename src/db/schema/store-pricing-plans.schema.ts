import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export type PricingInterval = 'MONTHLY' | 'YEARLY' | 'ONE_TIME'
export type PricingCtaMode = 'WHATSAPP' | 'EXTERNAL_LINK'

export const storePricingPlan = pgTable('store_pricing_plan', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .references(() => store.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),

  priceInCents: integer('price_in_cents').notNull(),
  interval: varchar('interval', { length: 20 })
    .notNull()
    .default('MONTHLY')
    .$type<PricingInterval>(),

  features: jsonb('features').$type<string[]>(),

  isHighlighted: boolean('is_highlighted').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  // CTA (mesma lógica do produto)
  ctaMode: varchar('cta_mode', { length: 20 })
    .notNull()
    .default('WHATSAPP')
    .$type<PricingCtaMode>(),
  ctaLabel: varchar('cta_label', { length: 80 }).default('Assinar'),
  ctaExternalUrl: text('cta_external_url'),
  ctaWhatsappMessage: text('cta_whatsapp_message'),

  position: integer('position').default(0).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
