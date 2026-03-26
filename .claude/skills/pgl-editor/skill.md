---
name: pgl-editor
description: Como funciona o editor visual do PGL (Pagina Local). Arquitetura completa, fluxo de dados, padrao de componentes, como adicionar novos blocos editaveis.
---

# PGL Editor — Documentacao Completa

## Visao Geral

O editor permite que usuarios editem visualmente os sites gerados pelo PGL diretamente no preview. O usuario clica num texto e edita inline, ou clica em botoes/imagens/nav/footer e edita via modal.

### Stack do Editor
- React 19 + Next.js 16 (App Router)
- Context + useReducer para estado
- Tailwind CSS para estilos
- shadcn/ui modal-blocks para popups
- Server Actions para salvar/upload
- Rota: `/editor/[storeSlug]`

---

## Arquitetura

```
EditorShell
  ├── EditorTopbar (salvar, viewport, undo/redo)
  ├── EditorSidebar (lista de secoes)
  ├── EditorPreview (container scrollavel do site)
  │     └── EditorPageRenderer
  │           └── EditorSectionWrapper × N  ← PONTO CENTRAL
  │                 ├── Detecta hover em [data-pgl-edit] → mostra outline/overlay
  │                 ├── Click em mode="text" → contentEditable inline
  │                 ├── Click em mode="button" → ButtonEditPopup (modal)
  │                 ├── Click em mode="image" → ImageEditPopup (modal)
  │                 ├── Click em mode="nav" → NavEditPopup (modal)
  │                 ├── Click em mode="footer" → FooterEditPopup (modal)
  │                 ├── SectionToolbar (Design, Editar, mover, ocultar, deletar)
  │                 └── SectionBlock (componente lazy do bloco)
  ├── SectionEditDrawer (formulario lateral)
  └── UnsavedChangesGuard
```

---

## Como o Editor Identifica Elementos Editaveis

### Sistema data-pgl-path

Cada elemento editavel no site renderizado carrega dois data attributes:

```html
<h2 data-pgl-path="title" data-pgl-edit="text">Titulo da secao</h2>
<p data-pgl-path="subheadline" data-pgl-edit="text">Subtitulo</p>
<a data-pgl-path="ctaText" data-pgl-edit="button">Comprar agora</a>
<img data-pgl-path="backgroundImage" data-pgl-edit="image" src="..." />
<header data-pgl-path="nav" data-pgl-edit="nav">...</header>
<footer data-pgl-path="footer" data-pgl-edit="footer">...</footer>
```

- `data-pgl-path` = caminho do campo no JSON do blueprint (ex: `items.0.name`, `plans.2.ctaText`)
- `data-pgl-edit` = modo de edicao: `text`, `button`, `image`, `nav`, `footer`

### Modos de Edicao

| Mode | Comportamento | Componente |
|------|---------------|------------|
| `text` | Inline contentEditable | Direto no DOM |
| `button` | Modal com label + tipo de link + URL | ButtonEditPopup |
| `image` | Modal com upload/busca | ImageEditPopup |
| `nav` | Modal com nome da loja, CTA, links | NavEditPopup |
| `footer` | Modal com copyright, toggle social | FooterEditPopup |
| `component` | Editado via drawer lateral apenas | SectionEditDrawer |

### Regras Importantes

1. **Header e Footer**: NENHUM elemento interno tem `data-pgl-edit`. Apenas o wrapper `<header>` e `<footer>` tem. Toda edicao via modal.
2. **Arrays**: Usam indice concreto no path: `data-pgl-path={`items.${i}.name`}`
3. **StyledHeadline e PglButton**: Aceitam `...rest` props e repassam data attributes para o elemento raiz.

---

## Fluxo de Edicao Inline (text)

```
1. Usuario passa mouse sobre elemento com data-pgl-edit="text"
   → EditorSectionWrapper.handleMouseOver
   → Adiciona data-pgl-hover no elemento → CSS mostra outline azul

2. Usuario clica no elemento
   → EditorSectionWrapper.handleClick
   → Le data-pgl-edit="text" e data-pgl-path="headline"
   → Ativa contentEditable no elemento
   → Posiciona cursor no ponto do click via caretRangeFromPoint
   → Seta user-select: auto no container

3. Usuario edita o texto

4. Usuario clica fora ou pressiona Enter (em headings)
   → save() le el.innerHTML
   → htmlToAccentText() converte <em>word</em> → *word*
   → setFieldByPath(content, path, newText) atualiza imutavelmente
   → dispatch UPDATE_SECTION_CONTENT
```

---

## Fluxo de Edicao via Modal (button/image/nav/footer)

