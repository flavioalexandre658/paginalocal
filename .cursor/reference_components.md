# PGL — Componentes de Referência PREMIUM (v2)

## Contexto

Este documento substitui a versão anterior dos componentes de referência.
O HTML `lavacar-premium-v2.html` é o benchmark visual aprovado.
TODOS os componentes React devem produzir resultado IDENTICO ao HTML de referência.

O Opus deve usar este documento como fonte de verdade para implementar ou refatorar
todos os blocos do site-renderer.

---

## Principios de Design Premium

Estes princípios diferenciam um site "limpo funcional" de um site premium:

### 1. Tipografia expressiva com palavra-destaque
Toda headline de seção deve ter UMA palavra em destaque: font-family serif italic + cor accent.
```
"Seu carro <em>impecável</em> em Santa Inês"
"Serviços de <em>estética automotiva</em>"
"Cuidado <em>real</em> com cada veículo"
"Perguntas <em>frequentes</em>"
```
O componente recebe o texto e a IA marca com asteriscos (*palavra*) no JSON.
O renderer converte *palavra* → <em> com classe de destaque.

### 2. Camadas e profundidade
Elementos sobrepostos criam sofisticação:
- Imagem com borda/shape deslocado (+20px offset)
- Trust bar com margin-top negativo sobre o hero
- Badges flutuando sobre imagens com animation float
- Shapes decorativos (círculos, retângulos) em accent com opacity baixa

### 3. Fotos reais como pilar
- Hero: SEMPRE com imagem de fundo (Google Places, upload ou Unsplash fallback)
- About: imagem do negócio/equipe ao lado do texto
- CTA: imagem de fundo com overlay
- SEM placeholder cinza — se não tem foto, buscar no Unsplash pela categoria

### 4. Seções dark intercaladas
- About OU Stats em fundo primary escuro
- CTA com imagem + overlay escuro
- Cria ritmo visual: claro → escuro → claro → escuro → claro

### 5. Micro-interações
- Hover em service cards: inverte fundo de branco para primary
- Nav: transparente → blur escuro no scroll
- FAQ: ícone + que roda 45deg virando ×
- Botões: translateY(-2px) + box-shadow colorido no hover
- Imagens: scale(1.03) no hover com overflow hidden

### 6. Sem marcas de IA
- ZERO ícones decorativos (exceto contato)
- ZERO grids simétricos 3×3 com cards idênticos
- ZERO gradientes coloridos lineares
- ZERO shadow-md/lg em cards (usar sombra sutil ou borda)
- ZERO texto centralizado em parágrafos longos

---

## CSS Global (globals.css) — OBRIGATÓRIO

```css
/* ===== PGL Premium Animation System ===== */

@keyframes pgl-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pgl-fade-right {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pgl-fade-left {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pgl-scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes pgl-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.pgl-fade-up { animation: pgl-fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
.pgl-fade-right { animation: pgl-fade-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
.pgl-fade-left { animation: pgl-fade-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
.pgl-scale-in { animation: pgl-scale-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
.pgl-float { animation: pgl-float 4s ease-in-out infinite; }

[data-delay="1"] { animation-delay: 0.1s; }
[data-delay="2"] { animation-delay: 0.2s; }
[data-delay="3"] { animation-delay: 0.3s; }
[data-delay="4"] { animation-delay: 0.4s; }
[data-delay="5"] { animation-delay: 0.5s; }
[data-delay="6"] { animation-delay: 0.6s; }
[data-delay="7"] { animation-delay: 0.7s; }

@media (prefers-reduced-motion: reduce) {
  .pgl-fade-up, .pgl-fade-right, .pgl-fade-left,
  .pgl-scale-in, .pgl-float {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Utilitário: Headline com Palavra-Destaque

A IA gera headlines com *palavra* marcada por asteriscos no JSON.
Este componente converte para o tratamento visual premium.

```tsx
// src/components/site-renderer/shared/styled-headline.tsx
"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  text: string;
  tokens: DesignTokens;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accentClassName?: string;
}

/**
 * Converte "Servicos de *estetica automotiva*" em:
 * <h2>Servicos de <em style="...">estetica automotiva</em></h2>
 *
 * A palavra entre asteriscos recebe:
 * - font-family: serif (Playfair, DM Serif, etc.)
 * - font-style: italic
 * - color: accent do design token
 * - text-transform: none (mesmo se o heading for uppercase)
 */
