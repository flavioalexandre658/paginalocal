"use client"

import { IconStar } from "@tabler/icons-react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/marketing/scroll-reveal"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "Com o Decolou tudo ficou muito simples. Meu site ficou profissional e os clientes ja comecaram a me encontrar no Google. Melhor investimento que fiz.",
    name: "Marina Silva",
    business: "Salao Bela Vista",
    initials: "M",
  },
  {
    type: "stat" as const,
    value: "2.000+",
    label: "Sites gerados",
  },
  {
    quote:
      "E quase como se eu tivesse contratado uma equipe inteira de desenvolvedores e marketeiros, mas sem precisar paga-los.",
    name: "Pedro Oliveira",
    business: "Oliveira Fotografias",
    initials: "P",
  },
  {
    quote:
      "Antes eu perdia clientes por nao ter site. Agora recebo contatos toda semana pelo WhatsApp direto do site.",
    name: "Carlos Rodrigues",
    business: "Auto Center CR",
    initials: "C",
  },
  {
    quote:
      "Voce pode ser alguem que nao faz ideia de como mexer num computador e consegue facilmente construir seu site.",
    name: "Jessica Santos",
    business: "Doces da Jess",
    initials: "J",
  },
  {
    quote:
      "O Decolou foi fundamental para dar credibilidade ao meu negocio, ampliando significativamente meu alcance profissional.",
    name: "Chef Igor",
    business: "Chef particular",
    initials: "C",
  },
]

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function TestimonialsSection() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <div className="overflow-hidden rounded-3xl bg-[#1c1c1e] px-6 py-16 sm:px-10 md:py-24">

          {/* Big number */}
          <ScrollReveal className="mb-4 text-center">
            <span className="font-heading text-[64px] leading-none text-white/90 md:text-[96px]">
              2.000+
            </span>
          </ScrollReveal>

          {/* Subtitle */}
          <ScrollReveal className="mb-16 text-center">
            <p className="text-base text-white/50 md:text-lg">
              Negocios construidos sobre bases duradouras
            </p>
          </ScrollReveal>

          {/* Testimonials grid — asymmetric bento layout */}
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((item, index) => {
              /* Stat card */
              if ("type" in item && item.type === "stat") {
                return (
                  <StaggerItem key="stat">
                    <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white/[0.06] p-8">
                      <span className="font-heading text-[40px] leading-none text-white/90 md:text-[56px]">
                        {item.value}
                      </span>
                      <p className="mt-2 text-sm text-white/40">{item.label}</p>
                    </div>
                  </StaggerItem>
                )
              }

              /* Testimonial card */
              const testimonial = item as { quote: string; name: string; business: string; initials: string }
              const isTall = index === 0 || index === 3
              return (
                <StaggerItem key={testimonial.name} className={cn(isTall && "sm:row-span-2")}>
                  <div className="flex h-full flex-col justify-between rounded-2xl bg-white/[0.06] p-6">
                    {/* Stars */}
                    <div>
                      <div className="mb-4 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IconStar key={i} className="size-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      {/* Quote */}
                      <p className={cn(
                        "text-white/80 leading-relaxed",
                        isTall ? "text-base" : "text-sm",
                      )}>
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                    </div>

                    {/* Author */}
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/70">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/80">{testimonial.name}</p>
                        <p className="text-xs text-white/40">{testimonial.business}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