```
1. Hover em elemento com data-pgl-edit="button"|"image"|"nav"|"footer"
   → Mostra outline + dark overlay (::after pseudo-element)
   → Botao "Editar" flutuante aparece no centro via portal

2. Click no botao "Editar"
   → openPopup() le o mode e path do data attribute
   → Seta popup state → modal abre

3. Usuario edita campos no modal

4. Click em "Salvar"
   → Popup chama dispatch UPDATE_SECTION_CONTENT (ou SET_BLUEPRINT para nav links)
   → Modal fecha
```

---

## Estado do Editor

### EditorState (editor-types.ts)

```ts
{
  blueprint: SiteBlueprint,
  activePageId: string,
  selectedSectionId: string | null,
  hoveredSectionId: string | null,
  drawerOpen: boolean,
  isDirty: boolean,
  isSaving: boolean,
  viewportMode: "desktop" | "tablet" | "mobile",
  isInlineEditing: boolean,
  undoStack: SiteBlueprint[],   // max 20
  redoStack: SiteBlueprint[],
}
```

### Actions Disponiveis

| Action | Descricao |
|--------|-----------|
| SELECT_SECTION | Seleciona secao (ring azul) |
| HOVER_SECTION | Marca secao como hovered (toolbar) |
| SET_INLINE_EDITING | Ativa/desativa modo de edicao inline |
| UPDATE_SECTION_CONTENT | Atualiza content de uma secao (com undo) |
| MOVE_SECTION | Troca order entre secoes adjacentes |
| TOGGLE_SECTION_VISIBILITY | Mostra/oculta secao |
| DELETE_SECTION | Remove secao |
| OPEN_DRAWER / CLOSE_DRAWER | Drawer lateral |
| SET_BLUEPRINT | Substitui blueprint inteiro (ex: nav links) |
| SET_VIEWPORT | Muda viewport mode |
| UNDO / REDO | Desfaz/refaz com stack de 20 |

---

## BLOCK_EDIT_MAP (block-edit-map.ts)

Mapa estatico que define quais campos existem por block type e como editar cada um.

```ts
hero: [
  { path: "headline", mode: "text", label: "Titulo" },
  { path: "subheadline", mode: "text", label: "Subtitulo" },
  { path: "ctaText", mode: "button", label: "Botao principal", linkPath: "ctaLink", typePath: "ctaType" },
  { path: "backgroundImage", mode: "image", label: "Imagem de fundo" },
],
services: [
  { path: "title", mode: "text", label: "Titulo" },
  { path: "items.*.name", mode: "text", label: "Nome do servico" },
  { path: "items.*.ctaText", mode: "button", label: "Botao", linkPath: "items.*.ctaLink" },
],
header: [
  { path: "storeName", mode: "nav", label: "Nome da loja" },
  { path: "ctaText", mode: "nav", label: "Botao CTA", linkPath: "ctaLink" },
],
// ... 18+ block types
```

Funcoes utilitarias:
- `getFieldEditMode(blockType, path)` → retorna EditableField para um campo especifico
- `matchPath(pattern, concrete)` → "items.*.name" matches "items.0.name"
- `resolveCompanionPath(field, concrete, companion)` → resolve wildcards

---

## Componentes Compartilhados do Site

### StyledHeadline (shared/styled-headline.tsx)
- Renderiza texto com marcacao accent: `"*palavra*"` → `<em>` com cor accent
- Aceita `...rest` props (data attributes passam pro tag raiz h1/h2/h3)
- Uso: `<StyledHeadline text={c.title} tokens={tokens} data-pgl-path="title" data-pgl-edit="text" />`

### PglButton (shared/pgl-button.tsx)
- Renderiza como `<a>` (se href) ou `<button>`
- Aceita `...rest` props
- Uso: `<PglButton href={c.ctaLink} tokens={tokens} data-pgl-path="ctaText" data-pgl-edit="button">{c.ctaText}</PglButton>`

---

## Como Adicionar um Novo Bloco Editavel

### 1. Criar o componente do bloco

```tsx
// src/components/site-renderer/blocks/my-block/my-block-default.tsx
export function MyBlockDefault({ content, tokens, isDark }: Props) {
  const parsed = MyBlockSchema.safeParse(content);
  if (!parsed.success) return null;
  const c = parsed.data;

  return (
    <div>
      <StyledHeadline
        text={c.title}
        tokens={tokens}
        data-pgl-path="title"
        data-pgl-edit="text"
      />
      <p data-pgl-path="subtitle" data-pgl-edit="text">
        {c.subtitle}
      </p>
      {c.items.map((item, i) => (
        <div key={i}>
          <h3 data-pgl-path={`items.${i}.name`} data-pgl-edit="text">
            {item.name}
          </h3>
          <img
            src={item.image}
            data-pgl-path={`images.${i}.url`}
            data-pgl-edit="image"
          />
          <PglButton
            href={item.ctaLink}
            tokens={tokens}
            data-pgl-path={`items.${i}.ctaText`}
            data-pgl-edit="button"
          >
            {item.ctaText}
          </PglButton>
        </div>
      ))}
    </div>
  );
}
```

