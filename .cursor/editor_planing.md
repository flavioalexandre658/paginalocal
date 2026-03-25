# PGL — Editor Visual (estilo Durable)

## O que é

Após o onboarding gerar o site, o usuário cai direto neste editor. O editor mostra o site real renderizado no centro da tela, com ferramentas ao redor pra editar conteúdo, design e configurações — tudo manipulando o JSON Blueprint por baixo.

O princípio: o usuário NUNCA vê JSON. Ele interage visualmente, e cada ação atualiza o Blueprint que o renderer já sabe renderizar.

---

## Estrutura da Tela

```
┌──────────────────────────────────────────────────────────────┐
│  TOP BAR                                                      │
│  [Page: Início ▾]    [Theme] [Colors] [Fonts]   [Preview ▶] [Publicar] │
├────┬─────────────────────────────────────────────────────────┤
│    │                                                          │
│ S  │              SITE PREVIEW (renderizado real)             │
│ I  │                                                          │
│ D  │         O usuário vê o site como ele aparece             │
│ E  │         Clica em elementos pra editar                    │
│ B  │                                                          │
│ A  │         Cada seção tem toolbar flutuante:                │
│ R  │         [Design] [Editar conteúdo] [↑] [↓] [🗑]         │
│    │                                                          │
│    │         Entre seções: botão [+ Adicionar Seção]          │
│    │                                                          │
├────┴─────────────────────────────────────────────────────────┤
```

---

## 1. SIDEBAR ESQUERDA

Coluna fixa estreita (~56px) com ícones de navegação. Igual ao Durable.

**Ícones de cima pra baixo:**
- Home (dashboard do site)
- Website (editor — tela atual, ativa)
- Configurações (settings do site)
- SEO (meta tags, JSON-LD)
- Páginas (gerenciar páginas: home, serviços, sobre, contato)
- Analytics (visitas, cliques — feature futura)

**Na parte de baixo:**
- Ajuda
- Plano atual / Upgrade

Ao clicar em qualquer ícone que não seja "Website", abre um painel ou navega pra outra página do dashboard. O editor em si é a tela "Website".

---

## 2. TOP BAR

Barra horizontal fixa no topo com:

**Esquerda:**
- Seletor de página: dropdown "Page: Início ▾" que lista todas as páginas do Blueprint (Início, Serviços, Sobre, Contato). Ao trocar, o preview renderiza a página selecionada.

**Centro:**
- Botão "Theme" — abre tela de seleção de temas (galeria de templates visuais completos)
- Botão "Colors" — abre popup de paletas de cores
- Botão "Fonts" — abre popup de pares tipográficos

**Direita:**
- Botão "Preview" — abre o site em uma nova aba ou toggle preview mode (sem elementos de edição)
- Toggle Desktop/Tablet/Mobile — 3 ícones pra alternar viewport do preview
- Botão "Publicar" (verde, destaque) — abre painel de publicação

---

## 3. SITE PREVIEW (área central)

É o site real renderizado pelo PageRenderer existente, mas com camada de edição por cima.

### 3.1 Edição inline de texto

Quando o usuário clica em qualquer texto (headline, subtítulo, descrição, CTA), o texto fica editável in-place com borda azul de seleção (como o Durable mostra no hero).

Abaixo do campo de texto editável, aparece uma barra de IA com:
- Campo: "Peça pra IA reescrever seu texto"
- Botões rápidos: "Mais longo" | "Mais curto" | "Mais casual" | "Mais profissional"

Ao clicar num botão ou digitar um pedido, chama a API da IA pra reescrever apenas aquele trecho de texto. O Blueprint é atualizado com o novo texto.

**Como funciona por baixo:**
- Cada texto renderizado tem um atributo identificando o caminho no Blueprint (ex: `pages[0].sections[2].content.title`)
- Ao editar e confirmar, uma Server Action atualiza o campo específico no Blueprint JSON salvo no banco
- O preview re-renderiza em tempo real

### 3.2 Toolbar de seção flutuante

Ao passar o mouse sobre uma seção (ou clicar nela), aparece uma toolbar flutuante na parte inferior da seção, centralizada. Exatamente como o Durable.

**Botões da toolbar:**
- "Design" — abre popup com opções visuais da seção (variante do bloco, background, espaçamento)
- "Editar conteúdo" — abre popup/drawer com todos os campos editáveis daquela seção
- Seta ↑ — move a seção pra cima (reordena no Blueprint)
- Seta ↓ — move a seção pra baixo
- Lixeira — remove a seção (com confirmação)

### 3.3 Botão "Adicionar Seção"

Entre cada seção, ao passar o mouse, aparece um botão verde "+ Adicionar Seção".

Ao clicar, abre um painel com os blocos disponíveis pra adicionar:
- Lista os blockTypes que fazem sentido pro siteType atual
- Cada opção mostra nome + mini-preview/descrição
- Ao selecionar, a IA gera o conteúdo da nova seção baseado no contexto do negócio
- A seção é inserida na posição clicada

