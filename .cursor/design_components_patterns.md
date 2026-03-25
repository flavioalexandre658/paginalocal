# PGL — Design Quality System

## Regras de Qualidade para Componentes de Seção

Este documento define o padrão de qualidade visual que TODOS os componentes de bloco devem seguir. O objetivo é que os sites gerados pareçam feitos por um designer senior, não por uma IA.

---

## O que faz um site parecer "feito por IA"

Antes das regras, entenda os anti-patterns que queremos evitar:

1. Simetria perfeita demais — tudo centralizado, tudo do mesmo tamanho
2. Espaçamento uniforme robótico — mesma distância entre todos os elementos
3. Cards genéricos com ícone + título + texto em grid 3x3
4. Gradientes lineares de azul para roxo
5. Bordas arredondadas excessivas (tudo pill shape)
6. Texto motivacional vago ("Transformando sonhos em realidade")
7. Sombras grandes flutuantes em tudo
8. Uso excessivo de ícones decorativos (Lucide em cada card)
9. Layout 100% simétrico sem quebra visual
10. Cores vibrantes demais sem contraste adequado

---

## Regras Obrigatórias (aplicar em TODOS os blocos)

### 1. Tipografia

```
- Headings de seção: text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight
- Subtítulos de seção: text-lg md:text-xl text-muted-foreground font-normal max-w-2xl
- Títulos de card: text-lg font-semibold tracking-tight
- Body text: text-base leading-relaxed text-muted-foreground
- Labels/badges: text-xs font-medium uppercase tracking-wider
- Preços: text-2xl md:text-3xl font-semibold tabular-nums
- NUNCA: font-bold em títulos (usar font-semibold)
- NUNCA: text-center em parágrafos longos (> 2 linhas)
- NUNCA: mais de 65ch de largura em corpo de texto (usar max-w-prose)
```

### 2. Espaçamento

```
- Seções: py-20 md:py-28 (generoso, respira)
- Entre título da seção e conteúdo: mb-12 md:mb-16
- Entre cards em grid: gap-6 md:gap-8
- Padding interno de cards: p-6 md:p-8
- Container: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- NUNCA: py-10 ou menos em seções (muito apertado)
- NUNCA: gap-4 entre cards principais (muito colado)
```

### 3. Cores e Temas

```
- Usar CSS variables do DesignTokens (--pgl-primary, --pgl-secondary, etc.)
- Backgrounds de seção alternam: transparent → surface → transparent → surface
- Textos sobre fundo escuro: text-white/90 (não text-white puro, é agressivo)
- Textos secundários: text-muted-foreground (nunca cinza hardcoded)
- Accent color usado com moderação: badges, botões, detalhes, não áreas grandes
- Dark mode: TODAS as classes com variante dark:
- NUNCA: background-color com hex hardcoded (sempre via variable ou Tailwind)
- NUNCA: usar a cor primária como background de seção inteira (muito pesado)
  Em vez disso: usar primary/5 ou primary/10 como tint sutil
```

### 4. Layout e Composição

```
- Grids assimétricos quando possível:
  - Em vez de grid-cols-3 uniforme, usar grid com 1 item grande + 2 menores
  - Em vez de 4 cards iguais, usar 1 destaque + 3 secundários
- Quebra de padrão visual a cada 2-3 seções:
  - Seção com fundo escuro entre seções claras
  - Uma seção full-bleed entre seções com container
  - Um layout horizontal entre layouts verticais
- Alinhamento intencional:
  - Títulos de seção: text-left na maioria, text-center só em CTA/hero
  - Conteúdo principal: alinhado à esquerda (leitura natural em PT-BR)
- NUNCA: text-center em tudo (marca registrada de site genérico)
- NUNCA: mais de 4 cards por linha (fica minúsculo em mobile)
```

### 5. Sem Ícones Decorativos

```
- Ícones APENAS em contextos funcionais:
  - Lista de features (check marks)
  - Info de contato (telefone, email, localização)
  - Navegação (setas, menu)
  - Badges de status (verificado, novo)
- NUNCA: ícone no topo de cada card de serviço (anti-pattern #1 de site AI)
- NUNCA: ícone ao lado de título de seção
- NUNCA: ícones como decoração visual em headers
- Em vez de ícone: usar número estilizado, imagem real, ou nada
```

