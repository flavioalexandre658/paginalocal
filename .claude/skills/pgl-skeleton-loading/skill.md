---
name: pgl-skeleton-loading
description: Padrao de loading do PGL usando Skeleton ao inves de spinners. Define quando usar skeleton vs spinner, como estruturar skeletons que espelham o layout final, e exemplos praticos.
---

# PGL — Padrao de Loading com Skeleton

## Regra fundamental

**Conteudo carregando → Skeleton. Acao em progresso → Spinner.**

- Skeleton: usado quando a pagina/modal/tab esta carregando dados para exibir
- Spinner: usado SOMENTE em botoes de acao (salvar, enviar, adicionar) enquanto a acao executa

NUNCA usar spinner para loading de conteudo. NUNCA usar skeleton em botoes de acao.

## Componente base

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton do shadcn/ui — ja existe no projeto
// Usa animate-pulse + bg-accent + rounded-md
```

## Como construir um skeleton

O skeleton deve **espelhar o layout final** do conteudo. Cada elemento visivel (titulo, paragrafo, input, card) vira um `<Skeleton>` com dimensoes similares.

### Exemplo: formulario com titulo + descricao + 2 cards + separador + toggle

```tsx
if (loading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-7 w-24 bg-[#f5f5f4]" />           {/* titulo */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 bg-[#f5f5f4]" />         {/* subtitulo */}
        <Skeleton className="h-4 w-64 bg-[#f5f5f4]" />         {/* descricao */}
        <Skeleton className="h-[72px] w-full rounded-[12px] bg-[#f5f5f4]" />  {/* card 1 */}
        <Skeleton className="h-[72px] w-full rounded-[12px] bg-[#f5f5f4]" />  {/* card 2 */}
      </div>
      <Skeleton className="h-px w-full bg-[#f5f5f4]" />        {/* separador */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-48 bg-[#f5f5f4]" />         {/* label secao */}
        <Skeleton className="h-10 w-full rounded-[10px] bg-[#f5f5f4]" />  {/* toggle row */}
      </div>
    </div>
  );
}
```

### Exemplo: lista de items

```tsx
if (loading) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-7 w-32 bg-[#f5f5f4]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-[12px] bg-[#f5f5f4]" />
      ))}
    </div>
  );
}
```

### Exemplo: grid de imagens

```tsx
if (loading) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/3] w-full rounded-[8px] bg-[#f5f5f4]" />
      ))}
    </div>
  );
}
```

## Regras de estilo

- Cor: `bg-[#f5f5f4]` (editor bg-subtle) — NUNCA usar `bg-accent` padrao do shadcn que pode herdar cor do site
- Border-radius: espelhar o componente final (12px para cards, 10px para inputs, 8px para thumbnails)
- Largura de texto: usar valores fixos que simulam o comprimento do texto real (w-24 para titulos curtos, w-64 para descricoes)
- Altura de texto: h-4 para corpo, h-5 para labels, h-7 para titulos
- Altura de cards/inputs: h-10 para inputs, h-16 para list items, h-[72px] para option cards
- Spacing: usar o mesmo gap/space-y do layout final

## Quando usar

- Tab de modal carregando dados do servidor
- Pagina carregando dados iniciais
- Lista carregando items
- Preview de imagem carregando

## Quando NAO usar

- Botao de salvar/enviar executando acao → usar spinner inline no botao
- Transicao entre paginas → nao precisa skeleton, Next.js faz isso
- Conteudo que ja esta em cache → nao mostrar loading
- Elementos que aparecem instantaneamente (sem fetch) → nao precisa
