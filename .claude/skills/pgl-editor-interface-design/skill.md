---
name: pgl-edit-interfaces-design
description: Skill para construir interfaces de edição no editor do PGL com nível de design idêntico ao Durable. Cobre o componente base EditPopup, sidebar do editor, toolbar de seção, popups de botão/imagem/nav/footer, e todas as variações. Foco em design frontend com detalhes de spacing, cores, tipografia, sombras e micro-interações.
---

# PGL — Design de Interfaces de Edição (nível Durable)

## Objetivo

Toda interface de edição no editor do PGL deve atingir o mesmo nível de polish visual do Durable. Este skill define os tokens de design, componentes base, e regras que garantem consistência.

---

## Design Tokens do Editor (NÃO do site gerado)

O editor tem sua própria linguagem visual, separada do site que o usuário está editando. Esses tokens se aplicam apenas aos elementos de UI do editor (popups, sidebar, topbar, toolbars).

### Cores

```
--editor-bg: #ffffff                    (fundo de popups e cards)
--editor-bg-subtle: #f5f5f4            (fundo de campos input, áreas secundárias)
--editor-bg-hover: #f0efee             (hover em itens de lista)
--editor-border: rgba(0, 0, 0, 0.06)   (bordas sutis)
--editor-border-hover: rgba(0, 0, 0, 0.12)  (bordas no hover)
--editor-text: #1a1a1a                 (texto principal)
--editor-text-muted: #737373           (texto secundário, labels)
--editor-text-ghost: #a3a3a3           (placeholders)
--editor-accent: #171717               (botões filled, tabs ativas)
--editor-accent-text: #ffffff          (texto sobre accent)
--editor-shadow-sm: 0 1px 3px rgba(0,0,0,0.06)
--editor-shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--editor-shadow-lg: 0 12px 40px rgba(0,0,0,0.12)
--editor-shadow-xl: 0 25px 60px rgba(0,0,0,0.15)
```

### Tipografia

```
Font family:    system-ui, -apple-system, sans-serif (NÃO usa a fonte do site)
Título popup:   16px, font-weight 600, color --editor-text
Label campo:    13px, font-weight 500, color --editor-text-muted
Input texto:    14px, font-weight 400, color --editor-text
Botão texto:    13px, font-weight 500
Tab texto:      13px, font-weight 500
Lista item:     14px, font-weight 400
Placeholder:    14px, font-weight 400, color --editor-text-ghost
```

### Espaçamento

```
Popup padding:       20px
Popup gap interno:   16px entre campos
Campo label→input:   6px
Lista item padding:  12px 14px
Lista item gap:      6px entre itens
Footer padding:      16px 20px
Tab padding:         8px 16px
Botão padding:       8px 16px (inline), 10px 20px (footer)
```

### Border Radius

```
Popup:           16px
Input/campo:     10px
Lista item:      10px
Tab pill:        8px
Botão inline:    8px
Botão footer:    8px
Toggle:          999px (full)
Thumbnail img:   8px
Avatar:          999px (full)
```

---

## Componente Base: EditPopup

Toda interface de edição usa este componente como casca. Ele NUNCA varia — o que varia é o conteúdo interno (children).

### Estrutura visual (de cima pra baixo)

```
┌─────────────────────────────────────────┐
│          ━━━━━  (handle)                │  ← barra de 40px × 4px, cinza, rounded-full, centralizada, margin-top 10px
│                                         │
│  Título da Interface          [ações]   │  ← 16px semibold, ações opcionais à direita
│                                         │
│  ┌─────────────────────────────────┐    │
│  │  Conteúdo (children)           │    │  ← área scrollável se necessário
│  │                                 │    │
│  │  campos, listas, grids...       │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │  ← border-top sutil
│                        Cancel    Done   │  ← footer fixo
└─────────────────────────────────────────┘
```

### Handle (grabber)

- Barra horizontal: largura 40px, altura 4px
- Cor: rgba(0,0,0,0.15)
- Border-radius: 999px (full)
- Centralizada horizontalmente
- Margin: 10px auto 4px auto
- Não é funcional (decorativa) — apenas dá a aparência de bottom-sheet arrastável

### Header

- Padding: 0 20px
- Título: à esquerda, 16px, font-weight 600, color --editor-text
- Ações (opcionais): à direita, inline com o título
  - Cada ação é um botão texto: 12px, font-weight 500, color --editor-text-muted
  - Ações comuns: "Adjust", "Upload", "0/5" (contador IA), "Upgrade"
  - Gap entre ações: 12px
  - Ícone pequeno (14px) antes do texto de cada ação

### Body

- Padding: 16px 20px
- Overflow-y: auto (scrollável se conteúdo exceder)
- Max-height: 60vh (nunca ocupa tela inteira)
- Gap entre campos: 16px

### Footer

