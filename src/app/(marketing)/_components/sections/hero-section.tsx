"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconArrowRight } from "@tabler/icons-react"
import { PglButton } from "@/components/ui/pgl-button"
import { trackWhatsAppClick } from "@/lib/tracking"

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_SUPPORT_NUMBER || "73981269904"

interface Props {
  shouldRedirectToWhatsApp: boolean
}

export function HeroSection({ shouldRedirectToWhatsApp }: Props) {
  const whatsAppUrl = `https://wa.me/55${WHATSAPP_NUMBER}?text=${encodeURIComponent("Ola! Quero criar meu site com IA!")}`
  const ctaHref = shouldRedirectToWhatsApp ? whatsAppUrl : `${process.env.NEXT_PUBLIC_APP_URL}/cadastro`

  return (
    <section className="relative flex min-h-dvh flex-col justify-between overflow-hidden bg-white">
      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-6 py-20 text-center md:py-28">

          {/* Heading */}
          <motion.h1
            className="text-[52px] font-medium leading-[1.05] tracking-[-0.02em] text-black/80 md:text-[88px]"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Crie um site em 30 segundos com IA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="max-w-[480px] text-base text-black/80 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          >
            O Construtor de Sites com IA que impulsiona o seu negocio, atrai clientes e coloca voce em 1o lugar no Google e no ChatGPT.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
          >
            <PglButton variant="dark" size="lg" asChild>
              <Link
                href={ctaHref}
                target={shouldRedirectToWhatsApp ? "_blank" : undefined}
                rel={shouldRedirectToWhatsApp ? "noopener noreferrer" : undefined}
                onClick={() => shouldRedirectToWhatsApp && trackWhatsAppClick("hero_cta")}
              >
                Comece de graca
                <IconArrowRight className="size-4" />
              </Link>
            </PglButton>
          </motion.div>

        </div>
      </div>

      {/* ── Decorative site mockups ── */}
      <motion.div
        className="relative z-0 mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-14"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <div className="flex items-end justify-center gap-4 pb-0">
          {/* Left mockup */}
          <div className="hidden w-[30%] translate-y-8 sm:block">
            <SiteMockup variant="dark" />
          </div>

          {/* Center mockup — prominent */}
          <div className="w-full max-w-[480px] sm:w-[40%]">
            <SiteMockup variant="light" featured />
          </div>

          {/* Right mockup */}
          <div className="hidden w-[30%] translate-y-12 sm:block">
            <SiteMockup variant="green" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Site mockup skeleton                                                */
/* ------------------------------------------------------------------ */

function SiteMockup({ variant, featured }: { variant: "dark" | "light" | "green"; featured?: boolean }) {
  const heroColors = {
    dark: "from-black/80 to-black/60",
    light: "from-black/[0.04] to-black/[0.02]",
    green: "from-emerald-800 to-emerald-600",
  }
  const textColor = variant === "light" ? "bg-black/10" : "bg-white/30"
  const textColorStrong = variant === "light" ? "bg-black/15" : "bg-white/50"
  const textColorMuted = variant === "light" ? "bg-black/[0.06]" : "bg-white/20"
  const cardBg = variant === "light" ? "bg-black/[0.03]" : "bg-white/[0.06]"
  const btnBg = variant === "light" ? "bg-black/80" : "bg-white/80"

  return (
    <div className={`overflow-hidden rounded-t-2xl border border-b-0 border-black/[0.08] bg-white shadow-xl ${featured ? "shadow-black/[0.08]" : "shadow-black/[0.04]"}`}>
      {/* Browser chrome */}
      <div className="flex h-7 items-center gap-1.5 border-b border-black/[0.06] px-3">
        <div className="size-2 rounded-full bg-black/10" />
        <div className="size-2 rounded-full bg-black/10" />
        <div className="size-2 rounded-full bg-black/10" />
        <div className="mx-auto h-3.5 w-24 rounded-full bg-black/[0.04]" />
      </div>

      {/* Site header skeleton */}
      <div className="flex items-center justify-between border-b border-black/[0.04] px-4 py-2">
        <div className="h-2.5 w-16 rounded bg-black/[0.08]" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded bg-black/[0.05]" />
          <div className="h-2 w-8 rounded bg-black/[0.05]" />
          <div className="h-2 w-8 rounded bg-black/[0.05]" />
        </div>
      </div>

      {/* Hero area */}
      <div className={`bg-gradient-to-br ${heroColors[variant]} px-5 py-8 text-center ${featured ? "sm:py-12" : "sm:py-8"}`}>
        <div className={`mx-auto h-2 w-14 rounded ${textColor}`} />
        <div className={`mx-auto mt-2.5 h-4 w-36 rounded ${textColorStrong}`} />
        <div className={`mx-auto mt-1.5 h-2 w-24 rounded ${textColorMuted}`} />
        <div className={`mx-auto mt-4 h-6 w-20 rounded-lg ${btnBg}`} />
      </div>

      {/* Content area */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-12 rounded-lg ${cardBg}`} />
          <div className={`h-12 rounded-lg ${cardBg}`} />
          <div className={`h-12 rounded-lg ${cardBg}`} />
        </div>
        {featured && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className={`h-8 rounded-lg ${cardBg}`} />
            <div className={`h-8 rounded-lg ${cardBg}`} />
          </div>
        )}
      </div>
    </div>
  )
}
