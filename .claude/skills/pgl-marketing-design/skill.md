---
name: pgl-marketing-design
description: Use when criando ou editando telas de marketing/landing pages/páginas públicas do PGL (Decolou). Cobre o design system completo: cores, tipografia, backgrounds, cards, seções, animações e padrões de componentes extraídos da landing page principal.
---

# PGL Marketing Design System

## Visão Geral

O design da plataforma PGL usa uma linguagem visual **limpa, moderna e de alto contraste** — fundo claro/escuro com glassmorphism sutil, cor primária laranja-coral vibrante, e animações de scroll reveal via Framer Motion.

---

## Cores do Sistema

### Primária — Laranja/Coral
```
--primary: oklch(0.628 0.258 29.234)  → laranja-coral vibrante
```
Uso em Tailwind: `text-primary`, `bg-primary`, `border-primary`, `shadow-primary/30`

**Opacidades frequentes:** `/5`, `/10`, `/20`, `/30`, `/40`

### Paleta de Background
```
Light: bg-gradient-to-br from-slate-50 via-white to-slate-100
Dark:  dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
```
Overlay radial no topo das páginas:
```tsx
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
```

### Textos
| Uso | Light | Dark |
|---|---|---|
| Título principal | `text-slate-900` | `dark:text-white` |
| Subtítulo/corpo | `text-slate-500` | `dark:text-slate-400` |
| Muted | `text-slate-400` | `dark:text-slate-500` |

### Cores Semânticas (accent por seção)
| Seção/Tema | Cor |
|---|---|
| Sucesso, SEO, velocidade | `text-emerald-500`, `bg-emerald-500/10` |
| IA, sparkles | `text-amber-500`, `bg-amber-500/20` |
| Analytics, dados | `text-purple-500`, `bg-purple-500/10` |
| Google, azul | `text-blue-500`, `bg-blue-500/20` |
| Alerta, urgência | `text-rose-600`, `bg-rose-500/10` |
| Performance | `text-cyan-500`, `bg-cyan-500/10` |
| Compare/destaque | `text-orange-600`, `bg-orange-500/10` |
| Nichos/negócios | `text-primary`, `bg-primary/20` |

---

## Componentes Base

### Card padrão (glassmorphism)
```tsx
<div className="rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/20">
```

### Card grande (painel/destaque)
```tsx
<div className="rounded-3xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 md:p-12">
```

### Badge / Pill de seção (kicker)
```tsx
<span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
  <IconCheck className="h-4 w-4" />
  Texto do kicker
</span>
```
Troque a cor semântica (`emerald`, `amber`, `purple`, etc.) por seção.

### Ícone box (feature icon)
```tsx
<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 shadow-lg">
  <IconSparkles className="h-7 w-7" />
</div>
```

### Número de step
```tsx
<div className="absolute -top-4 left-6 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
  01
</div>
```

---

## Tipografia de Seções

### H1 Hero
```tsx
<h1 className="mx-auto max-w-4xl text-4xl font-normal tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
  Texto normal{" "}
  <span className="text-primary font-black">destaque.</span>
</h1>
```

### H2 de seção
```tsx
<h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
```

### Subtítulo de seção
```tsx
<p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
```

### Padrão de header de seção (kicker + h2 + p)
```tsx
<ScrollReveal className="mb-16 text-center">
  <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-{cor}/10 px-4 py-1.5 text-sm font-medium text-{cor}-600 dark:text-{cor}-400">
    <Icon className="h-4 w-4" />
    Texto do kicker
  </span>
  <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
    Título da seção
  </h2>
  <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
    Descrição
  </p>
</ScrollReveal>
```

---

## Botões

### Primário (CTA principal)
```tsx
<a className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40">
  <IconRocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
  Quero meu site
</a>
```

### Secundário (ghost/outline)
```tsx
<Link className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800">
  Ver como funciona
  <IconArrowRight className="h-5 w-5" />
</Link>
```

---

## Animações (Framer Motion)

### Variantes globais reutilizáveis
```tsx
const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
```

### Componente ScrollReveal
```tsx
function ScrollReveal({ children, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={revealVariants} className={className}>
      {children}
    </motion.div>
  );
}
```

### Pattern de grid com stagger
```tsx
const ref = useRef(null);
const isInView = useInView(ref, { once: true, margin: "-100px" });

<motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer} className="grid gap-8 md:grid-cols-3">
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {/* card */}
    </motion.div>
  ))}
</motion.div>
```

### Animações de entrada por eixo (mockups/ilustrações)
```tsx
// Da esquerda
initial={{ opacity: 0, x: -40 }}
animate={isInView ? { opacity: 1, x: 0 } : {}}
transition={{ duration: 0.7 }}

// Da direita
initial={{ opacity: 0, x: 20 }}
animate={isInView ? { opacity: 1, x: 0 } : {}}
transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}

// Scale in (CTA icon)
initial={{ scale: 0 }}
whileInView={{ scale: 1 }}
viewport={{ once: true }}
transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
```

---

## Estrutura de Seção Completa

Toda seção segue este padrão:
```tsx
<section className="relative py-24">
  {/* Optional: background decoration */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

  <div className="container relative mx-auto px-4">
    {/* 1. Header centralizado com kicker + h2 + p */}
    <ScrollReveal className="mb-16 text-center">
      ...
    </ScrollReveal>

    {/* 2. Conteúdo (grid, mockup, etc.) */}
    ...
  </div>
</section>
```

Sections alternam backgrounds via `from-white to-slate-100/50` ou `via-{cor}/5`.

---

## Backgrounds de Seção Alternados

```tsx
// Seção clara com gradiente sutil
<div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-white dark:from-slate-900/50 dark:to-slate-950" />

// Seção com toque de cor temática
<div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50" />
```

---

## Feature Row (ícone + texto)

```tsx
<div className="group flex gap-4 rounded-2xl border border-transparent bg-white/50 p-4 transition-all hover:border-purple-200/60 hover:bg-white/80 hover:shadow-lg hover:shadow-purple-500/5 dark:bg-slate-900/50 dark:hover:border-purple-800/40 dark:hover:bg-slate-900/80">
  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500 transition-transform group-hover:scale-110">
    <Icon className="h-6 w-6" />
  </div>
  <div>
    <h4 className="font-semibold text-slate-900 dark:text-white">{title}</h4>
    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
  </div>
</div>
```

---

## Decorações Flutuantes (blur orbs)

```tsx
{/* Blur decoration circles — coloque em position relative no pai */}
<div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl" />
<div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-2xl" />
```

---

## Checklist ao criar nova tela de marketing

- [ ] Background: `from-slate-50 via-white to-slate-100` + overlay radial `primary/5`
- [ ] Seções usam `py-24` e `container mx-auto px-4`
- [ ] Cada seção tem `position: relative` + `overflow-hidden` se tiver decorações
- [ ] Header de seção: kicker pill colorido + h2 `tracking-tight` + p `max-w-2xl`
- [ ] Cards com `backdrop-blur-sm`, `bg-white/70`, `border-slate-200/40`
- [ ] Hover nos cards: `-translate-y-2` + `shadow-xl` + `border-primary/20`
- [ ] CTA primário: `bg-primary shadow-primary/30 hover:scale-105`
- [ ] Animações: `ScrollReveal` no header + `staggerContainer`/`staggerItem` em grids
- [ ] Dark mode em todos os elementos (`dark:` classes)
- [ ] Ícones: `@tabler/icons-react`