- Border-top: 1px solid --editor-border
- Padding: 16px 20px
- Display: flex, justify-content: flex-end, gap: 8px
- Botão "Cancel": sem background, sem borda, color --editor-text-muted, font-weight 500, 13px, hover: color --editor-text
- Botão "Done": background --editor-accent (#171717), color white, font-weight 500, 13px, padding 8px 20px, rounded 8px, hover: opacity 0.9

### Sombra e posição

- Box-shadow: --editor-shadow-xl
- Border: 1px solid --editor-border (opcional, sutil)
- Posição: floating-ui ancorado ao elemento que disparou
- Placement preferido: bottom-start ou bottom
- Offset: 8px
- Z-index: 9999

### Animação

- Entrada: opacity 0→1 + translateY(4px→0) em 200ms ease-out
- Saída: opacity 1→0 + translateY(0→4px) em 150ms ease-in

---

## Tabs (Layout / Customize, Content / Design)

Quando o popup tem tabs, elas ficam logo abaixo do título.

### Visual

- Container: fundo --editor-bg-subtle, rounded 10px, padding 4px, display inline-flex
- Cada tab: padding 8px 16px, rounded 8px, 13px, font-weight 500
- Tab ativa: fundo --editor-bg (branco), shadow --editor-shadow-sm, color --editor-text
- Tab inativa: fundo transparente, color --editor-text-muted, hover: color --editor-text

Esse padrão é idêntico ao que o Durable usa — são "pills" dentro de um container com fundo sutil. A tab ativa "levanta" com fundo branco e sombra.

---

## Campos de Input

### Text Input

- Fundo: --editor-bg-subtle
- Border: 1px solid --editor-border
- Border-radius: 10px
- Padding: 10px 14px
- Font: 14px, regular
- Placeholder: color --editor-text-ghost
- Focus: border-color rgba(0,0,0,0.2), outline none, sem glow colorido
- Altura: ~40px

### Textarea

- Mesmo estilo do input
- Min-height: 80px
- Resize: vertical

### Label

- Font: 13px, font-weight 500, color --editor-text-muted
- Margin-bottom: 6px
- Sem uppercase, sem tracking extra (diferente dos labels do site gerado)

---

## Toggle (Switch)

Estilo iOS. Usado pra "Display buttons", "Mostrar mapa", etc.

- Track: largura 44px, altura 24px, rounded 999px
- Track off: fundo --editor-bg-subtle, border 1px solid --editor-border
- Track on: fundo --editor-accent (#171717)
- Thumb: círculo 20px, branco, shadow-sm
- Thumb off: alinhado à esquerda (2px offset)
- Thumb on: alinhado à direita (2px offset)
- Transição: 200ms ease-out
- Ao lado do toggle: label 14px regular

---

## Lista Editável (links do nav, perguntas do FAQ, features de plano)

### Item

- Fundo: --editor-bg (branco)
- Border: 1px solid --editor-border
- Border-radius: 10px
- Padding: 12px 14px
- Display: flex, align-items: center, gap: 10px
- Hover: border-color --editor-border-hover

### Composição do item (esquerda → direita)

1. **Drag handle:** 6 dots (2×3 grid), cor --editor-text-ghost, cursor grab
   - Ao arrastar: item ganha shadow-lg, opacity 0.9, z-index elevado
2. **Texto:** 14px, regular, color --editor-text, flex: 1
3. **Botão Edit:** ícone lápis 14px + texto "Edit" 12px, color --editor-text-muted, hover: color --editor-text
4. **Botão Delete:** ícone lixeira 14px, color --editor-text-ghost, hover: color vermelho/destructive

### Botão "Add item"

- Abaixo da lista
- Texto: "+ Add item" ou "+ Adicionar"
- Estilo: 13px, font-weight 500, color --editor-text-muted
- Sem fundo, sem borda
- Hover: color --editor-text
- Padding: 8px 0

---

## Grid de Imagens (popup de edição de imagem)

### Campo de busca

- Input com ícone de lupa à esquerda (dentro do campo)
- Placeholder: "Buscar ou gerar uma imagem"
- Botão "Generate" (ícone sparkle + texto) à direita, DENTRO do campo ou ao lado
- O botão Generate: fundo --editor-bg-subtle, border 1px solid --editor-border, rounded 8px, 12px, font-weight 500

### Grid

- 2 colunas (popup ~400px) ou 3 colunas (popup mais largo)
- Gap: 8px
- Cada thumbnail:
  - Aspect-ratio: 4/3 ou 1/1
  - Object-fit: cover
  - Border-radius: 8px
  - Cursor: pointer
  - Hover: ring 2px accent, scale(1.02), transição 150ms
  - Selecionada: ring 2px accent sólida, ícone check no canto superior direito (fundo accent, rounded-full, 20px, ícone branco)
- Container scrollável: max-height 300px, overflow-y auto

---

## Link Type Selector (popup de botão/CTA)

### Visual

- Container: display flex, flex-wrap, gap 6px
- Cada opção: pill com border 1px solid --editor-border, rounded 8px, padding 6px 14px, 13px, font-weight 400
- Opção ativa: fundo --editor-accent (#171717), color branco, border transparente
- Opção inativa: fundo transparente, color --editor-text-muted, hover: border --editor-border-hover
- Opções: "Page link", "External link", "Email", "Phone", "Page section"

---

## Popup de Seção (Design / Layout)

Quando o usuário clica em "Design" na toolbar da seção.

### Tab "Layout"

- Grid de mini-previews das variantes disponíveis pra aquele tipo de bloco
- 2 colunas
- Cada preview:
  - Screenshot/mockup em miniatura do layout da variante
  - Border-radius: 8px
  - Border: 2px solid transparente
  - Variante atual: border 2px solid --editor-accent
  - Hover: border 2px solid --editor-border-hover
  - Cursor: pointer
- Abaixo do grid principal: separador + texto "Try a different layout set" + grid de layouts alternativos (outros blockTypes que poderiam substituir)

### Tab "Customize" / "Content"

Campos específicos da seção:

- **"Display buttons":** toggle (mostra/esconde botões na seção)
- **"Manage buttons":** row com label + botão "Edit" → abre sub-popup de botão
- **"Background Image":** thumbnail da imagem atual (80×60px, rounded 8px) + clicável pra trocar
- Outros campos conforme o blockType

---

## Sidebar do Editor

### Visual

- Largura: ~200px (expandida) ou ~56px (colapsada, só ícones)
- Fundo: --editor-bg (branco)
- Border-right: 1px solid --editor-border
- Padding: 16px 12px

### Header da sidebar

- Nome do site: 14px, font-weight 600, truncado se longo
- Ícone dropdown (chevron-down) pra trocar de site (se tiver múltiplos)
- Ícone de copiar/abrir site (quadrado com seta)
- Gap: 8px entre elementos

### Itens de navegação

- Cada item: display flex, align-items center, gap 10px, padding 8px 12px, rounded 8px
- Ícone: 18px, color --editor-text-muted
- Texto: 14px, font-weight 400, color --editor-text
- Item ativo: fundo --editor-bg-subtle, font-weight 500
- Item hover: fundo --editor-bg-hover

### Itens
1. Home (ícone casa)
2. Website (ícone monitor) — ativo quando no editor
3. Customers (ícone pessoas)
4. Discoverability (ícone bússola/olho)
5. Invoices (ícone documento)
6. Studio (ícone paleta)
7. AI Partner (ícone sparkle)

### Card de upsell (na parte de baixo)

- Fundo: --editor-bg-subtle
- Border: 1px solid --editor-border
- Border-radius: 12px
- Padding: 16px
- Título: "Publique seu site", 13px, font-weight 600
- Subtítulo: "Acesse recursos premium", 12px, color --editor-text-muted
- Botão: fundo --editor-accent, color branco, full-width, rounded 8px, padding 8px, 13px font-weight 500, ícone sparkle antes do texto

### Links de rodapé

- Abaixo do card de upsell
- Ícone + texto, 13px, color --editor-text-muted
- Settings, Referrals, Help
- Hover: color --editor-text

---

## Topbar do Editor

### Visual

- Altura: ~48px
- Fundo: --editor-bg
- Border-bottom: 1px solid --editor-border
- Padding: 0 16px
- Display: flex, align-items center, justify-content space-between

### Esquerda

- Nome do site (se sidebar colapsada): 14px, font-weight 600
- Seletor de página: "Page: Início" com dropdown chevron, 13px, font-weight 500, border 1px, rounded 8px, padding 6px 12px

### Centro

- 3 botões:
  - "Theme" (ícone palette + texto)
  - "Colors" (ícone paintbrush + texto)
  - "Fonts" (ícone Aa + texto)
- Estilo: 13px, font-weight 500, color --editor-text-muted, gap 4px ícone→texto, gap 16px entre botões
- Hover: color --editor-text

### Direita

- Ícone settings (engrenagem)
- Ícone responsivo (3 ícones: desktop/tablet/mobile, o ativo tem cor --editor-text, os outros --editor-text-ghost)
- "Preview" (texto + ícone play)
- Botão "Publish": fundo verde #22c55e ou accent do editor, color branco, rounded 8px, padding 8px 16px, font-weight 600, ícone foguete/sparkle

---

## Toolbar Flutuante de Seção

### Visual

- Fundo: rgba(23, 23, 23, 0.9) — quase preto
- Backdrop-filter: blur(8px)
- Border-radius: 999px (pill)
- Padding: 6px 8px
- Shadow: --editor-shadow-lg
- Display: inline-flex, gap: 2px

### Botões

- Cada botão: padding 6px 12px, rounded 6px, 12px, font-weight 500, color rgba(255,255,255,0.7)
- Hover: fundo rgba(255,255,255,0.1), color branco
- Ícone: 14px, margin-right 4px
- Separador: barra vertical 1px, height 16px, cor rgba(255,255,255,0.15), margin 0 4px

### Botões na ordem

1. Ícone brush + "Design"
2. Ícone pencil + "Edit content"
3. | separador |
4. Ícone seta ↑ (sem texto)
5. Ícone seta ↓ (sem texto)
6. Ícone lixeira (sem texto), hover: cor destructive/vermelho

---

## Botão "Add Section"

- Aparece entre seções ao hover na zona de separação
- Fundo: #22c55e (verde)
- Color: branco
- Padding: 6px 14px
- Rounded: 6px
- Font: 12px, font-weight 600
- Ícone + antes do texto
- Shadow: --editor-shadow-sm
- Hover: brightness 1.1

---

## Botão "Edit" flutuante (em componentes)

### Para botões/CTAs

- Posição: centralizado dentro do componente (sobre o texto do botão)
- Fundo: branco
- Shadow: --editor-shadow-md
- Rounded: 999px (pill)
- Padding: 6px 14px
- Display: flex, align-items center, gap 6px
- Ícone lápis: 14px, color --editor-text-muted
- Texto "Edit": 13px, font-weight 500, color --editor-text
- Hover: shadow-lg

### Para imagens

- Dois botões lado a lado, centralizados na imagem:
  - "Regenerate": ícone sparkle + texto, mesmo estilo (branco, pill, shadow)
  - "Edit": ícone lápis + texto
- Gap entre eles: 8px

### Para nav/footer

- Centralizado no componente
- Estilo idêntico ao de botões, mas com texto mais longo:
  - "Edit navigation bar"
  - "Edit bottom bar"

### Para imagens pequenas (avatar)

- Ícone de lápis apenas (sem texto)
- Posição: canto inferior direito do avatar
- Fundo: branco
- Rounded: 999px
- Tamanho: 28×28px
- Shadow: --editor-shadow-sm
- Hover: shadow-md

---

## Regras de Consistência

### 1. Nunca usar cores do site gerado nos elementos do editor
O popup é SEMPRE branco/cinza independente da paleta do site. Se o site tem fundo escuro navy, o popup continua branco. A única exceção é a cor de selection/ring quando o elemento está em hover (que pode usar azul padrão #3b82f6).

### 2. Nunca usar as fontes do site gerado nos elementos do editor
O popup usa system-ui SEMPRE. O Oswald/Playfair/Roboto do site nunca aparece dentro dos popups.

### 3. Sombras consistentes
Usar apenas as 4 sombras definidas (sm, md, lg, xl). Nunca box-shadow custom fora desse sistema.

### 4. Border-radius consistente
10px pra campos e itens, 16px pra popups, 999px pra botões pill e toggles. Nunca usar rounded-md ou rounded-lg do Tailwind diretamente — mapear pras variáveis.

### 5. Animações sutis
Toda transição: 150-200ms ease-out. Nunca bounce, spring ou durações longas. O editor é ferramenta de trabalho, não showcase.

### 6. Z-index hierarchy
Toolbar de seção: z-9990, Botões Edit flutuantes: z-9991, EditPopup: z-9995, Tooltip/toast: z-9999. Nunca z-50 ou z-auto.

### 7. Outline de hover nos elementos do site
Solid 2px pra texto, dashed 2px pra componentes. Cor: rgba(59, 130, 246, 0.4). Nunca usar ring do Tailwind (adiciona espaço). Usar CSS outline (não afeta layout).

---

## Checklist de Qualidade Visual

Antes de considerar qualquer popup/interface pronta, verificar:

- [ ] Handle (grabber bar) no topo: 40×4px, centralizado, cinza
- [ ] Título: 16px semibold, sem uppercase
- [ ] Labels: 13px medium, cor muted, sem uppercase
- [ ] Inputs: fundo sutil, border sutil, rounded 10px, focus sem glow colorido
- [ ] Tabs: pills dentro de container com fundo sutil, ativa com fundo branco + shadow
- [ ] Toggle: estilo iOS, 44×24px, preto quando ativo
- [ ] Lista: itens com border sutil, drag handles, botões Edit/Delete alinhados à direita
- [ ] Footer: border-top sutil, Cancel ghost + Done filled dark, alinhados à direita
- [ ] Sombra do popup: --editor-shadow-xl (suave mas presente)
- [ ] Sem cores do site vazando pro popup
- [ ] Sem fontes do site vazando pro popup
- [ ] Animação de entrada: sutil, 200ms, sem bounce
- [ ] Funciona sobre fundo claro E escuro do site (o popup é sempre branco)