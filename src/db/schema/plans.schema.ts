import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb } from 'drizzle-orm/pg-core'

export type PlanType = 'ESSENTIAL' | 'PRO' | 'AGENCY'
export type BillingInterval = 'MONTHLY' | 'YEARLY'

export interface PlanFeatures {
  maxStores: number
  maxPhotosPerStore: number
  aiRewritesPerMonth: number | null
  customDomain: boolean
  gmbSync: boolean
  gmbAutoUpdate: boolean
  unifiedDashboard: boolean
}

export const plan = pgTable('plan', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: varchar('name', { length: 50 }).notNull(),
  type: varchar('type', { length: 20 }).notNull().$type<PlanType>(),
  description: text('description'),

  monthlyPriceInCents: integer('monthly_price_in_cents').notNull(),
  yearlyPriceInCents: integer('yearly_price_in_cents').notNull(),

  stripeMonthlyPriceId: varchar('stripe_monthly_price_id', { length: 255 }),
  stripeYearlyPriceId: varchar('stripe_yearly_price_id', { length: 255 }),
  stripeProductId: varchar('stripe_product_id', { length: 255 }),

  features: jsonb('features').notNull().$type<PlanFeatures>(),

  isHighlighted: boolean('is_highlighted').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