### 6. Sem Emojis

```
- Zero emojis em qualquer lugar
- Inclusive em badges, labels, CTAs, tooltips
- Se precisar de indicador visual, usar dot (w-2 h-2 rounded-full bg-primary)
```

### 7. Imagens e Mídia

```
- Imagens SEMPRE com aspect-ratio definido (aspect-video, aspect-square, aspect-[4/3])
- Usar object-cover em todas as imagens
- Imagens com rounded corners consistentes (rounded-lg ou rounded-xl)
- Placeholder com skeleton animado quando carregando
- Overlay sutil em imagens com texto sobreposto:
  bg-gradient-to-t from-black/60 via-black/20 to-transparent
- NUNCA: imagem sem aspect-ratio (causa layout shift)
- NUNCA: imagem esticada ou comprimida
- NUNCA: borda ao redor de imagem (usar shadow sutil ou nada)
```

### 8. Botões e CTAs

```
- CTA primário:
  bg-[--pgl-primary] text-white px-6 py-3 rounded-[--pgl-radius]
  font-medium text-sm
  hover: brightness-110 ou opacity-90
  transition-all duration-200
  
- CTA secundário:
  border border-[--pgl-primary]/20 text-[--pgl-primary]
  hover:bg-[--pgl-primary]/5
  
- Micro-interactions:
  hover:translate-y-[-1px] em botões
  active:translate-y-[0px] active:scale-[0.98]
  
- NUNCA: botão com ícone de seta (→) no texto (exceto links inline)
- NUNCA: "Saiba mais" como texto de CTA (muito genérico)
- NUNCA: dois CTAs primários lado a lado (um deve ser secundário)
- NUNCA: botão com shadow-lg (sombra grande flutuante)
```

### 9. Cards

```
- Card padrão:
  bg-background rounded-xl border border-border/50
  p-6 md:p-8
  hover:border-border transition-colors duration-200
  
- Card em destaque:
  ring-2 ring-[--pgl-primary]/20 (não sombra, usar ring)
  
- Card com imagem:
  overflow-hidden (clip a imagem no rounded)
  imagem com hover:scale-105 transition-transform duration-500
  
- NUNCA: shadow-md ou shadow-lg em cards (usar border sutil)
- NUNCA: todos os cards com a mesma altura forçada se o conteúdo varia
  Em vez disso: usar grid com auto-rows e deixar natural
```

### 10. Animações

```
- Entrada de seções:
  animate-fade-in-up com stagger de 100ms entre children
  Trigger: quando entra no viewport (IntersectionObserver)
  
- Hover em cards/imagens:
  transition-all duration-300 ease-out
  Escala máxima: scale-[1.02] (sutil)
  
- Contadores (bloco stats):
  Animação de contagem com easing (não linear)
  
- NUNCA: animação de bounce ou shake
- NUNCA: delay maior que 600ms (parece travado)
- NUNCA: animação em loop infinito (exceto loading states)
- NUNCA: mais de 3 propriedades animando simultaneamente
- Respeitar prefers-reduced-motion: desabilitar animações
```

### 11. Responsividade

```
- Mobile-first: estilos base são mobile, md: e lg: adicionam
- Grid breakpoints:
  - Mobile: 1 coluna (grid-cols-1)
  - Tablet: 2 colunas (md:grid-cols-2)
  - Desktop: 3-4 colunas (lg:grid-cols-3 ou lg:grid-cols-4)
- Texto que é text-5xl em desktop deve ser text-3xl em mobile
- Imagens full-bleed em mobile, com padding em desktop
- Stack vertical em mobile, horizontal em desktop
- Touch targets: mínimo 44px em mobile
- NUNCA: overflow-x em mobile (testar sempre)
- NUNCA: texto menor que text-sm em mobile
```

### 12. Micro-detalhes que Fazem Diferença

