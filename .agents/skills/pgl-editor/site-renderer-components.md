---
name: site-renderer-components
description: Documentação de como cada componente do site-renderer é estruturado, quais campos do blueprint usa, e o padrão para novos componentes funcionarem com o editor.
---

# Site Renderer — Componentes e Padrões

## Arquitetura Geral

```
SiteBlueprint (JSON)
  └─ pages[].sections[] (SectionBlock)
       ├─ blockType: "hero" | "services" | ... (20 tipos)
       ├─ variant: 1-5
       └─ content: { ... }  ← schema específico por blockType

SectionBlock → block-registry.ts → ComponenteReact
  Props: { content, tokens, isDark? }
```

### Fluxo de renderização
1. `SectionBlock` recebe `block.blockType` + `block.variant`
2. Consulta `BLOCK_REGISTRY[blockType][variant]` para carregar o componente lazy
3. Fallback para variant 1 se não existe
4. Passa `content`, `tokens`, `isDark` como props

---

## Inventário Completo (20 tipos, 74 variantes)

| Block Type | Variantes | Conteúdo Principal |
|---|---|---|
| **hero** | 5 | headline, subheadline, ctaText, backgroundImage |
| **header** | 5 | storeName, logoUrl, ctaText |
| **footer** | 5 | copyrightText, showSocial |
| **services** | 4 | title, items[].name/description/price |
| **about** | 3 | title, paragraphs[], highlights[], image |
| **testimonials** | 3 | title, items[].text/author/rating/role |
| **gallery** | 4 | title, images[].url/alt/caption |
| **faq** | 2 | title, items[].question/answer |
| **contact** | 3 | title, address, phone, email, formFields |
| **cta** | 3 | title, subtitle, ctaText |
| **pricing** | 5 | title, plans[].name/price/features[]/ctaText |
| **stats** | 2 | title, items[].value/label |
| **team** | 3 | title, members[].name/role/bio/image |
| **catalog** | 5 | title, categories[].name/description/image |
| **featured-products** | 2 | title, items[].name/price/image |
| **menu** | 3 | title, categories[].name/items[].name/price |
| **location** | 2 | title, address, lat, lng |
| **hours** | 2 | title, schedule (Record), note |
| **whatsapp-float** | 2 | number, message |

---

## Schemas de Conteúdo por BlockType

### hero
```
headline: string           ← texto inline (H1) — suporta *accent*
subheadline: string        ← texto inline (P)
ctaText: string            ← botão CTA (primário)
ctaLink?: string           ← URL do botão
ctaType: "whatsapp"|"link"|"scroll"
secondaryCtaText?: string  ← botão CTA (secundário)
secondaryCtaLink?: string
backgroundImage?: string   ← URL da imagem de fundo
overlayOpacity: 0-1
```

### services
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
items[]:
  name: string             ← texto inline (H3)
  description: string      ← texto inline (P)
  price?: string           ← texto inline (SPAN)
  icon?: string
  image?: string           ← imagem
  ctaText?: string         ← botão CTA
  ctaLink?: string
```

### testimonials
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
items[]:
  text: string             ← texto inline (BLOCKQUOTE/P)
  author: string           ← texto inline (SPAN)
  rating?: 1-5             ← componente (stars)
  role?: string            ← texto inline (SPAN)
```

### pricing
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
showBillingToggle: boolean ← componente (toggle)
plans[]:
  name: string             ← texto inline (H3)
  price: string            ← texto inline (SPAN)
  priceAnnual?: string     ← texto inline
  description: string      ← texto inline (P)
  features: string[]       ← texto inline (cada item)
  highlighted: boolean     ← componente (toggle)
  ctaText: string          ← botão CTA
  ctaType: "whatsapp"|"link"
```

### faq
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
items[]:
  question: string         ← texto inline (SPAN dentro de BUTTON)
  answer: string           ← texto inline (P)
```

### stats
```
title?: string             ← texto inline (H2)
items[]:
  value: string            ← texto inline (H3/SPAN)
  label: string            ← texto inline (P/SPAN)
  icon?: string
```

