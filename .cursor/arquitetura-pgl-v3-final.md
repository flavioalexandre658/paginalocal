# Página Local — Arquitetura v3 (SEO Pages + Catálogo)

## Sobre a questão do Catálogo

**Sim, vale ter um schema de coleção/catálogo. Não é complexidade desnecessária.**

Motivos:

1. **SEO**: `/catalogo/camisetas` com título, descrição e keywords próprios ranqueia muito melhor do que um filtro em query string (`/catalogo?cat=camisetas`).
2. **Realidade do usuário**: uma loja de roupas tem "Masculino", "Feminino", "Acessórios". Uma loja de peças tem "Motor", "Suspensão", "Freios". Isso não é over-engineering — é o mínimo para um catálogo funcional.
3. **Múltiplas linhas de produto**: você mesmo mencionou. Uma confeitaria pode ter "Bolos", "Doces Finos", "Salgados" — cada um com sua página.
4. **É uma tabela simples**: 8-10 campos. Sem hierarquia (sem subcategorias). Flat list com SEO.

O que **seria** complexidade desnecessária: subcategorias aninhadas, atributos dinâmicos, filtros facetados. Isso não vamos fazer.

---

## Mapa completo de rotas SEO

```
STORE PÚBLICA (domínio/subdomínio do cliente)
│
├── /                              → Home (seções montadas pelo sections[])
│
├── /servicos                      → Lista de serviços (já existe)
│   └── /servicos/:slugService     → Página do serviço (já existe)
│
├── /catalogo                      → Lista de coleções + produtos em destaque
│   ├── /catalogo/:slugCollection  → Produtos de uma coleção
│   └── /produto/:slugProduct      → Página do produto individual
│
├── /planos                        → Tabela de planos/pricing
│
├── /sobre                         → Página sobre (store_page ABOUT)
└── /contato                       → Página contato (store_page CONTACT)
```

Cada uma dessas páginas precisa de:
- `seoTitle`, `seoDescription` (na tabela ou gerados via IA)
- `generateMetadata()` no Next.js
- JSON-LD específico (`Service`, `Product`, `Offer`, etc.)

---

## Schemas Atualizados

### 1. `store_product` — com CTA flexível e SEO

```typescript
// store-products.schema.ts

import {
  pgTable, uuid, varchar, text, timestamp,
  boolean, integer, jsonb
} from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

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

  // --- CTA do produto ---
  ctaMode: varchar('cta_mode', { length: 20 })
    .notNull()
    .default('WHATSAPP')
    .$type<ProductCtaMode>(),
  ctaLabel: varchar('cta_label', { length: 80 }).default('Comprar'),
  ctaExternalUrl: text('cta_external_url'),
  ctaWhatsappMessage: text('cta_whatsapp_message'),
  // Se ctaMode = 'WHATSAPP' → abre WhatsApp da store com ctaWhatsappMessage
  //    template padrão: "Olá! Tenho interesse no produto *{nome}* (R$ {preço})"
  // Se ctaMode = 'EXTERNAL_LINK' → redireciona para ctaExternalUrl
  //    (Shopee, Mercado Livre, Hotmart, link próprio, etc.)

  // --- SEO (gerado via IA) ---
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
```

**Detalhe do CTA**: o `ctaWhatsappMessage` permite personalizar a mensagem por produto. Se estiver vazio, usa um template padrão com nome + preço. O WhatsApp do destino vem da `store.whatsapp` (já existe). Na prática, o componente faz:

```typescript
// Lógica do botão de CTA do produto (conceito)
function getProductCtaUrl(product: Product, store: Store): string {
  if (product.ctaMode === 'EXTERNAL_LINK' && product.ctaExternalUrl) {
    return product.ctaExternalUrl
  }

  const message = product.ctaWhatsappMessage
    || `Olá! Tenho interesse no produto *${product.name}* (R$ ${(product.priceInCents / 100).toFixed(2)})`

  return `https://wa.me/55${store.whatsapp}?text=${encodeURIComponent(message)}`
}
```

---

### 2. `store_product_collection` — Coleções/Catálogo

```typescript
// store-product-collections.schema.ts

