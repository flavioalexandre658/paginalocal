---
name: pgl-site-extraction
description: Processo completo para extrair o design de um site de referencia e transformar em um template do Decolou. Usar sempre que o usuario fornecer um HTML de site para clonar. Cobre extracao CSS pixel-perfect, componentizacao de secoes, registro no banco, animacoes, responsivo mobile e documentacao de paleta.
---

# PGL — Extracao de Design para Templates

## Visao Geral

Este skill define o processo para extrair o design EXATO de um site HTML de referencia e transforma-lo em um **template completo** do Decolou. Cada template e composto por secoes independentes que a IA preenche com conteudo.

**Principio fundamental**: Extracao PIXEL-PERFECT. Cada valor (font-size, weight, tracking, line-height, padding, gap, radius, color, shadow, animacao) deve ser extraido diretamente do CSS do site fonte. NUNCA interpretar livremente — COPIAR os valores exatos.

---

## Arquitetura de Templates

```
src/templates/
├── registry.ts              # TEMPLATE_REGISTRY: templateId → blockType → variant → componente
├── types.ts                 # TemplateConfig, TemplateSectionProps
├── [nome-template]/
│   ├── config.ts            # TemplateConfig (secoes, estilo, fontes, nichos)
│   ├── index.ts             # Exporta config
│   ├── sections/
│   │   ├── header.tsx
│   │   ├── hero.tsx
│   │   ├── process.tsx      # (services variant 1)
│   │   ├── features.tsx     # (services variant 2)
│   │   ├── integrations.tsx # (stats variant 1)
│   │   ├── pricing.tsx
│   │   ├── testimonials.tsx
│   │   ├── faq.tsx
│   │   └── footer.tsx
│   └── preview-data.ts      # Dados mockup para preview
```

Cada secao:
- E um componente React independente
- Recebe `{ content, tokens, isDark?, navigation? }` como props
- Usa CSS vars (`--pgl-primary`, `--pgl-font-heading`, etc.) para cores/fontes parametrizaveis
- Usa inline styles para valores exatos do design
- Usa Tailwind APENAS para layout responsivo (flex-direction, width, padding que muda entre breakpoints)
- Controla seu proprio background (page-renderer alterna `--pgl-background` / `--pgl-surface`)

---

## Pre-requisitos

1. HTML do site salvo em `.claude/sites-clone/NomeDoSite.html`
2. Screenshots desktop E mobile do site original para comparacao

---

## Processo Completo (10 Etapas)

### Etapa 1: Identificar Secoes

```bash
# Para sites Framer:
grep -o 'data-framer-name="[^"]*Section[^"]*"' SiteNome.html
grep -o 'data-framer-name="[^"]*[Hh]eader[^"]*"' SiteNome.html
grep -o 'data-framer-name="[^"]*[Ff]ooter[^"]*"' SiteNome.html

# Breakpoints:
grep -oE 'max-width: [0-9.]+px' SiteNome.html | sort -u
```

Mapear cada secao para um blockType:

| Secao no Site | blockType PGL |
|---|---|
| Header/Nav | `header` |
| Hero | `hero` |
| Features/Process | `services` (variant 1 = process, variant 2 = features) |
| Stats/Integrations | `stats` |
| Pricing | `pricing` |
| Testimonials/Cases | `testimonials` |
| FAQ | `faq` |
| Footer | `footer` |
| About | `about` |
| Contact | `contact` |
| CTA | `cta` |

### Etapa 2: Extrair Design Tokens Globais + Paleta

```bash
# Cores
grep -oE 'rgb\([0-9]+, [0-9]+, [0-9]+\)' SiteNome.html | sort -u

# Fontes
grep -oE "font-family:[^;\"]*" SiteNome.html | sort -u

# Tokens CSS (Framer)
grep -o 'var(--token-[^)]*' SiteNome.html | sort -u
```

Salvar paleta em `memory/site_palette_NOMEDOSITE.md`. Incluir:
- Background, Surface, Text, TextMuted (cores de fundo e texto)
- Primary, Secondary, Accent (cores de marca)
- Border-radius padrao, sombras, espacamento entre secoes
- **Secoes que tem bg escuro** (pricing, CTA) vs bg claro

### Etapa 3: Extrair CSS de CADA Secao (1 POR VEZ)

**REGRA CRITICA**: Processar UMA secao por vez.

#### 3a. Localizar HTML
```bash
node -e "
const fs = require('fs');
const html = fs.readFileSync('SiteNome.html', 'utf-8');
const start = html.indexOf('data-framer-name=\"NOME Section\"');
const tagStart = html.lastIndexOf('<', start);
console.log(html.substring(tagStart, tagStart + 5000));
"
```

#### 3b. Extrair CSS das classes
```bash
grep -oE '\.framer-CLASSNAME\{[^}]*\}' SiteNome.html | head -1
grep -oE 'framer-styles-preset-NOME[^}]*\}' SiteNome.html | head -1
```