### cta
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
ctaText: string            ← botão CTA
ctaType: "whatsapp"|"link"|"scroll"
ctaLink?: string
backgroundColor: "primary"|"secondary"|"accent"|"gradient"
```

### about
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
paragraphs: string[]       ← texto inline (P cada)
highlights?[]:
  label: string            ← texto inline (SPAN)
  value: string            ← texto inline (SPAN)
image?: string             ← imagem
```

### gallery
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
images[]:
  url: string              ← imagem
  alt: string
  caption?: string         ← texto inline
```

### contact
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
showMap: boolean           ← componente (toggle)
showForm: boolean          ← componente (toggle)
formFields: string[]       ← componente (lista editável)
address?: string           ← texto inline
phone?: string             ← texto inline
email?: string             ← texto inline
whatsapp?: string          ← texto inline
```

### team
```
title: string              ← texto inline (H2) — suporta *accent*
subtitle?: string          ← texto inline (P)
members[]:
  name: string             ← texto inline
  role: string             ← texto inline
  bio?: string             ← texto inline
  image?: string           ← imagem
```

### header
```
storeName?: string         ← texto inline (logo text)
logoUrl?: string           ← imagem (logo)
ctaText?: string           ← botão CTA
ctaLink?: string
```

### footer
```
copyrightText?: string     ← texto inline
showSocial: boolean        ← componente (toggle)
```

---

## Componentes Compartilhados

### StyledHeadline (`shared/styled-headline.tsx`)
- Renderiza texto com marcação accent: `"*palavra*"` → `<em>` com cor accent
- Estilos variam por `tokens.style`:
  - elegant: serif + wavy underline
  - bold: uppercase + thick underline
  - warm: bold + accent color
  - industrial: italic serif + accent
  - minimal: bottom border

### PglButton (`shared/pgl-button.tsx`)
- Props: `href, variant ("primary"|"secondary"), tokens, isDark`
- Renderiza como `<a>` se tem href, senão `<button>`
- Classe: `inline-flex` (NUNCA `w-full`)
- Estilos variam por tokens.style e variant

### ImageFrame (`shared/image-frame.tsx`)
- Wrapper para imagens com border-radius e shadow por estilo
- Lazy loading nativo

---

## Classificação de Campos para o Editor

Cada campo de conteúdo se encaixa em um de 3 modos de edição:

### 1. `text` — Edição inline (contentEditable)
Campos que renderizam como H1-H6, P, SPAN, LI, BLOCKQUOTE.
O usuário clica e edita direto no preview.

### 2. `button` — Edição via popup (CTA)
Campos que representam botões de ação.
Popup com: label, tipo de link, URL.
Campos relacionados: `ctaText` + `ctaLink` + `ctaType`

### 3. `image` — Edição via popup (imagem)
Campos que são URLs de imagens.
Popup com: upload, busca, URL.

### 4. `component` — Edição via drawer lateral
Campos complexos que não se encaixam nos anteriores.
Ex: `formFields`, `showMap`, `highlighted`, `schedule`, `rating`
Editados pelo drawer "Editar conteúdo" na section toolbar.

---

## Padrão para Novos Componentes

Para que um novo componente funcione bem com o editor:

### 1. Props obrigatórias
```tsx
interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
}
```

### 2. Validação de conteúdo
```tsx
const parsed = MyContentSchema.safeParse(content);
if (!parsed.success) return null;
const c = parsed.data;
```

### 3. Usar StyledHeadline para títulos
```tsx
<StyledHeadline text={c.title} tokens={tokens} as="h2" className="..." />
```

### 4. Usar PglButton para CTAs
```tsx
<PglButton href={c.ctaLink || "#contact"} tokens={tokens}>
  {c.ctaText}
</PglButton>
```

### 5. Evitar botões UI desnecessários
Carousel arrows, accordion toggles, etc. devem ter:
- Sem texto visível (apenas `aria-label`)
- OU `w-full` + SVG icon (para FAQ toggles)
- O editor ignora esses botões automaticamente

### 6. Registrar no block-registry
```ts
// blocks/registry.ts
"my-block": {
  1: () => import("./my-block/my-block-default").then(m => ({ default: m.MyBlockDefault })),
}
```