import {
  pgTable, uuid, varchar, text, timestamp,
  boolean, integer
} from 'drizzle-orm/pg-core'
import { store } from './stores.schema'

export const storeProductCollection = pgTable('store_product_collection', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id')
    .references(() => store.id, { onDelete: 'cascade' })
    .notNull(),

  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),

  // --- SEO (gerado via IA) ---
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),

  isActive: boolean('is_active').default(true).notNull(),
  position: integer('position').default(0).notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})
```

**Por que "collection" e não "category"?**
- `category` já existe no projeto (categorias de negócio: Borracharia, Restaurante, etc.)
- "Coleção" é o termo que Shopify, Nuvemshop e outros usam — o usuário final entende
- Evita confusão semântica no código: `category` = tipo de negócio, `collection` = grupo de produtos

**Sem hierarquia (flat list)**: uma coleção não tem subcoleções. Se a loja quer "Roupas → Masculino → Camisetas", ela cria 3 coleções separadas. Simples, funciona, sem árvore recursiva.

---

### 3. `store_pricing_plan` — com SEO para /planos

```typescript
// store-pricing-plans.schema.ts

import {
  pgTable, uuid, varchar, text, timestamp,
  boolean, integer, jsonb
} from 'drizzle-orm/pg-core'
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

  // --- CTA (mesma lógica do produto) ---
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
```

O SEO da página `/planos` não precisa estar em cada plano individual — fica na section config ou em `store_page`:

```typescript
// Na store.sections JSONB, a seção PRICING_PLANS pode ter:
{
  type: 'PRICING_PLANS',
  isActive: true,
  order: 4,
  config: {
    pageTitle: 'Nossos Planos',
    seoTitle: 'Planos e Preços | Nome da Empresa',
    seoDescription: 'Conheça nossos planos...',
    showInterval: true,  // mostrar toggle mensal/anual
  }
}
```

---

### 4. Ajustes no `service` existente (já tem SEO)

O schema `service` já tem `seoTitle`, `seoDescription`, `slug`, `longDescription` e `heroImageUrl`. Está pronto para as páginas `/servicos/:slugService`. Sem mudanças necessárias.

O que falta é o SEO da página de listagem `/servicos`. Mesma abordagem — via section config:

```typescript
{
  type: 'SERVICES',
  isActive: true,
  order: 2,
  config: {
    pageTitle: 'Nossos Serviços',
    seoTitle: 'Serviços de Borracharia | Nome da Empresa',
    seoDescription: 'Conheça todos os serviços...',
  }
}
```

---

### 5. Campo `sections` atualizado com SEO por seção

```typescript
// stores.schema.ts — type atualizado

export interface SectionConfig {
  // SEO da página de listagem (quando a seção tem rota própria)
  pageTitle?: string
  seoTitle?: string
  seoDescription?: string

  // Configs visuais específicas (cada seção usa o que precisa)
  [key: string]: unknown
}

