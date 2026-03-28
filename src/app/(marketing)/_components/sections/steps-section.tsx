"use client"

import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { IconMessageQuestion, IconSparkles, IconAdjustments } from "@tabler/icons-react"

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const STEPS: { step: string; title: string; description: string; icon: typeof IconMessageQuestion; visual: string; span2?: boolean }[] = [
  {
    step: "Passo 1",
    title: "Responda a 3 perguntas sobre o seu negocio",
    description:
      "Compartilhe os detalhes do seu negocio com nosso gerador de sites para personalizar a forma como nossa IA cria seu site.",
    icon: IconMessageQuestion,
    visual: "search",
  },
  {
    step: "Passo 2",
    title: "Um site totalmente funcional, construido com IA",
    description:
      "Nosso criador de sites com IA cria um site profissional projetado para ajudar voce a expandir seu negocio.",
    icon: IconSparkles,
    visual: "website",
  },
  {
    step: "Etapa 3",
    title: "Edite textos direto no site, sem complicacao",
    description:
      "Clique em qualquer texto do seu site e edite na hora. Altere cores, fontes e temas com um clique. Sem paineis complexos, sem codigo.",
    icon: IconAdjustments,
    span2: true,
    visual: "editor",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function StepsSection() {
  return (
    <section className="bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        {/* Header — centered */}
        <ScrollReveal className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Crie seu site com IA
          </span>
          <h2 className="mt-4 font-heading text-[32px] leading-[40px] text-black/80 md:text-[40px] md:leading-[48px]">
            Seu site criado com IA{"\n"}em 3 passos
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-black/55 md:text-lg">
            Sem codigo, sem complicacoes — responda a tres perguntas e nossa IA criara um site personalizado que transformara sua ideia em realidade.
          </p>
        </ScrollReveal>

        {/* Steps grid — 2 cols, step 3 spans full */}
        <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
          {STEPS.map((step) => (
            <ScrollReveal
              key={step.step}
              className={step.span2 ? "xl:col-span-2" : ""}
            >
              <div className="flex h-full flex-col items-center gap-3 overflow-hidden rounded-2xl bg-black/[0.03] pt-10 text-center sm:pt-14">
                {/* Kicker */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {step.step}
                </span>

                {/* Title */}
                <h3 className="max-w-sm px-6 font-heading text-xl text-black/80 md:text-2xl">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="max-w-md px-6 text-sm text-black/55 leading-relaxed">
                  {step.description}
                </p>

                {/* Visual mockup area */}
                <div className="mt-4 w-full flex-1">
                  <StepVisual type={step.visual} span2={!!step.span2} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Step Visuals — rich mockup placeholders                             */
/* ------------------------------------------------------------------ */

function StepVisual({ type, span2 }: { type: string; span2: boolean }) {
  if (type === "search") {
    return (
      <div className="relative mx-auto flex max-w-sm flex-col items-center px-6 pb-0">
        {/* Floating icon */}
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
          <IconMessageQuestion className="size-5" />
        </div>
        {/* Fake search input */}
        <div className="w-full rounded-2xl border border-black/[0.06] bg-white px-5 py-3.5 text-left text-sm text-black/30 shadow-sm">
          What type of business are you building?
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-black/40" />
        </div>
        {/* Mockup screenshot placeholder */}
        <div className="mt-6 aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-black/[0.04]">
          <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.04] bg-white/80 px-4">
            <div className="size-2.5 rounded-full bg-black/10" />
            <div className="size-2.5 rounded-full bg-black/10" />
            <div className="size-2.5 rounded-full bg-black/10" />
            <div className="mx-auto h-4 w-32 rounded-full bg-black/[0.04]" />
          </div>
          <div className="space-y-3 p-4">
            <div className="h-3 w-3/4 rounded bg-black/[0.06]" />
            <div className="h-3 w-1/2 rounded bg-black/[0.04]" />
            <div className="mt-4 h-20 w-full rounded-xl bg-black/[0.04]" />
          </div>
        </div>
      </div>
    )
  }

  if (type === "website") {
    return (
      <div className="relative mx-auto flex max-w-sm flex-col items-center px-6 pb-0">
        {/* Floating sparkle icon */}
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg shadow-amber-500/20">
          <IconSparkles className="size-5" />
        </div>
        {/* Website mockup */}
        <div className="w-full overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.06] bg-white shadow-sm">
          {/* Browser chrome */}
          <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.04] px-4">
            <div className="size-2.5 rounded-full bg-red-300" />
            <div className="size-2.5 rounded-full bg-amber-300" />
            <div className="size-2.5 rounded-full bg-emerald-300" />
            <div className="mx-auto h-4 w-40 rounded-full bg-black/[0.04]" />
          </div>
          {/* Page content mockup */}
          <div className="relative">
            {/* Hero area */}
            <div className="bg-gradient-to-br from-black/80 to-black/60 px-6 py-10 text-center">
              <div className="mx-auto h-3 w-24 rounded bg-white/30" />
              <div className="mx-auto mt-3 h-5 w-48 rounded bg-white/50" />
              <div className="mx-auto mt-2 h-3 w-36 rounded bg-white/20" />
              <div className="mx-auto mt-4 h-7 w-28 rounded-lg bg-white/90" />
            </div>
            {/* Content blocks */}
            <div className="grid grid-cols-3 gap-2 p-4">
              <div className="h-16 rounded-lg bg-black/[0.04]" />
              <div className="h-16 rounded-lg bg-black/[0.04]" />
              <div className="h-16 rounded-lg bg-black/[0.04]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "editor") {
    return (
      <div className={`relative mx-auto w-full overflow-hidden ${span2 ? "max-w-3xl" : "max-w-sm"} px-6 pb-0`}>
        <div className="w-full overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.06] bg-[#f5f5f4] shadow-lg shadow-black/[0.06]">
          {/* ── Shell: sidebar + right column ── */}
          <div className="flex h-72 sm:h-96">

            {/* Sidebar */}
            <div className="hidden w-40 shrink-0 flex-col border-r border-black/[0.04] bg-[#f5f5f4] p-3 sm:flex">
              {/* Store name */}
              <div className="mb-4 flex items-center gap-2 rounded-xl px-2 py-1.5">
                <div className="flex size-6 items-center justify-center rounded-full bg-black/80 text-[8px] font-bold text-white">L</div>
                <div className="text-[10px] font-medium text-black/80 truncate">Loja bela varieda...</div>
              </div>
              {/* Nav items */}
              <div className="space-y-0.5">
                {[
                  { label: "Inicio", active: false },
                  { label: "Meu Site", active: true },
                  { label: "Contatos", active: false },
                  { label: "Analitica", active: false },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center gap-2 rounded-xl px-2 py-1.5 text-[10px] ${item.active ? "bg-black/5 font-medium text-black/80" : "text-black/55"}`}>
                    <div className={`size-3 rounded ${item.active ? "bg-black/20" : "bg-black/[0.08]"}`} />
                    {item.label}
                  </div>
                ))}
              </div>
           
            </div>

            {/* Right column */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Topbar */}
              <div className="flex h-9 shrink-0 items-center justify-between border-b border-black/[0.04] bg-[#f5f5f4] px-3">
                <div className="size-4 rounded bg-black/[0.06]" />
                {/* Pill switcher */}
                <div className="flex items-center gap-0.5 rounded-full border border-black/[0.06] p-[2px]">
                  {["Tema", "Cores", "Fontes"].map((label, i) => (
                    <div key={label} className={`rounded-full px-2 py-0.5 text-[8px] font-medium ${i === 0 ? "bg-black/5 text-black/80" : "text-black/40"}`}>
                      {label}
                    </div>
                  ))}
                </div>
                {/* Right actions */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 rounded-full border border-black/[0.06] px-2 py-0.5">
                    <div className="text-[7px] text-black/55">Previa</div>
                    <div className="h-3 w-5 rounded-full bg-black/10">
                      <div className="size-2.5 translate-x-0 rounded-full bg-black/40 shadow-sm" />
                    </div>
                  </div>
                  <div className="flex h-5 items-center gap-0.5 rounded-full bg-emerald-600 px-2 text-[7px] font-semibold text-white">
                    Publicar
                  </div>
                </div>
              </div>

              {/* Preview area with site skeleton */}
              <div className="flex-1 overflow-hidden p-2">
                <div className="h-full overflow-hidden rounded-xl bg-white">
                  {/* Site header skeleton */}
                  <div className="flex items-center justify-between border-b border-black/[0.04] px-4 py-2">
                    <div className="h-3 w-24 rounded bg-black/[0.08]" />
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-10 rounded bg-black/[0.06]" />
                      <div className="h-2 w-12 rounded bg-black/[0.06]" />
                      <div className="h-2 w-8 rounded bg-black/[0.06]" />
                      <div className="h-2 w-10 rounded bg-black/[0.06]" />
                      <div className="h-4 w-20 rounded-md border border-black/[0.06]" />
                    </div>
                  </div>
                  {/* Site hero skeleton with inline edit indicator */}
                  <div className="relative bg-gradient-to-b from-black/70 to-black/50 px-6 py-8 text-center sm:py-14">
                    {/* Kicker skeleton */}
                    <div className="mx-auto mb-3 flex items-center justify-center gap-2">
                      <div className="h-px w-6 bg-white/20" />
                      <div className="h-2 w-16 rounded bg-white/15" />
                      <div className="h-px w-6 bg-white/20" />
                    </div>
                    {/* Headline skeleton with blue edit border */}
                    <div className="relative mx-auto max-w-[220px] rounded border-2 border-blue-400/60 px-3 py-2">
                      <div className="mx-auto h-5 w-44 rounded bg-white/25 sm:h-7" />
                      <div className="mx-auto mt-1.5 h-5 w-28 rounded bg-white/20 sm:h-7" />
                    </div>
                    {/* Subtitle skeleton */}
                    <div className="mx-auto mt-3 h-2 w-40 rounded bg-white/10" />
                    <div className="mx-auto mt-1 h-2 w-32 rounded bg-white/10" />
                    {/* CTA skeletons */}
                    <div className="mx-auto mt-4 flex items-center justify-center gap-2">
                      <div className="h-5 w-16 rounded-md bg-white/10" />
                      <div className="h-5 w-24 rounded-md border border-white/15" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
