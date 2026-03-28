"use client"

import Link from "next/link"
import { IconArrowRight, IconBrandWhatsapp } from "@tabler/icons-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { trackWhatsAppClick } from "@/lib/tracking"

interface Props {
  shouldRedirectToWhatsApp: boolean
}

const WHATSAPP_URL = `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "73981269904"}?text=${encodeURIComponent("Ola! Quero saber mais sobre o site para meu negocio.")}`

export function CTASection({ shouldRedirectToWhatsApp }: Props) {
  const ctaHref = shouldRedirectToWhatsApp
    ? WHATSAPP_URL
    : `${process.env.NEXT_PUBLIC_APP_URL}/cadastro`

  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-black/80 px-6 py-20 text-center sm:px-12 md:py-28">

            {/* Subtle glow decoration */}
            <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-white/[0.03] blur-3xl" />

            {/* Heading */}
            <h2 className="relative mx-auto max-w-[600px] font-heading text-[36px] leading-[42px] text-white/90 md:text-[56px] md:leading-[64px]">
              Comece a construir seu negocio hoje
            </h2>

            {/* Description */}
            <p className="relative mx-auto mt-6 max-w-md text-base text-white/50 leading-relaxed md:text-lg">
              Seu concorrente ja esta no Google recebendo os clientes que poderiam ser seus. Crie seu site profissional agora com IA.
            </p>

            {/* CTA button */}
            <div className="relative mt-10">
              <Link
                href={ctaHref}
                target={shouldRedirectToWhatsApp ? "_blank" : undefined}
                rel={shouldRedirectToWhatsApp ? "noopener noreferrer" : undefined}
                onClick={() => shouldRedirectToWhatsApp && trackWhatsAppClick("cta_section")}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-medium text-black/80 shadow-lg transition-all duration-150 hover:shadow-xl hover:shadow-white/10"
              >
                {shouldRedirectToWhatsApp ? (
                  <>
                    <IconBrandWhatsapp className="size-5" />
                    Falar no WhatsApp
                  </>
                ) : (
                  <>
                    Comece de graca
                    <IconArrowRight className="size-5" />
                  </>
                )}
              </Link>
            </div>

            {/* Footer note */}
            <p className="relative mt-6 text-sm text-white/30">
              Sem cartao de credito • Cancele quando quiser
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