### 3.4 Edição de imagens

Ao clicar em qualquer imagem do site, abre um popup (como o Durable):

**Opções:**
- "Ajustar" — crop, reposicionar
- "Upload" — enviar imagem do computador
- Contador de gerações IA: "0/5" (limite por plano)
- Campo de busca: "Buscar ou gerar uma imagem"
- Botão "Gerar" (IA) — gera imagem por IA baseada no contexto
- Grid de imagens sugeridas (Unsplash, baseadas no nicho)
- Ao selecionar, atualiza o campo de imagem no Blueprint

### 3.5 Edição de navegação

Ao clicar no header/nav do site, aparece botão "Editar barra de navegação".

Abre popup com:
- Logo: campo de texto + botão Edit (pra upload de logo)
- Links de navegação: lista com drag handles pra reordenar
  - Cada link tem: nome editável + botão Edit + botão Delete
  - Botão "+ Adicionar link" no final
- Botões Cancel / Done

### 3.6 Edição de footer

Mesma lógica do nav. Ao clicar no footer, abre popup com:
- Logo/nome
- Grupos de navegação (Principal, Serviços, Legal)
  - Cada grupo com links editáveis, reordenáveis, deletáveis
- Redes sociais (ícones editáveis)
- Texto de copyright

---

## 4. POPUPS GLOBAIS (top bar)

### 4.1 Theme (Temas)

Tela cheia (substitui o preview temporariamente) com galeria de temas.

Cada tema é um card com:
- Screenshot/preview do tema aplicado
- Nome do tema
- Botão "Usar este tema" ou badge "Tema atual"

Ao selecionar um tema, o editor aplica os novos designTokens (style, fontPairing, palette) ao Blueprint e re-renderiza o preview. O conteúdo NÃO muda — só o visual.

No PGL, os "temas" são combinações de: style (industrial, elegant, warm, bold, minimal) + fontPairing + palette. Podemos ter 15-20 combinações pré-definidas mostradas como previews visuais.

### 4.2 Colors (Cores)

Popup centralizado sobre o preview mostrando um grid de paletas.

Cada paleta é um card com 3 círculos de cor (primary, secondary, accent).
O fundo do card mostra se a paleta é clara ou escura.

Grid de ~12 paletas pré-definidas, organizadas por tom (escuras, claras, quentes, frias).

Toggle "Personalizar" no topo que, quando ativado, mostra color pickers individuais pra primary, secondary e accent.

Ao selecionar uma paleta, atualiza o `designTokens.palette` no Blueprint. O preview atualiza em tempo real.

### 4.3 Fonts (Tipografia)

Popup centralizado com grid de pares tipográficos.

Cada card mostra:
- O nome da fonte de heading renderizado na própria fonte
- O nome da fonte de body renderizado na própria fonte
- Ex: "Playfair Display / Inter"

Grid de 6-8 opções (os fontPairings do nosso sistema).

Ao selecionar, atualiza o `designTokens.fontPairing` no Blueprint. O preview carrega as novas fontes e re-renderiza.

---

## 5. PAINEL DE PUBLICAÇÃO

Ao clicar em "Publicar" no canto superior direito, abre um painel lateral (à direita, sobre o preview).

**Conteúdo do painel:**
- "Seu domínio": mostra o subdomínio atual (ex: `https://lavacar.paginalocal.com.br`)
  - Botões: copiar URL, editar slug
- Status: "Modo demo — seu site está oculto dos buscadores até publicar"
- Card de upsell: "Pareça profissional com um domínio personalizado" + botão "Adicionar domínio" (leva pra upgrade/configuração)
- Botão grande: "Publicar site"

Ao publicar:
- Free: publica no subdomínio com marca PGL no footer
- Pago: publica no subdomínio E no domínio customizado (se configurado)

---

## 6. DRAWER DE EDIÇÃO DE CONTEÚDO

Quando o usuário clica em "Editar conteúdo" na toolbar da seção, abre um drawer lateral (à direita) com os campos da seção.

O drawer mostra campos diferentes baseado no blockType:

**Hero:**
- Headline (textarea)
- Subheadline (textarea)
- Texto do CTA primário
- Link do CTA
- Texto do CTA secundário
- Imagem de fundo (thumbnail + botão trocar)

**Services:**
- Título da seção
- Subtítulo
- Lista de serviços (cada um com: nome, descrição, preço, CTA)
- Botão "+ Adicionar serviço"
- Drag handles pra reordenar

**About:**
- Título
- Subtítulo
- Parágrafos (textareas)
- Highlights (valor + label, editáveis)
- Imagem (thumbnail + trocar)

**Testimonials:**
- Título
- Lista de depoimentos (texto, autor, nota, cargo)
- Botão "+ Adicionar depoimento"

**FAQ:**
- Título
- Subtítulo
- Lista de perguntas (pergunta + resposta)
- Botão "+ Adicionar pergunta"
- Drag handles pra reordenar

**Contact:**
- Título
- Subtítulo
- Endereço
- Telefone
- WhatsApp
- Toggle: mostrar formulário
- Toggle: mostrar mapa

