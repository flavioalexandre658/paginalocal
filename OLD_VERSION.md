# OLD_VERSION — Sistema Legado de Geração de Sites

> Este documento descreve o sistema atual (pré-v3 AI) de geração de sites do PGL.
> Será removido após a migração completa para o novo sistema baseado em SiteBlueprint.

---

## Visão Geral

O sistema atual gera sites de clientes de forma **hard-coded por seção**. Cada loja tem um conjunto de seções configurável (ativas/inativas, ordenáveis), e o Next.js renderiza um switch-case que escolhe o componente React de cada seção.

Não há geração de layout por IA — a IA apenas gera **conteúdo textual** (títulos, descrições, FAQs), não a estrutura visual.

---

## Arquivos-Chave

### Roteamento e Entrada

| Arquivo | Responsabilidade |
|---------|----------------|
| `src/middleware.ts` | Resolve URL → slug da loja |
| `src/app/site/[slug]/layout.tsx` | Layout base com CSS vars, fonte, header, footer |
| `src/app/site/[slug]/page.tsx` | Página principal — busca dados e renderiza seções |

### Lógica de Seções

| Arquivo | Responsabilidade |
|---------|----------------|
| `src/lib/store-sections.ts` | Defaults de seções por modo, funções utilitárias |
| `src/lib/store-terms.ts` | Gramática portuguesa (artigos a/o, da/do, etc.) |
| `src/lib/local-copy/index.ts` | Textos dinâmicos por StoreMode com variantes seed-based |
| `src/lib/color-contrast.ts` | Contraste automático de texto sobre cor de fundo |

### Geração de Conteúdo por IA

| Arquivo | Responsabilidade |
|---------|----------------|
| `src/lib/store-builder.ts` | Importa dados do Google Places + gera conteúdo via Gemini |
| `src/lib/ai/index.ts` | Orquestrador: escolhe provider (OpenAI/Gemini) |
| `src/lib/ai/prompts.ts` | Templates de prompt para geração de marketing copy |
| `src/lib/ai/prompts-products.ts` | Prompts específicos para produtos |
| `src/lib/ai/gemini.ts` | Implementação Google Gemini |
| `src/lib/ai/openai.ts` | Implementação OpenAI |
| `src/lib/ai/types.ts` | Types: `MarketingCopy`, `ServiceItem`, `FAQItem`, `MarketingCopyInput` |
| `src/lib/ai/fallbacks.ts` | Dados de fallback quando a IA falha |

### SEO

| Arquivo | Responsabilidade |
|---------|----------------|
| `src/lib/local-seo.ts` | Geração de JSON-LD (LocalBusiness, Breadcrumb, FAQ, OfferCatalog) |
| `src/lib/faq-json-ld.ts` | Schema JSON-LD específico para FAQ |
| `src/lib/faq-utils.ts` | Parsing e utilitários de FAQ |

### Componentes de Seção (site legado)

Todos em `src/app/site/[slug]/_components/`:

| Componente | Seção |
|-----------|-------|
| `hero-section.tsx` | HERO |
| `about-section.tsx` | ABOUT |
| `services-section.tsx` | SERVICES |
| `products-section.tsx` | PRODUCTS (v3) |
| `pricing-plans-section.tsx` | PRICING_PLANS (v3) |
| `gallery-section.tsx` | GALLERY |
| `testimonials-section.tsx` | TESTIMONIALS |
| `faq-section.tsx` | FAQ |
| `areas-section.tsx` | AREAS |
| `stats-section.tsx` | STATS |
| `contact-section.tsx` | CONTACT |
| `site-header.tsx` | Header da loja |
| `site-footer.tsx` | Footer da loja |
| `floating-contact.tsx` | Botão WhatsApp/ligação flutuante |
| `draft-banner.tsx` | Banner de rascunho para donos |
| `draft-modal.tsx` | Modal de ativação |

---

## Como Funciona o Roteamento

