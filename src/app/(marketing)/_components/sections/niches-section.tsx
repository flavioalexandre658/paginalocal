"use client"

import Link from "next/link"
import { IconArrowRight } from "@tabler/icons-react"
import { ScrollReveal, StaggerGroup, StaggerItem } from "@/components/marketing/scroll-reveal"

const CATEGORIES = [
  {
    title: "Oficinas e Auto Centers",
    description: "Mecanicas, borracharias, lava-jatos e auto centers.",
    href: "/oficinas",
  },
  {
    title: "Beleza e Estetica",
    description: "Saloes, barbearias, clinicas de estetica e nail designers.",
    href: "/saloes",
  },
  {
    title: "Alimentacao",
    description: "Restaurantes, pizzarias, hamburguers, cafeterias e delivery.",
    href: "/restaurantes",
  },
  {
    title: "Saude e Bem-estar",
    description: "Academias, clinicas, dentistas, pilates e nutricionistas.",
    href: "/saude",
  },
  {
    title: "Pet Shops e Veterinarias",
    description: "Pet shops, banho e tosa, clinicas veterinarias.",
    href: "/pet-shops",
  },
  {
    title: "Comercio e Servicos",
    description: "Lojas, imobiliarias, contabilidade e servicos gerais.",
    href: "/comercio",
  },
]

export function NichesSection() {
  return (
    <section className="bg-white pt-24 md:pt-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">

        {/* Title — left aligned, heading font, large */}
        <ScrollReveal>
          <h2 className="mb-10 max-w-[480px] text-[32px] leading-[40px] font-heading text-black/80 md:text-[40px] md:leading-[48px]">
            Feito para o seu negocio
          </h2>
        </ScrollReveal>

        {/* Cards grid — 3 columns */}
        <StaggerGroup className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <StaggerItem key={cat.title}>
              <Link
                href={cat.href}
                className="group flex items-start gap-4 rounded-2xl bg-black/[0.03] p-6 transition-[background,color] duration-150 hover:bg-black/[0.05]"
              >
                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-black/80">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-black/55">
                    {cat.description}
                  </p>
                </div>

                {/* Arrow circle */}
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-black/30 transition-[background,color] duration-150 group-hover:bg-black/[0.08] group-hover:text-black/55">
                  <IconArrowRight className="size-4" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
