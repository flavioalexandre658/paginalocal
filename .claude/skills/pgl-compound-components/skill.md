---
name: pgl-compound-components
description: Skill para construir componentes de UI usando o padrão Compound Components. Usar sempre que criar novos componentes de interface no PGL — botões, popups, cards, listas, toolbars, drawers, modais, e qualquer elemento composto. Garante composição flexível, consistência visual e tipagem forte com TypeScript.
---

# Compound Components — Padrão de Componentização do PGL

## O que é

Compound Components é um padrão onde um componente pai gerencia lógica e variantes, e subcomponentes auxiliares funcionam como slots composíveis. Os subcomponentes só fazem sentido dentro do pai. O consumidor monta a estrutura que precisa combinando os slots, sem precisar passar 15 props pro componente pai.

## Por que usar

Props demais criam componentes frágeis:
```tsx
// ❌ RUIM — prop hell
<Button icon={<IconPlus />} iconPosition="left" label="Criar" badge="3" badgeColor="red" loading />
```

Compound components criam composição flexível:
```tsx
// ✅ BOM — composição
<Button variant="primary" loading>
  <ButtonLeft><IconPlus /></ButtonLeft>
  <ButtonContent>Criar</ButtonContent>
  <ButtonBadge color="red">3</ButtonBadge>
</Button>
```

---

## Regras obrigatórias

### 1. Componente pai

- Sempre usa `forwardRef` pra expor a ref do elemento DOM
- Variantes definidas com `class-variance-authority` (cva)
- Aceita `asChild` via `@radix-ui/react-slot` quando fizer sentido (botões, links)
- Gerencia estados globais: `loading`, `disabled`, `open`, `active`
- Exporta o componente E o objeto de variantes

### 2. Subcomponentes

- São wrappers simples — apenas `<span>`, `<div>` ou `<li>` com className
- Não têm lógica complexa, não fazem fetch, não gerenciam estado
- Aceitam `children` e `className` sempre
- Nome segue o padrão: `NomeDoPai` + `Slot` (ex: `CardHeader`, `CardBody`, `CardFooter`)
- Exportados individualmente como named exports no mesmo arquivo do pai

### 3. Arquivo

- Um arquivo por componente composto (pai + todos os subcomponentes juntos)
- Path: `src/components/ui/nome-do-componente.tsx`
- Exporta tudo no final: `export { Pai, Sub1, Sub2, Sub3, variantes }`

### 4. Tipagem

- Props do pai: extends HTMLAttributes do elemento base + VariantProps do cva
- Props dos subs: `{ children: React.ReactNode; className?: string }` no mínimo
- Interface nomeada: `NomeDoPaiProps`

---

## Estrutura base (template)

Todo componente composto segue esta estrutura:

```tsx
// src/components/ui/example.tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// ═══════════════════════════════════════════════
// VARIANTES
// ═══════════════════════════════════════════════

const exampleVariants = cva(
  // classes base que SEMPRE se aplicam
  "inline-flex items-center transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        primary: "bg-primary text-white",
        ghost: "bg-transparent hover:bg-gray-100",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-4 py-2",
        lg: "text-base px-6 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// ═══════════════════════════════════════════════
// COMPONENTE PAI
// ═══════════════════════════════════════════════

export interface ExampleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {
  asChild?: boolean
}

const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div"
    return (
      <Comp
        ref={ref}
        className={cn(exampleVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Example.displayName = "Example"

// ═══════════════════════════════════════════════
// SUBCOMPONENTES (slots)
// ═══════════════════════════════════════════════

const ExampleHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("font-semibold", className)}>{children}</div>
}

const ExampleBody = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex-1", className)}>{children}</div>
}

const ExampleFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex justify-end gap-2", className)}>{children}</div>
}

// ═══════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════

export {
  Example,
  ExampleHeader,
  ExampleBody,
  ExampleFooter,
  exampleVariants,
}
```

---

## Exemplos reais do projeto

### Botão com loading, ícones e variantes

```tsx
// src/components/ui/enhanced-button.tsx

// Pai: gerencia variantes (cva), loading, disabled, asChild
// Slots: Left (ícone esquerda), Content (texto), Right (ícone direita)

<EnhancedButton variant="ametista" size="lg" loading>
  <EnhancedButtonLeft><IconRocket /></EnhancedButtonLeft>
  <EnhancedButtonContent>Publicar site</EnhancedButtonContent>
</EnhancedButton>

<EnhancedButton variant="ghost" size="sm">
  <EnhancedButtonContent>Cancelar</EnhancedButtonContent>
</EnhancedButton>
```