#### 3c. Extrair animacoes e efeitos
```bash
# Keyframes
grep -oE '@keyframes [^{]*\{[^}]*\}' SiteNome.html

# Transitions
grep -oE 'transition:[^;}"]*' SiteNome.html | sort -u

# Transforms
grep -oE 'transform:[^;}"]*' SiteNome.html | sort -u

# Backdrop filters (glassmorphism)
grep -oE 'backdrop-filter:[^;}"]*' SiteNome.html | sort -u

# Scroll animations (Framer)
grep -oE 'data-framer-appear[^"]*' SiteNome.html | sort -u

# Hover states
grep -oE ':hover\{[^}]*\}' SiteNome.html | head -10
```

#### 3d. Documentar TODOS os valores ANTES de codar
```
SECAO: FAQ
Layout:
- Container: max-width 1200px, padding 80px, flex row 33%/58%
Tipografia:
- H2: heading font, 36px, weight 400, tracking -0.05em, leading 1.1
- Question: heading font, 20px, weight 400, tracking -0.04em
Cores:
- Bg: var(--pgl-background)
- Card fechado: rgba(255,255,255,0.7)
- Card aberto: rgba(255,255,255,0.9) + shadow + border white
Animacoes:
- Accordion: transition all 0.3s
- Plus icon: rotate 45deg on open
- Card: background-color 0.3s, box-shadow 0.3s, border-color 0.3s
```

### Etapa 4: Criar Componente React (Desktop + Mobile)

Criar em `src/templates/[nome]/sections/[secao].tsx`

#### Regras de implementacao:

**1. Inline styles para valores EXATOS de design:**
```tsx
style={{ fontSize: 20, fontWeight: 400, letterSpacing: "-0.04em", lineHeight: "1.3em" }}
```

**2. CSS vars para cores/fontes parametrizaveis:**
```tsx
style={{ color: "var(--pgl-text)", fontFamily: "var(--pgl-font-heading)" }}
```

**3. REGRA CRITICA — Tailwind para layout responsivo, NUNCA inline:**
```tsx
// ❌ ERRADO — inline bloqueia responsivo
<div style={{ display: "flex", flexDirection: "row", width: "41%" }}>

// ✅ CORRETO — Tailwind controla layout
<div className="flex flex-col md:flex-row w-full md:w-[41%]">
```

**4. Botoes com estilo inline do template (NAO usar PglButton):**
```tsx
<a style={{ borderRadius: 32, backgroundColor: "var(--pgl-text)", padding: "8px 8px 8px 16px" }}>
```

**5. Parse de *accent* words nos titulos:**
```tsx
{c.title.split(/\*([^*]+)\*/).map((part, i) =>
  i % 2 === 1 ? <span key={i} style={{ color: tokens.palette.accent }}>{part}</span>
              : <span key={i}>{part}</span>
)}
```

**6. ZERO textos hardcoded — todo conteudo vem do blueprint:**
```tsx
// ❌ ERRADO
<button>Contact us</button>
<p>4.9 / 5 Rated</p>

// ✅ CORRETO
<button>{c.ctaText}</button>
// Ou simplesmente remover se nao tem campo no schema
```

**7. Editabilidade — ver Etapa 4b abaixo (secao dedicada)**

**8. Props padrao:**
```tsx
interface Props {
  content: Record<string, unknown>;
  tokens: DesignTokens;
  isDark?: boolean;
  navigation?: { label: string; href: string; isExternal?: boolean }[];
}
```

**9. Schema de content:**
```tsx
const parsed = HeroContentSchema.safeParse(content);
if (!parsed.success) return null;
const c = parsed.data;
```

### Etapa 4b: Tornar TODOS os Elementos Editaveis

**REGRA CRITICA**: Todo elemento visivel que o usuario pode querer mudar DEVE ser editavel no editor visual. Um template sem editabilidade e inutil.

O editor detecta editabilidade via dois atributos HTML:
- `data-pgl-path` — caminho dot-notation ate o campo no content (ex: `"items.2.name"`)
- `data-pgl-edit` — tipo de edicao (define qual UI o editor abre)

#### Modos de edicao disponiveis

| Modo | Uso | UI no Editor |
|---|---|---|
| `"text"` | Titulos, paragrafos, labels, nomes | contentEditable inline |
| `"button"` | Botoes/CTAs (texto + link + tipo) | Popup modal |
| `"image"` | Imagens, avatares, logos, backgrounds | Popup upload/search/URL |
| `"nav"` | Header (nome da loja, logo, links, CTA) | Popup modal |
| `"footer"` | Footer (copyright, redes sociais) | Popup modal |
| `"pricing"` | Tabela de precos (planos, features) | Popup modal |

#### Como aplicar `data-pgl-path`

Usa **dot-notation** para mapear ate o campo no objeto `content`:

```tsx
// Campo raiz
data-pgl-path="title"           // → content.title
data-pgl-path="subtitle"        // → content.subtitle
data-pgl-path="backgroundImage" // → content.backgroundImage

// Campo dentro de array (indice numerico)
data-pgl-path="items.0.name"         // → content.items[0].name
data-pgl-path="items.2.description"  // → content.items[2].description
data-pgl-path="plans.0.features.1"   // → content.plans[0].features[1]

// Imagem dentro de array
data-pgl-path="items.0.image"        // → content.items[0].image
```

#### Exemplos por tipo de elemento