```
- Dividers entre seções: usar mudança de background, não <hr>
- Badge de destaque em pricing: posição absolute no topo do card
  -top-3 left-1/2 -translate-x-1/2
- Números em stats: usar tabular-nums para alinhamento
- Aspas em testimonials: usar before:content-['"'] estilizado
  text-6xl text-primary/20 font-serif absolute -top-4 -left-2
- Hover em links: underline-offset-4 decoration-primary/30
  hover:decoration-primary transition-colors
- Focus visible: focus-visible:ring-2 ring-primary/50 ring-offset-2
- Placeholder em inputs: placeholder:text-muted-foreground/50
```

### 13. Patterns de Layout por Tipo de Bloco

```
HERO:
- Full viewport height (min-h-[90vh]) ou height limitado (h-[70vh])
- Texto nunca ocupa mais de 60% da largura
- CTA com margem superior generosa (mt-8)
- Se tem imagem de fundo: overlay obrigatório

SERVICES:
- Se tem até 3 serviços: grid assimétrico (1 grande + 2 pequenos)
- Se tem 4-6: grid 2x3 ou layout alternado
- Se tem 7+: lista com agrupamento ou accordion
- Preço (se presente): alinhado à direita, text-muted até hover

TESTIMONIALS:
- Aspas decorativas grandes e semi-transparentes
- Foto do autor: w-10 h-10 rounded-full (pequena, não destaque)
- Rating: dots ou estrelas em cor primária/30, não amarelo
- Layout: quote grande + atribuição discreta

GALLERY:
- Masonry é mais interessante que grid uniforme
- Hover: overlay escuro + zoom sutil
- Lightbox com fundo blur e close no canto

PRICING:
- Plano destaque: scale-105 e ring, não sombra
- Features com check/x: text-sm, cor sutil
- Período (mensal/anual): toggle discreto, não tabs grandes
- "Mais popular" badge: absolute, pill, small

FAQ:
- Accordion com transição suave de height
- Indicador: ChevronDown que roda 180deg, não +/-
- Resposta: max-w-prose, text-muted-foreground
- Sem borda entre items, usar space-y com divider sutil

CONTACT:
- Form fields: minimal, sem label flutuante (label acima, discreto)
- Mapa: rounded, sem borda, com overlay sutil no topo
- Info de contato: ícone funcional + texto, layout simples
```

### 14. Padrão de Código dos Componentes

```tsx
// Template base para TODOS os blocos

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

// Props sempre tipadas com content schema + tokens
interface Props {
  content: ContentType;
  tokens: DesignTokens;
}

export function BlockName({ content, tokens }: Props) {
  return (
    // Wrapper da seção: NUNCA colocar py aqui (o SectionBlock já faz)
    // Usar container padrão
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header da seção: título + subtítulo */}
      {/* Apenas se o bloco tem título (hero não precisa deste pattern) */}
      <div className="mb-12 md:mb-16">
        <h2 className={cn(
          "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight",
          // Alinhamento: left por padrão, center só se fizer sentido
        )}>
          {content.title}
        </h2>
        {content.subtitle && (
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl">
            {content.subtitle}
          </p>
        )}
      </div>

      {/* Conteúdo do bloco */}
      {/* ... */}
      
    </div>
  );
}
```

### 15. Variações de Background entre Seções

Para que o site não pareça uma lista vertical monótona, as seções devem alternar backgrounds. O renderer deve aplicar automaticamente:

```tsx
// No SectionBlock ou PageRenderer:
// Seções ímpares: fundo transparente
// Seções pares: fundo surface sutil
// Exceções: hero, cta e seções com fundo próprio (dark sections)

const backgroundPattern = (index: number, blockType: string) => {
  // Blocos que controlam seu próprio fundo
  const selfBackgroundBlocks = ["hero", "cta", "stats"];
  if (selfBackgroundBlocks.includes(blockType)) return "";
  
  return index % 2 === 1
    ? "bg-[--pgl-surface]"
    : "bg-transparent";
};
```

### 16. Uma Seção Dark a Cada 3-4 Seções

Para quebrar a monotonia, o blueprint pode marcar uma seção como "dark". Isso inverte o esquema:

```
- Fundo: bg-[--pgl-primary] ou bg-gray-950
- Texto: text-white/90
- Texto muted: text-white/60
- Cards: bg-white/5 border-white/10
- Bom para: stats, CTA, testimonial em destaque
```

