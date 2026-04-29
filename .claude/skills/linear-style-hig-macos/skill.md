---
name: linear-style-hig-macos
description: Design system completo para construir interfaces no estilo Apple HIG / Linear / Durable. Usar sempre que criar ou refazer qualquer componente de UI no editor, dashboard ou modais do PGL. Define paleta de cores, tipografia, espacamento, bordas, sombras, estados interativos e padroes de layout.
---

# Linear-Style / Apple HIG Design System — PGL

## Filosofia

Este design system segue os principios da **Apple Human Interface Guidelines (HIG)** adaptados para SaaS web, conhecido no mercado como "Linear-style". Caracteristicas centrais:

- **Monocromatico com opacidade** — Uma unica cor base (`black`) com niveis de opacidade em vez de escalas de cinza nomeadas (slate, gray, zinc)
- **Profundidade sutil** — Sombras e bordas quase invisiveis que criam hierarquia sem peso visual
- **Espacamento generoso** — Componentes "respiram" com padding interno largo
- **Cantos arredondados grandes** — Raios de 12px-32px como padrao (macOS-like)
- **Tipografia system-ui** — Font stack nativa do OS, sem fontes custom no editor
- **Transicoes suaves** — 150ms como padrao, ease-out para entrada
- **Minimalismo funcional** — Cada pixel tem proposito, zero decoracao gratuita

---

## Paleta de Cores

### Regra de ouro: `black/opacity` em vez de cores nomeadas

```
NUNCA:  text-slate-500, bg-gray-100, border-zinc-200
SEMPRE: text-black/55,  bg-black/5,  border-black/[0.08]
```

### Escala completa de opacidades

| Token               | Valor visual         | Uso                                                |
|----------------------|----------------------|----------------------------------------------------|
| `black/80`          | Quase preto          | Texto primario, icones ativos, headings             |
| `black/55`          | Cinza medio          | Texto secundario, icones inativos, labels           |
| `black/40`          | Cinza claro          | Texto terciario, placeholders fortes, chevrons      |
| `black/30`          | Sutil                | Placeholders de input                               |
| `black/20`          | Muito sutil          | Focus rings                                         |
| `black/10`          | Quase invisivel      | Bordas de input, toggle inativo, separadores fortes |
| `black/[0.08]`      | Ultra sutil          | Bordas de cards, dropdowns, pill switcher           |
| `black/[0.06]`      | Fantasma             | Divisores internos, separadores dentro de cards     |
| `black/[0.05]`      | Border sidebar       | `border-t border-black/5` em divisores de secao     |
| `black/[0.04]`      | Background pill      | Background do pill switcher em preview mode         |
| `black/[0.03]`      | Hover background     | Hover em items de sidebar, hover em pill inativo    |
| `black/[0.02]`      | Background secao     | Sidebar settings, bg de option card selecionado     |
| `black/[0.01]`      | Hover muito sutil    | Hover em option cards nao selecionados              |
| `black/5`           | Background ativo     | Nav item ativo, hover em botoes ghost               |
| `white`             | Puro                 | Fundo de cards, modais, pill item ativo             |
| `bg-sidebar`        | Quase branco (oklch) | Fundo de sidebar e topbar (usa CSS variable)        |

### Cores semanticas (usadas com moderacao)

| Cor                    | Uso                                        |
|------------------------|--------------------------------------------|
| `#519A73` / `#DEF2E7`| Verde: status publicado, botao publicar     |
| `#408059`             | Verde hover: botao publicar hover           |
| `amber-100/50` `amber-600` | Amarelo: status nao publicado, demo    |
| `red-50` `red-600`    | Vermelho: hover em "Sair", acoes destrutivas|
| `emerald-500/600`     | Verde: botao primario (PglButton primary)   |
| `#f5f5f4`             | Cinza quente: skeletons, backgrounds de input|
| `#f0fdf4` / `#16a34a` | Verde claro: status "conectado"            |
| `#fef2f2` / `#ef4444` | Vermelho claro: DNS nao configurado        |