export function StyledHeadline({ text, tokens, as: Tag = "h2", className, accentClassName }: Props) {
  // Parse *palavra* → segmentos
  const parts = text.split(/\*([^*]+)\*/);

  // Determinar font serif baseado no fontPairing
  const serifFont = getSerifFont(tokens.fontPairing);

  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em
            key={i}
            className={cn("not-italic", accentClassName)}
            style={{
              fontFamily: serifFont,
              fontStyle: "italic",
              fontWeight: 700,
              color: tokens.palette.accent,
              textTransform: "none",
            }}
          >
            {part}
          </em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </Tag>
  );
}

function getSerifFont(fontPairing: string): string {
  const serifs: Record<string, string> = {
    "oswald+roboto": "'Playfair Display', serif",
    "montserrat+opensans": "'Playfair Display', serif",
    "inter+merriweather": "'Merriweather', serif",
    "poppins+lora": "'Lora', serif",
    "playfair+source-sans": "'Playfair Display', serif",
    "dm-sans+dm-serif": "'DM Serif Display', serif",
    "raleway+roboto": "'Playfair Display', serif",
    "space-grotesk+inter": "'DM Serif Display', serif",
  };
  return serifs[fontPairing] || "'Playfair Display', serif";
}
```

---

## Utilitário: Unsplash Fallback por Nicho

Quando o cliente não tem foto, buscar imagem por categoria.

```tsx
// src/lib/unsplash-fallback.ts

const NICHE_QUERIES: Record<string, string[]> = {
  "lava-car": ["car detailing", "car wash professional", "auto detailing"],
  "estetica-automotiva": ["car polish", "auto detailing studio", "car cleaning"],
  barbearia: ["barber shop interior", "men haircut", "barber tools"],
  restaurante: ["restaurant interior", "food plating", "chef cooking"],
  clinica: ["medical clinic modern", "dental office", "healthcare interior"],
  academia: ["gym interior modern", "fitness equipment", "crossfit box"],
  salao: ["beauty salon interior", "hair styling", "salon workspace"],
  advocacia: ["law office interior", "legal books", "modern office"],
  floricultura: ["flower shop", "flower arrangement", "botanical"],
  oficina: ["auto repair shop", "mechanic tools", "car engine"],
  borracharia: ["tire shop", "wheel alignment", "auto service"],
  "pet-shop": ["pet grooming", "pet store", "dog grooming"],
  hotel: ["luxury hotel room", "hotel lobby", "resort pool"],
  fotografo: ["photography studio", "camera equipment", "photo gallery"],
};

// Usar Unsplash Source (free, sem API key necessária)
export function getUnsplashFallback(
  category: string,
  index: number = 0,
  size: string = "800x600"
): string {
  const normalized = category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const key = Object.keys(NICHE_QUERIES).find(k =>
    normalized.includes(k.replace(/-/g, " ")) || k.includes(normalized)
  );

  const queries = key ? NICHE_QUERIES[key] : ["business interior"];
  const query = queries[index % queries.length];

  return `https://images.unsplash.com/photo-random?w=${size.split("x")[0]}&q=80&fit=crop&${query.replace(/ /g, "+")}`;
}
```

**NOTA:** Em produção, usar a Unsplash API oficial com API key para resultados melhores.
O código acima é um fallback simplificado.

---

## 1. HERO — Premium com imagem + badge flutuante

```tsx
// src/components/site-renderer/blocks/hero/hero-premium.tsx
"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    headline: string;
    subheadline: string;
    ctaText: string;
    ctaLink?: string;
    ctaType?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    backgroundImage?: string;
  };
  tokens: DesignTokens;
}

