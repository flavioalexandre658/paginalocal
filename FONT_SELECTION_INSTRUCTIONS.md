Guia Definitivo de Tipografia para Landing Pages Premium
Fundamentos Estratégicos
1. Seleção Tipográfica
Critérios de Escolha:

Personalidade da marca: A fonte deve refletir o DNA da marca (corporativo, inovador, luxuoso, jovem, etc.)
Legibilidade ≠ Readability: Legibilidade = facilidade de distinguir caracteres individuais | Readability = conforto na leitura de blocos de texto
Versatilidade: Escolha famílias com múltiplos pesos (mínimo 4: Light, Regular, Medium, Bold)
Suporte OpenType: Recursos como ligaduras, numerais tabulares/proporcionais, small caps aumentam refinamento
Licenciamento: Verifique se a licença permite uso web comercial

Estrutura Ideal:

1 Display Font (headlines, títulos principais) - pode ser expressiva
1 Body Font (parágrafos, textos corridos) - priorize legibilidade
Regra de ouro: Máximo 2 famílias tipográficas. Mais que isso cria poluição visual


2. Hierarquia Visual
Sistema de Escalas Tipográficas:
Use progressão matemática para criar harmonia. Escalas populares:

Escala Menor (1.2): Elegante, conservadora
Escala Áurea (1.618): Clássica, harmoniosa
Escala Maior (1.5): Moderna, com contraste

Exemplo de Sistema:
H1: 64px / 4rem (Hero principal)
H2: 48px / 3rem (Seções principais)
H3: 36px / 2.25rem (Sub-seções)
H4: 24px / 1.5rem (Títulos de cards)
Body Large: 20px / 1.25rem (Leads, introduções)
Body: 16px / 1rem (Texto padrão)
Small: 14px / 0.875rem (Notas, legendas)
Pesos e Função:

Thin/Light (100-300): Textos grandes, ambientes minimalistas, headers secundários
Regular (400): Corpo de texto, uso geral
Medium (500-600): Destaque sutil, navegação, CTAs secundários
Bold (700): Títulos, CTAs principais, informações críticas
Black (800-900): Uso pontual, números grandes, impacto visual

❌ Erros Comuns:

Usar bold em textos longos (cansa a vista)
Light em fundos escuros (baixo contraste)
Muitos pesos diferentes na mesma página


3. Legibilidade e Conforto Visual
Desktop
Line Height (Altura da Linha):

Headlines: 1.1 - 1.3
Body text: 1.5 - 1.8 (quanto menor a fonte, maior o line-height)
Texto longo: 1.6 - 1.8 para máximo conforto

Line Length (Largura da Linha):

Ideal: 60-75 caracteres por linha (CPL)
Mínimo aceitável: 45 CPL
Máximo: 90 CPL
Regra prática: 2-3 alfabetos completos

Letter Spacing (Tracking):

Headlines grandes: -0.02em a -0.05em (apertar levemente)
All caps: +0.05em a +0.15em (sempre expandir)
Body text: 0 (não alterar, exceto para ajustes finos)

Mobile
Ajustes Obrigatórios:

Redução proporcional: 60-80% do tamanho desktop

   H1 Desktop: 64px → Mobile: 40-48px
   Body Desktop: 16px → Mobile: 16px (não reduzir abaixo)

Aumento de line-height: +0.1 a +0.2 em mobile

Telas pequenas exigem mais espaço respiratório


Simplificação de hierarquia:

Reduza níveis de H2-H6
Priorize contraste de peso vs. tamanho


Touch targets: CTAs com texto mínimo de 16px, área clicável ≥ 44x44px

❌ Erros Fatais Mobile:

Texto menor que 14px (ilegível)
Line-height < 1.4 (linhas coladas)
Parágrafos > 90 CPL (rolagem horizontal mental)


4. Contraste e Acessibilidade
WCAG 2.1 - Requisitos Mínimos:

Texto normal (< 18px): Contraste 4.5:1
Texto grande (≥ 18px ou ≥ 14px bold): Contraste 3:1
AAA (ideal): 7:1 para texto normal

Ferramentas de Teste:

WebAIM Contrast Checker
Stark (plugin Figma)
Chrome DevTools Accessibility Panel

Cores e Legibilidade:

