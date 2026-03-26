---
name: pgl-edit-wrapper
description: Como transformar um bloco/componente do site em um wrapper editavel via modal no editor PGL. Passo a passo para adicionar novos modos de edicao (pricing, catalogo, etc).
---

# PGL Edit Wrapper — Como Criar um Novo Modo de Edicao via Modal

## Quando Usar

Usar quando um bloco do site tem dados COMPOSTOS que nao fazem sentido editar inline (contentEditable). Exemplos:
- Tabela de precos/planos (pricing) — nome, preco, features, botao por plano
- Catalogo de produtos — nome, descricao, preco, imagem por item
- Menu de restaurante — categorias com itens
- Galeria — lista de imagens com legendas
- FAQ — perguntas e respostas (se quiser editar via modal em vez de inline)

Elementos SIMPLES (titulo, subtitulo, paragrafo) continuam com `data-pgl-edit="text"` (inline).

---

## Passo a Passo

### 1. Adicionar o novo mode ao EditMode type

**Arquivo:** `src/app/editor/[storeSlug]/_lib/block-edit-map.ts`

```ts
// Antes
export type EditMode = "text" | "button" | "image" | "nav" | "footer" | "pricing" | "component";

// Depois (adicionar o novo mode)
export type EditMode = "text" | "button" | "image" | "nav" | "footer" | "pricing" | "catalog" | "component";
```

### 2. Atualizar o BLOCK_EDIT_MAP

**Arquivo:** `src/app/editor/[storeSlug]/_lib/block-edit-map.ts`

Simplificar os campos do bloco — titulo/subtitulo ficam como "text", o resto vira o novo mode:

```ts
catalog: [
  { path: "title", mode: "text", label: "Titulo" },
  { path: "subtitle", mode: "text", label: "Subtitulo" },
  { path: "categories", mode: "catalog", label: "Categorias" },
],
```

### 3. Atualizar os componentes do bloco

**Arquivos:** `src/components/site-renderer/blocks/[blockType]/*.tsx`

Para CADA variante do bloco:
1. Manter `data-pgl-path="title" data-pgl-edit="text"` no StyledHeadline
2. Manter `data-pgl-path="subtitle" data-pgl-edit="text"` no subtitulo
3. REMOVER `data-pgl-edit`/`data-pgl-path` individuais dos elementos internos (nomes, precos, botoes, etc.)
4. ADICIONAR um wrapper com o novo mode ao redor da area de dados:

```tsx
<div data-pgl-path="categories" data-pgl-edit="catalog">
  {/* ... todo o conteudo de categorias/items ... */}
</div>
```

Se ja existe um div pai natural, adicionar os data attributes nele em vez de criar um wrapper novo.

### 4. Criar o popup de edicao

**Arquivo:** `src/app/editor/[storeSlug]/_components/popups/[mode]-edit-popup.tsx`

Usar o padrao modal-blocks:

```tsx
"use client";

import { useState, useCallback } from "react";
import {
  Modal, ModalContent, ModalHeader, ModalTitle,
  ModalBody, ModalFooter, ModalFooterActions,
} from "@/components/ui/modal-blocks";
import { Button } from "@/components/ui/button";
import { useEditor } from "../../_lib/editor-context";

interface Props {
  sectionId: string;
  content: Record<string, unknown>;
  onClose: () => void;
}

export function CatalogEditPopup({ sectionId, content, onClose }: Props) {
  const { dispatch } = useEditor();

  // Ler dados existentes do content
  const [categories, setCategories] = useState(/* ... */);

  const handleSave = useCallback(() => {
    dispatch({
      type: "UPDATE_SECTION_CONTENT",
      sectionId,
      content: { ...content, categories },
    });
    onClose();
  }, [content, dispatch, sectionId, categories, onClose]);

  return (
    <Modal open onOpenChange={(open) => { if (!open) onClose(); }}>
      <ModalContent size="lg" data-editor-ui>
        <ModalHeader>
          <ModalTitle>Editar catalogo</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {/* Campos de edicao */}
        </ModalBody>
        <ModalFooter>
          <div />
          <ModalFooterActions>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </ModalFooterActions>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

### 5. Registrar no EditorSectionWrapper

**Arquivo:** `src/app/editor/[storeSlug]/_components/editor-section-wrapper.tsx`

3 mudancas:

**a) Import:**
```ts
import { CatalogEditPopup } from "./popups/catalog-edit-popup";
```

**b) PopupType:**
```ts
type PopupType = "button" | "image" | "nav" | "footer" | "pricing" | "catalog";
```

**c) openPopup — adicionar case:**
```ts
} else if (mode === "catalog") {
  setPopup({ type: "catalog", rect, path, fieldPrefix: "", textField: "", linkField: "" });
}
```

**d) Render — adicionar popup:**
```tsx
{popup?.type === "catalog" && (
  <CatalogEditPopup
    sectionId={section.id}
    content={content}
    onClose={closePopup}
  />
)}
```

### 6. Adicionar CSS do hover (se necessario)

**Arquivo:** `src/app/editor/[storeSlug]/_components/editor-preview.tsx`

Adicionar o novo mode nos seletores de cursor e overlay escuro:

```css
.editor-preview [data-pgl-hover][data-pgl-edit="catalog"] {
  cursor: pointer;
}
.editor-preview [data-pgl-hover][data-pgl-edit="catalog"] {
  position: relative;
}
.editor-preview [data-pgl-hover][data-pgl-edit="catalog"]::after {
  /* overlay escuro */
}
```

Ou simplesmente adicionar "catalog" nos seletores existentes que ja cobrem image/nav/footer/pricing.

### 7. Atualizar o label do botao de hover

No EditorSectionWrapper, atualizar o texto do botao "Editar":

```ts
{hoverRect.mode === "catalog" ? "Editar catalogo" : /* ... */}
```

---

## Checklist

- [ ] EditMode type atualizado
- [ ] BLOCK_EDIT_MAP simplificado (titulo/subtitulo text, resto novo mode)
- [ ] Componentes do bloco: wrapper com data-pgl-edit, individuais removidos
- [ ] Popup criado com modal-blocks
- [ ] EditorSectionWrapper: import + PopupType + case + render
- [ ] CSS: cursor + overlay escuro no hover
- [ ] Label do botao traduzido

## Referencia de Implementacoes Existentes

| Mode | Popup | Wrapper |
|------|-------|---------|
| `nav` | `popups/nav-edit-popup.tsx` | `<header data-pgl-edit="nav">` |
| `footer` | `popups/footer-edit-popup.tsx` | `<footer data-pgl-edit="footer">` |
| `pricing` | `popups/pricing-edit-popup.tsx` | `<div data-pgl-edit="pricing">` |
| `button` | `popups/button-edit-popup.tsx` | Elemento individual |
| `image` | `popups/image-edit-popup.tsx` | Elemento individual |

## Padroes Importantes

1. Titulo e subtitulo SEMPRE ficam como `data-pgl-edit="text"` (inline)
2. O wrapper do novo mode englobam SOMENTE a area de dados complexos
3. REMOVER todos os data-pgl individuais dos elementos DENTRO do wrapper
4. O popup recebe `sectionId`, `content`, `onClose` como props
5. Salvar via `dispatch({ type: "UPDATE_SECTION_CONTENT", sectionId, content })`
6. Usar `modal-blocks` do shadcn para a modal (nunca criar portais manuais)
7. Textos em portugues: "Cancelar", "Salvar", "Editar [nome]"