```
REQUEST (qualquer domínio)
  ↓
src/middleware.ts
  ├─ Subdomínio: shopname.paginalocal.com.br → slug = "shopname"
  ├─ Domínio custom: minhaloja.com → GET /api/domain/resolve?domain=... → slug
  └─ Rewrite interno: NextResponse.rewrite("/site/{slug}/...")

src/app/site/[slug]/layout.tsx
  ├─ Busca: name, slug, primaryColor, heroBackgroundColor, buttonColor, logo, font
  ├─ Detecta owner: session.userId === store.userId
  ├─ Aplica CSS vars: --primary, --store-hero-bg, --store-button-color
  ├─ Carrega fonte: getSiteFontUrl(store.fontFamily)
  └─ Monta: <DraftBanner?> + <SiteHeader?> + {children} + <SiteFooter> + <FloatingContact>

src/app/site/[slug]/page.tsx
  ├─ Fetch paralelo (unstable_cache TTL 3600s):
  │    store, services, testimonials, galleryImages, heroImage
  │    products, pricingPlans, institutionalPages
  ├─ generateMetadata() → title, description, OG, JSON-LD
  ├─ getStoreSections(store) → seções customizadas ou default por mode
  ├─ getActiveSections(sections) → filtra isActive=true, ordena por .order
  └─ activeSections.map(section => switch(section.type) { case 'HERO': ... })
```

---

## Sistema de Seções (`src/lib/store-sections.ts`)

### Tipos

```typescript
type SectionType =
  | 'HERO' | 'ABOUT' | 'SERVICES' | 'PRODUCTS' | 'PRICING_PLANS'
  | 'GALLERY' | 'TESTIMONIALS' | 'FAQ' | 'AREAS' | 'STATS' | 'CONTACT'

interface StoreSection {
  type: SectionType
  isActive: boolean
  order: number
  config?: Record<string, unknown>
}
```

### Defaults por StoreMode

```typescript
LOCAL_BUSINESS:   HERO → STATS → ABOUT → SERVICES → GALLERY → AREAS → TESTIMONIALS → FAQ → CONTACT
PRODUCT_CATALOG:  HERO → STATS → PRODUCTS → TESTIMONIALS → FAQ → AREAS → CONTACT
SERVICE_PRICING:  HERO → STATS → ABOUT → SERVICES → PRICING_PLANS → TESTIMONIALS → FAQ → AREAS → CONTACT
HYBRID:           Todas habilitadas (GALLERY oculta por padrão)
```

### Funções Disponíveis

```typescript
getDefaultSections(): StoreSection[]
getDefaultSectionsForMode(mode: StoreMode): StoreSection[]
getStoreSections(store: IStore): StoreSection[]
getActiveSections(sections: StoreSection[]): StoreSection[]
isSectionActive(sections: StoreSection[], type: SectionType): boolean
getSectionConfig<T>(sections: StoreSection[], type: SectionType): T | undefined
```

---

## Sistema de Estilos Dinâmicos

O layout lê cores do banco e aplica como CSS vars:

```typescript
// src/app/site/[slug]/layout.tsx
cssVars['--primary'] = store.primaryColor           // default: #3b82f6
cssVars['--store-hero-bg'] = store.heroBackgroundColor  // default: #1e293b
cssVars['--store-button-color'] = store.buttonColor  // default: #22c55e
```

Contraste de texto calculado em runtime (`src/lib/color-contrast.ts`):
- `isLightColor(hex)` → luminância WCAG
- `getContrastTextClass(hex)` → 'text-black' ou 'text-white'

Fonte por loja:
- `store.fontFamily` armazena o identificador da fonte
- `getSiteFontUrl(fontFamily)` retorna a URL do Google Fonts
- `getSiteFontFamily(fontFamily)` retorna o nome CSS

---

## Sistema de Textos Dinâmicos (`src/lib/local-copy/`)

```typescript
interface LocalPageCtx {
  storeId: string
  mode: StoreMode
  category: string
  name: string
  city: string
  // ...
}

getCopy(ctx: LocalPageCtx, key: string): Token[]
```

- Cada key tem 5+ variantes de texto
- Variante escolhida deterministicamente via seed do storeId
- Tokens formatados: `{ t: "text" | "strong" | "primary", v: "..." }`
- Keys disponíveis: `"services.heading"`, `"testimonials.intro"`, `"faq.intro"`, etc.