export interface StoreSection {
  type: SectionType
  isActive: boolean
  order: number
  config?: SectionConfig
}
```

---

## Como a IA gera SEO para cada nível

### Na criação/edição, a IA gera:

| Entidade | Campos SEO | Exemplo |
|----------|-----------|---------|
| `store` | `seoTitle`, `seoDescription` | "Borracharia do João - Pneus em Salvador \| Página Local" |
| `service` | `seoTitle`, `seoDescription` | "Troca de Pneus em Salvador - Borracharia do João" |
| `store_product` | `seoTitle`, `seoDescription` | "Pneu Aro 15 205/65R15 - R$ 299,90 \| Borracharia do João" |
| `store_product_collection` | `seoTitle`, `seoDescription` | "Pneus Aro 15 - Catálogo \| Borracharia do João" |
| `store_pricing_plan` | *(SEO fica na section config)* | — |
| Section SERVICES config | `seoTitle`, `seoDescription` | "Todos os Serviços \| Borracharia do João" |
| Section PRODUCTS config | `seoTitle`, `seoDescription` | "Catálogo de Produtos \| Borracharia do João" |
| Section PRICING config | `seoTitle`, `seoDescription` | "Planos e Preços \| Nome da Empresa" |

### Pattern da IA para gerar SEO de produto:

```typescript
// Prompt para IA (conceito)
const productSeoPrompt = `
Gere SEO otimizado para este produto:
- Produto: ${product.name}
- Preço: R$ ${(product.priceInCents / 100).toFixed(2)}
- Descrição: ${product.description}
- Loja: ${store.name}
- Cidade: ${store.city}/${store.state}
- Categoria do negócio: ${store.category}

Retorne:
- seoTitle (max 60 chars): inclua nome do produto + cidade se local
- seoDescription (max 155 chars): inclua preço, benefício principal, CTA
`
```

---

## Rotas no Next.js (App Router)

```
src/app/site/[slug]/
├── page.tsx                              → Home
├── servicos/
│   ├── page.tsx                          → /servicos (listagem)
│   └── [serviceSlug]/
│       └── page.tsx                      → /servicos/:slugService
├── catalogo/
│   ├── page.tsx                          → /catalogo (coleções + destaques)
│   └── [collectionSlug]/
│       └── page.tsx                      → /catalogo/:slugCollection
├── produto/
│   └── [productSlug]/
│       └── page.tsx                      → /produto/:slugProduct
├── planos/
│   └── page.tsx                          → /planos
├── sobre/
│   └── page.tsx                          → /sobre
└── contato/
    └── page.tsx                          → /contato
```

### Metadata pattern para cada rota:

```typescript
// app/site/[slug]/produto/[productSlug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug, params.productSlug)
  if (!product) return {}

  return {
    title: product.seoTitle || `${product.name} | ${product.store.name}`,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  }
}
```

### JSON-LD por rota:

```typescript
// /produto/:slug → Product schema
const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description: product.description,
  image: product.images?.map(i => i.url),
  offers: {
    '@type': 'Offer',
    price: (product.priceInCents / 100).toFixed(2),
    priceCurrency: 'BRL',
    availability: product.status === 'ACTIVE'
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  },
}

// /catalogo/:collection → CollectionPage schema
const collectionJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: collection.name,
  description: collection.seoDescription,
}

// /planos → Product com multiple Offers
const pricingJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `Planos ${store.name}`,
  offers: plans.map(plan => ({
    '@type': 'Offer',
    name: plan.name,
    price: (plan.priceInCents / 100).toFixed(2),
    priceCurrency: 'BRL',
  })),
}
```

---

## Schema Index Final

```typescript
// schema/index.ts
export * from './users.schema'
export * from './categories.schema'
export * from './stores.schema'
export * from './services.schema'
export * from './leads.schema'
export * from './testimonials.schema'
export * from './store-images.schema'
export * from './plans.schema'
export * from './subscriptions.schema'
export * from './tracking.schema'
export * from './pageviews.schema'
export * from './store-transfers.schema'
export * from './store-pages.schema'
// NOVOS
export * from './store-products.schema'
export * from './store-product-collections.schema'
export * from './store-pricing-plans.schema'
export * from './store-templates.schema'
```

---

## Resumo Completo de Mudanças

| Arquivo | Mudança |
|---------|---------|
| `stores.schema.ts` | + `mode`, `sections` (JSONB), `templateId`, `templateConfig` |
| `categories.schema.ts` | + `applicableModes` |
| `store-products.schema.ts` | **NOVO** — com `ctaMode`, `collectionId`, SEO |
| `store-product-collections.schema.ts` | **NOVO** — agrupamento de produtos com SEO |
| `store-pricing-plans.schema.ts` | **NOVO** — com `ctaMode`, SEO via section config |
| `store-templates.schema.ts` | **NOVO** — sistema de templates |
| `schema/index.ts` | + 4 exports |

**Novas tabelas: 4** (`store_product`, `store_product_collection`, `store_pricing_plan`, `store_template`)

**Novas rotas: 4** (`/catalogo`, `/catalogo/:collection`, `/produto/:product`, `/planos`)