### Regra: Quando usar cores semanticas vs black/opacity

- **Layout, navegacao, cards, modais, inputs** → Sempre `black/opacity`
- **Status indicators (publicado/erro/alerta)** → Cores semanticas
- **CTAs primarios (publicar, upgrade)** → Cores de marca (#519A73, emerald, violet)
- **Destrutivos (deletar, sair)** → red-50/red-600 apenas no hover

---

## Tipografia

### Font stack

```tsx
style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
```

Aplicar no container raiz (shell, layout). Nunca usar fontes custom no editor/dashboard.

### Escala tipografica

| Classe          | Tamanho | Uso                                            |
|-----------------|---------|------------------------------------------------|
| `text-[11px]`   | 11px    | Iniciais em avatares pequenos, uppercase labels |
| `text-[12px]`   | 12px    | Status text, meta info, badges                  |
| `text-xs`       | 12px    | Alias para text-[12px]                          |
| `text-[13px]`   | 13px    | **Tamanho padrao** — nav items, botoes, labels  |
| `text-sm`       | 14px    | Texto de corpo, inputs, descriptions            |
| `text-[14px]`   | 14px    | Alias explicito                                 |
| `text-base`     | 16px    | Titulos de modal, section titles                |
| `text-[16px]`   | 16px    | Iniciais em avatares grandes                    |
| `text-xl`       | 20px    | Titulos de tab panel (mobile)                   |
| `text-2xl`      | 24px    | Titulos de tab panel (desktop: `md:text-2xl`)   |

### Pesos

| Peso            | Uso                                              |
|-----------------|--------------------------------------------------|
| `font-medium`   | **Padrao** — nav items, botoes, labels, inputs   |
| `font-semibold` | Headings, nomes de store, titulos de secao        |
| `font-bold`     | Quase nunca — apenas iniciais de avatar           |

### Regra: `text-[13px] font-medium` como default

Na duvida, use `text-[13px] font-medium text-black/55`. Este e o texto "padrao" do sistema.

---

## Espacamento

### Paddings internos de componentes

| Componente            | Padding                          |
|-----------------------|----------------------------------|
| Sidebar               | `px-3 pt-4 pb-4`                |
| Topbar                | `px-4` (h-12)                   |
| Modal body            | `px-6 py-8` mobile, `md:px-14 md:py-12` desktop |
| Modal sidebar         | `p-4`                           |
| Card (option/domain)  | `p-4`                           |
| Card (publish domain) | `p-6`                           |
| Pill switcher         | `p-[3px]`                       |
| Input                 | `px-3.5 py-2.5`                 |
| Button sm             | `h-8 px-3`                      |
| Button md             | `h-9 px-4`                      |
| Nav item expanded     | `px-2 py-1`                     |
| Nav item collapsed    | `p-1.5`                         |
| Dropdown item         | `px-3 py-2`                     |

### Gaps entre elementos

| Contexto              | Gap                              |
|-----------------------|----------------------------------|
| Secoes dentro de tab  | `gap-8`                          |
| Cards em lista        | `gap-3` ou `space-y-3`          |
| Items de navegacao    | `gap-2`                          |
| Icone + texto inline  | `gap-1.5` ou `gap-2`            |
| Sidebar sections      | `gap-3`                          |
| Form label + input    | `gap-1.5`                        |
| Header avatar + name  | `gap-2`                          |

### Divisores

```tsx
// Divisor dentro de dropdown/card
<div className="my-1 h-px bg-black/[0.06]" />

// Divisor de secao no footer da sidebar
<div className="border-t border-black/5 pt-3" />

// Divisor entre secoes no modal
<div className="my-6" style={{ height: 1, backgroundColor: "rgba(0,0,0,0.06)" }} />
```

---

## Border Radius

### Escala de raios

| Classe           | Valor | Uso                                          |
|------------------|-------|----------------------------------------------|
| `rounded-3xl`    | 24px  | Modal dialog container                       |
| `rounded-2xl`    | 16px  | Cards grandes (upgrade, publish, option)     |
| `rounded-xl`     | 12px  | Nav items, buttons md, inputs, dropdowns     |
| `rounded-[14px]` | 14px  | Domain card no publish modal                 |
| `rounded-[12px]` | 12px  | Cards de configuracao, domain cards          |
| `rounded-[10px]` | 10px  | Inputs internos, DNS record cards            |
| `rounded-lg`     | 8px   | Buttons xs, dropdown items, pill item rounded|
| `rounded-[8px]`  | 8px   | Botoes de acao inline                        |
| `rounded-full`   | 999px | Avatares, pills, toggle switches, badges     |

### Regra de decisao

- **Container de nivel mais alto** → Raio maior (3xl, 2xl)
- **Componentes interativos** → xl (12px)
- **Elementos internos aninhados** → lg ou [10px]
- **Circulos (avatar, toggle, pill)** → full

---

## Sombras e Bordas

### Sombras

```tsx
// Card upgrade na sidebar
"shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]"

// Dropdown
"shadow-xl shadow-black/10"

// Modal
"shadow-lg"

// Publish modal
"shadow-xl ring-1 ring-black/5"

// Pill switcher item ativo
"shadow-sm"
```

### Bordas

```tsx
// Card / dropdown exterior
"border border-black/[0.08]"

// Input
"border border-black/10"

// Input focus
"focus:border-black/30 focus:ring-1 focus:ring-black/10"

// Option card selecionado
"border-black/80 ring-1 ring-black/80"

// Option card normal
"border-black/10 hover:border-black/20"

// Publish modal
"ring-1 ring-black/5"

// Nunca usar:
"border-slate-200" // ❌
"border-gray-300"  // ❌
```

---

## Componentes e Padroes

### Avatar / Iniciais

```tsx
// Avatar grande (dropdown header)
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-[16px] font-semibold text-white">
  {name.charAt(0).toUpperCase()}
</div>

// Avatar medio (store selector)
<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/80 text-[11px] font-semibold text-white">
  {name.charAt(0).toUpperCase()}
</div>
```

Regra: Fundo `bg-black/80`, texto `text-white`, sempre `rounded-full`.

### Nav Item

```tsx
<button
  data-active={isActive}
  className={cn(
    "flex w-full items-center overflow-hidden font-medium outline-none",
    "transition-[background,color] duration-150",
    "text-black/55 hover:bg-black/5 hover:text-black/80",
    "data-[active=true]:bg-black/5 data-[active=true]:text-black/80",
    expanded
      ? "gap-0 rounded-xl px-2 py-1 text-sm has-[>svg:first-child]:pl-2 has-[>svg:first-child]:pr-3"
      : "justify-center rounded-xl p-1.5",
  )}
>
  <Icon className="size-5 shrink-0" />
  {expanded && <span className="inline-block max-w-40 truncate pl-1 text-sm">{label}</span>}
</button>
```

Padroes chave:
- `data-active` em vez de prop `active` + ternario
- `has-[>svg:first-child]` para padding condicional CSS-only
- Icone sempre `size-5`
- Transicao apenas em `background,color` (nao `all`)

### Dropdown (Fixed Positioning)

```tsx
// Trigger
<button ref={btnRef} onClick={() => setIsOpen(!isOpen)}
  className="relative inline-flex h-8 w-full min-w-0 items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-black/80 outline-none transition-[background,color] duration-150 hover:bg-black/5"
>

// Dropdown panel — FIXED para escapar overflow-hidden
{isOpen && (
  <>
    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
    <div
      className="fixed z-50 w-[240px] rounded-xl border border-black/[0.08] bg-white py-2 shadow-xl shadow-black/10"
      style={{
        top: btnRef.current ? btnRef.current.getBoundingClientRect().bottom + 6 : 60,
        left: btnRef.current ? btnRef.current.getBoundingClientRect().left : 12,
      }}
    >
      {content}
    </div>
  </>
)}
```

Regras:
- Sempre `position: fixed` + `getBoundingClientRect()` para dropdowns dentro de `overflow-hidden`
- Overlay invisivel (`fixed inset-0 z-40`) para fechar ao clicar fora
- `z-50` para o panel, `z-40` para overlay
- Gap de `6px` entre trigger e dropdown

### Dropdown Item

```tsx
<button className={cn(
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors",
  isActive
    ? "bg-black/5 font-medium text-black/80"
    : "text-black/55 hover:bg-black/5 hover:text-black/80",
)}>
  <Avatar />
  <span className="truncate">{name}</span>
</button>
```

### Option Card (Settings)

```tsx
<button
  onClick={onClick}
  className={cn(
    "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
    selected
      ? "border-black/80 ring-1 ring-black/80 bg-black/[0.02]"
      : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
  )}
>
  <div className={cn("shrink-0 [&>svg]:size-5", selected ? "text-black/80" : "text-black/40")}>
    {icon}
  </div>
  <div className="flex-1">
    <p className={cn("text-sm font-medium", selected ? "text-black/80" : "text-black/55")}>{title}</p>
    <p className="text-sm text-black/40">{description}</p>
  </div>
</button>
```

### Toggle Switch

```tsx
<button
  role="switch"
  aria-checked={checked}
  onClick={() => onChange(!checked)}
  className={cn(
    "relative h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
    checked ? "bg-black/80" : "bg-black/10",
  )}
>
  <span className={cn(
    "block h-5 w-5 rounded-full bg-white shadow transition-transform",
    checked ? "translate-x-5" : "translate-x-0",
  )} />
</button>
```

### Input

```tsx
<input className={cn(
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black/80 outline-none transition-colors",
  "placeholder:text-black/30",
  "focus:border-black/30 focus:ring-1 focus:ring-black/10",
)} />
```

### Publish Modal (Popover posicionado)

```tsx
// Backdrop invisivel
<div className="fixed inset-0 z-[9998]" onClick={onClose} />

// Card flutuante
<div className="fixed z-[9999] right-3 top-14 w-[376px] max-w-[calc(100vw-32px)] rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
```

Regra: Modais tipo "popover" usam `fixed` + `right-3 top-14` ancorados ao botao. Usam `ring-1 ring-black/5` em vez de `border`.

### Domain Status Card

```tsx
// Publicado: fundo verde
<div className="flex flex-col rounded-[14px] bg-[#DEF2E7]">
  <div className="m-0.5 flex items-center justify-between rounded-xl bg-white pl-3 pr-1">
    {/* URL + actions */}
  </div>
  <div className="flex items-center justify-center gap-2 p-2">
    <div className="size-2 rounded-full bg-[#519A73]" />
    <p className="text-xs font-medium text-[#519A73]">Seu site esta no ar</p>
  </div>
</div>

// Nao publicado: fundo amber
<div className="flex flex-col rounded-[14px] bg-amber-100/50">
  {/* mesma estrutura */}
</div>
```

Padrao: Card com cor semantica como background externo, card branco interno com `m-0.5 rounded-xl bg-white`.

### Upgrade Card (Sidebar)

```tsx
<div className="flex flex-col gap-1 rounded-2xl bg-white p-1 shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1),0_10px_15px_-3px_rgba(0,0,0,0.1)]">
  <div className="px-2 pt-2 pb-1">
    <p className="text-sm font-medium text-black/80">Titulo</p>
    <p className="text-sm text-black/55">Descricao</p>
  </div>
  <PglButton variant="dark" size="sm" className="w-full">
    <IconSparkles />
    CTA
  </PglButton>
</div>
```

### Pill Switcher

```tsx
<PglPillSwitcher>
  <PglPillSwitcherItem icon={<Icon />} active={isActive} onClick={handleClick}>
    Label
  </PglPillSwitcherItem>
</PglPillSwitcher>
```

Container: `border border-black/[0.06] rounded-full p-[3px] gap-0.5`
Item ativo: `bg-black/5 text-black/80` (mesmo padrao dos nav items da sidebar)
Item inativo: `text-black/55 hover:bg-black/5 hover:text-black/80`

---

## Estados Interativos

### Hover

```tsx
// Background — sempre black/5 ou black/[0.03]
"hover:bg-black/5"      // Padrao para items de nav, botoes ghost
"hover:bg-black/[0.03]" // Sutil, para sidebar settings items
"hover:bg-black/[0.01]" // Ultra sutil, para option cards
"hover:bg-black/10"     // Para close buttons (ja tem bg-black/5)

// Texto — sempre transicao para black/80
"hover:text-black/80"   // De black/55 ou black/40

// Bordas — aumenta opacidade
"hover:border-black/20" // De border-black/10
```

### Active / Selected

```tsx
// Nav items — usa data attribute
"data-[active=true]:bg-black/5 data-[active=true]:text-black/80"

// Option cards — borda forte + ring
"border-black/80 ring-1 ring-black/80 bg-black/[0.02]"

// Toggle checked
"bg-black/80" // Track
"translate-x-5" // Knob

// Pill item ativo
"bg-white text-black/80 shadow-sm border border-black/[0.08]"

// Tab mobile ativo
"border-black/80 text-black/80" // border-b-2
```

### Disabled

```tsx
"disabled:opacity-50 disabled:cursor-not-allowed"
```

### Focus

```tsx
"focus:border-black/30 focus:ring-1 focus:ring-black/10"
// Ou para botoes:
"focus:outline-none focus:ring-2 focus:ring-black/20"
```

### Destructive hover

```tsx
// Botao "Sair"
"text-black/55 hover:bg-red-50 hover:text-red-600"
```

---

## Transicoes e Animacoes

### Duracoes

| Duracao     | Uso                                              |
|-------------|--------------------------------------------------|
| `150ms`     | **Padrao** — hover, focus, toggle                |
| `200ms`     | Sidebar mobile slide, chevron rotate, width change|
| `ease-out`  | Slide-in (sidebar mobile, modals)                |

### Propriedades animadas

```tsx
"transition-colors"                    // Apenas cor — mais performatico
"transition-[background,color]"        // Background + cor — nav items
"transition-all duration-150"          // Tudo — pills, option cards
"transition-transform"                 // Toggle knob, chevron rotate
"transition-[width] duration-200"      // Sidebar collapse
"transition-opacity duration-200"      // Overlay fade
```

### Animacao de entrada do publish modal

```css
@keyframes publish-enter {
  from { opacity: 0; transform: translateY(-4px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

### Modal (Radix)

```tsx
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
```

---

## Layout

### Sidebar + Topbar (Durable pattern)

```
Container (flex, bg-sidebar, h-100dvh)
├── Sidebar (flex-col, h-full, w-220/52px)
│   ├── Header (store dropdown)
│   ├── Nav (flex-1, overflow-auto)
│   └── Footer (upgrade + settings)
└── Right Column (flex-col, flex-1)
    ├── Topbar (h-12, shrink-0)
    └── Content (flex-1, overflow-hidden, p-2)
        └── Preview (rounded-2xl, bg-slate-100/80)
```

Regra: Sidebar ocupa full height. Topbar fica DENTRO da coluna de conteudo, nao full-width.

### Mobile overlay sidebar

```tsx
// Backdrop
<div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200 md:hidden" />

// Sidebar
<aside
  className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-sidebar transition-transform duration-200 ease-out md:hidden"
  style={{ transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)" }}
/>
```

### Settings Modal (two-column)

```
Modal (rounded-3xl, max-w-840px, h-640px)
├── Sidebar (w-220px, hidden md:flex, bg-black/[0.02])
│   ├── Title
│   └── Tab items
├── Content Column (flex-1)
│   ├── Mobile tabs (md:hidden, horizontal)
│   └── Body (overflow-y-auto, px-6/14 py-8/12)
│       └── TabPanel
│           ├── SectionTitle
│           └── SectionBlocks
```

---

## Icones

### Tamanhos

| Classe     | Uso                                    |
|------------|----------------------------------------|
| `size-3.5` | Chevrons, small indicators             |
| `size-4`   | Botoes icon-sm, acoes inline           |
| `size-5`   | **Padrao** — nav items, icones de card |
| `size-6`   | Icones de destaque                     |

### Padrao de uso

```tsx
// Icone em nav item
<Icon className="size-5 shrink-0" />

// Icone em botao
<Icon className="h-4 w-4" />

// Icone em slot de compound component
<span className="shrink-0 [&>svg]:size-5">{icon}</span>
```

---

## Skeletons / Loading

```tsx
<Skeleton className="h-7 w-24 bg-[#f5f5f4]" />
<Skeleton className="h-[72px] w-full rounded-[12px] bg-[#f5f5f4]" />
```

Regra: Sempre `bg-[#f5f5f4]` (cinza quente). Raio e altura correspondem ao componente real.

---

## Checklist para novos componentes

Antes de considerar um componente pronto neste design system:

- [ ] Cores usam `black/opacity` — zero slate/gray/zinc
- [ ] Texto padrao e `text-[13px] font-medium text-black/55`
- [ ] Headings usam `text-black/80 font-semibold`
- [ ] Bordas usam `border-black/[0.08]` ou `border-black/10`
- [ ] Hover usa `hover:bg-black/5 hover:text-black/80`
- [ ] Border radius segue a hierarquia (container > componente > elemento interno)
- [ ] Transicao e `150ms` padrao, `200ms` para layout changes
- [ ] Inputs seguem o padrao: `rounded-xl border-black/10 px-3.5 py-2.5 focus:border-black/30`
- [ ] Dropdowns usam `position: fixed` + `getBoundingClientRect()`
- [ ] Icones sao `size-5` em nav, `size-4` em botoes
- [ ] Nenhum `style={{ color: "#hex" }}` inline — usar classes Tailwind
- [ ] Font e `system-ui` (herdada do container)
- [ ] Sombras seguem os padroes definidos (shadow-sm, shadow-xl shadow-black/10, ring-1 ring-black/5)

---

## Anti-patterns

### ❌ Usar cores nomeadas do Tailwind
```tsx
"text-slate-500 bg-gray-100 border-zinc-200" // ❌
"text-black/55 bg-black/5 border-black/[0.08]" // ✅
```

### ❌ Dark mode com classes separadas
```tsx
"bg-white dark:bg-slate-900 text-black dark:text-white" // ❌ no editor
"bg-sidebar text-black/80" // ✅ usa CSS variables
```

O editor usa `bg-sidebar` que ja resolve light/dark via CSS variables. Nao duplicar.

### ❌ Bordas grossas ou coloridas
```tsx
"border-2 border-blue-500" // ❌
"border border-black/[0.08]" // ✅
"ring-1 ring-black/80" // ✅ para selected
```

### ❌ Box shadows pesadas
```tsx
"shadow-2xl" // ❌ muito pesado
"shadow-xl shadow-black/10" // ✅ suave
"shadow-sm" // ✅ para elementos internos
```

### ❌ Fontes custom ou tamanhos fora da escala
```tsx
"font-sans text-[17px]" // ❌
"text-[13px]" // ✅ padrao
"text-sm" // ✅ corpo
```

### ❌ Transicoes em `all`
```tsx
"transition-all" // ❌ anima tudo incluindo layout
"transition-colors" // ✅ performatico
"transition-[background,color] duration-150" // ✅ explicito
```

---

## Convitede project conventions (hybrid palette)

Quando aplicado ao projeto **Convitede** (`frontend-next/convitede`), o design system Linear/HIG é adaptado a uma **paleta híbrida** que mantém a identidade da marca. Ler esta seção antes de trabalhar em landing pages, públicas ou catálogo do Convitede.

### Decisão híbrida (released + black/opacity)

A regra "monocromático com opacidade" do Linear NÃO é aplicada por completo. Decisão tomada com o usuário em 2026-04-07:

- **`released-*`** (roxo `#6f42c1`) = cor de marca, **mantida** para CTAs primários, ícones de destaque, badges, links importantes, focus rings.
- **`black/opacity`** = substitui TODOS os `gray-*` / `slate-*` / `zinc-*` em texto secundário, bordas, backgrounds sutis.
- **NÃO usar** `bg-sidebar` (CSS var do Linear original) — usar `bg-white` ou `bg-black/[0.02]`.
- **NÃO usar** as cores semânticas amber/emerald do PGL — Convitede tem suas próprias paletas em `tailwind.config.ts` (`success`, `warning`, `danger`, `info`, `waiting`, `primary`, `secondary`).

### Tabela de tokens híbridos finais

| Token Tailwind | Uso no Convitede |
|---|---|
| `text-black/85` | Headings, textos primários (h1, h2, h3) |
| `text-black/60` | Texto secundário, descrições, labels |
| `text-black/55` | Texto terciário (footer, captions) |
| `text-black/40` | Texto desabilitado, placeholders |
| `bg-white` | Fundo de cards, modais, sections "white" |
| `bg-black/[0.02]` | Fundo de section "subtle", cards minimais |
| `bg-black/[0.04]` | Skeletons, hover sutis, fundos pill |
| `bg-released-50` | Section "branded", badges de marca |
| `bg-released-100`/`text-released-700` | Pills, ícones de feature, eyebrows |
| `bg-released-600` | CTA primário, ícones de destaque, fundo final-cta |
| `border-black/[0.06]` | Bordas de cards/dropdowns/divisores |
| `border-black/[0.08]` | Bordas de cards (mais visíveis) |
| `border-black/10` | Bordas de inputs |
| `ring-1 ring-black/[0.06]` | Cards minimais com ring em vez de border |
| `ring-1 ring-released-100` | Eyebrows e badges de marca |
| `ring-released-200` | Focus ring em CTAs |
| `shadow-released-600/10` | Sombra colorida em hero |
| `shadow-xl shadow-released-600/5` | Cards de feature destacados |
| `hover:bg-black/[0.03]` | Hover backgrounds |
| `hover:border-black/20` | Hover em borders de cards |

### Caminhos canônicos do Convitede

Quando criar/modificar componentes, usar **estas pastas** (NUNCA criar wrappers genéricos novos):

| Pasta | Uso |
|---|---|
| `src/components/ui/` | Wrappers shadcn (Button, Card, Badge, Dialog, etc) — JÁ EXISTEM, reusar |
| `src/components/ui/skeletons/` | Skeletons espelho dos componentes finais |
| `src/components/landing/` | Compound components específicos da landing page |
| `src/components/headers/` | Header e nav |
| `src/components/router/` | CustomLink (wrapper de Next/Link com NProgress) |
| `messages/{pt,en,es}.json` | i18n via next-intl (sempre adicionar nas 3 línguas) |

### Wrappers compound prontos para reusar (não duplicar)

```tsx
// Button compound:
import { Button, ButtonLeft, ButtonContent, ButtonRight } from "@/components/ui/button";
<Button asChild size="lg" color="released">
  <CustomLink href="/foo">
    <ButtonLeft><IconEdit size={18} /></ButtonLeft>
    <ButtonContent>Editar</ButtonContent>
  </CustomLink>
</Button>

// Card compound:
import { Card, CardImage, CardHeader, CardBody, CardFooter } from "@/components/ui/card";

// Outros: Badge, Avatar, Container, Skeleton, Dialog, Drawer, Input, Tooltip, Tabs
```

Variantes do Button suportadas: `filled` | `light` | `outline` | `subtle` | `unstyled` | `white` | `gradient`. Cores: `released` | `gray` | `red`/`danger` | `orange`/`warning` | `blue`/`primary` | `green`/`success` | `info`. Sempre usar `color="released"` para CTAs principais.

### Padrão de Compound Components no Convitede

Cada componente novo segue rigorosamente o `pgl-compound-components`:

1. Um arquivo por componente em `src/components/landing/<nome>.tsx`
2. Pai com `React.forwardRef` + `cva` variants
3. Subcomponentes-slot definidos **fora** do render do pai (NUNCA inline)
4. Estilos via `cva` ou `cn(...)`, **sem ternários inline** complexos
5. Named exports no final do arquivo
6. `asChild` via `@radix-ui/react-slot` quando precisa renderizar como `<Link>` etc.

Exemplo do contexto compartilhado entre slots (PricingCard featured): usar `React.createContext` em vez de prop drilling.

### Padrão de skeleton (pgl-skeleton-loading no Convitede)

- Cor base: `bg-black/[0.04]` (NUNCA `bg-gray-100` — quebra a paleta híbrida)
- Border radius espelha o componente final (`rounded-2xl`, `rounded-xl`, `rounded-full`)
- Skeletons da landing ficam em `src/components/ui/skeletons/skeleton-landing.tsx`
- Spinner SOMENTE em ações de botão (já vem no `Button loading`)
- Skeleton SEMPRE espelha a geometria do componente final, nunca um placeholder genérico

### Tipografia adaptada ao Convitede

- **Hero H1**: `text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black/85 leading-[1.05]`
- **Section title (h2)**: `text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-black/85`
- **Feature block title (h2)**: `text-3xl md:text-4xl font-semibold tracking-tight text-black/85`
- **Card title (h3)**: `text-lg font-semibold text-black/85`
- **Eyebrow/badge**: `text-xs font-semibold tracking-wide uppercase`
- **Body**: `text-base md:text-lg text-black/60 leading-relaxed`
- **Sem fontes custom no body** — `font-sans` herdado (Inter já está no `(main)/layout.tsx`)

### Espaçamento padrão de seções na landing

- Section padding: `py-24 md:py-32 px-4` (variant `lg` do `LandingSection`)
- Section padding compacto: `py-16 md:py-24 px-4` (variant `md`)
- Container max: `max-w-7xl mx-auto`
- Gaps em grids: `gap-5 md:gap-6` (cards) ou `gap-12 lg:gap-20` (feature blocks)

### O que NÃO usar (quebra de padrão histórica)

❌ **CSS modules antigos** em `src/components/statics/main-page/*.module.css` — referenciam `var(--mantine-color-released-filled)`, `light-dark()`, `var(--mantine-spacing-md)` que não existem fora do MantineProvider e quebram visualmente.

❌ **`AliceCarousel`** em landing/marketing — penaliza LCP. Usar grid estático ou CSS scroll-snap se precisar de horizontal scroll.

❌ **`MantineProvider`** no `(main)` — foi removido na Fase 7 da migração. O `mantine-vars-shim.css` é apenas fallback temporário.

❌ **`Container size="full"` com px-[150px]`** — quebra responsividade. Usar `max-w-7xl mx-auto px-4`.

❌ **`Group`/`Stack`/`SimpleGrid`** importados do `@/components/ui/*` em código novo — eles existem só para retrocompatibilidade. Usar Tailwind flex/grid direto.

❌ **Cores `c="orange"`, `c="white"`, `c="dimmed"`** estilo Mantine — usar classes Tailwind (`text-black/60`, etc).

### i18n no Convitede

- Sempre adicionar chaves em `messages/pt.json`, `messages/en.json`, `messages/es.json` (3 arquivos).
- Server components: `import { getTranslations } from "next-intl/server"` e `await getTranslations({ locale, namespace: "..." })`.
- Client components: `import { useTranslations, useLocale } from "next-intl"`.
- Para dados estruturados em JSON (arrays de itens): usar `t.raw("key")` e tipar manualmente.

### Routing localizado

- Toda navegação usa `getRoute(locale, "key")` ou `buildCategoryUrl(locale, slug)` de `@/lib/route-map`.
- NUNCA hardcodar `/catalogo`, `/sobre-nos`, etc — sempre passar pela `route-map`.
- Para Links com client-side feedback (NProgress), usar `CustomLink` de `@/components/router/custom-link`.
