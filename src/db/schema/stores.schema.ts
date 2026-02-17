import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core'
import { user } from './users.schema'
import { category } from './categories.schema'

export type CreationSource = 'GOOGLE_IMPORT' | 'MANUAL_CREATION'

export type StoreMode = 
  | 'LOCAL_BUSINESS'    // Negócio local tradicional (default atual)
  | 'PRODUCT_CATALOG'   // Foco em catálogo de produtos
  | 'SERVICE_PRICING'   // Foco em planos/pricing
  | 'HYBRID'            // Mix de serviços + produtos + planos

export type SectionType = 
  | 'HERO' | 'ABOUT' | 'SERVICES' | 'PRODUCTS' | 'PRICING_PLANS' 
  | 'GALLERY' | 'TESTIMONIALS' | 'FAQ' | 'AREAS' | 'STATS' | 'CONTACT'

export interface SectionConfig {
  // SEO para páginas de listagem
  pageTitle?: string
  seoTitle?: string
  seoDescription?: string
  
  // Configs visuais específicas por seção
  [key: string]: unknown
}

export interface StoreSection {
  type: SectionType
  isActive: boolean
  order: number
  config?: SectionConfig
}

export interface StoreStat {
  label: string
  value: string
  prefix?: string
  suffix?: string
}

export const store = pgTable('store', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }).notNull(),

  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  creationSource: varchar('creation_source', { length: 20 }).notNull().default('GOOGLE_IMPORT').$type<CreationSource>(),
  customDomain: varchar('custom_domain', { length: 255 }).unique(),

  description: text('description'),
  category: varchar('category', { length: 100 }).notNull(),
  categoryId: uuid('category_id').references(() => category.id),
  phone: varchar('phone', { length: 20 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 20 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  zipCode: varchar('zip_code', { length: 10 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),

  googlePlaceId: varchar('google_place_id', { length: 255 }).unique(),
  googleRating: decimal('google_rating', { precision: 2, scale: 1 }),
  googleReviewsCount: integer('google_reviews_count').default(0),

  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  coverUrl: text('cover_url'),
  primaryColor: varchar('primary_color', { length: 7 }).default('#3b82f6'),
  heroBackgroundColor: varchar('hero_background_color', { length: 7 }).default('#1e293b'),
  buttonColor: varchar('button_color', { length: 7 }).default('#22c55e'),
  openingHours: jsonb('opening_hours'),

  heroTitle: text('hero_title'),
  heroSubtitle: text('hero_subtitle'),

  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),

  faq: jsonb('faq'),
  neighborhoods: jsonb('neighborhoods'),
  stats: jsonb('stats').$type<StoreStat[]>(),

  whatsappDefaultMessage: varchar('whatsapp_default_message', { length: 300 }),

  showWhatsappButton: boolean('show_whatsapp_button').default(true).notNull(),
  showCallButton: boolean('show_call_button').default(true).notNull(),

  instagramUrl: text('instagram_url'),
  facebookUrl: text('facebook_url'),
  googleBusinessUrl: text('google_business_url'),

  fontFamily: varchar('font_family', { length: 50 }),

  highlightBadge: varchar('highlight_badge', { length: 50 }),
  highlightText: text('highlight_text'),

  // Novos campos para v3
  mode: varchar('mode', { length: 20 })
    .notNull()
    .default('LOCAL_BUSINESS')
    .$type<StoreMode>(),

  sections: jsonb('sections').$type<StoreSection[]>(),

  templateId: varchar('template_id', { length: 50 })
    .notNull()
    .default('default'),

  templateConfig: jsonb('template_config'),

  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
