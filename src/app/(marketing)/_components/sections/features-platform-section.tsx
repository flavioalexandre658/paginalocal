"use client"

import { useState } from "react"
import {
  IconBrush,
  IconPencil,
  IconDeviceMobile,
  IconSearch,
  IconWorld,
  IconChartBar,
  IconPlus,
  IconX,
} from "@tabler/icons-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    id: "design",
    icon: IconBrush,
    title: "Design profissional automatico",
    description:
      "Nossa IA cria um site completo com layout, cores e tipografia pensados para converter visitantes em clientes.",
  },
  {
    id: "content",
    icon: IconPencil,
    title: "Textos escritos por IA",
    description:
      "Todo o conteudo do seu site — titulos, descricoes, servicos — e gerado por inteligencia artificial e otimizado para SEO.",
  },
  {
    id: "mobile",
    icon: IconDeviceMobile,
    title: "100% responsivo",
    description:
      "Seu site funciona perfeitamente em celular, tablet e computador. Pronto para receber clientes de qualquer dispositivo.",
  },
  {
    id: "seo",
    icon: IconSearch,
    title: "SEO nativo para Google",
    description: "Meta tags, codigo limpo e carregamento ultra-rapido. Seu negocio aparece no topo das buscas.",
  },
  {
    id: "domains",
    icon: IconWorld,
    title: "Dominio personalizado",
    description: "Conecte seu proprio dominio (seunegocio.com.br) ao site. Nos cuidamos da configuracao tecnica.",
  },
  {
    id: "google",
    icon: IconSearch,
    title: "Integracao com Google",
    description: "Importamos fotos, avaliacoes e horarios direto do Google Meu Negocio para seu site.",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function FeaturesPlatformSection() {
  const [activeFeature, setActiveFeature] = useState("design")

  return (
    <section className="bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        {/* Header — left aligned */}
        <ScrollReveal className="mb-10">
          <span className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Plataforma completa
          </span>
          <h2 className="max-w-[520px] font-heading text-[32px] leading-[40px] text-black/80 md:text-[48px] md:leading-[56px]">
            Lance e expanda seu negocio
          </h2>
        </ScrollReveal>

        {/* ── Main showcase card — dark bg ── */}
        <ScrollReveal>
          <div className="overflow-hidden rounded-3xl bg-black/80">
            <div className="flex flex-col lg:flex-row">

              {/* Left — reactive mockup area */}
              <div className="relative flex-1 px-6 pt-10 pb-8 sm:pt-16 lg:py-16 lg:pl-10 lg:pr-0">
                <FeatureMockup activeFeature={activeFeature} />

                {/* Bottom label */}
                <div className="mt-8">
                  <p className="text-base font-semibold text-white/90">
                    Construtor de Sites com IA
                  </p>
                  <p className="mt-1 max-w-xs text-sm text-white/50 leading-relaxed">
                    Seu site profissional pronto em segundos. IA gera design, textos e SEO otimizado para seu negocio.
                  </p>
                </div>
              </div>

              {/* Right — feature accordion */}
              <div className="flex w-full flex-col gap-2 p-6 lg:w-[340px] lg:shrink-0 lg:py-10 lg:pr-8 lg:pl-6">
                {FEATURES.map((feature) => {
                  const isActive = activeFeature === feature.id
                  return (
                    <button
                      key={feature.id}
                      onClick={() => setActiveFeature(feature.id)}
                      className={cn(
                        "flex flex-col rounded-2xl px-5 py-4 text-left transition-all duration-200",
                        isActive
                          ? "bg-white/[0.08]"
                          : "hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex size-6 items-center justify-center transition-colors",
                          isActive ? "text-white/80" : "text-white/40",
                        )}>
                          {isActive ? <IconX className="size-4" /> : <IconPlus className="size-4" />}
                        </div>
                        <span className={cn(
                          "text-sm font-medium transition-colors",
                          isActive ? "text-white/90" : "text-white/70",
                        )}>
                          {feature.title}
                        </span>
                      </div>
                      <div className={cn(
                        "grid transition-all duration-200",
                        isActive ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}>
                        <div className="overflow-hidden">
                          <p className="pl-9 text-sm text-white/50 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Reactive mockup — changes based on active feature                   */
/* ------------------------------------------------------------------ */

function FeatureMockup({ activeFeature }: { activeFeature: string }) {
  return (
    <div className="relative mx-auto max-w-lg lg:mx-0">
      {/* All mockups stacked with crossfade */}
      <div className="relative min-h-[280px] sm:min-h-[340px]">

        {/* design — stacked browser windows */}
        <MockupFrame visible={activeFeature === "design"}>
          <BrowserChrome />
          <div className="bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-5 py-10">
            <div className="mx-auto h-3 w-20 rounded bg-white/10" />
            <div className="mx-auto mt-3 h-5 w-44 rounded bg-white/15" />
            <div className="mx-auto mt-2 h-3 w-32 rounded bg-white/[0.08]" />
            <div className="mx-auto mt-4 h-7 w-24 rounded-lg bg-white/15" />
          </div>
          <div className="grid grid-cols-3 gap-2 p-4">
            <div className="h-14 rounded-lg bg-white/[0.04]" />
            <div className="h-14 rounded-lg bg-white/[0.04]" />
            <div className="h-14 rounded-lg bg-white/[0.04]" />
          </div>
        </MockupFrame>

        {/* content — text blocks being written */}
        <MockupFrame visible={activeFeature === "content"}>
          <BrowserChrome />
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-white/15" />
              <div className="h-3 w-full rounded bg-white/[0.08]" />
              <div className="h-3 w-[90%] rounded bg-white/[0.08]" />
              <div className="h-3 w-[75%] rounded bg-white/[0.06]" />
            </div>
            <div className="h-px w-full bg-white/[0.06]" />
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-white/15" />
              <div className="h-3 w-full rounded bg-white/[0.08]" />
              <div className="h-3 w-[85%] rounded bg-white/[0.08]" />
            </div>
            {/* Cursor blinking indicator */}
            <div className="flex items-center gap-1">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-4 w-px animate-pulse bg-white/60" />
            </div>
          </div>
        </MockupFrame>

        {/* mobile — phone + desktop side by side */}
        <MockupFrame visible={activeFeature === "mobile"}>
          <div className="flex items-end justify-center gap-4 p-6">
            {/* Desktop skeleton */}
            <div className="w-[60%] overflow-hidden rounded-xl border border-white/10 bg-white/[0.06]">
              <div className="flex h-5 items-center gap-1 border-b border-white/5 px-2">
                <div className="size-1.5 rounded-full bg-white/20" />
                <div className="size-1.5 rounded-full bg-white/20" />
                <div className="size-1.5 rounded-full bg-white/20" />
              </div>
              <div className="p-3">
                <div className="h-16 rounded-lg bg-white/[0.05]" />
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  <div className="h-8 rounded bg-white/[0.04]" />
                  <div className="h-8 rounded bg-white/[0.04]" />
                  <div className="h-8 rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
            {/* Phone skeleton */}
            <div className="w-[22%] overflow-hidden rounded-2xl border-2 border-white/15 bg-white/[0.06]">
              <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-white/20" />
              <div className="p-2 pt-3">
                <div className="h-20 rounded-lg bg-white/[0.05]" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-4 w-full rounded bg-white/[0.04]" />
                  <div className="h-4 w-full rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        </MockupFrame>

        {/* seo — search results mockup */}
        <MockupFrame visible={activeFeature === "seo"}>
          <div className="p-6">
            {/* Search bar */}
            <div className="mx-auto flex max-w-sm items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5">
              <IconSearch className="size-4 text-white/30" />
              <div className="h-3 w-32 rounded bg-white/15" />
            </div>
            {/* Search results */}
            <div className="mx-auto mt-6 max-w-sm space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className={cn(
                  "rounded-xl p-4",
                  i === 1 ? "border border-white/15 bg-white/[0.08]" : "bg-white/[0.03]",
                )}>
                  <div className="h-2.5 w-28 rounded bg-white/10" />
                  <div className={cn("mt-2 h-3.5 w-48 rounded", i === 1 ? "bg-white/20" : "bg-white/10")} />
                  <div className="mt-1.5 h-2.5 w-full rounded bg-white/[0.06]" />
                  {i === 1 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-400/60" />
                      <div className="h-2 w-16 rounded bg-emerald-400/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </MockupFrame>

        {/* domains — domain card mockup */}
        <MockupFrame visible={activeFeature === "domains"}>
          <div className="flex flex-col items-center justify-center p-8">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10">
              <IconWorld className="size-7 text-white/60" />
            </div>
            <div className="mt-6 w-full max-w-xs">
              {/* Domain card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-400" />
                  <div className="h-3 w-40 rounded bg-white/20" />
                </div>
                <div className="mt-2 h-2.5 w-32 rounded bg-white/[0.08]" />
              </div>
              {/* Arrow */}
              <div className="mx-auto my-3 h-6 w-px bg-white/10" />
              {/* Subdomain card */}
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                <div className="h-3 w-48 rounded bg-white/10" />
                <div className="mt-2 h-2.5 w-36 rounded bg-white/[0.06]" />
              </div>
            </div>
          </div>
        </MockupFrame>

        {/* analytics — dashboard skeleton */}
        <MockupFrame visible={activeFeature === "analytics"}>
          <div className="p-6">
            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-3">
              {["bg-cyan-400/20", "bg-emerald-400/20", "bg-purple-400/20"].map((bg, i) => (
                <div key={i} className={cn("rounded-xl p-3", bg)}>
                  <div className="h-5 w-10 rounded bg-white/20" />
                  <div className="mt-1.5 h-2 w-14 rounded bg-white/10" />
                </div>
              ))}
            </div>
            {/* Chart area */}
            <div className="mt-4 rounded-xl bg-white/[0.04] p-4">
              <div className="flex items-end gap-1.5" style={{ height: 100 }}>
                {[40, 55, 35, 65, 50, 75, 60, 85, 70, 90].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-white/10 transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            {/* Sources */}
            <div className="mt-4 flex gap-2">
              {["bg-blue-400", "bg-pink-400", "bg-white/30"].map((bg, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-full bg-white/[0.06] px-3 py-1">
                  <div className={cn("size-2 rounded-full", bg)} />
                  <div className="h-2 w-10 rounded bg-white/15" />
                </div>
              ))}
            </div>
          </div>
        </MockupFrame>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                               */
/* ------------------------------------------------------------------ */

function MockupFrame({ children, visible }: { children: React.ReactNode; visible: boolean }) {
  return (
    <div className={cn(
      "absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-2xl transition-all duration-300",
      visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97] pointer-events-none",
    )}>
      {children}
    </div>
  )
}

function BrowserChrome() {
  return (
    <div className="flex h-7 items-center gap-1.5 border-b border-white/5 px-3">
      <div className="size-2 rounded-full bg-red-400/60" />
      <div className="size-2 rounded-full bg-amber-400/60" />
      <div className="size-2 rounded-full bg-emerald-400/60" />
      <div className="mx-auto h-3 w-28 rounded-full bg-white/[0.06]" />
    </div>
  )
}
