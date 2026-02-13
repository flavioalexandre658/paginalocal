# Template de Design - Guia de Modernização dos Sites

Este documento analisa 18 screenshots de templates modernos fornecidos como inspiração e documenta exatamente como replicar esses padrões de design nas seções existentes do site. O objetivo é manter a mesma estrutura de seções, mas elevar significativamente o nível visual para um padrão profissional e diferenciado.

---

## Índice

1. [Análise dos Templates de Inspiração](#1-análise-dos-templates-de-inspiração)
2. [Padrões de Design Extraídos](#2-padrões-de-design-extraídos)
3. [Guia Seção por Seção](#3-guia-seção-por-seção)
4. [Novos Componentes CSS/Animações](#4-novos-componentes-cssanimações)
5. [Prioridade de Implementação](#5-prioridade-de-implementação)

---

## 1. Análise dos Templates de Inspiração

### Template A — Agência Digital (Imagens 1-7) - Tema Azul

**Imagem 1 - Hero da Agência:**
- Fundo com gradiente azul forte (de `#3b82f6` para `#1d4ed8`) — não é sutil, é BOLD
- Logo no topo com ícone + texto branco
- Ilustração grande (laptop com foguete) centralizada acima do texto
- Tipografia gigante e bold: "VOCÊ ESTÁ PRONTO?" em branco, `font-extrabold`, tamanho estimado `text-5xl` a `text-6xl`
- Subtítulo em peso normal com palavra em **negrito** ("decolar!")
- Botão CTA "Sobre nos" com fundo branco, texto azul, `rounded-full`, padding generoso `px-8 py-3`
- Efeito visual: elementos gráficos flutuantes (ícones de dinheiro, gráficos) ao redor da ilustração

**Imagem 2 - Stats Counter:**
- Fundo sólido azul (`#2563eb`) — seção inteira colorida
- 4 métricas empilhadas verticalmente (layout mobile)
- Número em tipografia gigante `text-5xl font-extrabold text-white`
- Label abaixo do número em `text-sm font-medium text-white/80` com espaçamento menor
- Sem bordas ou cards — números diretamente sobre o fundo colorido
- Exemplos: "648 Clientes Satisfeitos", "12 Anos de Experiência", "37 Projetos Finalizados", "434 Prêmios Recebidos"

**Imagem 3 - Seção Habilidades (About):**
- Fundo branco com layout de duas áreas: ilustração + texto
- Badge de categoria: "Nossas Habilidades" em texto azul pequeno (`text-primary font-semibold text-sm`)
- Título grande e impactante com palavras em **negrito** e UPPERCASE: "Criamos campanhas **exclusivas** que ajudam sua empresa a **CRESCER!**"
- Tamanho do título: `text-3xl md:text-4xl font-bold`
- Palavras de destaque em `font-extrabold` com cor diferente ou peso extra
- Parágrafo de suporte em cinza `text-slate-500`
- Botão CTA "Sobre nós" com fundo azul, texto branco, `rounded-full`
- Ilustração: imagem vetorial colorida à esquerda com elementos decorativos (moedas, funil, personagens)

**Imagem 4 - Seção Serviços (Cards):**
- Subtítulo: "Resolvemos problemas reais!" em `text-primary font-semibold`
- Título: "O que podemos fazer por você?" em `text-3xl font-extrabold text-slate-900`
- Cards individuais com:
  - Borda arredondada `rounded-2xl` com `border border-slate-200`
  - Sombra suave `shadow-md`
  - Ícone temático no topo (linha/outline style, cor azul) — tamanho grande ~48px
  - Nome do serviço em `font-bold text-lg text-slate-900`
  - Badge "NOVO" ao lado: `bg-slate-900 text-white text-xs font-bold rounded-full px-3 py-1`
  - Descrição em `text-slate-500 text-sm`
  - Link "Saiba mais ▸" em `text-primary font-medium text-sm` com seta
- Layout: grid `md:grid-cols-2` com gap generoso

**Imagem 5 - Mais Cards + Barras de Progresso:**
- Continuação dos cards de serviço (Web Design, Estratégia) — mesmo padrão da imagem 4
- **Seção de Skills com Progress Bars:**
  - Badge: "Nossas Habilidades" em azul
  - Título bold: "Somos Excelentes no que fazemos!"
  - Parágrafo de suporte em cinza
  - 3 barras de progresso:
    - Label à esquerda: "Campanhas Publicitárias" em `font-medium text-slate-700`
    - Porcentagem à direita: "84%" em `font-bold`
    - Barra com fundo `bg-slate-200 rounded-full h-3`
    - Preenchimento com gradiente azul para ciano: `bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full`
    - Largura animada com CSS transition/animation
  - Exemplos: Campanhas 84%, Estratégias 75%, Web Design 95%

**Imagem 6 - CTA + Logos de Parceiros:**
- **Seção CTA:**
  - Título UPPERCASE gigante: "DESIGN & CRIATIVIDADE!" em `text-4xl font-extrabold text-slate-900`
  - Parágrafo descritivo em cinza
  - Botão "Entre em contato" com borda: `border-2 border-slate-900 rounded-full px-8 py-3 font-semibold` (estilo outline)
- **Logos de parceiros:**
  - Logos em escala de cinza (grayscale filter) dispostos em linha
  - Opacidade reduzida: `opacity-50 grayscale`
  - Hover: `hover:opacity-100 hover:grayscale-0` para colorir
  - Layout: `flex items-center justify-center gap-8 flex-wrap`

**Imagem 7 - Depoimento + Footer:**
- **Depoimento centralizado:**
  - Avatar circular grande (80-96px) centralizado no topo
  - Texto do depoimento em *itálico* (`italic text-lg leading-relaxed`)
  - Nome do autor: "José Augusto" em `font-bold`
  - Subtítulo: "Web Designer | Videomaker Pro" em `text-sm text-slate-500`
  - 5 estrelas douradas em linha (`text-amber-400 fill-amber-400`)
- **Footer com gradiente azul:**
  - Fundo com gradiente forte azul (como o hero)
  - 3 colunas: Serviços | Nossa Empresa | Contato
  - Título de coluna em `font-bold text-white text-base`
  - Links em `text-white/70 hover:text-white text-sm`
  - Logo da empresa centralizado abaixo
  - Texto institucional em `text-white/60 text-sm italic`
  - Ícones sociais (câmera, play) em círculos com borda branca
  - Copyright no rodapé: `text-white/50 text-xs`

---

### Template B — Landing Page de Produto (Imagens 8-13) - Tema Dark/White

**Imagem 8 - Hero Dark com Produto:**
- Fundo totalmente preto `bg-black`
- Navbar: logo branco à esquerda, links de navegação ao centro, botão "contato" outline à direita
- Título do produto em tipografia BOLD extrema: "AIRPHONE" em `text-6xl font-black text-white tracking-tight`
- Palavra destaque "PRO" com borda/outline: `border-2 border-white px-4 py-1` (text stroke effect)
- Descrição em `text-white/70 text-base leading-relaxed`
- Botão CTA: `bg-blue-500 text-white rounded-lg px-8 py-4 font-semibold text-lg`
- Imagem do produto grande, flutuante, com sombra drop-shadow
- Indicador de slide (dots) no bottom

**Imagem 9 - Grid de Features com Ícones:**
- Fundo branco limpo
- Título BOLD centralizado: "VOCÊ NUNCA OUVIU NADA ASSIM." em `text-4xl font-black text-slate-900 tracking-tight`
- Grid 3x2 de features:
  - Ícone grande centralizado (~48-64px), estilo linha, cor preta
  - Texto descritivo abaixo em `text-sm text-slate-500 text-center leading-relaxed`
  - Sem cards/bordas — apenas ícone + texto sobre fundo branco
  - Separação por espaçamento generoso `gap-12`
- Layout: `grid grid-cols-3 gap-12 max-w-4xl mx-auto`

**Imagem 10 - Showcase com Anotações:**
- Imagem grande do produto à esquerda
- Pontos de anotação (`annotation dots`) conectados a textos explicativos à direita
- Dots: círculo com borda `border-2 border-slate-400 rounded-full h-4 w-4` + ponto interno
- Textos das anotações em `text-sm text-slate-600 leading-relaxed`
- Linhas conectoras sutis (pode ser feito com CSS borders ou SVG)
- Layout assimétrico: imagem ocupa ~50%, anotações em coluna à direita

**Imagem 11 - Vista Explodida do Produto:**
- Imagens múltiplas do produto (estojo, ear tip, driver, fone completo)
- Textos descritivos posicionados relativamente às imagens
- Layout criativo com posicionamento absoluto/relativo
- Tipografia: `text-sm text-slate-600` para descrições, `font-bold` para subtítulos
- Fundo branco com bastante espaço negativo

**Imagem 12 - Seções Dark com Stats:**
- **Seção Bateria (dark bg):**
  - Subtítulo: "Bateria eficiente!" em `text-sm text-slate-400 italic`
  - Título BOLD: "CARREGUE SEM FIO, USE SEM PARAR." em `text-3xl font-black text-white`
  - Descrição em `text-slate-400`
  - Imagem do produto à esquerda
  - **Stats em grid 1x3:**
    - Número grande: "24h" em `text-4xl font-black text-white`
    - Descrição curta em `text-xs text-slate-400`
    - Sem bordas entre os stats, separação por espaçamento
- **Seção Frete (dark bg):**
  - Subtítulo italic: "Envio nacional"
  - Título BOLD: "FRETE GRÁTIS PARA TODO BRASIL"
  - Badge numérica: "2+" em `bg-blue-500 text-white rounded-full h-8 w-8 font-bold`
  - Imagem do produto com embalagem

**Imagem 13 - Checklist de Features:**
- Fundo branco
- Título BOLD: "MUITO MAIS QUE UM FONE!" em `text-3xl font-black`
- Descrição em `text-slate-500`
- Lista de checkmarks centralizada:
  - Cada item: texto + ícone de check azul `text-blue-500` à direita
  - Texto em `text-sm font-medium text-slate-700`
  - Check icon: `IconCircleCheck` ou similar, preenchido azul
  - Espaçamento: `space-y-3`
  - Items como: "Conexão Automática ✓", "Preço Super Acessível ✓", "Melhor Qualidade de Áudio ✓"
- Imagem do produto + estojo à direita

---

### Template C — FAQ e CTA (Imagens 14-15)

**Imagem 14 - FAQ Dark + Footer Completo:**
- **FAQ:**
  - Fundo dark `bg-slate-900`
  - Título split: "DÚVIDAS & PERGUNTAS" em `text-slate-400 text-lg tracking-wider` + "FREQUENTES" em `text-5xl font-black text-white`
  - Accordion com fundo escuro, perguntas bold, respostas em texto normal
- **Footer profissional (dark):**
  - 3 colunas: Info da empresa | Fale Conosco | Entrega Garantida
  - Botões de ação: "Whatsapp" (azul), "Rastrear Pedido" (verde)
  - Ícones de confiança: "Compra Segura", "Satisfação Garantida", "Privacidade Protegida"
  - Bandeiras de pagamento: Visa, PayPal, Mastercard, Cielo, etc.
  - Aviso legal em texto pequeno
  - Copyright

**Imagem 15 - FAQ Light + CTA de Contato:**
- **FAQ:**
  - Fundo cinza claro `bg-slate-50`
  - Título com destaque: "Ainda com alguma **dúvida**?" — palavra "dúvida" em `text-primary font-bold`
  - Subtítulo: "leia nossas **perguntas frequentes**" com link em azul
  - Accordion limpo:
    - Items com `border-b border-slate-200` (sem card, apenas linhas)
    - Pergunta em `font-medium text-slate-700`
    - Ícone `+`/`-` à direita em azul quando aberto
    - Item ativo: borda esquerda azul `border-l-4 border-primary` + pergunta em azul
    - Resposta em `text-slate-500 text-sm`
- **CTA "Ainda com dúvida":**
  - Fundo `bg-slate-100` com `rounded-2xl`
  - Layout 2 colunas: texto à esquerda, ilustração à direita
  - Título bold: "Ainda com dúvida sobre nossos planos?"
  - Palavra em destaque bold: "GreatPages"
  - 2 botões lado a lado:
    - "Falar com Consultor" — `bg-amber-500 text-white rounded-full px-6 py-3`
    - "Central de Ajuda" — `bg-slate-700 text-white rounded-full px-6 py-3`

---

### Template D — SaaS/App (Imagens 16-18) - Tema Teal/Verde

**Imagem 16 - Hero SaaS:**
- Fundo sólido teal/verde `bg-teal-500` (#14b8a6 ou similar)
- Navbar: logo branco, links de navegação, botão "Teste Grátis" outline branco
- Layout 2 colunas: texto à esquerda, ilustração à direita
- Título: "Fique conectado com seus amigos!" em `text-4xl font-bold text-white`
- Descrição em `text-white/80`
- Botão CTA: `bg-amber-500 text-white rounded-full px-8 py-4 font-semibold shadow-lg`
- Texto de urgência: "Experimente gratuitamente por 14 dias." em `italic font-semibold text-white`
- Subtexto: "Sem risco e sem necessidade de cartão de crédito." em `italic text-white/70`
- **Barra de logos de parceiros:**
  - Fundo branco, sombra sutil no topo
  - Logos em escala de cinza, alinhados horizontalmente
  - Nomes: BLACKFOREST, INVENTOR, MONDIAL, SEA TEAM, PLAYSTAR
  - Layout: `flex items-center justify-between px-12`

**Imagem 17 - Stats com Porcentagens:**
- Fundo branco
- Título em itálico e bold teal: "Aplicativo mais rápido e poderoso" em `italic font-bold text-teal-500`
- Descrição em cinza
- 4 stats em linha:
  - Número com `%`: "43%" em `text-5xl font-black text-teal-500`
  - Label abaixo: "Mais Rápido" em `text-sm font-semibold text-slate-500`
- Layout: `grid grid-cols-4 gap-8 text-center`

**Imagem 18 - Features Alternadas + Lista de Features:**
- **Seções de features alternadas:**
  - Seção 1: Ilustração à esquerda, texto à direita
  - Seção 2: Texto à esquerda, ilustração à direita
  - Layout: `grid md:grid-cols-2 gap-12 items-center`
  - Título: `text-2xl font-bold text-teal-500`
  - Descrição em cinza
  - Botão "Saiba Mais!" em `bg-amber-500 text-white rounded-full`
- **Lista de features com ícones:**
  - Imagem/gráfico à esquerda (pizza chart)
  - Lista de 3 items à direita:
    - Ícone circular + título bold + descrição
    - Títulos: "Melhor suporte", "Segurança", "Design Incrível"
    - Ícone: círculo com ícone outline em teal
    - Layout vertical: `space-y-6`

---

## 2. Padrões de Design Extraídos

Estes são os padrões visuais recorrentes encontrados nos templates de inspiração que devem ser aplicados nas nossas seções.

### REGRAS FUNDAMENTAIS (devem ser respeitadas em TODAS as seções)

#### Regra 1 — Largura Máxima Consistente

Todas as seções do site DEVEM usar a mesma largura máxima de conteúdo: `max-w-4xl` (896px).

```tsx
// Estrutura padrão de TODA seção:
<section className="...">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-4xl">
      {/* TODO conteúdo: header, cards, grid, etc */}
    </div>
  </div>
</section>
```

Regras:
- O wrapper `mx-auto max-w-4xl` DEVE envolver todo o conteúdo de cada seção (título + corpo)
- NUNCA usar `max-w-5xl`, `max-w-6xl` ou sem max-width no conteúdo
- Os grids de cards (2 colunas) devem ficar DENTRO do `max-w-4xl`
- Isso garante alinhamento visual perfeito entre todas as seções da página

#### Regra 2 — Alternância de Fundos entre Seções

Seções consecutivas NUNCA devem ter o mesmo fundo. As 3 cores de fundo permitidas são:

1. **Branco** — `bg-white` (ou o gradient sutil atual com `from-slate-50 via-white to-slate-50`)
2. **Cinza claro** — `bg-[#f3f5f7]`
3. **Cor primária da store** — `bg-primary` (fundo cheio na cor da loja)

Padrão de alternância: se a seção anterior é branca, a próxima DEVE ser `#f3f5f7` ou `primary`. Nunca duas seções brancas seguidas, nunca duas cinzas seguidas.

Ordem fixa das seções e sugestão de fundo:
```
HeroSection         → próprio fundo (heroBackgroundColor)
AboutSection        → branco
ServicesSection     → #f3f5f7
GallerySection      → branco
AreasSection        → #f3f5f7 ou primary
TestimonialsSection → branco
FAQSection          → #f3f5f7
ContactSection      → branco
SiteFooter          → dark/primary gradient
```

Como algumas seções são condicionais, a regra é: **olhe a seção anterior renderizada e alterne**.

#### Regra 3 — Contraste de Texto em Fundo Colorido

Quando uma seção usa `bg-primary` como fundo:
- Se a cor primária for **escura** → texto em `text-white`, subtexto em `text-white/70`
- Se a cor primária for **clara** → texto em `text-slate-900`, subtexto em `text-slate-600`
- Usar `isLightColor()` de `@/lib/color-contrast` para determinar automaticamente

Para elementos que precisam de contraste interno (como cards brancos dentro de fundo primary):
```tsx
// Seção com fundo primary + card branco interno (ver imagem 3 de referência)
<section className="bg-primary py-20">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-4xl">
      {/* Card branco flutuante dentro do fundo colorido */}
      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl">
        {/* Conteúdo com cores normais (slate-900, primary, etc) */}
      </div>
    </div>
  </div>
</section>
```

#### Regra 4 — Cores Sempre do Schema da Store

- NUNCA usar cores fixas como `blue-500`, `emerald-500`, `teal-500`, `amber-500` para elementos de destaque
- SEMPRE usar `primary` (que vem de `var(--primary)` injetada pelo layout via `store.primaryColor`)
- Cores fixas permitidas: neutras (`slate`, `white`, `black`, `#f3f5f7`) e semáforos (`red-400` para "Fechado", `amber-400` para estrelas)

### 2.1 Tipografia Bold e Impactante

**Padrão atual:** `text-2xl font-semibold` / `text-3xl font-semibold`
**Novo padrão:** `text-4xl font-extrabold tracking-tight` / `text-5xl font-black`

```tsx
// ANTES (atual)
<h2 className="text-2xl font-semibold text-slate-900 md:text-3xl">
  Serviços de {category} em {city}
</h2>

// DEPOIS (novo)
<h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
  Serviços de <span className="text-primary">{category}</span> em {city}
</h2>
```

Regras:
- Títulos principais: `font-extrabold` ou `font-black`, nunca `font-semibold`
- Pelo menos uma palavra colorida com `text-primary` no título
- Tamanhos maiores: mobile `text-3xl`, tablet `md:text-4xl`, desktop `lg:text-5xl`
- Tracking apertado: `tracking-tight` para títulos grandes
- Subtítulos acima do título: `text-sm font-semibold text-primary uppercase tracking-wider`

### 2.2 Seções com Fundo Alternado

**Ver Regra 2 e Regra 3 acima para as regras completas de alternância e contraste.**

As 3 opções de fundo e como implementar:

```tsx
// Opção 1: Branco (com decorative elements opcionais)
<section className="relative py-20 md:py-28 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
  {/* conteúdo */}
</section>

// Opção 2: Cinza claro
<section className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7]">
  {/* conteúdo — textos normais slate-900/slate-500 */}
</section>

// Opção 3: Cor primária (full bleed) com card branco interno
<section className="bg-primary py-20 md:py-28">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-xl">
        {/* conteúdo com cores normais */}
      </div>
    </div>
  </div>
</section>

// Opção 3b: Cor primária com texto direto (sem card)
<section className="bg-primary py-20 md:py-28">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-4xl text-white">
      {/* texto em branco/white para contraste */}
    </div>
  </div>
</section>
```

### 2.3 Cards de Serviço Modernos

**Padrão atual:** Cards com glassmorphism (`bg-white/70 backdrop-blur-sm`), ícone Check genérico
**Novo padrão:** Cards limpos com ícone temático grande, borda mais definida, badge opcional

```tsx
<div className="group rounded-2xl border-2 border-slate-100 bg-white p-8 shadow-sm
  transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-2">
  {/* Ícone temático grande */}
  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl
    bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white">
    <IconBrush className="h-8 w-8" />
  </div>

  {/* Nome com badge opcional */}
  <div className="mb-3 flex items-center gap-2">
    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
    {isNew && (
      <span className="rounded-full bg-slate-900 px-3 py-0.5 text-xs font-bold text-white">
        NOVO
      </span>
    )}
  </div>

  {/* Descrição */}
  <p className="mb-4 text-slate-500 leading-relaxed">{description}</p>

  {/* Link */}
  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary
    transition-all group-hover:gap-2">
    Saiba mais
    <IconChevronRight className="h-4 w-4" />
  </span>
</div>
```

Regras:
- Borda mais visível: `border-2 border-slate-100` (não `border-slate-200/60`)
- Ícone grande temático (não um Check genérico)
- Hover mais pronunciado: `hover:-translate-y-2 hover:shadow-xl`
- Ícone muda de cor no hover: `group-hover:bg-primary group-hover:text-white`
- Remover glassmorphism: usar `bg-white` sólido

### 2.4 Bento Grid — Layout de Features/Serviços Assimétrico

**Inspiração:** Imagem de referência "Funcionalidades que ampliam sua criatividade"

Design pattern sofisticado para exibir features/serviços em um grid assimétrico (estilo "bento box") onde os items têm tamanhos variados, criando dinamismo visual. Muito mais impactante que um grid uniforme de cards.

**Estrutura geral:**

```
┌──────────────────────────────────────────────┐
│  Header: Título bold + subtítulo             │
├──────────────────────────────────────────────┤
│  Badge de Categoria   Descrição da categoria │
├───────────────┬──────────────────────────────┤
│               │  Card pequeno (1x1)          │
│  Card grande  ├──────────────────────────────┤
│  (1x2)        │  Card pequeno (1x1)          │
│  com imagem   │                              │
├───────────────┴──────────────────────────────┤
│  Badge de Categoria   Descrição da categoria │
├──────────────────────┬───────────────────────┤
│  Card (1x1)          │  Card (1x1)           │
├──────────────────────┼───────────────────────┤
│  Card largo (2x1)    │  Card (1x1)           │
├──────────────────────┴───────────────────────┤
│  Card full width (banner/CTA)                │
└──────────────────────────────────────────────┘
```

**Componentes do layout:**

1. **Header da seção:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     Funcionalidades que <span className="font-black text-primary">ampliam sua criatividade</span>
   </h2>
   <p className="mt-4 text-lg text-slate-500">Descrição de apoio</p>
   ```

2. **Badge de sub-categoria:**
   ```tsx
   <div className="mb-8 flex items-center gap-4">
     <span className="shrink-0 rounded-full border-2 border-primary px-5 py-1.5 text-sm font-semibold text-primary">
       GERAÇÃO
     </span>
     <p className="text-sm text-slate-500">
       Descrição curta da categoria
     </p>
   </div>
   ```

3. **Grid bento com CSS Grid:**
   ```tsx
   <div className="grid gap-4 md:grid-cols-3 md:auto-rows-[minmax(200px,auto)]">
     {/* Card grande — ocupa 1 col, 2 rows */}
     <div className="md:row-span-2 rounded-2xl border-2 border-slate-100 bg-white p-6 overflow-hidden">
       <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-xl bg-slate-50">
         <Image ... />
       </div>
       <h3 className="text-lg font-bold text-slate-900">Título</h3>
       <p className="mt-2 text-sm text-slate-500">Descrição...</p>
     </div>

     {/* Card normal — 1 col, 1 row */}
     <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 flex flex-col justify-between">
       <div>
         <h3 className="text-lg font-bold text-slate-900">Título</h3>
         <p className="mt-2 text-sm text-slate-500">Descrição</p>
       </div>
       <div className="mt-4 flex justify-end">
         {/* Ícone decorativo ou ilustração */}
         <IconDiamond className="h-12 w-12 text-primary/20" />
       </div>
     </div>

     {/* Card com destaque/CTA */}
     <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
       <h3 className="text-xl font-extrabold text-slate-900">
         Otimize com IA agora!
       </h3>
     </div>

     {/* Card largo — ocupa 2 cols */}
     <div className="md:col-span-2 rounded-2xl border-2 border-slate-100 bg-white p-6 flex items-center gap-6">
       <div className="flex-1">
         <h3 className="text-lg font-bold text-slate-900">Título</h3>
         <p className="mt-2 text-sm text-slate-500">Descrição</p>
       </div>
       <div className="shrink-0">
         {/* Imagem ou ilustração */}
       </div>
     </div>

     {/* Card full width com CTA */}
     <div className="md:col-span-3 rounded-2xl border-2 border-slate-100 bg-white p-6 flex items-center justify-between">
       <div>
         <h3 className="font-bold text-slate-900">Título</h3>
         <p className="text-sm text-slate-500">Descrição</p>
       </div>
       <Button className="rounded-full bg-primary px-6">Ação</Button>
     </div>
   </div>
   ```

**Regras do Bento Grid:**
- Grid base: `grid gap-4 md:grid-cols-3`
- Altura das linhas: `md:auto-rows-[minmax(200px,auto)]` para altura mínima uniforme
- Cards grandes: `md:row-span-2` (ocupa 2 linhas) ou `md:col-span-2` (ocupa 2 colunas)
- Cards normais: 1x1 (padrão, sem span)
- Cards full-width: `md:col-span-3`
- Todos os cards: `rounded-2xl border-2 border-slate-100 bg-white p-6`
- Cards de destaque: `border-primary/20 bg-primary/5` para diferenciação visual
- Ícones/ilustrações decorativas: `text-primary/20` como decoração de canto
- Imagens dentro dos cards: `rounded-xl overflow-hidden` com aspect ratio definido
- Hover: `hover:border-primary/30 hover:shadow-lg transition-all duration-300`
- Cada card pode conter: imagem + título + descrição, ou ícone + título + descrição, ou título + CTA

**Quando usar:**
- Quando há muitos serviços/features (6+) e um grid uniforme ficaria monótono
- Quando se deseja destacar 1-2 items como maiores/mais importantes
- Pode ser usado como alternativa ao grid 2x2 uniforme do ServicesSection

### 2.5 Progress Bars / Barras de Habilidade

Novo componente que não existe atualmente. Pode ser usado na AboutSection ou como subseção.

```tsx
<div className="space-y-6">
  {skills.map((skill) => (
    <div key={skill.name}>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-slate-700">{skill.name}</span>
        <span className="text-sm font-bold text-primary">{skill.percentage}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60
            transition-all duration-1000 ease-out"
          style={{ width: `${skill.percentage}%` }}
        />
      </div>
    </div>
  ))}
</div>
```

### 2.5 Stats Counter

Seção de números grandes com fundo colorido. Usar counters animados.

```tsx
<section className="bg-primary py-16 md:py-20">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-4xl font-black text-white md:text-5xl">
            {stat.value}{stat.suffix}
          </div>
          <div className="mt-2 text-sm font-medium text-white/80">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 2.6 Subtítulos de Seção (Section Badges)

**Padrão atual:** Badge pill com ícone
**Novo padrão:** Texto simples colorido uppercase OU badge mais sofisticado

```tsx
// Opção A: Texto simples (como template agência)
<span className="text-sm font-semibold uppercase tracking-wider text-primary">
  Nossos Serviços
</span>

// Opção B: Badge com underline
<span className="relative inline-block text-sm font-semibold text-primary">
  Nossos Serviços
  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary/30 rounded-full" />
</span>
```

### 2.7 Depoimentos Centralizados

**Padrão atual:** Grid de cards lado a lado
**Novo padrão:** Carrossel com depoimento grande centralizado

```tsx
<div className="mx-auto max-w-2xl text-center">
  {/* Avatar grande */}
  <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full ring-4 ring-primary/20">
    <Image src={avatar} alt={name} fill className="object-cover" />
  </div>

  {/* Quote em itálico */}
  <blockquote className="mb-6 text-lg italic leading-relaxed text-slate-600 md:text-xl">
    "{content}"
  </blockquote>

  {/* Nome do autor */}
  <p className="text-lg font-bold text-slate-900">{name}</p>
  <p className="text-sm text-slate-500">{role}</p>

  {/* Estrelas */}
  <div className="mt-3 flex items-center justify-center gap-1">
    {[...Array(5)].map((_, i) => (
      <IconStar key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
    ))}
  </div>
</div>
```

### 2.8 FAQ com Destaque Visual

**Padrão atual:** Accordion com glassmorphism e ícone chevron rotativo
**Novo padrão (inspirado imagem 15):** Accordion limpo com borda lateral quando ativo

```tsx
<div className={cn(
  'border-b border-slate-200 transition-all',
  isOpen && 'border-l-4 border-l-primary bg-primary/5'
)}>
  <button className="flex w-full items-center justify-between px-6 py-5 text-left">
    <h3 className={cn(
      'font-semibold transition-colors',
      isOpen ? 'text-primary' : 'text-slate-700'
    )}>
      {question}
    </h3>
    <span className={cn(
      'text-2xl font-light transition-all',
      isOpen ? 'text-primary rotate-0' : 'text-slate-400'
    )}>
      {isOpen ? '−' : '+'}
    </span>
  </button>
  {/* resposta animada */}
</div>
```

### 2.9 CTA Section (Call to Action)

Seção final antes do footer com apelo forte para contato.

```tsx
<section className="bg-slate-50 py-16 md:py-20">
  <div className="container mx-auto px-4">
    <div className="mx-auto max-w-4xl rounded-3xl bg-primary/5 p-8 md:p-12">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900 md:text-3xl">
            Ainda com dúvida?
          </h2>
          <p className="mb-6 text-slate-500">
            Entre em contato conosco pelo WhatsApp!
          </p>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-primary px-8">Falar pelo WhatsApp</Button>
            <Button variant="outline" className="rounded-full px-8">Ligar agora</Button>
          </div>
        </div>
        {/* Ilustração ou ícone decorativo à direita */}
      </div>
    </div>
  </div>
</section>
```

### 2.10 Footer com Gradiente

**Padrão atual:** Footer com fundo branco/cinza claro
**Novo padrão (inspirado imagens 7, 14):** Footer com fundo gradiente da cor primária

```tsx
<footer className="bg-gradient-to-b from-primary/90 to-primary pt-12 pb-6 text-white">
  <div className="container mx-auto px-4">
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
      {/* Colunas com links em text-white/70 */}
    </div>
    <div className="mt-10 border-t border-white/20 pt-6">
      {/* Social icons + copyright */}
    </div>
  </div>
</footer>
```

---

## 3. Guia Seção por Seção

### 3.1 HeroSection

**Arquivo:** `src/app/site/[slug]/_components/hero-section.tsx`

**Inspiração:** Imagens 1 (agência), 8 (produto dark), 16 (SaaS)

**Mudanças principais:**

1. **Tipografia mais impactante:**
   - Título atual: `text-3xl font-semibold md:text-4xl lg:text-5xl`
   - Novo: `text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl`
   - Adicionar `leading-tight` para linhas mais próximas

2. **Gradiente de fundo mais marcante:**
   - Atual: gradiente sutil com opacidade (`${heroBg}b3, ${heroBg}80, ${heroBg}f2`)
   - Novo: gradiente mais sólido e diagonal
   ```tsx
   background: `linear-gradient(135deg, ${heroBg}e6, ${heroBg}cc, ${heroBg}f5)`
   ```

3. **Botões CTA mais chamativos:**
   - Estilo `rounded-full` com padding maior
   - Adicionar sombra colorida: `shadow-lg shadow-primary/30`
   - Botão principal maior com `text-lg px-8 py-4`

4. **Badge de localização melhorado:**
   - Adicionar `shadow-lg` para destaque
   - Bordas mais visíveis

5. **Elemento decorativo no fundo:**
   - Adicionar pattern SVG sutil ou formas geométricas com CSS
   - Círculos de gradiente posicionados com `absolute`:
   ```tsx
   <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
   <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
   ```

6. **Espaçamento:**
   - Atual: `py-20 md:py-36`
   - Manter ou até aumentar para dar mais respiro

### 3.2 AboutSection

**Arquivo:** `src/app/site/[slug]/_components/about-section.tsx`

**Inspiração:** Imagens 3 (habilidades), 5 (progress bars), 18 (alternating features)

**Mudanças principais:**

1. **Título com palavras de destaque:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     {category} em <span className="text-primary">{city}</span> — {name}
   </h2>
   ```

2. **Subtítulo de seção como texto simples:**
   ```tsx
   <span className="text-sm font-bold uppercase tracking-widest text-primary">
     Sobre
   </span>
   ```

3. **Card de descrição com visual mais forte:**
   - Borda esquerda colorida: `border-l-4 border-l-primary`
   - Fundo sólido `bg-white` (remover glassmorphism `bg-white/70`)
   - Sombra mais definida: `shadow-lg`

4. **Tags de serviço como pills:**
   - Atual: pills com ícone Check
   - Novo: pills com cor de fundo mais forte
   ```tsx
   <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2
     text-sm font-medium text-primary">
     <IconCheck className="h-3.5 w-3.5" />
     {svcName}
   </span>
   ```

5. **Cards de horário/bairros com ícone colorido maior:**
   - Ícone em círculo com fundo gradiente da cor primária
   - Título mais bold

### 3.3 ServicesSection

**Arquivo:** `src/app/site/[slug]/_components/services-section.tsx`

**Inspiração:** Imagens 4-5 (cards de serviço com ícone)

**Mudanças principais:**

1. **Subtítulo + título split:**
   ```tsx
   <span className="text-sm font-bold uppercase tracking-widest text-primary">
     Nossos Serviços
   </span>
   <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
     O que podemos fazer <span className="text-primary">por você?</span>
   </h2>
   ```

2. **Cards redesenhados (inspiração imagem 4):**
   - Ícone grande no topo (não ao lado): `h-16 w-16 mb-6` centralizado ou top-left
   - Borda mais visível no hover: `border-2 border-transparent hover:border-primary/20`
   - Sombra mais pronunciada no hover: `hover:shadow-2xl hover:-translate-y-2`
   - Fundo sólido `bg-white` (sem glassmorphism)
   - Link "Saiba mais ▸" embaixo com cor primary e seta animada

3. **Remover botão "Ver detalhes"** de dentro do card — substituir por link sutil:
   ```tsx
   <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary
     transition-all group-hover:gap-2">
     Saiba mais
     <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
   </span>
   ```

4. **Grid mais espaçoso:** `gap-8` ao invés de `gap-6`

### 3.4 GallerySection

**Arquivo:** `src/app/site/[slug]/_components/gallery-section.tsx`

**Fundo:** Branco (vem depois de ServicesSection que é `#f3f5f7`)

**Design pattern:** Grid de fotos com imagem destaque maior + thumbnails menores

**Mudanças principais:**

1. **Header padrão (subtítulo uppercase + título extrabold):**
   ```tsx
   <span className="text-sm font-bold uppercase tracking-widest text-primary">
     Galeria de Fotos
   </span>
   <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
     Conheça a <span className="text-primary">{storeName}</span>
   </h2>
   ```

2. **Grid com imagem destaque (featured):**
   - Primeira imagem ocupa 2 colunas e 2 linhas: `md:col-span-2 md:row-span-2`
   - Restantes em grid `md:grid-cols-3` com `gap-4`
   - Aspecto da imagem destaque: `aspect-[4/3]` (maior, mais impactante)
   - Aspecto das thumbnails: `aspect-square` (quadradas para compactar)

3. **Hover com overlay e ícone de zoom:**
   ```tsx
   <div className="absolute inset-0 flex items-center justify-center
     bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
     <div className="flex h-12 w-12 items-center justify-center rounded-full
       bg-white/20 backdrop-blur-sm border border-white/30">
       <IconZoomIn className="h-6 w-6 text-white" />
     </div>
   </div>
   ```

4. **Cards de imagem sólidos (sem glassmorphism):**
   - `rounded-2xl border-2 border-slate-100 bg-white overflow-hidden`
   - Hover: `hover:-translate-y-1 hover:shadow-xl hover:border-primary/30`
   - Image scale on hover: `group-hover:scale-105`

5. **Stat de quantidade de fotos:**
   - Mostrar badge com total: "{images.length} fotos" ao lado do subtítulo ou como parte do header

6. **Largura:** `max-w-4xl` (regra fundamental)

7. **Lightbox:** Manter a funcionalidade atual (zoom, pan, navegação) — já está boa

### 3.5 AreasSection

**Arquivo:** `src/app/site/[slug]/_components/areas-section.tsx`

**Inspiração:** Imagens 2 (stats counter), 17 (stats percentuais)

**Mudanças principais:**

1. **Transformar em seção visual com stats + bairros:**
   - Adicionar um stat counter no topo mostrando número de bairros atendidos
   - Fundo colorido `bg-primary` para o bloco de stats:
   ```tsx
   <div className="rounded-3xl bg-primary p-8 text-white text-center mb-12">
     <div className="text-5xl font-black">{neighborhoods.length}+</div>
     <div className="mt-2 text-white/80 font-medium">Bairros Atendidos em {city}</div>
   </div>
   ```

2. **Grid de bairros mais visual:**
   - Ícones de pin maiores
   - Hover com fundo primary leve: `hover:bg-primary/5 hover:border-primary/30`
   - Borda arredondada maior: `rounded-2xl`

3. **Título bold:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     Áreas <span className="text-primary">Atendidas</span>
   </h2>
   ```

### 3.6 TestimonialsSection

**Arquivo:** `src/app/site/[slug]/_components/testimonials-section.tsx`

**Inspiração:** Imagem 7 (depoimento centralizado), padrões gerais

**Mudanças principais:**

1. **Layout de destaque centralizado (para poucos depoimentos ≤3):**
   - Se houver 1-3 depoimentos: layout centralizado grande
   - Se houver 4+: manter grid mas com visual melhorado

2. **Card de depoimento centralizado:**
   ```tsx
   <div className="mx-auto max-w-2xl text-center">
     <div className="mx-auto mb-6 h-20 w-20 overflow-hidden rounded-full
       ring-4 ring-primary/20 shadow-lg">
       <Image ... />
     </div>
     <blockquote className="mb-6 text-xl italic leading-relaxed text-slate-600">
       "{content}"
     </blockquote>
     <p className="text-lg font-bold text-slate-900">{name}</p>
     <div className="mt-3 flex justify-center gap-1">
       {/* estrelas */}
     </div>
   </div>
   ```

3. **Grid cards melhorados (para muitos depoimentos):**
   - Ícone de aspas decorativo maior e mais visível: `opacity-10` → `opacity-20`
   - Card com borda mais definida: `border-2 border-slate-100`
   - Hover border colorida: `hover:border-primary/30`
   - Fundo sólido `bg-white` (sem glassmorphism)

4. **Título bold:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     O que nossos <span className="text-primary">clientes</span> dizem
   </h2>
   ```

### 3.7 FAQSection

**Arquivo:** `src/app/site/[slug]/_components/faq-section.tsx`

**Inspiração:** Imagens 14 (FAQ dark), 15 (FAQ limpo com borda lateral)

**Mudanças principais:**

1. **Título com palavra colorida:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     Perguntas <span className="text-primary">Frequentes</span>
   </h2>
   ```

2. **Accordion com borda lateral ativa (inspiração imagem 15):**
   ```tsx
   <div className={cn(
     'overflow-hidden transition-all duration-300',
     openIndex === index
       ? 'rounded-xl border-l-4 border-l-primary bg-primary/5 shadow-md'
       : 'border-b border-slate-200 hover:bg-slate-50'
   )}>
   ```

3. **Indicador +/− ao invés de chevron:**
   ```tsx
   <span className={cn(
     'flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold transition-all',
     openIndex === index
       ? 'bg-primary text-white'
       : 'bg-slate-100 text-slate-500'
   )}>
     {openIndex === index ? '−' : '+'}
   </span>
   ```

4. **Item ativo: pergunta em cor primary:**
   ```tsx
   <h3 className={cn(
     'font-semibold transition-colors',
     openIndex === index ? 'text-primary' : 'text-slate-900'
   )}>
   ```

5. **Adicionar CTA abaixo do FAQ (inspiração imagem 15):**
   - "Ainda tem dúvidas? Fale conosco!" com botão de WhatsApp
   - Card com fundo `bg-primary/5 rounded-2xl p-8`

### 3.8 ContactSection

**Arquivo:** `src/app/site/[slug]/_components/contact-section.tsx`

**Inspiração:** Imagens 7, 14 (footer com contato estruturado)

**Mudanças principais:**

1. **Título bold:**
   ```tsx
   <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
     Onde <span className="text-primary">nos encontrar</span>
   </h2>
   ```

2. **Cards de contato mais impactantes:**
   - Ícone maior: `h-16 w-16` com `rounded-2xl`
   - Borda esquerda colorida: `border-l-4 border-l-primary` no card principal
   - Fundo sólido sem glassmorphism
   - Hover mais pronunciado: `hover:-translate-y-2 hover:shadow-xl`

3. **Mapa com overlay no topo:**
   - Borda arredondada maior: `rounded-3xl`
   - Sombra mais forte
   - Badge "Ver no Google Maps" flutuante sobre o mapa

### 3.9 SiteFooter

**Arquivo:** `src/app/site/[slug]/_components/site-footer.tsx`

**Inspiração:** Imagens 7 (footer gradiente azul), 14 (footer dark)

**Mudanças principais:**

1. **Fundo com gradiente da cor primária (em vez de branco):**
   ```tsx
   <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 pt-16 pb-8 text-white">
   ```
   Ou usando a cor primária da loja:
   ```tsx
   <footer style={{ background: `linear-gradient(to bottom, ${primaryColor}ee, ${primaryColor})` }}
     className="pt-16 pb-8 text-white">
   ```

2. **Textos brancos com opacidade:**
   - Títulos de coluna: `text-white font-bold`
   - Links: `text-white/60 hover:text-white transition-colors`
   - Copyright: `text-white/40`

3. **Ícones sociais em círculos com borda:**
   ```tsx
   <a className="flex h-10 w-10 items-center justify-center rounded-full
     border border-white/20 text-white/60 transition-all
     hover:bg-white/10 hover:text-white hover:border-white/40">
   ```

4. **Separador com borda branca transparente:**
   `border-t border-white/10`

5. **Logo da empresa (se disponível) centralizado:**
   - Área de logo centralizada entre colunas e copyright

### 3.10 FloatingContact

**Arquivo:** `src/app/site/[slug]/_components/floating-contact.tsx`

**Mudanças menores:**
- Manter funcionalidade atual
- Alinhar visual: `shadow-2xl` para mais destaque
- Pulse animation no ícone do WhatsApp
- Tamanho ligeiramente maior: `h-14 w-14` ao invés de `h-12 w-12`

---

## 4. Novos Componentes CSS/Animações

### 4.1 Novas Keyframes para `globals.css`

```css
/* Contagem animada (para stats) */
@keyframes count-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-count-up {
  animation: count-up 0.8s ease-out forwards;
}

/* Barra de progresso animada */
@keyframes progress-fill {
  from { width: 0%; }
}

.animate-progress {
  animation: progress-fill 1.5s ease-out forwards;
}

/* Pulse suave para CTA */
@keyframes pulse-soft {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

/* Shimmer / brilho no botão */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

/* Float sutil para elementos decorativos */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
```

### 4.2 Classes Utilitárias Novas

```css
/* Texto com gradiente (para títulos especiais) */
.text-gradient-primary {
  background: linear-gradient(135deg, var(--primary), color-mix(in oklch, var(--primary), white 30%));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Borda com brilho no hover */
.glow-border {
  transition: box-shadow 0.3s ease;
}
.glow-border:hover {
  box-shadow: 0 0 20px color-mix(in oklch, var(--primary), transparent 80%);
}

/* Underline animado para links */
.animated-underline {
  position: relative;
}
.animated-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: width 0.3s ease;
  border-radius: 1px;
}
.animated-underline:hover::after {
  width: 100%;
}
```

### 4.3 Intersection Observer para Animações on Scroll

Criar um hook `useInView` para disparar animações quando elementos entram na viewport:

```tsx
// src/hooks/use-in-view.ts
'use client'
import { useEffect, useRef, useState } from 'react'

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.1, ...options })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])

  return { ref, isInView }
}
```

Uso nas seções para disparar animações de números, progress bars, etc.

### 4.4 Componente AnimatedCounter

```tsx
// src/components/site/animated-counter.tsx
'use client'
import { useEffect, useState, useRef } from 'react'

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({ target, suffix = '', duration = 2000, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
```

---

## 5. Prioridade de Implementação

Ordem recomendada para implementar as mudanças, do maior impacto visual ao menor:

### Fase 1 — Impacto Visual Imediato (Alto)
1. **HeroSection** — Tipografia bold, gradientes mais fortes, elementos decorativos, CTAs maiores
2. **SiteFooter** — Fundo com gradiente/dark, texto branco, visual premium
3. **ServicesSection** — Cards modernos com ícone grande, hover pronunciado, link com seta

### Fase 2 — Diferencial (Médio-Alto)
4. **FAQSection** — Accordion com borda lateral, +/−, palavra colorida no título, CTA abaixo
5. **TestimonialsSection** — Depoimento centralizado grande (poucos) ou cards melhorados
6. **AboutSection** — Título bold com palavra colorida, card com borda lateral, pills coloridas

### Fase 3 — Complemento (Médio)
7. **ContactSection** — Cards mais impactantes, ícones maiores, mapa arredondado
8. **GallerySection** — Grid variável, hover com zoom icon, bordas melhores
9. **AreasSection** — Stats counter animado, visual mais forte

### Fase 4 — Polish
10. **globals.css** — Novas animações (counter, progress, shimmer, float)
11. **Hook useInView** — Para animações on-scroll
12. **AnimatedCounter** — Componente de contagem animada
13. **FloatingContact** — Ajustes menores de tamanho e sombra

---

## Resumo das Diferenças Chave (Antes vs Depois)

| Aspecto | Atual | Novo |
|---------|-------|------|
| Títulos | `font-semibold text-2xl` | `font-extrabold text-4xl tracking-tight` |
| Palavra destaque | Sem destaque | `<span className="text-primary">` |
| Subtítulo seção | Badge pill com ícone | Texto uppercase `tracking-widest text-primary` |
| Fundos de seção | Gradiente sutil 3% opacidade | Alternância: branco ↔ `bg-primary` sólido |
| Cards | Glassmorphism `bg-white/70` | Sólido `bg-white border-2` |
| Hover cards | `-translate-y-1 shadow-xl` | `-translate-y-2 shadow-2xl border-primary/30` |
| Ícones | Check genérico 28px | Ícone temático 32-48px com fundo |
| FAQ | Chevron rotativo | `+`/`−` + borda lateral ativa |
| Depoimentos | Grid 3 colunas | Centralizado grande OU grid melhorado |
| Footer | Fundo branco/cinza | Gradiente dark ou cor primária |
| Botões CTA | `rounded-md` padrão | `rounded-full shadow-lg px-8` |
| Animações | Fade-in-up básico | Counter, progress bar, shimmer, float |