---

## Gramática Portuguesa (`src/lib/store-terms.ts`)

```typescript
type TermGender = 'MASCULINE' | 'FEMININE'
type TermNumber = 'SINGULAR' | 'PLURAL'

getStoreGrammar(gender, number): {
  art: 'a'|'o'|'as'|'os'
  da:  'da'|'do'|'das'|'dos'
  na:  'na'|'no'|'nas'|'nos'
  pela: 'pela'|'pelo'|'pelas'|'pelos'
  nossa: 'nossa'|'nosso'|'nossas'|'nossos'
  uma: 'uma'|'um'|'umas'|'uns'
}
```

Campos no banco: `store.termGender` e `store.termNumber`

---

## Geração de Conteúdo por IA (atual)

### Fluxo no Store Builder (`src/lib/store-builder.ts`)

1. Recebe `googlePlaceId` ou dados manuais
2. Chama Google Places API para buscar: nome, endereço, fotos, avaliações, horários
3. Classifica categoria via IA (fallback em cascata)
4. Chama `generateMarketingCopy()` com `MarketingCopyInput`:
   - Gera: `heroTitle`, `heroSubtitle`, `seoTitle`, `seoDescription`
   - Gera: array de `services[]`, array de `faq[]`, `neighborhoods[]`
   - Detecta `termGender` e `termNumber` para gramática
5. Retorna `StoreBuilderResult` com todos os dados prontos para inserir no banco

### Provider Abstraction (`src/lib/ai/index.ts`)

```typescript
// Seleciona via env AI_PROVIDER (default: 'openai')
generateMarketingCopy(input: MarketingCopyInput): Promise<MarketingCopy>
generateServiceDescription(input): Promise<string>
generateProductDescription(input): Promise<string>
```

### Types de IA (`src/lib/ai/types.ts`)

```typescript
interface MarketingCopy {
  brandName: string; slug: string
  heroTitle: string; heroSubtitle: string
  aboutSection: string
  seoTitle: string; seoDescription: string
  services: ServiceItem[]; faq: FAQItem[]
  neighborhoods: string[]
  termGender: 'MASCULINE' | 'FEMININE'
  termNumber: 'SINGULAR' | 'PLURAL'
}
```

---

## SEO (atual)

`src/lib/local-seo.ts` gera JSON-LD schemas:

1. **LocalBusiness** — nome, endereço, telefone, rating, horários, areaServed
2. **Breadcrumb** — Categoria → Categoria em Cidade → Nome
3. **Website** — estrutura, geo
4. **OfferCatalog** — serviços como dados estruturados
5. **FAQ** — itens de FAQ
6. **serviceArea** — bairros atendidos

Metadata via `generateMetadata()` em `page.tsx`:
- Padrão: `"{categoria} em {cidade} | {nome}"`
- OG tags, Twitter cards, geo tags
- AEO (AI Engine Optimization): HTML oculto com keywords semânticas

---

## Schema do Banco (relevante)

```typescript
// src/db/schema/stores.schema.ts (simplificado)
store: {
  id: uuid
  slug: string (unique)
  name: string
  mode: 'LOCAL_BUSINESS' | 'PRODUCT_CATALOG' | 'SERVICE_PRICING' | 'HYBRID'
  sections: StoreSection[] (JSONB)    // seções configuradas
  templateId: string                   // 'default' | 'modern' | 'minimal' | 'bold'
  templateConfig: unknown (JSONB)
  primaryColor: string
  heroBackgroundColor: string
  buttonColor: string
  fontFamily: string
  termGender: 'MASCULINE' | 'FEMININE'
  termNumber: 'SINGULAR' | 'PLURAL'
  isActive: boolean
  // ... campos de conteúdo, SEO, localização
}
```

---

## Cache

| Dado | Mecanismo | TTL |
|------|-----------|-----|
| Store page data | `unstable_cache` (Next.js) + tag `store-data` | 3600s (1h) |
| Domain custom resolve | Cache em memória (Map) | 300s (5min) sucesso / 30s erro |

Invalidação manual: `revalidateTag('store-data')` em server actions após updates.
