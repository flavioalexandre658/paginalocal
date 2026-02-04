import { pgTable, uuid, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { user } from './users.schema'
import { plan } from './plans.schema'

export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'TRIALING' | 'INCOMPLETE' | 'INCOMPLETE_EXPIRED' | 'UNPAID'

export const subscription = pgTable('subscription', {
  id: uuid('id').primaryKey().defaultRandom(),

  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),
  planId: uuid('plan_id').references(() => plan.id).notNull(),

  status: varchar('status', { length: 30 }).notNull().$type<SubscriptionStatus>().default('ACTIVE'),
  billingInterval: varchar('billing_interval', { length: 10 }).notNull().$type<'MONTHLY' | 'YEARLY'>(),

  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),

  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: timestamp('cancel_at_period_end'),

  aiRewritesUsedThisMonth: integer('ai_rewrites_used_this_month').default(0).notNull(),
  aiRewritesResetAt: timestamp('ai_rewrites_reset_at'),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
