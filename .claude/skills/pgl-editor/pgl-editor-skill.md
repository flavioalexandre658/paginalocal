---
name: pgl-inline-editor
description: Skill para implementar edição inline de elementos no editor visual do PGL (Decolou). Cobre hover detection, seleção de elementos, edição inline de texto com cursor, manutenção de estilos accent, toolbar de seção, e barra de reescrita por IA. Referência visual: editor do Durable.
---

# PGL — Inline Editor (Fase 2)

## O que este skill resolve

O editor do PGL precisa permitir que o usuário edite o site gerado diretamente no preview, clicando nos elementos. O comportamento deve ser idêntico ao do Durable:

1. Hover: ao passar o mouse sobre qualquer elemento editável (texto, imagem, botão), aparece um outline sutil indicando que é editável
2. Clique: 1 clique ativa a edição, o cursor aparece na posição exata do clique
3. O background do elemento fica transparente (sem caixa branca/cinza cobrindo o design)
4. Palavras com estilo accent (cor, itálico, underline) são mantidas durante a edição
5. Abaixo do elemento em edição, aparece barra de reescrita por IA
6. Entre seções, toolbar flutuante com ações (Design, Editar, mover, deletar)

---

## Contexto do projeto

- Stack: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- O site é renderizado por componentes React que leem um JSON chamado SiteBlueprint
- Cada seção do site é um bloco (hero, services, about, faq, etc.)
- Cada bloco tem content (textos, imagens, links) e designTokens (cores, fontes)
- O editor manipula o Blueprint JSON — cada edição atualiza o JSON via Server Action
- Os textos podem ter palavras com estilo accent marcadas com asteriscos: "Seu carro *impecável*"
- O renderer converte *palavra* para tratamento visual (cor accent, itálico serif, etc.)

---

## Arquitetura do sistema de edição

### Conceito principal: Editable Wrapper

Cada elemento editável no preview é envolvido por um componente wrapper que controla os 3 estados: idle (normal), hover (outline aparece), e editing (contentEditable ativado).

O wrapper NÃO adiciona background, NÃO muda layout, NÃO quebra o design existente. Ele apenas:
- Detecta hover e adiciona outline
- Detecta clique e ativa contentEditable
- Captura blur/escape pra salvar e desativar edição
- Mostra a barra de IA quando em modo edição

### Como identificar qual campo do Blueprint cada texto representa

Cada wrapper recebe via prop o "path" do campo no Blueprint. Exemplos:
- `pages.0.sections.0.content.headline`
- `pages.0.sections.2.content.items.1.description`
- `pages.0.sections.4.content.items.0.question`

Quando o usuário confirma a edição, o sistema usa esse path pra atualizar cirurgicamente o Blueprint no banco.

---

## Regras visuais OBRIGATÓRIAS

### 1. Hover state

