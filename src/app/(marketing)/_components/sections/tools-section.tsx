"use client"

import { cn } from "@/lib/utils"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/marketing/scroll-reveal"

/* ------------------------------------------------------------------ */
/*  Tool visual mockups                                                 */
/* ------------------------------------------------------------------ */

function WebsiteBuilderVisual() {
  return (
    <div className="relative flex h-48 items-end justify-center overflow-hidden px-4">
      {/* Back card */}
      <div className="absolute right-6 top-4 w-[55%] overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-md">
        <div className="flex h-5 items-center gap-1 border-b border-black/[0.04] px-2">
          <div className="size-1.5 rounded-full bg-black/10" />
          <div className="size-1.5 rounded-full bg-black/10" />
          <div className="size-1.5 rounded-full bg-black/10" />
        </div>
        <div className="p-2.5">
          <div className="h-12 rounded-lg bg-black/[0.04]" />
          <div className="mt-2 h-2.5 w-3/4 rounded bg-black/[0.06]" />
        </div>
      </div>
      {/* Front card */}
      <div className="relative z-10 w-[65%] overflow-hidden rounded-xl border border-black/[0.06] bg-white shadow-lg">
        <div className="flex h-5 items-center gap-1 border-b border-black/[0.04] px-2">
          <div className="size-1.5 rounded-full bg-red-300" />
          <div className="size-1.5 rounded-full bg-amber-300" />
          <div className="size-1.5 rounded-full bg-emerald-300" />
        </div>
        <div className="bg-gradient-to-br from-black/80 to-black/60 px-4 py-6 text-center">
          <div className="mx-auto h-2 w-12 rounded bg-white/30" />
          <div className="mx-auto mt-2 h-3.5 w-32 rounded bg-white/40" />
          <div className="mx-auto mt-1.5 h-2 w-20 rounded bg-white/20" />
          <div className="mx-auto mt-2.5 h-5 w-16 rounded-md bg-white/80" />
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-2.5">
          <div className="h-8 rounded bg-black/[0.04]" />
          <div className="h-8 rounded bg-black/[0.04]" />
          <div className="h-8 rounded bg-black/[0.04]" />
        </div>
      </div>
    </div>
  )
}

function ImageStudioVisual() {
  return (
    <div className="flex h-48 items-center justify-center px-6">
      <div className="relative">
        {/* Logo card */}
        <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-4 shadow-lg">
          <div className="flex size-24 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
            <div className="flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <div className="size-6 rounded-full border-2 border-white/80" />
            </div>
          </div>
        </div>
        {/* Floating image cards */}
        <div className="absolute -right-8 -top-2 h-16 w-20 overflow-hidden rounded-lg border border-black/[0.06] bg-black/[0.04] shadow-md">
          <div className="h-full bg-gradient-to-br from-emerald-200/50 to-cyan-200/50" />
        </div>
        <div className="absolute -bottom-3 -right-6 h-14 w-18 overflow-hidden rounded-lg border border-black/[0.06] bg-black/[0.04] shadow-md">
          <div className="h-full bg-gradient-to-br from-rose-200/50 to-purple-200/50" />
        </div>
      </div>
    </div>
  )
}