Evite texto cinza claro (#999) em fundos brancos
Prefira cinza escuro (#1a1a1a) ao preto puro (#000)
Texto branco em fundos coloridos: teste sempre


5. Pareamento de Fontes
Combinações Testadas:
Fórmula 1: Serif + Sans-Serif

Display: Serif elegante (Playfair, Lora, Cormorant)
Body: Sans-serif clean (Inter, Open Sans, Poppins)
Uso: Sites premium, moda, editorial

Fórmula 2: Geométrica + Humanista

Display: Sans geométrica (Montserrat, Futura)
Body: Sans humanista (Source Sans, PT Sans)
Uso: Tech, startups, modernidade

Fórmula 3: Monoweight (1 família apenas)

Usar diferentes pesos da mesma fonte
Exemplo: Inter (Thin até Black)
Uso: Minimalismo, brutalismo, clareza máxima

Regras de Ouro:

Contraste suficiente (não pareie duas geométricas)
Coerência histórica (evite Garamond + Futura)
Teste em contexto real


6. Performance e Otimização
Carregamento de Fontes
Estratégias:

Font-display: swap

css   @font-face {
     font-family: 'Custom';
     src: url('font.woff2') format('woff2');
     font-display: swap; /* Mostra fallback até carregar */
   }

Preload fonts críticas

html   <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

Subset fonts: Carregue apenas caracteres necessários

Latin extended vs. Latin basic
Remova caracteres especiais não utilizados


Variable fonts: 1 arquivo com todos os pesos

Reduz requests HTTP
Permite animações de peso



Formatos por Prioridade:

WOFF2 (melhor compressão, moderno)
WOFF (fallback)
TTF (evitar em web)

Limite de Pesos:

Carregue máximo 4 variações (Regular, Medium, Bold, Italic)
Cada peso adicional = ~50-200kb


7. Espaçamento e Ritmo Vertical
Vertical Rhythm:
Estabeleça um baseline grid:
css:root {
  --baseline: 8px; /* ou 4px para mais flexibilidade */
}

h1 { margin-bottom: calc(var(--baseline) * 6); } /* 48px */
h2 { margin-bottom: calc(var(--baseline) * 4); } /* 32px */
p  { margin-bottom: calc(var(--baseline) * 3); } /* 24px */
Proporções Harmônicas:

Espaço antes do título: 1.5x-2x do espaço depois
Espaço entre parágrafos: 0.75x-1x do line-height
Seções: 80-120px (desktop), 48-64px (mobile)


8. Casos de Uso Específicos
CTAs (Call-to-Actions)

Peso: Bold (700) mínimo
Size: 16-18px (jamais abaixo de 16px)
Letter-spacing: +0.02em a +0.05em
Padding interno generoso: 16px 32px mínimo

Números e Estatísticas

Peso: Bold ou Black
Tamanho: 2-3x maior que o body
Usar tabular numerals (todos mesma largura)
Considere fontes específicas para dados (IBM Plex Mono)

Citações e Depoimentos

Italic ou peso diferente
Tamanho: 1.2x-1.5x do body
Aspas tipográficas (" ") não retas (" ")
Margem lateral (blockquote indent)

Navegação

Peso: Medium (500-600)
Tamanho: 14-16px
Letter-spacing: +0.01em
All caps com parcimônia (cansa)

10. Princípios Universais
Menos é Mais:

Resistir à tentação de usar muitos pesos/tamanhos
3-4 tamanhos bem definidos > 10 tamanhos aleatórios

Consistência:

Documente o sistema tipográfico (design system)
Use variáveis CSS para manter padrões

Contexto sobre Regras:

Sites editoriais: priorize readability
Landing pages produto: priorize hierarquia visual
E-commerce: priorize clareza em CTAs

Testes com Usuários Reais:

Heatmaps mostram onde a leitura trava
A/B test tamanhos de CTA
Tempo na página indica conforto de leitura


Conclusão
Tipografia premium não é sobre fontes caras, mas sobre sistema, intenção e refinamento. Cada decisão — do kerning ao line-height — impacta conversão, credibilidade e experiência.
Regra Final: Se você não consegue explicar por que escolheu aquele peso, tamanho ou espacejamento específico, provavelmente é arbitrário. Toda escolha tipográfica deve ter propósito.