### 17. Detalhes Decorativos Permitidos (com moderação)

```
- Grid pattern sutil no background:
  bg-[linear-gradient(to_right,theme(colors.border/5)_1px,transparent_1px),
  linear-gradient(to_bottom,theme(colors.border/5)_1px,transparent_1px)]
  bg-[size:4rem_4rem]
  
- Dot pattern:
  bg-[radial-gradient(circle,theme(colors.border/30)_1px,transparent_1px)]
  bg-[size:1.5rem_1.5rem]
  
- Gradient glow sutil (não em tudo, 1-2 por site):
  <div className="absolute -top-40 -right-40 w-80 h-80 
    bg-[--pgl-primary]/10 rounded-full blur-3xl" />
  
- Linha decorativa acima do título:
  <div className="w-12 h-1 bg-[--pgl-primary] rounded-full mb-6" />
  Usar com moderação (máximo 2 seções por página)

- NUNCA: múltiplos efeitos decorativos na mesma seção
- NUNCA: decoração que distrai do conteúdo
```

### 18. Regras de Texto Gerado pela IA

Estas regras devem ir no PROMPT para o Claude, não no componente:

```
- Headlines: máximo 8 palavras (curta e impactante)
- Subtítulos: máximo 20 palavras (uma frase clara)
- Descrições de serviço: 2-3 frases, linguagem direta
- CTA: verbo no imperativo + benefício ("Agende e ganhe 10% off")
- NUNCA: adjetivos genéricos ("excelente", "incrível", "melhor")
- NUNCA: frases motivacionais vagas ("Transformando vidas")
- NUNCA: superlativos sem fundamento ("O melhor da cidade")
- PREFERIR: linguagem específica ("Cortes masculinos com agendamento online")
- PREFERIR: números quando possível ("Atendemos há 12 anos no centro")
- PREFERIR: linguagem do nicho (barbeiro fala diferente de dentista)
```

### 19. Acessibilidade

```
- Contraste mínimo: 4.5:1 para texto, 3:1 para texto grande
- Todas as imagens com alt text descritivo (gerado pela IA)
- Botões com aria-label quando o texto não é descritivo
- Skip to content link no topo
- Focus visible em todos os interativos
- Landmark roles: header, main, nav, footer
- heading hierarchy: h1 apenas no hero, h2 nas seções, h3 nos cards
- Formulários com labels associados (htmlFor + id)
- prefers-reduced-motion: desabilitar todas as animações
- prefers-color-scheme: dark mode automático
```

### 20. Performance

```
- Imagens: next/image com lazy loading (exceto hero que é eager)
- Componentes de bloco: lazy import via registry
- Fontes: display=swap no Google Fonts
- Animações: apenas transform e opacity (GPU accelerated)
- Intersection Observer: uma instância compartilhada para fade-ins
- CSS: Tailwind purge remove classes não usadas
- NUNCA: importar biblioteca inteira para um ícone
- NUNCA: inline styles com valores calculados em cada render
```

---

## Checklist de Review (aplicar antes de cada PR de bloco)

Para cada componente de bloco, verificar:

- [ ] Sem font-bold (usar font-semibold)
- [ ] Sem emojis
- [ ] Sem ícones decorativos em títulos
- [ ] Sem text-center em parágrafos longos
- [ ] Sem shadow-md/lg em cards (usar border)
- [ ] Sem hex hardcoded (usar CSS variables ou Tailwind)
- [ ] Dark mode testado
- [ ] Mobile testado (320px)
- [ ] Tablet testado (768px)
- [ ] Animações com prefers-reduced-motion
- [ ] Contraste de cores adequado
- [ ] Heading hierarchy correta (h2 seção, h3 cards)
- [ ] cn() usado para classes condicionais
- [ ] max-w-prose em textos longos
- [ ] aspect-ratio em todas as imagens
- [ ] Sem "Saiba mais" como CTA text
- [ ] Espaçamento generoso (py-20+, gap-6+)
- [ ] Pelo menos uma quebra visual no layout (assimetria)