### EditPopup (popup de edição do editor)

```tsx
// src/components/editor/edit-popup.tsx

// Pai: gerencia posição (floating-ui), open/close, animação
// Slots: Handle, Header, HeaderActions, Body, Footer

<EditPopup anchor={buttonRef} open={isOpen} onClose={close}>
  <EditPopupHandle />
  <EditPopupHeader>
    <EditPopupTitle>Call to Action</EditPopupTitle>
    <EditPopupHeaderActions>
      <button>Adjust</button>
      <button>Upload</button>
    </EditPopupHeaderActions>
  </EditPopupHeader>
  <EditPopupBody>
    <LinkTypeSelector value={linkType} onChange={setLinkType} />
    <InputField label="Button label" value={label} onChange={setLabel} />
  </EditPopupBody>
  <EditPopupFooter>
    <EditPopupCancel onClick={close} />
    <EditPopupDone onClick={save} />
  </EditPopupFooter>
</EditPopup>
```

### ListItem editável (links do nav, itens do FAQ, features de plano)

```tsx
// src/components/editor/editable-list.tsx

// Pai: gerencia drag-and-drop, ordem, add/remove
// Slots: DragHandle, Content, Actions

<EditableList onReorder={handleReorder}>
  {items.map((item) => (
    <EditableListItem key={item.id}>
      <EditableListDragHandle />
      <EditableListContent>{item.label}</EditableListContent>
      <EditableListActions>
        <EditableListEdit onClick={() => edit(item)} />
        <EditableListDelete onClick={() => remove(item)} />
      </EditableListActions>
    </EditableListItem>
  ))}
  <EditableListAdd onClick={addItem}>+ Adicionar</EditableListAdd>
</EditableList>
```

### Card de seção na sidebar

```tsx
// src/components/editor/section-card.tsx

<SectionCard active={isSelected} onClick={select}>
  <SectionCardIcon><IconLayout /></SectionCardIcon>
  <SectionCardContent>
    <SectionCardTitle>Hero</SectionCardTitle>
    <SectionCardDescription>Seção principal</SectionCardDescription>
  </SectionCardContent>
  <SectionCardActions>
    <SectionCardVisibility visible={section.visible} onToggle={toggle} />
    <SectionCardMenu onDelete={del} onDuplicate={dup} />
  </SectionCardActions>
</SectionCard>
```

### Toolbar flutuante de seção

```tsx
// src/components/editor/section-toolbar.tsx

<SectionToolbar position={toolbarPos}>
  <SectionToolbarButton icon={<IconBrush />} label="Design" onClick={openDesign} />
  <SectionToolbarButton icon={<IconPencil />} label="Edit content" onClick={openContent} />
  <SectionToolbarSeparator />
  <SectionToolbarButton icon={<IconArrowUp />} onClick={moveUp} />
  <SectionToolbarButton icon={<IconArrowDown />} onClick={moveDown} />
  <SectionToolbarButton icon={<IconTrash />} onClick={confirmDelete} destructive />
</SectionToolbar>
```

### Tabs (Layout/Customize, Content/Design)

```tsx
// src/components/editor/editor-tabs.tsx

<EditorTabs value={activeTab} onValueChange={setActiveTab}>
  <EditorTabsList>
    <EditorTabsTrigger value="layout">Layout</EditorTabsTrigger>
    <EditorTabsTrigger value="customize">Customize</EditorTabsTrigger>
  </EditorTabsList>
  <EditorTabsContent value="layout">
    <LayoutGrid variants={variants} current={current} onSelect={select} />
  </EditorTabsContent>
  <EditorTabsContent value="customize">
    <ToggleField label="Display buttons" checked={show} onChange={setShow} />
    <ImageField label="Background Image" src={img} onChange={setImg} />
  </EditorTabsContent>
</EditorTabs>
```

---

## Quando usar cada slot

### Slots universais (quase todo componente tem)
- `Header` — título, ações do header
- `Body` / `Content` — conteúdo principal
- `Footer` — botões de ação (Cancel/Done/Save)

### Slots de posição (pra conteúdo inline)
- `Left` — ícone ou elemento à esquerda
- `Right` — ícone ou elemento à direita
- `Center` — conteúdo centralizado

### Slots de lista (pra itens repetidos)
- `Item` — wrapper de cada item
- `DragHandle` — ícone de arrastar
- `Actions` — grupo de botões de ação por item
- `Add` — botão de adicionar ao final da lista

