import { pgTable, varchar, text, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core'

/**
 * Definicao de uma secao dentro de um template.
 */
export interface TemplateSectionDef {
  blockType: string
  variant: number
  name: string
  description: string
}

/**
 * Tabela de templates de site.
 * Cada template define um design system coeso com secoes pre-definidas.
 */
export const siteTemplate = pgTable('store_template', {
  /** ID unico do template (slug) — ex: "aurora", "forge" */
  id: varchar('id', { length: 50 }).primaryKey(),

  /** Nome legivel — ex: "Aurora" */
  name: varchar('name', { length: 100 }).notNull(),

  /** Descricao do estilo visual */
  description: text('description'),

  /** URL do thumbnail para preview na listagem */
  thumbnailUrl: text('thumbnail_url'),

  /** URL da pagina de preview full */
  previewUrl: text('preview_url'),

  /** Nichos de negocio ideais — ex: ["saas", "tech", "startup"] */
  bestFor: jsonb('best_for').$type<string[]>().default([]).notNull(),

  /** Estilo forcado do design tokens — ex: "elegant" */
  forceStyle: varchar('force_style', { length: 30 }).notNull().default('elegant'),

  /** Border radius forcado — ex: "lg" */
  forceRadius: varchar('force_radius', { length: 10 }).notNull().default('lg'),

  /** Fonte heading recomendada (slug) */
  recommendedHeadingFont: varchar('recommended_heading_font', { length: 50 }),

  /** Fonte body recomendada (slug) */
  recommendedBodyFont: varchar('recommended_body_font', { length: 50 }),

  /** Secoes na ordem padrao */
  defaultSections: jsonb('default_sections').$type<TemplateSectionDef[]>().notNull(),

  /** Variantes disponiveis por blockType — ex: { "hero": [1], "services": [1, 2] } */
  availableVariants: jsonb('available_variants').$type<Record<string, number[]>>().notNull(),

  /** Ordem de exibicao na listagem */
  sortOrder: integer('sort_order').default(0).notNull(),

  /** Se false, nao aparece na listagem para usuarios */
  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