**Textos (inline edit):**
```tsx
<h2 data-pgl-path="title" data-pgl-edit="text">{c.title}</h2>
<p data-pgl-path="subtitle" data-pgl-edit="text">{c.subtitle}</p>
<span data-pgl-path="items.0.name" data-pgl-edit="text">{item.name}</span>
<span data-pgl-path="items.2.role" data-pgl-edit="text">{item.role}</span>
```

**Botoes (popup: texto + link + tipo):**
```tsx
<a data-pgl-path="ctaText" data-pgl-edit="button" href={c.ctaLink}>
  {c.ctaText}
</a>
<a data-pgl-path="items.0.ctaText" data-pgl-edit="button" href={item.ctaLink}>
  {item.ctaText}
</a>
```

**Imagens (popup: upload/search/URL):**
```tsx
// Imagem simples
<img data-pgl-path="backgroundImage" data-pgl-edit="image" src={c.backgroundImage} />

// Imagem dentro de array — atributo no CONTAINER, nao no <img>
<div data-pgl-path="items.0.image" data-pgl-edit="image" style={{ overflow: "hidden" }}>
  {item.image ? (
    <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  ) : (
    <div>/* placeholder/fallback visual */</div>
  )}
</div>

// Avatar/foto de perfil em testimonials
<div
  data-pgl-path="items.3.image"
  data-pgl-edit="image"
  style={{ width: 56, height: 56, borderRadius: 16, overflow: "hidden" }}
>
  {item.image ? (
    <img src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  ) : (
    <span>{item.author.charAt(0)}</span>
  )}
</div>
```

**Header (popup: nome, logo, links):**
```tsx
<header data-pgl-path="storeName" data-pgl-edit="nav">
  ...
</header>
```

**Footer (popup: copyright, social):**
```tsx
<footer data-pgl-path="copyrightText" data-pgl-edit="footer">
  ...
</footer>
```

**Pricing (popup: planos, features, precos):**
```tsx
<div data-pgl-path="plans" data-pgl-edit="pricing">
  {c.plans.map((plan, idx) => (
    <div key={idx}>
      <span data-pgl-path={`plans.${idx}.name`} data-pgl-edit="text">{plan.name}</span>
      <span data-pgl-path={`plans.${idx}.price`} data-pgl-edit="text">{plan.price}</span>
      <span data-pgl-path={`plans.${idx}.description`} data-pgl-edit="text">{plan.description}</span>
      <a data-pgl-path={`plans.${idx}.ctaText`} data-pgl-edit="button">{plan.ctaText}</a>
      {plan.features.map((feat, fi) => (
        <span key={fi} data-pgl-path={`plans.${idx}.features.${fi}`} data-pgl-edit="text">{feat}</span>
      ))}
    </div>
  ))}
</div>
```

#### Regra para imagens com fallback

Quando a imagem pode nao existir (placeholder/skeleton), o `data-pgl-edit="image"` vai no **container div**, NAO no `<img>`. Assim o editor detecta o clique mesmo sem imagem:

```tsx
// ✅ CORRETO — atributo no container
<div data-pgl-path="items.0.image" data-pgl-edit="image" style={{ overflow: "hidden" }}>
  {item.image ? <img src={item.image} /> : <div className="placeholder" />}
</div>

// ❌ ERRADO — se nao tem imagem, nao existe <img> para clicar
{item.image && <img data-pgl-path="items.0.image" data-pgl-edit="image" src={item.image} />}
```

#### Atualizar o BLOCK_EDIT_MAP

Apos criar o componente, verificar se `src/app/editor/[storeSlug]/_lib/block-edit-map.ts` tem TODOS os campos editaveis do blockType registrados:

```typescript
// Exemplo: se o blockType "stats" agora tem imagens
stats: [
  { path: "title", mode: "text", label: "Título" },
  { path: "items.*.value", mode: "text", label: "Valor" },
  { path: "items.*.label", mode: "text", label: "Label" },
  { path: "items.*.image", mode: "image", label: "Imagem" },  // ← ADICIONAR
],
```

O `BLOCK_EDIT_MAP` usa `*` como wildcard para indices de array. O editor resolve `items.*.name` para `items.0.name`, `items.1.name`, etc. automaticamente.

#### Checklist de editabilidade por secao

Para CADA secao do template, verificar:

| Elemento | `data-pgl-edit` | Exemplo path |
|---|---|---|
| Titulo principal (H2) | `"text"` | `"title"` |
| Subtitulo | `"text"` | `"subtitle"` |
| Botao CTA | `"button"` | `"ctaText"` |
| Botao secundario | `"button"` | `"secondaryCtaText"` |
| Imagem de fundo | `"image"` | `"backgroundImage"` |
| Nome de item em lista | `"text"` | `"items.N.name"` |
| Descricao de item | `"text"` | `"items.N.description"` |
| Imagem de item | `"image"` | `"items.N.image"` |
| Botao de item | `"button"` | `"items.N.ctaText"` |
| Autor (testimonial) | `"text"` | `"items.N.author"` |
| Cargo/role | `"text"` | `"items.N.role"` |
| Foto/avatar | `"image"` | `"items.N.image"` |
| Pergunta FAQ | `"text"` | `"items.N.question"` |
| Resposta FAQ | `"text"` | `"items.N.answer"` |
| Plano (nome) | `"text"` | `"plans.N.name"` |
| Plano (preco) | `"text"` | `"plans.N.price"` |
| Plano (CTA) | `"button"` | `"plans.N.ctaText"` |
| Feature do plano | `"text"` | `"plans.N.features.N"` |
| Header completo | `"nav"` | `"storeName"` |
| Footer completo | `"footer"` | `"copyrightText"` |
| Container de pricing | `"pricing"` | `"plans"` |