### Slots de estado (opcionais)
- `Loading` — conteúdo durante loading
- `Empty` — conteúdo quando lista está vazia
- `Error` — conteúdo de erro

---

## Padrões avançados

### Contexto compartilhado entre pai e filhos

Quando os subcomponentes precisam de dados do pai (ex: o Footer precisa saber se o form está dirty pra desabilitar o Done), usar React Context:

```tsx
// Dentro do componente pai:
const EditPopupContext = React.createContext<{
  isDirty: boolean
  isLoading: boolean
}>({ isDirty: false, isLoading: false })

// Pai provê:
<EditPopupContext.Provider value={{ isDirty, isLoading }}>
  {children}
</EditPopupContext.Provider>

// Subcomponente consome:
const EditPopupDone = ({ onClick }: { onClick: () => void }) => {
  const { isDirty, isLoading } = React.useContext(EditPopupContext)
  return (
    <button disabled={!isDirty || isLoading} onClick={onClick}>
      Done
    </button>
  )
}
```

Usar Context SOMENTE quando o subcomponente precisa de estado do pai. Se é só visual (className), não precisa.

### Componente pai com render de filhos condicionais

O pai pode verificar quais slots foram passados e ajustar o layout:

```tsx
const Example = ({ children, ...props }) => {
  const childArray = React.Children.toArray(children)
  const hasFooter = childArray.some(
    (child) => React.isValidElement(child) && child.type === ExampleFooter
  )

  return (
    <div className={cn(hasFooter && "pb-0")}>
      {children}
    </div>
  )
}
```

Usar com moderação — na maioria dos casos, o pai não precisa inspecionar os filhos.

### Variantes no subcomponente

Quando um subcomponente tem variações próprias (ex: botão da toolbar pode ser normal ou destructive):

```tsx
const toolbarButtonVariants = cva(
  "px-3 py-1.5 rounded text-xs font-medium transition-colors",
  {
    variants: {
      destructive: {
        true: "hover:bg-red-500/20 hover:text-red-400",
        false: "hover:bg-white/10 hover:text-white",
      },
    },
    defaultVariants: {
      destructive: false,
    },
  }
)

const SectionToolbarButton = ({
  icon,
  label,
  destructive,
  className,
  ...props
}: {
  icon: React.ReactNode
  label?: string
  destructive?: boolean
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={cn(toolbarButtonVariants({ destructive, className }))} {...props}>
      {icon}
      {label && <span className="ml-1">{label}</span>}
    </button>
  )
}
```

---

## Checklist pra todo componente novo

Antes de considerar o componente pronto:

- [ ] Pai usa `forwardRef`
- [ ] Variantes definidas com `cva` (nunca ternários inline pra estilo)
- [ ] Subcomponentes aceitam `children` + `className`
- [ ] Subcomponentes usam `cn()` pra merge de classes
- [ ] Todas as props tipadas com interface nomeada
- [ ] `displayName` definido no pai
- [ ] Tudo exportado como named exports no final do arquivo
- [ ] Nenhum subcomponente definido DENTRO da função do pai (anti-pattern que causa remount)
- [ ] Composição testada com cenário mínimo (só pai + 1 slot) e máximo (todos os slots)
- [ ] O consumidor consegue compor sem olhar a implementação — os nomes são auto-explicativos

---

## Anti-patterns a evitar

### ❌ Subcomponente dentro do render do pai
```tsx
const Parent = () => {
  // Isso causa remount a cada render!
  const Child = () => <div>child</div>
  return <Child />
}
```

### ❌ Prop drilling em vez de composição
```tsx
// Ruim: 10 props no pai
<Card title="X" subtitle="Y" icon={<I/>} footer={<F/>} headerActions={[...]} />

// Bom: slots composíveis
<Card>
  <CardHeader><I/> X</CardHeader>
  <CardBody>Y</CardBody>
  <CardFooter><F/></CardFooter>
</Card>
```

### ❌ Lógica complexa no subcomponente
```tsx
// Ruim: sub faz fetch
const CardBody = () => {
  const data = useFetch("/api/data") // ❌
  return <div>{data}</div>
}

// Bom: sub é wrapper puro, lógica fica fora
const CardBody = ({ children, className }) => {
  return <div className={cn("p-4", className)}>{children}</div>
}
```

### ❌ Estilos hardcoded sem cva
```tsx
// Ruim: ternários inline
<button className={`px-4 py-2 ${variant === "primary" ? "bg-blue-500" : "bg-gray-500"}`}>

// Bom: cva
<button className={cn(buttonVariants({ variant }))}>
```