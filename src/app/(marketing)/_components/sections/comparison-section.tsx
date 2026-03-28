"use client"

import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Tool pills — colorful floating badges                               */
/* ------------------------------------------------------------------ */

const TOOL_PILLS = [
  { label: "Site profissional", price: "R$ 150", color: "bg-emerald-500", rotate: "2deg", top: "18%", left: "8%" },
  { label: "Hospedagem", price: "R$ 40", color: "bg-orange-500", rotate: "-6deg", top: "5%", left: "32%" },
  { label: "SEO", price: "R$ 300", color: "bg-gray-400", rotate: "4deg", top: "10%", left: "58%" },
  { label: "Dominio", price: "R$ 50", color: "bg-blue-500", rotate: "-8deg", top: "2%", left: "78%" },
  { label: "Designer", price: "R$ 500", color: "bg-red-500", rotate: "-3deg", top: "55%", left: "12%" },
  { label: "Redator SEO", price: "R$ 200", color: "bg-amber-500", rotate: "8deg", top: "52%", left: "38%" },
  { label: "Manutencao", price: "R$ 100", color: "bg-teal-500", rotate: "10deg", top: "58%", left: "65%" },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function ComparisonSection() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <div className="overflow-hidden rounded-3xl bg-[#1c1c1e] px-6 py-16 sm:px-10 md:py-24">

          {/* Kicker */}
          <ScrollReveal className="text-center">
            <span className="text-sm font-medium text-emerald-400">
              Tudo incluido
            </span>
          </ScrollReveal>

          {/* Heading */}
          <ScrollReveal className="mt-4 text-center">
            <h2 className="mx-auto max-w-[480px] font-heading text-[36px] leading-[42px] text-white/90 md:text-[56px] md:leading-[64px]">
              Menos ferramentas para misturar
            </h2>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal className="mt-4 text-center">
            <p className="text-base text-white/50">
              Tudo o que uma agencia cobraria milhares por mes, em um unico plano.
            </p>
          </ScrollReveal>

          {/* Floating pills area */}
          <ScrollReveal className="mt-12">
            <div className="relative mx-auto h-[220px] max-w-[600px] sm:h-[260px]">
              {TOOL_PILLS.map((pill) => (
                <div
                  key={pill.label}
                  className={cn(
                    "absolute inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg",
                    pill.color,
                  )}
                  style={{
                    top: pill.top,
                    left: pill.left,
                    transform: `rotate(${pill.rotate})`,
                  }}
                >
                  <span className="opacity-90">{pill.label}</span>
                  <span className="opacity-60">{pill.price}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Price comparison */}
          <ScrollReveal className="mt-8">
            <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-16">
              {/* Typical cost */}
              <div className="text-center">
                <p className="text-sm text-white/40">Gastos tipicos</p>
                <p className="mt-2 font-heading text-[28px] text-white/50 line-through decoration-red-400/60 decoration-2 md:text-[36px]">
                  R$ 1.340/m
                </p>
              </div>

              {/* PGL cost */}
              <div className="text-center">
                <p className="text-sm text-white/40">Plano de crescimento sustentavel</p>
                <p className="mt-2 font-heading text-[28px] text-white/90 md:text-[36px]">
                  R$ 59,90/mes
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