---

### Etapa 5: Implementar Animacoes e Efeitos

#### Tipos de animacao a extrair:

**Hover states:**
```tsx
onMouseEnter={(e) => {
  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.6)";
  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.4)";
  e.currentTarget.style.boxShadow = "none";
}}
```

**CSS transitions (via style tag):**
```tsx
<style dangerouslySetInnerHTML={{ __html: `
  .template-faq-item {
    background: rgba(255,255,255,0.7);
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  .template-faq-item[open] {
    background: rgba(255,255,255,0.9);
    box-shadow: rgba(0,0,0,0.1) 0px 8px 20px;
  }
`}} />
```

**Transform animations:**
```tsx
// Rotate on open (accordion icons)
className="transition-transform duration-200 group-open:rotate-45"

// Card tilt
style={{ transform: "rotate(2deg)" }}
```

**Glassmorphism:**
```tsx
style={{
  backdropFilter: "blur(5px)",
  WebkitBackdropFilter: "blur(5px)",
  background: "linear-gradient(320deg, rgba(0,0,0,0.3), rgba(0,0,0,0.45))",
}}
```

**Scroll reveal (se o site original tem):**
```tsx
// Usar Framer Motion para entrada
import { motion } from "framer-motion";
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
```

**Gradient masks (fade effect):**
```tsx
style={{
  background: "linear-gradient(180deg, var(--pgl-background) 0%, transparent 15%, transparent 85%, var(--pgl-background) 100%)",
}}
```

### Etapa 6: Implementar Versao Mobile Responsiva

**OBRIGATORIO** para cada secao.

```tsx
// Container padding
className="px-6 py-12 md:px-[80px] md:py-[80px]"

// Flex direction
className="flex flex-col md:flex-row"

// Widths
className="w-full md:w-[41%]"

// Font clamp
style={{ fontSize: "clamp(28px, 5vw, 36px)" }}

// Hidden/shown
className="hidden md:block"  // desktop only
className="md:hidden"        // mobile only

// Grids
className="grid grid-cols-1 md:grid-cols-3 gap-2"
```

### Etapa 7: Registrar no Template Registry

#### 7a. `src/templates/registry.ts`
```typescript
aurora: {  // ou nome do novo template
  header: {
    1: lazySection(() => import("./[nome]/sections/header").then(m => ({ default: m.NomeHeader }))),
  },
  hero: {
    1: lazySection(() => import("./[nome]/sections/hero").then(m => ({ default: m.NomeHero }))),
  },
  // ... todas as secoes
}
```

#### 7b. `src/templates/[nome]/config.ts`
```typescript
export const NOME_CONFIG: TemplateConfig = {
  id: "nome-slug",
  name: "Nome Legivel",
  description: "Descricao do estilo visual",
  thumbnail: "/templates/nome/thumbnail.png",
  bestFor: ["nicho1", "nicho2"],
  forceStyle: "elegant",
  forceRadius: "lg",
  recommendedHeadingFont: "inter",
  recommendedBodyFont: "inter",
  defaultSections: [
    { blockType: "header", variant: 1, name: "...", description: "..." },
    // ... TODAS as secoes na ordem
  ],
  availableVariants: {
    header: [1], hero: [1], services: [1, 2],
    // ... TODOS os blockTypes
  },
}
```

### Etapa 8: Inserir Template no Banco de Dados

#### 8a. Adicionar ao seed (`src/db/seed-templates.ts`)
```typescript
await db.insert(siteTemplate).values({
  id: 'nome-slug',
  name: 'Nome Legivel',
  description: '...',
  bestFor: ['nicho1', 'nicho2', ...],
  forceStyle: 'elegant',
  forceRadius: 'lg',
  recommendedHeadingFont: 'inter',
  recommendedBodyFont: 'inter',
  defaultSections: [
    { blockType: 'header', variant: 1, name: '...', description: '...' },
    // TODAS as secoes
  ],
  availableVariants: { header: [1], hero: [1], ... },
  sortOrder: 2,  // proximo numero
  isActive: true,
}).onConflictDoUpdate({
  target: siteTemplate.id,
  set: {
    name: '...',
    description: '...',
    bestFor: [...],
    defaultSections: [...],  // IMPORTANTE: incluir no update!
    availableVariants: {...},
    updatedAt: new Date(),
  },
})
```

**REGRA CRITICA**: O `onConflictDoUpdate` DEVE incluir `defaultSections` e `availableVariants`. Se nao incluir, o banco fica com dados desatualizados.

#### 8b. Rodar o seed
```bash
npx tsx src/db/seed-templates.ts
```

#### 8c. Verificar no banco
```bash
npx tsx -e "
import 'dotenv/config';
import { db } from './src/db';
import { siteTemplate } from './src/db/schema';
import { eq } from 'drizzle-orm';
const data = await db.select({ defaultSections: siteTemplate.defaultSections }).from(siteTemplate).where(eq(siteTemplate.id, 'nome-slug')).limit(1);
console.log(data[0]?.defaultSections);
process.exit(0);
"
```

### Etapa 9: Registrar Campos de Imagem

Em `src/config/block-image-fields.ts`, garantir que os blockTypes do template estao cobertos:

```typescript
hero: [{ path: "backgroundImage", type: "single", imageType: "hero", description: "..." }],
services: [{ path: "items", type: "array-items", imageType: "gallery", description: "..." }],
testimonials: [{ path: "items", type: "array-items", imageType: "gallery", description: "..." }],
```

### Etapa 10: Criar Pagina de Preview

```
src/app/(marketing)/preview-[nome]/page.tsx
```

- Import direto dos componentes + `DesignTokensProvider`
- Dados mockup que mostram o template completo
- `robots: { index: false }`
- Testar em DESKTOP e MOBILE

---

### Etapa 11: Criar Content Map (Mapa de Conteudo para IA)

**OBRIGATORIO** para cada template. Sem isso, a IA gera conteudo generico que nao encaixa nos componentes.

#### O que e

Um arquivo `content-map.ts` por template que diz a IA **exatamente** quais campos gerar, com que formato, tom e tamanho. Usa `FieldSpec[]` tipado (nao string livre).

#### Onde fica

```
src/templates/[nome]/content-map.ts
```

#### Interfaces

```typescript
// Em src/templates/types.ts

interface FieldSpec {
  key: string;                   // "headline", "items", "highlights"
  type: "string" | "array" | "object";
  maxLength?: number;            // limite de caracteres
  count?: { min: number; max: number }; // para arrays
  children?: FieldSpec[];        // campos dentro de cada item
  description: string;           // o que a IA deve gerar
}

export interface ImageSpec {
  aspectRatio: "16:9" | "1:1" | "4:3" | "3:4";
  style: string;       // "cinematic professional photo", "headshot portrait"
  subject: string;     // O que a imagem deve mostrar
  avoid: string[];     // O que evitar na geracao
  count?: number;      // Quantas imagens gerar (para arrays)
}

export interface SectionContentMap {
  blockType: string;
  variant: number;
  fields: FieldSpec[];
  contentGuidance: string;       // tom, tamanho, contexto visual (em PT-BR)
  imageQueryHint?: string;       // hint para busca Unsplash (fallback)
  exampleOutput?: Record<string, unknown>; // few-shot example
  imageSpec?: ImageSpec;         // spec para geracao de imagem AI (Gemini)
  imageSpecs?: Record<string, ImageSpec>; // multiplos campos de imagem
}
```

#### ImageSpec por blockType (padrao)

| blockType | aspectRatio | style | Descricao |
|---|---|---|---|
| hero (backgroundImage) | 16:9 | cinematic professional | cena do negocio |
| about (image) | 4:3 | documentary editorial | equipe/espaco |
| services (items[].image) | 4:3 | clean service photo | servico em acao |
| testimonials (items[].image) | 1:1 | headshot portrait | pessoa sorrindo |
| gallery (images[].url) | 4:3 | editorial project | trabalho concluido |
| cta (backgroundImage) | 16:9 | atmospheric | ambiente inspirador |

#### Como criar

1. O content map tem **1 entry por secao** na **mesma ordem** de `defaultSections` no config
2. O acesso e por **indice direto** (`contentMap[i]` = `defaultSections[i]`), NAO por blockType+variant
3. Cada entry descreve os campos Zod do schema que a IA precisa preencher
4. `contentGuidance` descreve como o componente renderiza visualmente
5. `exampleOutput` e um JSON de exemplo (few-shot) — melhora drasticamente a qualidade
6. `imageQueryHint` e usado como fallback quando a IA nao gera query de imagem

#### Exemplo: About com Tabs + Checklist

```typescript
{
  blockType: "about",
  variant: 1,
  fields: [
    { key: "title", type: "string", maxLength: 60, description: "titulo com *destaque* accent" },
    { key: "subtitle", type: "string", maxLength: 50, description: "tag uppercase 2-4 palavras" },
    { key: "highlights", type: "array", count: { min: 3, max: 3 }, children: [
      { key: "label", type: "string", maxLength: 20, description: "nome da tab (1-2 palavras)" },
      { key: "value", type: "string", maxLength: 300, description: "paragrafo mostrado quando tab ativa" },
    ], description: "3 TABS clicaveis" },
    { key: "paragraphs", type: "array", count: { min: 4, max: 6 }, children: [
      { key: "", type: "string", maxLength: 50, description: "frase curta de checklist" },
    ], description: "bullet points do checklist 2x2" },
  ],
  contentGuidance: "Imagem a esquerda, conteudo a direita. Tag + H2 + 3 tabs + paragrafo dinamico + checklist 2x2.",
  imageQueryHint: "professional team workspace",
  exampleOutput: {
    title: "Mais de uma *decada* cuidando do seu conforto",
    subtitle: "QUEM SOMOS",
    highlights: [
      { label: "Nossa Missao", value: "Oferecer solucoes que garantam conforto..." },
    ],
    paragraphs: ["Equipe treinada", "Atendimento rapido", "Garantia total", "Orcamento gratis"],
  },
}
```

#### Registrar no pipeline

O registry central fica em `src/templates/content-maps.ts`:

```typescript
import { NOME_CONTENT_MAP } from "./[nome]/content-map";
const CONTENT_MAPS = { [templateId]: NOME_CONTENT_MAP };
export function getContentMapForTemplate(id: string) { return CONTENT_MAPS[id]; }
```

**OBRIGATORIO**: Apos criar o content map, SEMPRE adicionar o import e a entry no `CONTENT_MAPS` record em `src/templates/content-maps.ts`.

O `generate-site-v2.ts` usa `buildSectionPrompt(contentMap[i], i)` que serializa os FieldSpec em instrucoes formatadas para a IA, incluindo o exampleOutput como few-shot.

O prompt inclui: `EXATAMENTE N secoes, nesta ordem` — a IA e obrigada a gerar 1 objeto por secao do template.

#### Normalizacao de dados da IA no assembleBlueprint

A IA as vezes gera dados em formato diferente do esperado pelo schema Zod. O `assembleBlueprint()` normaliza automaticamente:

- `paragraphs`: IA gera `[{text: "..."}]` → normalizado para `["..."]`
- `rating`: IA gera `"5"` (string) → normalizado para `5` (number)

Se um schema Zod rejeita o conteudo da IA (`safeParse` falha), o componente retorna `null` e a secao desaparece. Por isso:
- Schemas devem ser TOLERANTES (limits altos, coerce numbers, optional fields)
- Componentes devem normalizar dados antes do safeParse como defesa extra

---

### Etapa 12: Parse de *accent* Words nos Titulos

**OBRIGATORIO** em TODAS as secoes que exibem titulos (H1, H2, H3).

A IA gera textos com `*palavra*` para indicar destaque em cor accent. O componente DEVE fazer parse disso.

#### Funcao helper

Adicionar em cada arquivo de secao que renderiza titulos:

```tsx
function renderAccentText(text: string, accentColor: string) {
  return text.split(/\*([^*]+)\*/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: accentColor }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
```

#### Uso

```tsx
// ❌ ERRADO — mostra asteriscos literais
<h2>{c.title}</h2>

// ✅ CORRETO — renderiza *palavra* na cor accent
<h2>{renderAccentText(c.title, accent)}</h2>
```

#### Onde aplicar

Em TODA secao que renderiza `title`, `headline`, ou qualquer texto que a IA pode gerar com `*destaque*`:
- hero (headline)
- about (title)
- services (title)
- process (title)
- testimonials (title)
- gallery (title)
- cta (title)
- quick-form (title)
- why-choose (title)

O `renderAccentText` nao afeta textos sem asteriscos — retorna o texto normal.

---

### Etapa 13: Eliminar Textos Hardcoded

**REGRA CRITICA**: ZERO textos hardcoded em ingles ou fixos. Todo texto visivel deve:
1. Vir do `content` prop (gerado pela IA)
2. Ou ser um label PT-BR generico (ex: "Solicitar orcamento", "Enviar mensagem")

#### O que verificar

| Componente | Textos que NUNCA devem ser hardcoded |
|---|---|
| Header | "24/7 Emergency Service" → usar "Atendimento 24h" ou content |
| Footer | "Quick Links", "Service Areas", "Contact Us", "Emergency Plumbing" → usar PT-BR ou nav items |
| Footer description | Frases em ingles sobre o negocio → usar `storeName` dinamico |
| CTA | "Submit Request" → "Enviar mensagem" |
| CTA | Paragrafos descritivos hardcoded → remover ou usar content fields |
| Quick Form | "Enter your full name" → "Seu nome completo" |
| Quick Form | Botao com `c.subtitle` como label (fica enorme) → texto fixo curto "Solicitar orcamento" |
| Testimonials | "Customer Review" → remover ou usar content |

#### Regra para botoes de submit

NUNCA usar um campo de conteudo longo (como `subtitle`) como texto de botao. Botoes de submit devem ter texto fixo curto em PT-BR:
- "Solicitar orcamento"
- "Enviar mensagem"
- "Enviar"
- "Agendar"

#### Regra para placeholders de input

Sempre em PT-BR:
- "Seu nome completo"
- "Seu e-mail"
- "Seu telefone"
- "Sua mensagem"

---

## Checklist Final

- [ ] Paleta documentada em memory
- [ ] CADA secao extraida com CSS exatos (1 por vez)
- [ ] Animacoes e efeitos extraidos (hover, transitions, transforms, glassmorphism)
- [ ] Inline styles para design, Tailwind para layout responsivo
- [ ] Versao mobile responsiva em TODOS os componentes
- [ ] ZERO textos hardcoded (todo conteudo vem do schema/blueprint)
- [ ] Parse de `*accent*` words nos titulos
- [ ] **EDITABILIDADE**: `data-pgl-path` + `data-pgl-edit` em TODOS os elementos visiveis
- [ ] **EDITABILIDADE**: Imagens com fallback usam `data-pgl-edit="image"` no container (nao no `<img>`)
- [ ] **EDITABILIDADE**: `BLOCK_EDIT_MAP` atualizado com todos os campos novos
- [ ] Campos de imagem registrados em `block-image-fields.ts`
- [ ] Template registrado em `templates/registry.ts`
- [ ] Template config em `templates/[nome]/config.ts`
- [ ] Template inserido no BANCO via seed (com defaultSections no onConflictDoUpdate!)
- [ ] Pagina de preview criada e testada desktop + mobile
- [ ] Background alterna automaticamente (page-renderer aplica background/surface)
- [ ] **CONTENT MAP**: `content-map.ts` criado com 1 entry por secao (FieldSpec tipado)
- [ ] **CONTENT MAP**: Registrado em `src/templates/content-maps.ts` (import + entry no CONTENT_MAPS)
- [ ] **CONTENT MAP**: `imageSpec` em secoes com imagens (hero, about, services, testimonials, gallery)
- [ ] **CONTENT MAP**: `exampleOutput` em secoes criticas (hero, about, stats, testimonials)
- [ ] **ACCENT PARSE**: `renderAccentText()` em TODOS os titulos (H1, H2, H3)
- [ ] **ZERO HARDCODED**: Nenhum texto em ingles, nenhum label de botao usando campo longo
- [ ] **ZERO CORES HARDCODED**: Todas as cores vem de `tokens.palette.*` ou CSS vars
- [ ] **FORMULARIOS**: `useSubmitFormLead` hook, inputs PT-BR, botoes com texto curto
- [ ] **SCHEMAS TOLERANTES**: max generoso em arrays, `z.coerce.number()` para rating, optional em tudo que pode faltar
- [ ] **NORMALIZACAO**: Componentes normalizam `paragraphs` (object→string) antes do safeParse
- [ ] `npx tsc --noEmit` sem erros
- [ ] Preview ~95% fiel ao desktop original
- [ ] Preview ~90% fiel ao mobile original

---

## Anti-patterns

### ❌ Inline style para layout responsivo
Inline `flexDirection: "row"` bloqueia `max-md:flex-col`. Usar Tailwind.

### ❌ Textos hardcoded
"Read more", "Contact us", "4.9/5 Rated" — todo texto visivel deve vir do blueprint.

### ❌ PglButton
Cada template tem seu estilo de botao. Criar inline.

### ❌ Esquecer defaultSections no onConflictDoUpdate do seed
O banco fica com secoes antigas e o template nao gera as secoes corretas.

### ❌ Esquecer animacoes
Hover states, transitions, transforms e glassmorphism sao parte essencial do design.

### ❌ Background fixo
Background e surface devem vir da paleta da IA (var(--pgl-background) / var(--pgl-surface)).

### ❌ max-lg em vez de max-md
Breakpoint padrao e `md:` (768px). Usar `max-md:` para mobile.

### ❌ Elementos sem `data-pgl-edit`
Todo texto, imagem, botao e campo visivel DEVE ter `data-pgl-path` + `data-pgl-edit`. Um template sem editabilidade nao serve para nada — o usuario precisa poder mudar qualquer conteudo.

### ❌ `data-pgl-edit="image"` no `<img>` em vez do container
Se a imagem pode nao existir (fallback/placeholder), o atributo deve ir no `<div>` container. Sem isso, o editor nao detecta o clique quando nao ha imagem.

### ❌ Esquecer de atualizar `BLOCK_EDIT_MAP`
Adicionar novos campos editaveis no componente sem registrar em `block-edit-map.ts` faz o editor ignorar esses campos.

### ❌ Titulo sem parse de `*accent*`
Se o titulo mostra `O *frescor* que sua casa merecia` com asteriscos literais, falta `renderAccentText()`. Aplicar em TODOS os H1/H2/H3.

### ❌ Botao de submit com texto de content field
NUNCA usar `c.subtitle` ou qualquer campo longo como texto de botao. Botoes de form devem ter texto fixo curto: "Solicitar orcamento", "Enviar mensagem".

### ❌ Textos em ingles
"Submit Request", "Emergency Plumbing", "Quick Links" — todo texto visivel deve ser PT-BR. Verificar header, footer, CTA, inputs.

### ❌ Esquecer o Content Map
Template sem `content-map.ts` = IA gera "conteudo adequado" sem saber a estrutura. O about nao tera tabs, a gallery nao tera captions, os stats terao numeros em vez de nomes de ferramentas.

### ❌ Cores hardcoded de marca no template
NUNCA usar `#142F45`, `#CDF660`, `#FF5E15` ou qualquer cor de marca diretamente nos componentes. TODA cor deve vir de:
- `const accent = tokens.palette.accent` (do props)
- `const primary = tokens.palette.primary` (do props)
- `var(--pgl-text)`, `var(--pgl-text-muted)`, `var(--pgl-background)`, `var(--pgl-surface)`, `var(--pgl-primary)`, `var(--pgl-accent)` (CSS vars)
Cores aceitaveis como hardcoded: `#fff` (contraste em fundo escuro), `rgba(255,255,255,X)` e `rgba(0,0,0,X)` (transparencias relativas).

### ❌ ScrollReveal quebrando layout flex
Quando `ScrollReveal` envolve um elemento que participa de flex layout (flex-1, w-full, etc.), o sizing pode quebrar. Solucao: colocar o sizing num `<div>` wrapper EXTERNO e o `ScrollReveal` DENTRO so na animacao.
```tsx
// ❌ ERRADO — ScrollReveal come o flex sizing
<ScrollReveal className="w-full md:flex-1">
  <div>...</div>
</ScrollReveal>

// ✅ CORRETO — div externo controla sizing
<div className="w-full md:flex-1">
  <ScrollReveal>
    <div>...</div>
  </ScrollReveal>
</div>
```

### ❌ Esquecer de registrar no content-maps.ts
Criar o `content-map.ts` do template mas nao adicionar o import + entry no `src/templates/content-maps.ts`. Sem isso, o pipeline nao encontra o mapa e usa o switch/case legado.

---

## Arquivos Envolvidos

| Arquivo | Funcao |
|---|---|
| `.claude/sites-clone/[Site].html` | HTML fonte |
| `src/templates/[nome]/sections/*.tsx` | Componentes de secao |
| `src/templates/[nome]/config.ts` | Config do template |
| `src/templates/registry.ts` | Lazy imports |
| `src/config/template-catalog.ts` | Funcoes de busca (async, banco) |
| `src/config/block-image-fields.ts` | Campos de imagem |
| `src/app/editor/[storeSlug]/_lib/block-edit-map.ts` | Mapa de campos editaveis por blockType |
| `src/db/schema/store-templates.schema.ts` | Schema da tabela |
| `src/db/seed-templates.ts` | Seed (insert/upsert) |
| `src/actions/ai/generate-site-v2.ts` | Gerador (monta blueprint) |
| `src/components/site-renderer/page-renderer.tsx` | Renderiza com alternancia bg |
| `src/components/site-renderer/section-block.tsx` | Resolve template → componente |
| `src/app/(marketing)/preview-[nome]/page.tsx` | Preview |
| `src/templates/[nome]/content-map.ts` | Mapa de conteudo para IA (FieldSpec + ImageSpec) |
| `src/templates/content-maps.ts` | Registry central de content maps |
| `src/templates/content-map-utils.ts` | fieldSpecToPrompt, buildSectionPrompt |
| `src/templates/types.ts` | FieldSpec, ImageSpec, SectionContentMap |
| `src/lib/banana-nano.ts` | API client Gemini para geracao de imagens |
| `src/lib/banana-prompt-builder.ts` | Construtor de prompts de imagem |
| `src/lib/ai-image-pipeline.ts` | Orquestrador: Gemini → S3, Unsplash fallback |
| `src/lib/generation-tracker.ts` | Tracking de tokens, custos e tempo |
| `src/db/schema/site-generation-log.schema.ts` | Tabela de log de geracao |
| `src/db/schema/image-generation-log.schema.ts` | Tabela de log de imagens |
| `src/components/site-renderer/store-context.tsx` | StoreProvider para forms de lead |
| `src/hooks/use-submit-form-lead.ts` | Hook para submit de formularios |
| `src/actions/leads/submit-form-lead.action.ts` | Action para salvar lead (source: form) |
| `memory/site_palette_[nome].md` | Paleta documentada |

---

## Fluxo de Geracao (como o template e usado)

```
1. Onboarding → categoria do negocio
2. createTracker() → inicia cronometro de metricas
3. getBestTemplate(categoria) → busca no banco (com normalizacao de acentos)
4. getContentMapForTemplate(templateId) → carrega content map tipado
5. buildSectionPrompt(contentMap[i], i) → serializa FieldSpec em instrucao
6. Prompt inclui "EXATAMENTE N secoes" → IA obrigada a gerar todas
7. generateContentWithClaude() → retorna content + usage (tokens, modelo, tempo)
8. assembleBlueprint() → normaliza dados da IA (paragraphs, rating)
9. generateAndFillImages() → Gemini primary (rate-limited) + Unsplash fallback
   - Coleta imageSlots de todas secoes
   - Constroi prompts com style prefix global + imageSpec
   - Envia em chunks de 2 com delay para respeitar rate limits
   - Otimiza com Sharp (WebP) + upload S3/CloudFront
10. persistMetrics(tracker, storeId) → salva tokens, custo, tempo no banco
11. page-renderer renderiza (template path: sem alternancia de bg)
12. section-block resolve componentes via TEMPLATE_REGISTRY
```

## Formularios de Lead

Templates com formularios (quick-form, cta com form) devem:
1. Usar o hook `useSubmitFormLead()` de `@/hooks/use-submit-form-lead`
2. O hook le `storeId` do `StoreProvider` (contexto)
3. O `SiteV2Renderer` envolve o site com `<StoreProvider storeId={...}>`
4. A action `submitFormLeadAction` salva na tabela `lead` com `source: 'form'`
5. Campos: `name`, `email`, `phone`, `message` (email e message adicionados na tabela)
6. Placeholders sempre em PT-BR
7. Botao de submit com texto CURTO fixo (nunca usar campo de conteudo longo)

## WhatsApp Float Button

O componente `whatsapp-pill.tsx` herda o estilo do template automaticamente:
- `backgroundColor: tokens.palette.accent`
- `borderRadius: var(--pgl-radius)`
- `fontFamily: var(--pgl-font-body)`
- `color`: auto-detecta via `isColorDark()` — branco se accent escuro, primary se claro
- `boxShadow`: sombra na cor accent com 26% opacity
