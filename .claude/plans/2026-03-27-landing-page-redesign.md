# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the PGL landing page from scratch following the Durable reference design — clean white background, black/opacity text, rounded-3xl cards, font-heading typography, business-input hero CTA, industry carousel, features platform, FAQ accordion, and modern footer.

**Architecture:** Modular section components in `src/app/(marketing)/_components/sections/`, shared compound components in `src/components/marketing/`, Framer Motion for scroll reveals. Each section is a standalone file. The main `landing-page.tsx` composes them all. Header and Footer are redesigned in-place.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, @tabler/icons-react, cva (compound components pattern)

---

## File Structure

### Shared Marketing Compound Components (new)
- `src/components/marketing/scroll-reveal.tsx` — ScrollReveal + stagger animation wrappers (reusable across all marketing pages)
- `src/components/marketing/section-shell.tsx` — Section container compound component (SectionShell, SectionHeader, SectionKicker, SectionTitle, SectionDescription)
- `src/components/marketing/feature-card.tsx` — FeatureCard compound component (card, icon, title, description)
- `src/components/marketing/faq-accordion.tsx` — FAQ accordion compound component (FAQAccordion, FAQItem)

### Landing Page Sections (new)
- `src/app/(marketing)/_components/sections/hero-section.tsx` — Hero with headline + business-type textarea CTA + social proof
- `src/app/(marketing)/_components/sections/industry-carousel.tsx` — Horizontal scrolling industry showcase with images
- `src/app/(marketing)/_components/sections/steps-section.tsx` — 3-step "how it works" cards
- `src/app/(marketing)/_components/sections/features-platform-section.tsx` — Feature showcase cards (AI builder, SEO, analytics, etc.)
- `src/app/(marketing)/_components/sections/tools-section.tsx` — Core tools grid (website builder, CRM, invoicing, discoverability)
- `src/app/(marketing)/_components/sections/comparison-section.tsx` — Comparison table (PGL vs Agency vs DIY)
- `src/app/(marketing)/_components/sections/testimonials-section.tsx` — Testimonials/social proof cards
- `src/app/(marketing)/_components/sections/faq-section.tsx` — FAQ with accordion
- `src/app/(marketing)/_components/sections/cta-section.tsx` — Final CTA block

### Modified Files
- `src/app/(marketing)/_components/landing-page.tsx` — Rewritten: thin composition of section imports
- `src/app/(marketing)/_components/marketing-header.tsx` — Redesigned: Durable-style sticky header
- `src/app/(marketing)/_components/marketing-footer.tsx` — Redesigned: Durable-style footer

---

## Design Tokens (Reference — Durable Style)

All components follow these tokens consistently:

```
Background:       bg-white (page), bg-black/[0.03] (card subtle)
Text primary:     text-black/80
Text secondary:   text-black/55
Text muted:       text-black/40
Heading font:     font-heading (mapped in tailwind config)
Body font:        font-body (system-ui)
H1:               text-[56px] leading-[60px] md:text-[80px] md:leading-[88px] font-heading
H2:               text-[32px] leading-[40px] font-heading text-black/80
Body:             text-base md:text-lg text-black/80
Card radius:      rounded-3xl (large), rounded-2xl (medium), rounded-xl (small)
Card border:      border border-black/[0.06]
Card shadow:      shadow-black/[0.06]
Button primary:   bg-black/80 text-white hover:shadow-button-dark rounded-2xl px-4 py-2
Button ghost:     hover:bg-black/5 text-black/80
Transitions:      transition-all duration-150
Spacing sections: pt-24 md:pt-32
Container:        max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-14
```

---

## Task 1: Shared Animation Utilities — scroll-reveal.tsx

**Files:**
- Create: `src/components/marketing/scroll-reveal.tsx`

- [ ] **Step 1: Create ScrollReveal compound component**