export function HeroPremium({ content, tokens }: Props) {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Background image */}
      {content.backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={content.backgroundImage}
            alt=""
            className="w-full h-full object-cover opacity-35"
          />
        </div>
      )}

      {/* Gradient overlay: heavy left, light right */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${tokens.palette.primary}ee 0%, ${tokens.palette.primary}99 50%, ${tokens.palette.primary}44 100%)`,
        }}
      />

      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%22.85%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />

      {/* Decorative circle shape */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] rounded-full border pointer-events-none"
        style={{ borderColor: `${tokens.palette.accent}12` }}
      >
        <div
          className="absolute inset-10 rounded-full border"
          style={{ borderColor: `${tokens.palette.accent}08` }}
        />
      </div>

      {/* Center line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

      {/* Content grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="py-10">
            {/* Label */}
            <div
              className="pgl-fade-up inline-flex items-center gap-3 mb-8"
              style={{ color: tokens.palette.accent }}
            >
              <span
                className="block w-10 h-px"
                style={{ backgroundColor: tokens.palette.accent }}
              />
              <span className="text-[0.7rem] font-medium tracking-[0.15em] uppercase">
                {tokens.style === "industrial" ? "Estética automotiva premium" : "Negócio local"}
              </span>
            </div>

            {/* Headline with accent word */}
            <StyledHeadline
              text={content.headline}
              tokens={tokens}
              as="h1"
              className={cn(
                "pgl-fade-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                "font-bold leading-[1.0] tracking-tight text-white uppercase",
              )}
              accentClassName="normal-case"
            />

            {/* Subheadline */}
            <p
              className="pgl-fade-up mt-6 text-base md:text-lg leading-[1.75] text-white/55 max-w-[440px] font-light"
              data-delay="2"
            >
              {content.subheadline}
            </p>

            {/* CTAs */}
            <div className="pgl-fade-up mt-10 flex flex-wrap gap-4" data-delay="3">
              <a
                href={content.ctaLink || "#contact"}
                className={cn(
                  "inline-flex items-center px-9 py-4",
                  "text-[0.82rem] font-medium tracking-[0.06em] uppercase text-white",
                  "transition-all duration-250",
                  "hover:translate-y-[-2px] hover:shadow-lg",
                  "active:translate-y-0",
                )}
                style={{
                  backgroundColor: tokens.palette.accent,
                  boxShadow: "none",
                  borderRadius: tokens.borderRadius === "none" ? "0" : "2px",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.boxShadow = `0 8px 30px ${tokens.palette.accent}40`;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.boxShadow = "none";
                }}
              >
                {content.ctaText}
              </a>
              {content.secondaryCtaText && (
                <a
                  href={content.secondaryCtaLink || "#services"}
                  className={cn(
                    "inline-flex items-center px-9 py-4",
                    "text-[0.82rem] font-medium tracking-[0.06em] uppercase",
                    "text-white/80 border border-white/15",
                    "transition-all duration-200",
                    "hover:border-white/40 hover:text-white",
                  )}
                  style={{ borderRadius: tokens.borderRadius === "none" ? "0" : "2px" }}
                >
                  {content.secondaryCtaText}
                </a>
              )}
            </div>
          </div>

          {/* Floating image (desktop only) */}
          {content.backgroundImage && (
            <div className="hidden lg:flex justify-center items-center pgl-fade-right" data-delay="4">
              <div className="relative">
                {/* Accent border offset */}
                <div
                  className="absolute -top-6 -right-6 w-40 h-40 z-0"
                  style={{
                    border: `2px solid ${tokens.palette.accent}`,
                    opacity: 0.15,
                  }}
                />
                {/* Main image */}
                <div className="relative w-[400px] h-[480px] overflow-hidden shadow-2xl z-10"
                  style={{ borderRadius: tokens.borderRadius === "none" ? "0" : "4px" }}
                >
                  <img
                    src={content.backgroundImage}
                    alt={content.headline.replace(/\*/g, "")}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badge */}
                <div
                  className="pgl-float absolute -bottom-5 -left-8 z-20 px-6 py-4 text-white text-[0.82rem] font-semibold tracking-[0.08em] uppercase shadow-xl"
                  style={{
                    backgroundColor: tokens.palette.accent,
                    fontFamily: "var(--pgl-font-heading)",
                    boxShadow: `0 12px 40px ${tokens.palette.accent}40`,
                    borderRadius: tokens.borderRadius === "none" ? "0" : "2px",
                  }}
                >
                  Resultado garantido
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[0.65rem] tracking-[0.15em] uppercase text-white/25">scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
      </div>
    </section>
  );
}
```

---

## 2. TRUST BAR — Flutuante sobre o hero

```tsx
// src/components/site-renderer/blocks/trust-bar/trust-bar-float.tsx
"use client";

import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    items: { value: string; label: string }[];
  };
  tokens: DesignTokens;
}

export function TrustBarFloat({ content, tokens }: Props) {
  const validItems = content.items.filter(item => {
    const num = parseInt(item.value.replace(/[^0-9.]/g, ""));
    return item.value && (isNaN(num) || num > 0);
  });

  if (validItems.length < 2) return null;

  return (
    <div className="relative z-10 -mt-10 mb-0">
      <div
        className="pgl-scale-in max-w-[900px] mx-auto bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        style={{ borderRadius: tokens.borderRadius === "none" ? "0" : "4px" }}
        data-delay="3"
      >
        <div
          className={cn(
            "grid divide-x divide-gray-100",
            validItems.length === 2 && "grid-cols-2",
            validItems.length === 3 && "grid-cols-3",
            validItems.length >= 4 && "grid-cols-4",
          )}
        >
          {validItems.map((item, i) => (
            <div key={i} className="py-7 px-8 text-center">
              <div
                className="text-2xl font-semibold tracking-tight tabular-nums"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.primary,
                }}
              >
                {item.value}
              </div>
              <div className="mt-1 text-[0.7rem] font-normal uppercase tracking-[0.08em] text-gray-400">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 3. SERVICES — Grid com hover escuro + numeração

```tsx
// src/components/site-renderer/blocks/services/services-premium-grid.tsx
"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface ServiceItem {
  name: string;
  description: string;
  price?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface Props {
  content: {
    title: string;
    subtitle?: string;
    items: ServiceItem[];
  };
  tokens: DesignTokens;
}

