import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core'
import { store } from './stores.schema'
import { storeProductCollection } from './store-product-collections.schema'

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK'
export type ProductCtaMode = 'WHATSAPP' | 'EXTERNAL_LINK'

export interface ProductImage {
  url: string
  alt: string
  order: number
}

export const storeProduct = pgTable('store_product', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .references(() => store.id, { onDelete: 'cascade' })
    .notNull(),
  collectionId: uuid('collection_id')
    .references(() => storeProductCollection.id, { onDelete: 'set null' }),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  longDescription: text('long_description'),

  priceInCents: integer('price_in_cents').notNull(),
  originalPriceInCents: integer('original_price_in_cents'),

  images: jsonb('images').$type<ProductImage[]>(),

  // CTA do produto
  ctaMode: varchar('cta_mode', { length: 20 })
    .notNull()
    .default('WHATSAPP')
    .$type<ProductCtaMode>(),
  ctaLabel: varchar('cta_label', { length: 80 }).default('Comprar'),
  ctaExternalUrl: text('cta_external_url'),
  ctaWhatsappMessage: text('cta_whatsapp_message'),

  // SEO (gerado via IA)
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),

  status: varchar('status', { length: 20 })
    .notNull()
    .default('ACTIVE')
    .$type<ProductStatus>(),

  isFeatured: boolean('is_featured').default(false).notNull(),
  position: integer('position').default(0).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
