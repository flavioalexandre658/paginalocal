---
name: decolou-color-palette
description: Paleta de cores oficial do Decolou. Usar sempre que criar ou editar componentes de UI, landing pages, editor, dashboard ou modais. Define accent indigo, superficies, texto, bordas, status e regras de aplicacao.
---

# Decolou — Paleta de Cores

## Regra principal

O Decolou usa **indigo #6366f1** como accent de marca, combinado com o sistema **monocromatico black/opacity** do HIG. O indigo aparece em **no maximo 10-15% da interface** — CTAs, links ativos, cards selecionados, focus rings. O resto e preto com opacidade. Se indigo aparecer em tudo, perde o impacto. **Menos e mais.**

---

## Cor de Marca (Accent Principal)

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| Primary | `#6366f1` | `bg-[#6366f1]` | Botao CTA primario, links ativos, badges de destaque |
| Primary hover | `#4f46e5` | `hover:bg-[#4f46e5]` | Hover do botao primario |
| Primary light | `#818cf8` | `text-[#818cf8]` | Texto accent em fundo escuro |
| Primary subtle | `rgba(99,102,241,0.08)` | `bg-[#6366f1]/[0.08]` | Background tinted (kicker pills, badges, upgrade cards) |
| Primary ring | `rgba(99,102,241,0.15)` | `ring-[#6366f1]/15` | Focus rings em inputs e botoes primarios |

### Quando usar indigo vs black/opacity

```
Indigo (#6366f1):
  - Botao CTA primario (hero, upgrade, upsell)
  - Link ativo que precisa de destaque visual
  - Option card selecionado (borda + ring)
  - Focus ring de inputs quando quiser accent
  - Kicker pills na landing page
  - Badge "Pro" / "Premium"
  - Toggle checked (opcao branded)

Black/opacity (padrao):
  - Todo o resto — nav items, headings, body text, bordas, hover states
  - Botao "dark" (bg-black/80) para acoes de sistema (salvar, continuar, entrar)
  - Toggle checked (opcao clean: bg-black/80)
```

---

## Superficies

| Superficie | Valor | Tailwind | Uso |
|---|---|---|---|
| Background | `#ffffff` | `bg-white` | Fundo principal de paginas |
| Background sutil | `#fafafa` | `bg-[#fafafa]` | Fundo de secoes alternadas |
| Sidebar/topbar | `oklch(0.985 0 0)` | `bg-sidebar` | Sidebar e topbar do editor (CSS variable) |
| Card | `#ffffff` | `bg-white` | Cards, modais, dropdowns |
| Preview area | `rgba(0,0,0,0.03)` | `bg-black/[0.03]` | Area de preview do editor, cards sutis da landing |

---

## Texto (Sistema black/opacity — nao muda)

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| Primario | `black/80` | `text-black/80` | Headings, texto principal, icones ativos |
| Secundario | `black/55` | `text-black/55` | Labels, texto de corpo, icones inativos |
| Terciario | `black/40` | `text-black/40` | Texto auxiliar, chevrons, timestamps |
| Placeholder | `black/30` | `placeholder:text-black/30` | Placeholders de input |
| Ghost | `black/20` | `text-black/20` | Focus rings sutis, elementos quase invisiveis |

---

## Bordas

| Token | Valor | Tailwind | Uso |
|---|---|---|---|
| Card/dropdown | `black/[0.08]` | `border-black/[0.08]` | Borda exterior de cards e dropdowns |
| Input | `black/10` | `border-black/10` | Borda de inputs em repouso |
| Input focus | `black/30` | `focus:border-black/30` | Borda de input em focus (padrao) |
| Input focus accent | `#6366f1` | `focus:border-[#6366f1]` | Borda de input em focus (quando quiser accent) |
| Selecionado | `#6366f1` | `border-[#6366f1] ring-1 ring-[#6366f1]` | Option card selecionado, tab ativa |
| Divisor | `black/[0.06]` | `border-black/[0.06]` | Separadores internos |

### Mudanca do Pagina Local → Decolou

```tsx
// ANTES (Pagina Local): option card selecionado usava preto
"border-black/80 ring-1 ring-black/80 bg-black/[0.02]"

// DEPOIS (Decolou): usa indigo como accent
"border-[#6366f1] ring-1 ring-[#6366f1] bg-[#6366f1]/[0.02]"
```

---

## Status (nao muda)

| Status | Cor | Tailwind bg | Tailwind text | Uso |
|---|---|---|---|---|
| Sucesso/publicado | `#10b981` | `bg-emerald-500` | `text-emerald-500` | Site publicado, DNS ok, acao concluida |
| Sucesso bg | `#d1fae5` | `bg-emerald-100` | — | Background de cards de sucesso |
| Alerta/demo | `#f59e0b` | `bg-amber-500` | `text-amber-500` | Modo demo, nao publicado |
| Alerta bg | `amber-500/10` | `bg-amber-500/10` | — | Background de alertas |
| Erro/destrutivo | `#ef4444` | `bg-red-500` | `text-red-500` | DNS erro, acao destrutiva |
| Erro bg | `#fef2f2` | `bg-red-50` | — | Background de erros |

---

## Botoes

### Primario (CTA de marca — indigo)

```tsx
<button className="rounded-xl bg-[#6366f1] px-4 py-2 text-sm font-medium text-white transition-[background,color] duration-150 hover:bg-[#4f46e5]">
  Fazer upgrade
</button>
```

Usar em: upgrade, upsell, CTA principal da landing page, "Criar conta", onboarding.

### Publicar (verde — semantico)

```tsx
<button className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-[background,color] duration-150 hover:bg-emerald-600">
  Publicar site
</button>
```