### 2. Registrar no block-registry

```ts
// src/components/site-renderer/blocks/registry.ts
"my-block": {
  1: () => import("./my-block/my-block-default").then(m => ({ default: m.MyBlockDefault })),
}
```

### 3. Adicionar ao BLOCK_EDIT_MAP

```ts
// src/app/editor/[storeSlug]/_lib/block-edit-map.ts
"my-block": [
  { path: "title", mode: "text", label: "Titulo" },
  { path: "subtitle", mode: "text", label: "Subtitulo" },
  { path: "items.*.name", mode: "text", label: "Nome" },
  { path: "items.*.image", mode: "image", label: "Imagem" },
  { path: "items.*.ctaText", mode: "button", label: "Botao", linkPath: "items.*.ctaLink" },
],
```

### 4. Regras para componentes

- NUNCA definir sub-componentes dentro da funcao de render (anti-pattern que causa re-mount)
- SEMPRE usar `data-pgl-path` com indice concreto para arrays: `items.${i}.name`
- Header e footer: apenas `data-pgl-edit="nav"/"footer"` no wrapper, NADA nos filhos
- Botoes de UI (accordion toggle, carousel arrows): NAO colocar data-pgl-edit
- StyledHeadline e PglButton ja aceitam rest props — usar direto

---

## Arquivos do Editor

### Componentes (_components/)

| Arquivo | Funcao |
|---------|--------|
| editor-shell.tsx | Layout principal (topbar + sidebar + preview) |
| editor-preview.tsx | Container scrollavel + CSS overrides |
| editor-page-renderer.tsx | Renderiza secoes com backgrounds alternados |
| editor-section-wrapper.tsx | **CENTRAL** — hover, click, inline edit, popups |
| section-toolbar.tsx | Toolbar flutuante (Design, Editar, mover, deletar) |
| editor-sidebar.tsx | Lista de secoes na lateral |
| editor-topbar.tsx | Barra superior (salvar, viewport, undo/redo) |
| section-edit-drawer.tsx | Drawer lateral com formulario de campos |
| unsaved-changes-guard.tsx | Previne navegacao com alteracoes nao salvas |
| popups/button-edit-popup.tsx | Modal de edicao de botao CTA |
| popups/image-edit-popup.tsx | Modal de edicao de imagem |
| popups/nav-edit-popup.tsx | Modal de edicao do header/nav |
| popups/footer-edit-popup.tsx | Modal de edicao do footer |

### Bibliotecas (_lib/)

| Arquivo | Funcao |
|---------|--------|
| editor-types.ts | Types do estado e actions |
| editor-reducer.ts | Reducer com undo/redo |
| editor-context.tsx | Provider + hook useEditor |
| block-edit-map.ts | Mapa de campos editaveis por blockType |
| text-field-mapper.ts | setFieldByPath para updates imutaveis |
| block-type-labels.ts | Labels em PT-BR para block types |

---

## CSS do Editor (editor-preview.tsx PREVIEW_CSS)

```css
/* Contem elementos fixed dentro do preview */
.editor-preview .fixed { position: absolute !important; }

/* Hover em elementos editaveis */
.editor-preview [data-pgl-hover] {
  outline: 2px solid rgba(59, 130, 246, 0.4) !important;
  outline-offset: 3px;
  border-radius: 3px;
}

/* Dark overlay em imagens/nav/footer no hover */
.editor-preview [data-pgl-hover][data-pgl-edit="image"]::after,
.editor-preview [data-pgl-hover][data-pgl-edit="nav"]::after,
.editor-preview [data-pgl-hover][data-pgl-edit="footer"]::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

/* Previne selecao de texto exceto durante edicao */
.editor-preview { user-select: none; }
.editor-preview [data-pgl-editing] { user-select: text; }
```

---

## Conversao Accent (htmlToAccentText)

O texto `"Refresque seus dias na *serra* de Jiquirica"` renderiza como:
```html
<span>Refresque seus dias na </span><em style="color: accent">serra</em><span> de Jiquirica</span>
```

Ao salvar inline edit, `htmlToAccentText()` converte de volta:
```ts
html.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
    .replace(/<[^>]+>/g, "")
    .trim()
// Resultado: "Refresque seus dias na *serra* de Jiquirica"
```

---

## Numeros

- 20 block types com schemas de conteudo
- 64 componentes de bloco (variantes)
- ~300 anotacoes data-pgl-path no total
- 14 actions no reducer
- 5 modos de edicao (text, button, image, nav, footer)
- 4 modais de edicao especificos
- Undo/redo com stack de 20 niveis
