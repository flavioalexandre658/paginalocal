import { pgTable, varchar, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core'
import type { StoreMode, SectionType } from './stores.schema'

export type TemplateType = 'default' | 'modern' | 'minimal' | 'bold'

export interface TemplateAvailableSection {
  type: SectionType
  label: string
  description: string
  isRequired: boolean  // Se true, não pode ser desativado
  defaultConfig?: Record<string, unknown>
}

export const storeTemplate = pgTable('store_template', {
  id: varchar('id', { length: 50 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),

  // Quais modos suportam este template
  supportedModes: jsonb('supported_modes').$type<StoreMode[]>().notNull(),

  // Seções disponíveis neste template
  availableSections: jsonb('available_sections')
    .$type<TemplateAvailableSection[]>()
    .notNull(),

  // Preview do template
  thumbnailUrl: text('thumbnail_url'),
  previewUrl: text('preview_url'),

  // Se false, só admin pode usar
  isPublic: boolean('is_public').default(true).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