Usar em: publicar site, ativar, confirmar acao positiva. Verde = "go".

### Dark (sistema — preto)

```tsx
<button className="rounded-xl bg-black/80 px-4 py-2 text-sm font-medium text-white/75 shadow-button-dark transition-[background,color,box-shadow] duration-150 hover:text-white hover:shadow-button-dark">
  Continuar
</button>
```

Usar em: login, salvar, continuar, acoes de sistema neutras. Equivalente ao `PglButton variant="dark"`.

### Ghost (transparente)

```tsx
<button className="rounded-xl px-4 py-2 text-sm font-medium text-black/55 transition-[background,color] duration-150 hover:bg-black/5 hover:text-black/80">
  Cancelar
</button>
```

### Outline

```tsx
<button className="rounded-xl border border-black/[0.09] px-4 py-2 text-sm font-medium text-black/55 transition-[background,color] duration-150 hover:bg-black/[0.04] hover:text-black/80">
  Ver detalhes
</button>
```

### Destrutivo

```tsx
<button className="rounded-xl px-4 py-2 text-sm font-medium text-black/55 transition-[background,color] duration-150 hover:bg-red-50 hover:text-red-600">
  Excluir
</button>
```

---

## PglButton — Mapeamento de variants

O componente `PglButton` em `src/components/ui/pgl-button.tsx` ja tem as variants corretas. Para adicionar o variant indigo (primario de marca):

```tsx
// Adicionar ao pglButtonVariants se ainda nao existir:
brand:
  "bg-[#6366f1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.15),0_0_0_1px_rgba(99,102,241,.5),0_1px_2px_rgba(99,102,241,.3)] hover:bg-[#4f46e5]",
```

| Variant PglButton | Quando usar |
|---|---|
| `dark` | Login, salvar, continuar, acoes de sistema |
| `primary` | Publicar site (verde) |
| `brand` (novo) | Upgrade, upsell, CTA de marca (indigo) |
| `ghost` | Cancelar, acoes secundarias |
| `outline` | Detalhes, acoes terciarias |
| `danger` | Excluir, acoes destrutivas |

---

## Exemplos de aplicacao

### Option Card selecionado (settings)

```tsx
<button className={cn(
  "flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all",
  selected
    ? "border-[#6366f1] ring-1 ring-[#6366f1] bg-[#6366f1]/[0.02]"
    : "border-black/10 hover:border-black/20 hover:bg-black/[0.01]",
)}>
```

### Kicker pill (landing page)

```tsx
<span className="inline-flex items-center gap-2 rounded-full bg-[#6366f1]/[0.08] px-4 py-1.5 text-sm font-medium text-[#6366f1]">
  <IconSparkles className="size-4" />
  Plataforma completa
</span>
```

### Link ativo com accent

```tsx
// Nav link ativo no marketing header
<Link className="text-sm font-medium text-[#6366f1]">
  Construtor de sites IA
</Link>

// Mas nav items do editor/sidebar continuam black/opacity:
"data-[active=true]:bg-black/5 data-[active=true]:text-black/80"
```

### Upgrade card

```tsx
<div className="rounded-2xl border border-[#6366f1]/20 bg-[#6366f1]/[0.03] p-4">
  <p className="text-sm font-medium text-black/80">Faca upgrade</p>
  <p className="text-sm text-black/55">Acesse recursos premium</p>
  <PglButton variant="brand" size="sm" className="mt-3 w-full">
    <IconSparkles />
    Fazer upgrade
  </PglButton>
</div>
```

### Focus ring com accent

```tsx
// Input com focus accent (uso seletivo)
<input className="rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/15" />

// Input padrao (uso geral — mantém monocromatico)
<input className="rounded-xl border border-black/10 px-3.5 py-2.5 text-sm outline-none focus:border-black/30 focus:ring-1 focus:ring-black/10" />
```

---

## Checklist de auditoria

Antes de considerar um componente pronto:

- [ ] Accent indigo aparece em **no maximo 10-15%** da interface
- [ ] CTAs de marca (upgrade, upsell) usam `bg-[#6366f1]`
- [ ] CTAs de sistema (salvar, continuar) usam `bg-black/80` (dark)
- [ ] CTAs de acao positiva (publicar) usam `bg-emerald-500` (verde)
- [ ] Option cards selecionados usam `border-[#6366f1] ring-[#6366f1]`
- [ ] Texto geral continua `black/opacity` — nao usar indigo em body text
- [ ] Bordas gerais continuam `black/[0.08]` — indigo so em selecionados
- [ ] Nenhum uso de `primary` (cor antiga coral/laranja) — trocar por `[#6366f1]`
- [ ] Hover states gerais continuam `hover:bg-black/5` — indigo nao domina hover

---

## Anti-patterns

### ❌ Indigo em tudo

```tsx
"text-[#6366f1] border-[#6366f1] bg-[#6366f1]/10" // ❌ muito indigo
"text-black/80 border-black/[0.08] bg-white" // ✅ monocromatico, indigo so no CTA
```

### ❌ Usar a cor antiga (primary/coral)

```tsx
"bg-primary text-primary-foreground" // ❌ referencia a cor antiga
"bg-[#6366f1] text-white" // ✅ indigo explicito
```

### ❌ Indigo em nav items do editor

```tsx
// ❌ Nav item do editor com indigo
"data-[active=true]:text-[#6366f1]"

// ✅ Nav item do editor continua monocromatico
"data-[active=true]:bg-black/5 data-[active=true]:text-black/80"
```

### ❌ Indigo em texto de corpo

```tsx
"text-[#6366f1]" // ❌ como cor de corpo/paragrafo
"text-black/55" // ✅ texto de corpo sempre black/opacity
```