export function ServicesPremiumGrid({ content, tokens }: Props) {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background shape */}
      <div
        className="absolute -top-[200px] -right-[300px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ backgroundColor: tokens.palette.accent, opacity: 0.02 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header: 2-column */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 items-end">
          <StyledHeadline
            text={content.title}
            tokens={tokens}
            className={cn(
              "pgl-fade-up text-3xl md:text-4xl lg:text-5xl",
              "font-bold leading-[1.05] tracking-tight uppercase",
            )}
            accentClassName="normal-case"
          />
          {content.subtitle && (
            <p
              className="pgl-fade-up text-[0.95rem] leading-[1.8] font-light"
              style={{ color: tokens.palette.textMuted }}
              data-delay="1"
            >
              {content.subtitle}
            </p>
          )}
        </div>

        {/* Service grid: 2×2 with gap lines */}
        <div
          className="grid sm:grid-cols-2 gap-px overflow-hidden"
          style={{
            backgroundColor: `${tokens.palette.text}08`,
            borderRadius: tokens.borderRadius === "none" ? "0" : "4px",
          }}
        >
          {content.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "group bg-white p-12 transition-all duration-400 cursor-default pgl-fade-up",
                "hover:bg-[--hover-bg]",
              )}
              style={{
                // @ts-ignore
                "--hover-bg": tokens.palette.primary,
                animationDelay: `${(i + 1) * 0.1}s`,
              }}
              data-delay={i + 1}
            >
              {/* Number */}
              <div
                className="text-5xl font-bold leading-none mb-5 transition-colors duration-400"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: `${tokens.palette.text}06`,
                }}
              >
                <span className="group-hover:!text-[--accent-c]" style={{ "--accent-c": tokens.palette.accent } as any}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-lg font-semibold tracking-[0.03em] uppercase mb-3 transition-colors duration-400 group-hover:text-white"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.text,
                }}
              >
                {item.name}
              </h3>

              {/* Accent line */}
              <div
                className="w-8 h-0.5 mb-4 transition-colors duration-400"
                style={{ backgroundColor: tokens.palette.accent }}
              />

              {/* Description */}
              <p
                className="text-[0.875rem] leading-[1.75] font-light transition-colors duration-400 group-hover:text-white/70"
                style={{ color: tokens.palette.textMuted }}
              >
                {item.description}
              </p>

              {/* Price if available */}
              {item.price && (
                <div
                  className="mt-4 text-lg font-semibold tabular-nums transition-colors duration-400 group-hover:text-white"
                  style={{ color: tokens.palette.accent }}
                >
                  {item.price}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 4. ABOUT — Seção dark com imagem + borda offset

```tsx
// src/components/site-renderer/blocks/about/about-premium-dark.tsx
"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    title: string;
    subtitle?: string;
    paragraphs: string[];
    highlights?: { label: string; value: string }[];
    image?: string;
  };
  tokens: DesignTokens;
}

export function AboutPremiumDark({ content, tokens }: Props) {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: tokens.palette.primary }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-11 gap-16 lg:gap-20 items-center">
          {/* Image: 5 cols */}
          <div className="lg:col-span-5 pgl-fade-left" data-delay="2">
            <div className="relative">
              {/* Offset border */}
              <div
                className="absolute top-5 left-5 right-[-20px] bottom-[-20px] border z-0"
                style={{
                  borderColor: `${tokens.palette.accent}25`,
                  borderRadius: tokens.borderRadius === "none" ? "0" : "4px",
                }}
              />
              {/* Background shape */}
              <div
                className="absolute -bottom-10 -right-10 w-28 h-28 z-0"
                style={{ backgroundColor: tokens.palette.accent, opacity: 0.08 }}
              />
              {/* Image */}
              <div
                className="relative z-10 overflow-hidden"
                style={{ borderRadius: tokens.borderRadius === "none" ? "0" : "4px" }}
              >
                {content.image ? (
                  <img
                    src={content.image}
                    alt={content.title.replace(/\*/g, "")}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[4/5] bg-white/5" />
                )}
              </div>
            </div>
          </div>

          {/* Text: 6 cols */}
          <div className="lg:col-span-6">
            {/* Label with extending line */}
            <div className="pgl-fade-up flex items-center gap-3 mb-5">
              <span
                className="text-[0.7rem] font-medium tracking-[0.15em] uppercase"
                style={{ color: tokens.palette.accent }}
              >
                Quem somos
              </span>
              <span className="flex-1 h-px bg-white/[0.06]" />
            </div>

            <StyledHeadline
              text={content.title}
              tokens={tokens}
              className={cn(
                "pgl-fade-up text-3xl md:text-4xl lg:text-[2.8rem]",
                "font-bold leading-[1.08] tracking-tight uppercase text-white",
              )}
              accentClassName="normal-case"
              data-delay="1"
            />

            {/* Paragraphs */}
            <div className="mt-7 space-y-4 pgl-fade-up" data-delay="2">
              {content.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-[0.925rem] leading-[1.85] font-light max-w-[500px]"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Highlights */}
            {content.highlights && content.highlights.length > 0 && (
              <div
                className="pgl-fade-up grid grid-cols-3 gap-6 mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                data-delay="3"
              >
                {content.highlights.map((h, i) => (
                  <div key={i}>
                    <div
                      className="text-xl font-semibold text-white"
                      style={{ fontFamily: "var(--pgl-font-heading)" }}
                    >
                      {h.value}
                    </div>
                    <div className="mt-1 text-[0.65rem] uppercase tracking-[0.1em] text-white/30 font-normal">
                      {h.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 5. TESTIMONIALS — Quote serif com aspas decorativas

```tsx
// src/components/site-renderer/blocks/testimonials/testimonials-premium.tsx
"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface TestimonialItem {
  text: string;
  author: string;
  rating?: number;
  role?: string;
}

interface Props {
  content: {
    title: string;
    subtitle?: string;
    items: TestimonialItem[];
  };
  tokens: DesignTokens;
}

export function TestimonialsPremium({ content, tokens }: Props) {
  const featured = content.items[0];
  const serifFont = getSerifFont(tokens.fontPairing);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header: centered */}
      <div className="text-center mb-16 pgl-fade-up">
        <StyledHeadline
          text={content.title}
          tokens={tokens}
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase"
        />
      </div>

      {/* Featured quote */}
      {featured && (
        <div className="max-w-[800px] mx-auto text-center pgl-fade-up" data-delay="1">
          {/* Giant decorative quote */}
          <span
            className="block text-[8rem] leading-none select-none pointer-events-none -mb-10"
            style={{
              fontFamily: serifFont,
              color: tokens.palette.accent,
              opacity: 0.08,
            }}
          >
            &ldquo;
          </span>

          <blockquote
            className="text-xl md:text-2xl leading-[1.7] font-bold"
            style={{
              fontFamily: serifFont,
              fontStyle: "italic",
              color: tokens.palette.text,
            }}
          >
            {featured.text}
          </blockquote>

          <div className="mt-8 flex items-center justify-center gap-4">
            {/* Avatar initials */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white"
              style={{
                backgroundColor: tokens.palette.primary,
                fontFamily: "var(--pgl-font-heading)",
              }}
            >
              {featured.author.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="text-left">
              <div
                className="text-[0.9rem] font-semibold tracking-[0.05em] uppercase"
                style={{
                  fontFamily: "var(--pgl-font-heading)",
                  color: tokens.palette.text,
                }}
              >
                {featured.author}
              </div>
              {featured.role && (
                <div className="text-xs mt-0.5" style={{ color: tokens.palette.textMuted }}>
                  {featured.role}
                </div>
              )}
            </div>
            {/* Rating dots */}
            {featured.rating && (
              <div className="flex gap-1 ml-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i < featured.rating!
                        ? tokens.palette.accent
                        : `${tokens.palette.text}15`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getSerifFont(fontPairing: string): string {
  const serifs: Record<string, string> = {
    "oswald+roboto": "'Playfair Display', serif",
    "montserrat+opensans": "'Playfair Display', serif",
    "inter+merriweather": "'Merriweather', serif",
    "poppins+lora": "'Lora', serif",
    "playfair+source-sans": "'Playfair Display', serif",
    "dm-sans+dm-serif": "'DM Serif Display', serif",
  };
  return serifs[fontPairing] || "'Playfair Display', serif";
}
```

---

## 6. FAQ — Split com CTA + ícone animado

```tsx
// src/components/site-renderer/blocks/faq/faq-premium.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    title: string;
    subtitle?: string;
    items: { question: string; answer: string }[];
  };
  tokens: DesignTokens;
}

export function FaqPremium({ content, tokens }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-5 gap-16 lg:gap-20 items-start">
        {/* Left: header + CTA (2 cols) */}
        <div className="lg:col-span-2 pgl-fade-up">
          <StyledHeadline
            text={content.title}
            tokens={tokens}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight uppercase"
          />
          {content.subtitle && (
            <p
              className="mt-4 text-[0.925rem] leading-[1.7] font-light"
              style={{ color: tokens.palette.textMuted }}
            >
              {content.subtitle}
            </p>
          )}
          <a
            href="#contact"
            className={cn(
              "inline-flex items-center gap-2 mt-8",
              "px-7 py-3.5 text-[0.8rem] font-medium tracking-[0.05em] uppercase text-white",
              "transition-all duration-200",
              "hover:translate-y-[-1px]",
            )}
            style={{
              backgroundColor: tokens.palette.primary,
              borderRadius: tokens.borderRadius === "none" ? "0" : "2px",
            }}
          >
            Falar no WhatsApp
          </a>
        </div>

        {/* Right: accordion (3 cols) */}
        <div className="lg:col-span-3 pgl-fade-up" data-delay="1">
          {content.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="border-b"
                style={{ borderColor: `${tokens.palette.text}08` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-5 py-5 text-left group"
                >
                  <span
                    className={cn(
                      "text-[0.925rem] font-medium tracking-tight transition-colors duration-200",
                      "group-hover:!text-[--accent]",
                    )}
                    style={{
                      color: tokens.palette.text,
                      "--accent": tokens.palette.accent,
                    } as any}
                  >
                    {item.question}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      borderColor: `${tokens.palette.text}10`,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus
                      className="w-3 h-3"
                      style={{ color: tokens.palette.textMuted }}
                    />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all duration-400",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className="pb-5 text-[0.875rem] leading-[1.8] font-light max-w-[540px]"
                      style={{ color: tokens.palette.textMuted }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

---

## 7. CTA — Imagem de fundo com overlay

```tsx
// src/components/site-renderer/blocks/cta/cta-premium-image.tsx
"use client";

import { cn } from "@/lib/utils";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    title: string;
    subtitle?: string;
    ctaText: string;
    ctaLink?: string;
    backgroundImage?: string;
  };
  tokens: DesignTokens;
}

export function CtaPremiumImage({ content, tokens }: Props) {
  return (
    <div className="relative h-[480px] overflow-hidden">
      {/* Background image */}
      {content.backgroundImage ? (
        <img
          src={content.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: tokens.palette.primary }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${tokens.palette.primary}ee, ${tokens.palette.primary}bb)`,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center max-w-[600px] px-6 pgl-fade-up">
          <StyledHeadline
            text={content.title}
            tokens={tokens}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight uppercase text-white leading-[1.08]"
            accentClassName="normal-case"
          />
          {content.subtitle && (
            <p className="mt-4 text-base leading-[1.7] text-white/50 font-light">
              {content.subtitle}
            </p>
          )}
          <a
            href={content.ctaLink || "#contact"}
            className={cn(
              "inline-flex items-center mt-9 px-11 py-4",
              "text-[0.85rem] font-medium tracking-[0.08em] uppercase text-white",
              "transition-all duration-250",
              "hover:translate-y-[-2px]",
            )}
            style={{
              backgroundColor: tokens.palette.accent,
              borderRadius: tokens.borderRadius === "none" ? "0" : "2px",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = `0 12px 40px ${tokens.palette.accent}40`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            {content.ctaText}
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. CONTACT — Premium com ícones circulares + form em card

```tsx
// src/components/site-renderer/blocks/contact/contact-premium.tsx
"use client";

import { cn } from "@/lib/utils";
import { MapPin, Phone, Clock } from "lucide-react";
import { StyledHeadline } from "../shared/styled-headline";
import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  content: {
    title: string;
    subtitle?: string;
    showForm?: boolean;
    formFields?: string[];
    address?: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  tokens: DesignTokens;
}

export function ContactPremium({ content, tokens }: Props) {
  const radius = tokens.borderRadius === "none" ? "0" : tokens.borderRadius === "sm" ? "2px" : "4px";

  const contactItems = [
    content.address && { icon: MapPin, label: "Endereço", value: content.address },
    content.phone && { icon: Phone, label: "Telefone", value: content.phone },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
        {/* Left: info */}
        <div className="pgl-fade-up">
          <StyledHeadline
            text={content.title}
            tokens={tokens}
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight uppercase mb-4"
          />
          {content.subtitle && (
            <p
              className="text-[0.925rem] leading-[1.7] font-light mb-10"
              style={{ color: tokens.palette.textMuted }}
            >
              {content.subtitle}
            </p>
          )}

          <div className="space-y-5">
            {contactItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tokens.palette.accent}0a` }}
                >
                  <item.icon
                    className="w-[18px] h-[18px]"
                    style={{ color: tokens.palette.accent }}
                  />
                </div>
                <div>
                  <div className="text-[0.7rem] uppercase tracking-[0.08em] text-gray-400 mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-[0.875rem] font-normal" style={{ color: tokens.palette.text }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {content.whatsapp && (
            <a
              href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 mt-9",
                "px-8 py-4 text-[0.82rem] font-medium tracking-[0.06em] uppercase text-white",
                "transition-all duration-200",
                "hover:translate-y-[-1px]",
              )}
              style={{
                backgroundColor: tokens.palette.primary,
                borderRadius: radius,
              }}
            >
              Falar no WhatsApp
            </a>
          )}
        </div>

        {/* Right: form in card */}
        {content.showForm && (
          <div
            className="pgl-fade-up bg-white p-10 lg:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
            style={{ borderRadius: radius }}
            data-delay="2"
          >
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full px-4 py-3.5 text-[0.875rem] border outline-none transition-colors duration-200 focus:border-current"
                    style={{
                      borderColor: `${tokens.palette.text}0c`,
                      backgroundColor: tokens.palette.background,
                      borderRadius: radius,
                      color: tokens.palette.text,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3.5 text-[0.875rem] border outline-none transition-colors duration-200 focus:border-current"
                    style={{
                      borderColor: `${tokens.palette.text}0c`,
                      backgroundColor: tokens.palette.background,
                      borderRadius: radius,
                      color: tokens.palette.text,
                    }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2">
                  Serviço desejado
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lavagem completa, polimento..."
                  className="w-full px-4 py-3.5 text-[0.875rem] border outline-none transition-colors duration-200 focus:border-current"
                  style={{
                    borderColor: `${tokens.palette.text}0c`,
                    backgroundColor: tokens.palette.background,
                    borderRadius: radius,
                    color: tokens.palette.text,
                  }}
                />
              </div>
              <div>
                <label className="block text-[0.75rem] font-medium uppercase tracking-[0.08em] mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  placeholder="Descreva o que precisa..."
                  className="w-full px-4 py-3.5 text-[0.875rem] border outline-none transition-colors duration-200 resize-none focus:border-current"
                  style={{
                    borderColor: `${tokens.palette.text}0c`,
                    backgroundColor: tokens.palette.background,
                    borderRadius: radius,
                    color: tokens.palette.text,
                  }}
                />
              </div>
              <button
                type="submit"
                className={cn(
                  "w-full py-4 text-[0.82rem] font-medium tracking-[0.08em] uppercase text-white",
                  "transition-all duration-200",
                  "hover:translate-y-[-1px]",
                )}
                style={{
                  backgroundColor: tokens.palette.accent,
                  borderRadius: radius,
                }}
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 9. FOOTER — Dark premium

```tsx
// src/components/site-renderer/blocks/footer/footer-premium.tsx
"use client";

import type { DesignTokens } from "@/types/ai-generation";

interface Props {
  tokens: DesignTokens;
  globalContent: {
    tagline?: string;
    footerText?: string;
  };
  navigation: { label: string; href: string }[];
  storeName: string;
}

export function FooterPremium({ tokens, globalContent, navigation, storeName }: Props) {
  return (
    <footer style={{ backgroundColor: tokens.palette.primary }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-8">
        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div
              className="text-base font-semibold text-white tracking-[0.1em] uppercase mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              {storeName}
            </div>
            {globalContent.tagline && (
              <p className="text-[0.825rem] leading-[1.7] text-white/30 font-light max-w-xs">
                {globalContent.tagline}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-white/45 mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              Navegação
            </h4>
            <div className="space-y-2.5">
              {navigation.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="block text-[0.825rem] text-white/30 font-light transition-colors duration-200 hover:text-white/70"
                  style={{ "--accent": tokens.palette.accent } as any}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact summary */}
          <div>
            <h4 className="text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-white/45 mb-4"
              style={{ fontFamily: "var(--pgl-font-heading)" }}
            >
              Contato
            </h4>
            <div className="space-y-2.5 text-[0.825rem] text-white/30 font-light">
              <p>WhatsApp disponível</p>
              <p>Seg - Sáb, 07:10 - 18:00</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-8 flex flex-wrap justify-between gap-4 text-[0.72rem] text-white/20 tracking-[0.03em]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span>{globalContent.footerText || `© ${new Date().getFullYear()} ${storeName}`}</span>
          <span>Desenvolvido por Página Local</span>
        </div>
      </div>
    </footer>
  );
}
```

---

## 10. PAGE RENDERER — Orquestra tudo

```tsx
// src/components/site-renderer/page-renderer.tsx
"use client";

import { Suspense } from "react";
import { cn } from "@/lib/utils";
import type {
  PageBlueprint,
  SiteBlueprint,
  DesignTokens,
  SectionBlock as SectionBlockType,
} from "@/types/ai-generation";
import { DesignTokensProvider } from "./design-tokens-provider";

// Blocos que gerenciam seu próprio fundo
const SELF_BG = ["hero", "cta", "whatsapp-float"];
// Blocos que DEVEM ser renderizados como seção dark
const ALWAYS_DARK = ["about"]; // About premium é sempre dark
// Blocos elegíveis para dark quando posicionados no meio
const DARK_ELIGIBLE = ["stats"];

interface Props {
  page: PageBlueprint;
  blueprint: SiteBlueprint;
  isPreview?: boolean;
  renderBlock: (
    block: SectionBlockType,
    tokens: DesignTokens,
    isDark: boolean,
    blueprint: SiteBlueprint
  ) => React.ReactNode;
}

export function PageRenderer({ page, blueprint, isPreview, renderBlock }: Props) {
  const { designTokens } = blueprint;
  const sections = [...page.sections]
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  let surfaceIndex = 0;

  return (
    <DesignTokensProvider tokens={designTokens}>
      <main
        className="min-h-screen"
        style={{
          backgroundColor: designTokens.palette.background,
          color: designTokens.palette.text,
          fontFamily: "var(--pgl-font-body), system-ui, sans-serif",
        }}
      >
        {sections.map((section, i) => {
          const isSelfBg = SELF_BG.includes(section.blockType);
          const isAlwaysDark = ALWAYS_DARK.includes(section.blockType);
          const isDark = isAlwaysDark;

          // Alternate surface/transparent for non-self-bg blocks
          let sectionStyle: React.CSSProperties = {};
          if (!isSelfBg && !isDark) {
            if (surfaceIndex % 2 === 1) {
              sectionStyle = { backgroundColor: designTokens.palette.surface };
            }
            surfaceIndex++;
          }

          // Padding: generous, but not for self-bg blocks
          const needsPadding = !SELF_BG.includes(section.blockType);

          return (
            <div key={section.id} style={sectionStyle}>
              <div className={cn(needsPadding && "py-24 md:py-32")}>
                <Suspense fallback={<div className="h-48 animate-pulse" />}>
                  {renderBlock(section, designTokens, isDark, blueprint)}
                </Suspense>
              </div>
            </div>
          );
        })}
      </main>
    </DesignTokensProvider>
  );
}
```

---

## Ajuste no Prompt: Marcar palavras-destaque

Adicionar ao system prompt no prompt-builder.ts:

```
REGRA DE HEADLINE COM DESTAQUE:
- Em TODA headline de seção, marque UMA palavra ou expressão curta com asteriscos
  para que o renderer aplique o tratamento visual premium (serif italic + accent color)
- Exemplos:
  "Seu carro *impecável* em Santa Inês"
  "Serviços de *estética automotiva*"
  "Cuidado *real* com cada veículo"
  "O que nossos clientes *dizem*"
  "Perguntas *frequentes*"
  "Fale com a *Lava Car*"
- A palavra marcada deve ser a mais expressiva/emocional da frase
- Marque no MÁXIMO 1-3 palavras por headline
- NUNCA marque a frase inteira
```

---

## Checklist de Qualidade Premium

Cada componente deve passar em TODOS estes critérios:

- [ ] StyledHeadline usado em toda headline de seção (palavra em destaque)
- [ ] Font heading (Oswald/var) em títulos, font serif (Playfair/var) em destaques
- [ ] Uppercase + tracking em títulos de seção e labels
- [ ] Font-light (300) em body text e descrições (não regular 400)
- [ ] Accent color usado em: labels, linhas decorativas, hover states, badges, números
- [ ] Pelo menos 1 seção dark (about ou stats) com dot pattern
- [ ] Imagem com borda/shape offset quando disponível (about, hero)
- [ ] Trust bar flutuante com margin-top negativo
- [ ] Service cards com hover que inverte para fundo dark
- [ ] FAQ com ícone + que roda para × no open
- [ ] CTA com imagem de fundo + overlay
- [ ] Form em card com sombra (não inline)
- [ ] Labels em uppercase tracking-wider (0.08em+)
- [ ] Botões com hover: translateY(-2px) + shadow colorido
- [ ] Grain texture no hero
- [ ] Scroll indicator no hero
- [ ] Footer dark com grid 3 colunas
- [ ] Zero ícones decorativos em serviços
- [ ] Zero shadow-md/lg (usar sombra sutil ou borda)
- [ ] Zero text-center em parágrafos longos
- [ ] Animações: fade-up, fade-left, fade-right, scale-in (variadas)
- [ ] prefers-reduced-motion respeitado