**Pricing:**
- Título
- Lista de planos (nome, preço, descrição, features, destacado sim/não)
- Botão "+ Adicionar plano"

**Gallery:**
- Título
- Grid de imagens com botão de trocar/remover cada uma
- Botão "+ Adicionar imagem"

**Hours:**
- Título
- Campos por dia da semana (editáveis)
- Nota

**CTA:**
- Título
- Subtítulo
- Texto do botão
- Link do botão

Cada campo, ao ser editado e perder foco (ou ao clicar "Salvar"), atualiza o Blueprint no banco via Server Action. O preview re-renderiza em tempo real.

---

## 7. DRAWER DE DESIGN DA SEÇÃO

Quando o usuário clica em "Design" na toolbar da seção, abre um drawer lateral com opções visuais:

- Variante do bloco: grid de mini-previews com as variantes disponíveis (ex: hero variant 1, 2, 3, 4, 5). Ao selecionar, troca a variante no Blueprint.
- Background: opções de fundo (transparente, surface, primary/dark). Quando a seção muda pra dark, textos invertem automaticamente.
- Visibilidade: toggle pra mostrar/esconder a seção sem deletar.

---

## 8. PREVIEW RESPONSIVO

No top bar, os 3 ícones de viewport (desktop/tablet/mobile):

- Desktop: preview ocupa toda a área central (~100% width)
- Tablet: preview fica num container centralizado de ~768px com fundo cinza ao redor
- Mobile: preview fica num container de ~375px centralizado, com moldura simulando celular

O site renderizado é o mesmo — só muda o width do container. Como os componentes são responsivos com Tailwind, o layout se adapta automaticamente.

---

## 9. FLUXO PÓS-ONBOARDING

```
Onboarding completo
       ↓
Tela "Gerando seu site..." (loading 30s)
       ↓
Redirect direto pro Editor com o site já renderizado
       ↓
Preview mode: primeiro acesso mostra o site sem overlays por 3 segundos
       ↓
Overlays aparecem suavemente (toolbars, sidebar, top bar)
       ↓
Toast/tooltip: "Clique em qualquer texto pra editar"
```

O usuário já vê o site pronto e pode começar a editar imediatamente. Não passa por dashboard, não passa por tela de "site criado", vai direto pra ação.

---

## 10. COMO O EDITOR MANIPULA O BLUEPRINT

Toda edição no editor é uma atualização cirúrgica no JSON Blueprint:

**Editar texto:**
Atualiza `blueprint.pages[pageIndex].sections[sectionIndex].content.title` (ou qualquer campo de texto)

**Reordenar seção:**
Atualiza os campos `order` das seções envolvidas

**Remover seção:**
Remove o objeto da array `sections` ou seta `visible: false`

**Adicionar seção:**
Chama a IA pra gerar o conteúdo da nova seção e insere no array `sections` com o `order` correto

**Trocar variante:**
Atualiza `blueprint.pages[pageIndex].sections[sectionIndex].variant`

**Trocar paleta:**
Atualiza `blueprint.designTokens.palette`

**Trocar fonte:**
Atualiza `blueprint.designTokens.fontPairing`

**Trocar tema:**
Atualiza `blueprint.designTokens` inteiro (style + palette + fontPairing + borderRadius)

**Trocar imagem:**
Faz upload via Uploadthing/S3, recebe URL, atualiza o campo de imagem no Blueprint

**Publicar:**
Seta flag `published: true` na store e configura DNS/rota do subdomínio

Todas as atualizações são via Server Actions tipadas com Zod. O Blueprint sempre é validado antes de salvar.

---

## 11. ORDEM DE IMPLEMENTAÇÃO

**Fase 1 — Editor básico (essencial)**
- Layout: sidebar + top bar + preview central
- Seletor de página
- Toolbar de seção (reordenar, deletar, visibilidade)
- Drawer de edição de conteúdo (campos por blockType)
- Salvar alterações no Blueprint via Server Action

**Fase 2 — Edição visual**
- Edição inline de texto (clicar no texto pra editar)
- Edição de imagens (popup com upload + Unsplash)
- Edição de nav e footer
- Preview responsivo (desktop/tablet/mobile)

**Fase 3 — Personalização global**
- Popup de Colors (paletas pré-definidas + customizar)
- Popup de Fonts (pares tipográficos)
- Tela de Themes (galeria de temas)
- Adicionar seção (com geração IA do conteúdo)

**Fase 4 — Publicação e IA**
- Painel de publicação (subdomínio + domínio custom)
- Reescrita de texto por IA (botões "mais curto", "mais casual", etc)
- Geração de imagem por IA (feature futura, gated por plano)
- Site settings (published/unpublished, SEO visibility)

**Fase 5 — Polish**
- Animação de entrada no primeiro acesso (preview → overlays)
- Tooltips de onboarding ("clique pra editar")
- Undo/redo (histórico de alterações no Blueprint)
- Autosave com debounce