function DiscoverabilityVisual() {
  return (
    <div className="flex h-48 flex-col items-center justify-center px-6">
      {/* Chart mockup */}
      <div className="w-full max-w-[200px]">
        <div className="flex items-end gap-1" style={{ height: 80 }}>
          {[30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-emerald-500/30"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 h-px w-full bg-black/[0.06]" />
      </div>
      {/* Metric badge */}
      <div className="mt-3 rounded-xl bg-black/80 px-4 py-2 text-center shadow-lg">
        <div className="text-[10px] text-white/50">Mar</div>
        <div className="text-sm font-semibold text-white">9.500</div>
        <div className="text-[10px] text-white/50">impressoes</div>
      </div>
    </div>
  )
}

function InvoicingVisual() {
  return (
    <div className="relative flex h-48 items-center justify-center px-6">
      {/* Back invoice */}
      <div className="absolute left-8 top-6 w-32 -rotate-6 rounded-xl border border-black/[0.06] bg-white p-3 shadow-md">
        <div className="h-2 w-16 rounded bg-black/[0.08]" />
        <div className="mt-2 h-2 w-full rounded bg-black/[0.04]" />
        <div className="mt-1 h-2 w-3/4 rounded bg-black/[0.04]" />
        <div className="mt-3 flex justify-end">
          <div className="rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-bold text-white">Pago</div>
        </div>
      </div>
      {/* Front invoice */}
      <div className="relative z-10 w-36 rotate-3 rounded-xl border border-black/[0.06] bg-white p-3 shadow-lg">
        <div className="h-2.5 w-20 rounded bg-black/[0.08]" />
        <div className="mt-1 h-2 w-12 rounded bg-black/[0.04]" />
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-2 w-16 rounded bg-black/[0.06]" />
            <div className="h-2 w-8 rounded bg-black/[0.06]" />
          </div>
          <div className="flex items-center justify-between">
            <div className="h-2 w-12 rounded bg-black/[0.06]" />
            <div className="h-2 w-10 rounded bg-black/[0.06]" />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <div className="rounded-full bg-emerald-500 px-2 py-0.5 text-[8px] font-bold text-white">Pago</div>
        </div>
      </div>
    </div>
  )
}

function CRMVisual() {
  return (
    <div className="flex h-48 flex-col items-center justify-center gap-2 px-6">
      {/* Lead notifications */}
      {[1, 2, 3].map((i) => (
        <div key={i} className={cn(
          "flex w-full max-w-[220px] items-center gap-2.5 rounded-xl border border-black/[0.06] bg-white px-3 py-2.5 shadow-sm transition-all",
          i === 1 && "shadow-md",
        )}>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <div className="text-[10px] font-bold text-emerald-600">↑</div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold text-emerald-600">Novo lider</div>
            <div className="mt-0.5 h-2 w-28 rounded bg-black/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  )
}

function AnalyticsVisual() {
  return (
    <div className="flex h-48 flex-col items-center justify-center px-6">
      {/* Mini metrics */}
      <div className="flex w-full max-w-[220px] gap-2">
        {[
          { color: "bg-cyan-400/20 text-cyan-600", value: "847" },
          { color: "bg-emerald-400/20 text-emerald-600", value: "127" },
          { color: "bg-purple-400/20 text-purple-600", value: "15%" },
        ].map((m, i) => (
          <div key={i} className={cn("flex-1 rounded-xl p-2.5 text-center", m.color.split(" ")[0])}>
            <div className={cn("text-sm font-bold", m.color.split(" ")[1])}>{m.value}</div>
            <div className="mt-0.5 mx-auto h-1.5 w-10 rounded bg-black/[0.06]" />
          </div>
        ))}
      </div>
      {/* Mini chart */}
      <div className="mt-3 w-full max-w-[220px] rounded-xl bg-black/[0.03] p-3">
        <div className="flex items-end gap-1" style={{ height: 50 }}>
          {[35, 50, 40, 65, 55, 75, 60, 80].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-purple-400/30" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tool card data                                                      */
/* ------------------------------------------------------------------ */

const TOOLS: { visual: React.ReactNode; name: string; description: string }[] = [
  {
    visual: <WebsiteBuilderVisual />,
    name: "Construtor de Sites com IA no 1",
    description: "O construtor de sites com IA mais rapido e poderoso. Mais de 10 milhoes de sites criados.",
  },
  {
    visual: <ImageStudioVisual />,
    name: "Estudio de imagem com IA",
    description: "Crie facilmente imagens que estejam alinhadas a sua marca para logotipos, anuncios e seu site.",
  },
  {
    visual: <DiscoverabilityVisual />,
    name: "Capacidade de descoberta",
    description: "Gere leads de alta qualidade com IA do Google e ChatGPT.",
  },
  {
    visual: <InvoicingVisual />,
    name: "Faturamento",
    description: "Receba seu pagamento mais rapido.",
  },
  {
    visual: <CRMVisual />,
    name: "CRM",
    description: "Todos os seus leads e clientes em um so lugar.",
  },
  {
    visual: <AnalyticsVisual />,
    name: "Analytics",
    description: "Acompanhe visitas, contatos e conversoes em tempo real.",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function ToolsSection() {
  return (
    <section className="bg-white pt-16 md:pt-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <StaggerItem key={tool.name}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-black/[0.03] transition-all duration-150 hover:bg-black/[0.05]">
                {/* Visual mockup */}
                {tool.visual}
                {/* Text */}
                <div className="px-6 pb-6">
                  <p className="text-base font-semibold text-black/80">{tool.name}</p>
                  <p className="mt-1 text-sm text-black/55 leading-relaxed">{tool.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