```tsx
"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={revealVariants} className={className}>
      {children}
    </motion.div>
  )
}

function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} className={className}>
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

export { ScrollReveal, StaggerGroup, StaggerItem, revealVariants, staggerContainer, staggerItem }
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/marketing/scroll-reveal.tsx
git commit -m "feat: add ScrollReveal shared animation components for marketing pages"
```

---

## Task 2: SectionShell Compound Component

**Files:**
- Create: `src/components/marketing/section-shell.tsx`

- [ ] **Step 1: Create SectionShell compound component with cva + forwardRef**

The SectionShell wraps every landing page section with consistent padding, max-width, and optional background. Subcomponents: SectionHeader, SectionKicker, SectionTitle, SectionDescription.

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "./scroll-reveal"

const sectionVariants = cva("relative", {
  variants: {
    spacing: {
      default: "pt-24 md:pt-32",
      tight: "pt-16 md:pt-24",
      none: "",
    },
    background: {
      default: "",
      subtle: "bg-black/[0.02]",
    },
  },
  defaultVariants: { spacing: "default", background: "default" },
})

interface SectionShellProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  as?: "section" | "div"
}

const SectionShell = React.forwardRef<HTMLElement, SectionShellProps>(
  ({ className, spacing, background, as: Tag = "section", children, ...props }, ref) => (
    <Tag ref={ref as React.Ref<HTMLElement>} className={cn(sectionVariants({ spacing, background }), className)} {...props}>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">{children}</div>
    </Tag>
  ),
)
SectionShell.displayName = "SectionShell"

function SectionHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <ScrollReveal className={cn("mb-16 text-center", className)}>{children}</ScrollReveal>
}

function SectionKicker({ children, className, color = "black" }: { children: React.ReactNode; className?: string; color?: string }) {
  return (
    <span className={cn("mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium", className)}>
      {children}
    </span>
  )
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-[32px] leading-[40px] font-heading text-black/80", className)}>
      {children}
    </h2>
  )
}

function SectionDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mx-auto mt-4 max-w-2xl text-base text-black/55 md:text-lg", className)}>
      {children}
    </p>
  )
}

export { SectionShell, SectionHeader, SectionKicker, SectionTitle, SectionDescription, sectionVariants }
```

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 3: FeatureCard Compound Component

**Files:**
- Create: `src/components/marketing/feature-card.tsx`

- [ ] **Step 1: Create FeatureCard compound component**

```tsx
"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const featureCardVariants = cva(
  "flex overflow-hidden rounded-3xl transition-all duration-150",
  {
    variants: {
      variant: {
        default: "bg-black/[0.03] hover:bg-black/[0.05]",
        outline: "border border-black/[0.06] bg-white hover:border-black/10",
      },
      layout: {
        vertical: "flex-col",
        horizontal: "flex-col xl:flex-row",
      },
    },
    defaultVariants: { variant: "default", layout: "vertical" },
  },
)

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof featureCardVariants> {}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, variant, layout, ...props }, ref) => (
    <div ref={ref} className={cn(featureCardVariants({ variant, layout }), className)} {...props} />
  ),
)
FeatureCard.displayName = "FeatureCard"

function FeatureCardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-1 flex-col gap-2 px-8 py-10 max-md:px-6", className)}>{children}</div>
}

function FeatureCardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-xl font-heading text-black/80 md:text-2xl", className)}>{children}</h3>
}

function FeatureCardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-base text-black/55", className)}>{children}</p>
}

function FeatureCardVisual({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("overflow-hidden", className)}>{children}</div>
}

function FeatureCardIcon({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4 flex size-12 items-center justify-center rounded-2xl", className)}>{children}</div>
}

export { FeatureCard, FeatureCardContent, FeatureCardTitle, FeatureCardDescription, FeatureCardVisual, FeatureCardIcon, featureCardVariants }
```

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 4: FAQ Accordion Compound Component

**Files:**
- Create: `src/components/marketing/faq-accordion.tsx`

- [ ] **Step 1: Create FAQ accordion with Radix Accordion primitives**

Uses `@radix-ui/react-accordion` for accessible expand/collapse. Follows Durable reference: clean borders, rotate chevron on open, smooth grid-template-rows animation.

```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { IconChevronDown } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

const FAQAccordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root ref={ref} className={cn("space-y-3", className)} {...props} />
))
FAQAccordion.displayName = "FAQAccordion"

const FAQItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-colors data-[state=open]:bg-black/[0.02]", className)}
    {...props}
  >
    {children}
  </AccordionPrimitive.Item>
))
FAQItem.displayName = "FAQItem"

const FAQTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between px-6 py-5 text-left text-base font-medium text-black/80 transition-all [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <IconChevronDown className="size-5 shrink-0 text-black/40 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
FAQTrigger.displayName = "FAQTrigger"

const FAQContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("px-6 pb-5 text-base text-black/55 leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
FAQContent.displayName = "FAQContent"

export { FAQAccordion, FAQItem, FAQTrigger, FAQContent }
```

- [ ] **Step 2: Verify Radix accordion dependency exists**

Run: `grep "@radix-ui/react-accordion" package.json`

If missing, install: `npm install @radix-ui/react-accordion`

- [ ] **Step 3: Verify no type errors**
- [ ] **Step 4: Commit**

---

## Task 5: Redesign Marketing Header

**Files:**
- Modify: `src/app/(marketing)/_components/marketing-header.tsx`

- [ ] **Step 1: Rewrite header following Durable style**

Durable header: sticky, white bg with backdrop-blur, border-b border-black/10, logo left, nav center (hidden mobile), CTA right. Clean, minimal.

Key changes from current:
- Remove slate-* and dark:* classes — use black/opacity tokens
- Remove glassmorphism (bg-white/70 backdrop-blur) — use solid bg-white/90 backdrop-blur-md
- Simplify nav: just "Construtor de sites IA" + "Precos" links
- CTA: dark button "Ir para o app" (logged in) or "Comecar" (logged out)
- Mobile: just logo + hamburger or simplified buttons

```tsx
'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/shared/logo'
import { IconRocket, IconLayoutDashboard } from '@tabler/icons-react'

interface MarketingHeaderProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

export function MarketingHeader({ isLoggedIn = false, hasSubscription = false }: MarketingHeaderProps) {
  const searchParams = useSearchParams()
  const shouldHideAuthButtons = searchParams.get('wpp') === 'true'

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-14">
        <Logo size="sm" href="/" />

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-8 lg:flex">
          <Link href="/#como-funciona" className="text-sm font-medium text-black/55 transition-colors hover:text-black/80">
            Construtor de sites IA
          </Link>
          <Link href="/planos" className="text-sm font-medium text-black/55 transition-colors hover:text-black/80">
            Precos
          </Link>
        </nav>

        {/* Right CTA */}
        <nav className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {!hasSubscription && (
                <Link href="/planos" className="hidden rounded-2xl bg-black/80 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/90 hover:shadow-lg sm:block">
                  <IconRocket className="mr-1.5 inline-block size-4" />
                  Ativar site
                </Link>
              )}
              <Link href="/painel" className="flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-medium text-black/80 transition-colors hover:bg-black/5">
                <IconLayoutDashboard className="size-4" />
                <span className="hidden sm:inline">Painel</span>
              </Link>
            </>
          ) : (
            <>
              {!shouldHideAuthButtons && (
                <>
                  <Link href="/entrar" className="hidden rounded-2xl px-4 py-2 text-sm font-medium text-black/55 transition-colors hover:bg-black/5 hover:text-black/80 sm:block">
                    Entrar
                  </Link>
                  <Link href="/cadastro" className="rounded-2xl bg-black/80 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-black/90 hover:shadow-lg">
                    Comecar
                  </Link>
                </>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 6: Redesign Marketing Footer

**Files:**
- Modify: `src/app/(marketing)/_components/marketing-footer.tsx`

- [ ] **Step 1: Rewrite footer following Durable style**

Durable footer: generous padding (py-28 md:py-40), flex column layout on mobile → row on desktop, company info + nav links + legal links. Clean black/opacity tokens.

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 7: Hero Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/hero-section.tsx`

- [ ] **Step 1: Build hero section following Durable reference**

Key elements:
- Full viewport height (min-h-[calc(100svh-56px)])
- Large heading: font-heading, text-[56px] md:text-[80px]
- Subheading: text-base md:text-lg text-black/80, max-w-[512px]
- Primary CTA: large dark button "Comecar de graca" with rounded-2xl
- Social proof line: "Com a confianca de +2.000 empresarios" text-sm text-black/40
- Business type textarea input with rounded-3xl bg-black/[0.03] and submit button
- Framer Motion entrance animations

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 8: Steps Section ("Como funciona")

**Files:**
- Create: `src/app/(marketing)/_components/sections/steps-section.tsx`

- [ ] **Step 1: Build 3-step process section**

Uses SectionShell + SectionHeader compounds. Three cards in a grid with:
- Step number badge (01, 02, 03)
- Icon in gradient box
- Title + description
- Durable card style: rounded-3xl bg-black/[0.03]

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 9: Features Platform Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/features-platform-section.tsx`

- [ ] **Step 1: Build feature showcase using FeatureCard compounds**

Durable pattern: large cards in asymmetric grid (2-col + 1-col, stacked). Each card has title, description, and visual mockup area. Cards use bg-black/[0.03] rounded-3xl.

Features to showcase:
1. "Projetos profissionais" — stunning designs that convert
2. "Escrito com maestria" — AI content
3. "Prioridade mobile" — responsive
4. "Otimizado para SEO e IA" — search optimization
5. "Dominios personalizados"
6. "Analytics completo"

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 10: Tools Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/tools-section.tsx`

- [ ] **Step 1: Build core tools grid**

Grid of tool cards showing all included tools:
- Construtor de Sites IA (free)
- Estudio de Imagem IA (free)
- SEO e Descoberta (free)
- Faturamento (free)
- CRM (free)
- Analytics (free)

Each card: icon + name + description + "Incluso" badge. Durable style cards.

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 11: Comparison Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/comparison-section.tsx`

- [ ] **Step 1: Rebuild comparison table with Durable styling**

Same data as current (PGL vs Agency vs DIY), but:
- Use black/opacity tokens instead of slate-*
- Desktop: clean table with rounded-2xl border border-black/[0.06]
- "Melhor opcao" badge on PGL column
- Mobile: stacked cards
- Check/X icons for boolean features

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 12: FAQ Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/faq-section.tsx`

- [ ] **Step 1: Build FAQ section using FAQAccordion compound**

6 questions adapted for PGL:
1. "Como o Decolou cria meu site com IA?"
2. "Posso personalizar o design do site gerado pela IA?"
3. "Meu site sera otimizado para SEO?"
4. "Quais outras ferramentas estao incluidas?"
5. "Posso usar o construtor de sites de graca?"
6. "Como funciona o dominio personalizado?"

Uses SectionShell + FAQAccordion compounds.

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 13: CTA Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/cta-section.tsx`

- [ ] **Step 1: Build final CTA block**

Large card with bg-black/[0.03] rounded-3xl, centered:
- Heading: "Comece de graca hoje"
- Description
- Primary dark CTA button
- "Sem cartao de credito" text

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 14: Testimonials Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/testimonials-section.tsx`

- [ ] **Step 1: Build testimonials/social proof section**

Grid of 3 testimonial cards:
- Avatar placeholder, name, business type
- Quote text
- Star rating
- Card style: rounded-2xl border border-black/[0.06]

Uses SectionShell + StaggerGroup compounds.

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 15: Niches Section

**Files:**
- Create: `src/app/(marketing)/_components/sections/niches-section.tsx`

- [ ] **Step 1: Build business niches grid**

Keep the 12 niches from current page but restyle:
- Grid: 2-col mobile, 3-col tablet, 4-col desktop
- Each niche: rounded-2xl bg-black/[0.03] hover:bg-black/[0.05], icon + name
- Uses StaggerGroup for animation

- [ ] **Step 2: Verify no type errors**
- [ ] **Step 3: Commit**

---

## Task 16: Compose Landing Page

**Files:**
- Modify: `src/app/(marketing)/_components/landing-page.tsx`

- [ ] **Step 1: Rewrite landing-page.tsx as thin composition**

The file should be ~80 lines max — just imports and composition:

```tsx
"use client"

import { useSearchParams } from "next/navigation"
import { MarketingHeader } from "./marketing-header"
import { MarketingFooter } from "./marketing-footer"
import { HeroSection } from "./sections/hero-section"
import { StepsSection } from "./sections/steps-section"
import { FeaturesPlatformSection } from "./sections/features-platform-section"
import { ToolsSection } from "./sections/tools-section"
import { ComparisonSection } from "./sections/comparison-section"
import { TestimonialsSection } from "./sections/testimonials-section"
import { NichesSection } from "./sections/niches-section"
import { FAQSection } from "./sections/faq-section"
import { CTASection } from "./sections/cta-section"

interface LandingPageProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

export function LandingPage({ isLoggedIn = false, hasSubscription = false }: LandingPageProps) {
  const searchParams = useSearchParams()
  const shouldRedirectToWhatsApp = searchParams.get("wpp") === "true"

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <HeroSection shouldRedirectToWhatsApp={shouldRedirectToWhatsApp} />
      <StepsSection />
      <FeaturesPlatformSection />
      <ToolsSection />
      <ComparisonSection />
      <TestimonialsSection />
      <NichesSection />
      <FAQSection />
      <CTASection shouldRedirectToWhatsApp={shouldRedirectToWhatsApp} />
      <MarketingFooter />
    </main>
  )
}
```

- [ ] **Step 2: Verify no type errors**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Verify page renders**

Run: `npm run dev` and visit localhost:3000

- [ ] **Step 4: Commit**

```bash
git add src/app/\(marketing\)/_components/ src/components/marketing/
git commit -m "feat: redesign landing page following Durable reference design"
```

---

## Task 17: Check font-heading is configured

**Files:**
- Check: `tailwind.config.ts`

- [ ] **Step 1: Verify font-heading exists in Tailwind config**

If `font-heading` is not defined, add it to `theme.extend.fontFamily`:

```ts
fontFamily: {
  heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
  body: ['system-ui', '-apple-system', 'sans-serif'],
}
```

Check if `--font-heading` CSS var is set in layout or globals.css. If not, fall back to system font with heavier weight.

- [ ] **Step 2: Commit if changes needed**

---

## Task 18: Final Cleanup and Verification

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit`

- [ ] **Step 2: Run dev server and visually verify each section**

Run: `npm run dev` — check localhost:3000

Verify:
- Header sticky with blur
- Hero centered with large heading
- Steps 3-card grid
- Features asymmetric cards
- Tools grid
- Comparison table (desktop + mobile)
- Testimonials cards
- Niches grid
- FAQ accordion opens/closes
- CTA block
- Footer clean

- [ ] **Step 3: Final commit**

---

## Execution Notes

- **Order matters for Tasks 1-4** (shared components first), then Tasks 5-15 (sections) can be parallelized, then Task 16 (composition) depends on all sections being done.
- Each section file should be self-contained — import only from `@/components/marketing/*`, `@/lib/utils`, `@tabler/icons-react`, and `framer-motion`.
- All colors use `black/opacity` tokens — NO slate-*, NO hex colors, NO dark: variants (Durable reference is light-only).
- The WhatsApp redirect logic (`shouldRedirectToWhatsApp`) must be preserved in Hero and CTA sections.
