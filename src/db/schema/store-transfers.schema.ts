import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'
import { user } from './users.schema'

export const storeTransfer = pgTable('store_transfer', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').references(() => store.id, { onDelete: 'cascade' }).notNull(),
  fromUserId: text('from_user_id').references(() => user.id).notNull(),
  toUserId: text('to_user_id').references(() => user.id).notNull(),
  adminId: text('admin_id').references(() => user.id).notNull(),
  wasActivated: boolean('was_activated').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