Quando o mouse passa sobre um elemento editável:
- Borda: outline 2px solid com cor primary do site (usar `tokens.palette.accent` ou azul #3b82f6)
- Border radius: seguir o radius do elemento (se o texto está dentro de um card com rounded-xl, o outline acompanha)
- Transição: opacity 0 → 1 em 150ms
- Cursor: muda pra `text` em textos, `pointer` em imagens/botões
- O outline NÃO ocupa espaço (usar outline CSS, não border — outline não afeta layout)
- O background NÃO muda. O elemento permanece exatamente como está. Sem caixa branca, sem overlay, sem mudança de opacidade no background.

### 2. Editing state (após clique)

Quando o usuário clica no elemento:
- O outline fica fixo (não desaparece ao mover o mouse)
- O outline pode ter cor mais intensa ou usar box-shadow: `0 0 0 2px rgba(59, 130, 246, 0.5)`
- contentEditable é ativado no elemento de texto
- O cursor aparece NA POSIÇÃO EXATA do clique (não no início do texto)
  - Usar `document.caretPositionFromPoint(x, y)` ou `document.caretRangeFromPoint(x, y)` pra posicionar o cursor no ponto do clique
- O background continua transparente
- O texto mantém TODAS as suas propriedades CSS: font-family, font-size, font-weight, color, letter-spacing, text-transform, line-height
- Palavras com estilo accent (ex: em itálico, com cor accent) devem manter sua aparência durante a edição
- A barra de reescrita IA aparece abaixo do elemento

### 3. Manutenção de estilos accent durante edição

Problema: quando um texto como "Refresque seus dias na *serra* de Jiquiriçá" entra em modo contentEditable, a palavra "serra" precisa manter sua formatação (cor accent, itálico serif).

Solução: o texto é renderizado com HTML interno, não texto puro. A palavra accent é um `<span>` ou `<em>` com inline styles preservados.

Quando o renderer converte `*serra*` → `<em style="color: #ea580c; font-style: italic; font-family: 'Playfair Display'">serra</em>`, esse HTML é mantido no contentEditable.

Ao salvar, o sistema extrai o texto e reconverte o HTML de volta para a notação com asteriscos:
- `<em class="pgl-accent">serra</em>` → `*serra*`

Regras:
- O contentEditable recebe `dangerouslySetInnerHTML` com o HTML formatado do texto
- Ao salvar (blur/enter/escape), ler o innerHTML e converter de volta pra texto com asteriscos
- O usuário pode digitar novos asteriscos pra criar novos destaques, ou remover os existentes
- Nunca perder a formatação accent durante a edição

### 4. Background SEMPRE transparente

O elemento em edição NÃO pode ter:
- background-color branco ou cinza
- overlay ou backdrop
- caixa/container adicional que não existia antes

O único visual que muda é o outline ao redor do elemento. O background do elemento permanece como renderizado pelo componente (que pode ser transparente, ou a cor de fundo da seção, ou uma imagem).

Isso é especialmente importante no hero, onde o texto está sobre imagem escura. O contentEditable sobre fundo escuro precisa manter text color branco sem adicionar caixa branca.

### 5. Barra de reescrita IA

Quando um texto está em modo edição, aparece uma barra flutuante ABAIXO do elemento editado.

Layout da barra:
- Fundo branco com borda sutil e border-radius, sombra suave (shadow-lg)
- Largura: max-width do elemento editado ou ~500px, o que for menor
- Posição: absolute abaixo do elemento, centralizada horizontalmente
- Z-index alto pra ficar acima de tudo

Conteúdo:
- Input de texto: placeholder "Peça pra IA reescrever seu texto"
- Abaixo: 4 botões pill: "Mais longo" | "Mais curto" | "Mais casual" | "Mais profissional"

Comportamento:
- Ao clicar num botão ou digitar + Enter, chama a API passando:
  - O texto atual do campo
  - A instrução (ex: "Reescreva mais curto")
  - O contexto do negócio (nome, categoria, cidade)
- Enquanto processa: loading state no botão/input
- Quando recebe a resposta: substitui o texto no contentEditable e no Blueprint
- O usuário pode desfazer com Ctrl+Z (manter texto anterior em memória)

A barra desaparece quando o usuário clica fora do elemento (blur).

---

## Toolbar flutuante de seção

### Quando aparece

Ao fazer hover sobre uma seção (não sobre um elemento individual), aparece uma toolbar na parte inferior da seção, centralizada horizontalmente.

### Visual

- Fundo: escuro semi-transparente (bg-gray-900/90) com backdrop-blur
- Border-radius: full (pill shape)
- Padding: compacto (py-2 px-3)
- Sombra: shadow-xl
- Z-index: acima de tudo exceto modals

### Botões (da esquerda pra direita)

1. Ícone brush + "Design" — abre drawer lateral com opções de variante do bloco e background
2. Ícone pencil + "Editar conteúdo" — abre drawer lateral com todos os campos da seção em formulário
3. Separador vertical sutil
4. Seta ↑ — move seção pra cima (troca order com a seção anterior)
5. Seta ↓ — move seção pra baixo (troca order com a próxima)
6. Lixeira — remove seção (com confirmação via popover: "Remover seção?" com "Cancelar" e "Remover")

### Posicionamento

- Position: sticky ou absolute na parte inferior da seção
- Aparece com animação fade-in + translateY de 8px pra 0
- Desaparece quando o mouse sai da seção (com delay de 200ms pra não ficar piscando)

### Interação com edição inline

- Se o usuário está editando um texto inline (contentEditable ativo), a toolbar da seção NÃO aparece — pra não atrapalhar
- A toolbar só aparece em hover quando nenhum elemento está em modo edição

---

## Botão "Adicionar seção"

### Quando aparece

Entre cada seção, ao fazer hover numa zona de ~40px de altura entre elas, aparece o botão.

### Visual

- Botão pill com ícone + e texto "Adicionar seção"
- Background: verde (accent ou success)
- Centralizado horizontalmente
- Aparece com fade-in rápido (150ms)

### Ao clicar

Abre um popover ou modal com lista de blocos disponíveis pra adicionar:
- Grid de opções com ícone + nome + descrição curta
- Filtrado pelo siteType (LOCAL_BUSINESS não mostra "Catálogo", SERVICE_PRICING não mostra "Menu")
- Ao selecionar um bloco, chama a IA pra gerar o conteúdo com contexto do negócio
- A nova seção é inserida na posição correta com o order atualizado

---

## Edição de imagens

### Hover em imagem

- Overlay escuro sutil (bg-black/30) com ícone de câmera centralizado
- Cursor: pointer

### Ao clicar

Abre popup flutuante sobre a imagem (não drawer):

Layout:
- Tabs ou botões no topo: "Ajustar" | "Upload" | "0/5 gerações IA" | "Upgrade"
- Campo de busca: "Buscar ou gerar uma imagem" com botão "Gerar" (ícone sparkle)
- Grid de imagens sugeridas (Unsplash, buscadas pelo nicho)
- Cada imagem é clicável — ao clicar, substitui a imagem no Blueprint
- Botões "Cancel" e "Done" no footer

### Upload

- Drag-and-drop zone
- Ou botão "Escolher arquivo"
- Após upload (via Uploadthing/S3), recebe URL e atualiza o Blueprint

---

## Edição de navegação (header/nav)

### Trigger

Ao fazer hover sobre o nav/header do site, aparece um botão flutuante: "Editar barra de navegação"

### Popup

- Tabs: "Content" | "Design"
- Content:
  - Logo: campo texto com botão Edit (pra trocar nome ou fazer upload de imagem de logo)
  - Navigation links: lista com drag handles pra reordenar
    - Cada link: ícone drag + nome editável + botão Edit (pra mudar href) + botão Delete
  - Botão "+ Adicionar link"
- Design:
  - Estilo do nav (transparente sobre hero vs fundo sólido)
  - Mostrar/esconder botão CTA
  - Mostrar/esconder redes sociais
- Botões: "Cancel" | "Done"

---

## Edição de footer

Mesma lógica do nav.

### Popup

- Tabs: "Content" | "Design"
- Content:
  - Logo/nome
  - Grupos de navegação: lista editável de grupos, cada grupo com links reordenáveis
  - Redes sociais: campos pra Instagram, Facebook, etc
  - Texto de copyright
- Design:
  - Cor do footer (seguir tema ou customizar)
  - Quantidade de colunas
- Botões: "Cancel" | "Done"

---

## Estado global do editor

O editor precisa de um estado global (Context ou Zustand) que controla:

- `editorMode`: "idle" | "editing-text" | "editing-image" | "editing-nav" | "editing-footer"
- `activeElementPath`: string ou null — qual campo do Blueprint está sendo editado
- `activeSectionId`: string ou null — qual seção tem a toolbar visível
- `hoveredSectionId`: string ou null — qual seção o mouse está sobre
- `hoveredElementPath`: string ou null — qual elemento o mouse está sobre
- `blueprint`: o SiteBlueprint completo (source of truth)
- `isDirty`: boolean — se tem alterações não salvas
- `history`: array de snapshots do Blueprint pra undo/redo

Regras de interação entre estados:
- Quando `editorMode` é "editing-text", a toolbar de seção NÃO aparece
- Quando `editorMode` é "editing-text", hover em outros elementos é desabilitado
- Clicar fora de qualquer elemento editável → salva edição atual + volta pra "idle"
- ESC → cancela edição (reverte texto) + volta pra "idle"
- Enter em headline → salva e sai da edição (headlines são single-line)
- Enter em descrição/parágrafo → insere quebra de linha (multi-line)

---

## Performance

- O preview do site NÃO re-renderiza inteiro a cada hover — apenas o outline é controlado via CSS classes toggle
- O contentEditable é ativado/desativado via ref, não via re-render do componente
- A barra de IA só é montada no DOM quando um elemento está em modo edição
- Debounce no salvamento: ao editar texto, salvar no banco apenas 500ms após o último keystroke
- As toolbars flutuantes usam portal (renderizadas fora do fluxo normal) pra não afetar layout

---

## Acessibilidade

- Todos os botões das toolbars têm aria-label
- ESC fecha qualquer popup/edição
- Tab navega entre elementos editáveis
- Focus visible nos elementos em hover/edição
- A barra de IA é acessível via teclado (Tab pra chegar nos botões)

---

## Checklist de qualidade

Antes de considerar a Fase 2 completa, verificar:

- [ ] Hover mostra outline sutil em TODOS os textos editáveis
- [ ] Hover mostra outline em imagens
- [ ] 1 clique ativa edição com cursor na posição exata do clique
- [ ] Background permanece transparente em TODOS os casos (hero escuro, seção clara, seção dark)
- [ ] Palavras accent mantêm cor/estilo durante edição
- [ ] Barra de IA aparece abaixo do texto em edição
- [ ] Botões da barra de IA funcionam (chamam API e atualizam texto)
- [ ] ESC cancela edição, clique fora salva
- [ ] Toolbar de seção aparece no hover da seção
- [ ] Toolbar desaparece quando editando texto inline
- [ ] Botões ↑↓ reordenam seções
- [ ] Botão lixeira remove seção com confirmação
- [ ] Botão "Adicionar seção" aparece entre seções
- [ ] Edição de imagem funciona (upload + Unsplash)
- [ ] Edição de nav funciona (logo, links, reordenar)
- [ ] Preview responsivo (desktop/tablet/mobile) funciona
- [ ] Sem layout shift ao ativar/desativar edição
- [ ] Performance: sem lag ao hover rapidamente sobre múltiplos elementos