'use client'

import Link from 'next/link'
import {
  IconTarget,
  IconBulb,
  IconUsers,
  IconTrendingUp,
  IconHeart,
  IconBrandWhatsapp,
  IconMapPin,
} from '@tabler/icons-react'
import { trackWhatsAppClick } from '@/lib/tracking'
import { MarketingHeader } from '../_components/marketing-header'
import { MarketingFooter } from '../_components/marketing-footer'
import { ScrollReveal, StaggerGroup, StaggerItem } from '@/components/marketing/scroll-reveal'
import { PglButton } from '@/components/ui/pgl-button'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WHATSAPP_URL = `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Quero saber mais sobre o site para meu negócio.')}`

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface SobreNosPageClientProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function SobreNosPageClient({ isLoggedIn = false, hasSubscription = false }: SobreNosPageClientProps) {
  return (
    <main className="min-h-screen bg-white">
      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <CTASection />
      <MarketingFooter />
    </main>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366f1]/[0.08]">
            <IconMapPin className="h-7 w-7" style={{ color: '#6366f1' }} />
          </div>

          <h1
            className="text-4xl font-semibold tracking-tight text-black/85 md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Seu negocio merece ser encontrado
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black/55">
            O Decolou usa inteligencia artificial para criar sites profissionais em segundos — com SEO otimizado, design responsivo e tudo que seu negocio precisa para atrair clientes pelo Google e WhatsApp. Sem conhecimento tecnico, sem complicacao.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Mission / Vision
// ---------------------------------------------------------------------------

function MissionSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Missão */}
            <div className="rounded-2xl bg-black/[0.03] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366f1]/[0.08]">
                <IconTarget className="h-5 w-5" style={{ color: '#6366f1' }} />
              </div>
              <h2
                className="mb-3 text-xl font-semibold text-black/80"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Nossa Missão
              </h2>
              <p className="text-sm leading-relaxed text-black/55">
                Democratizar o acesso a sites profissionais com inteligencia artificial. Qualquer empreendedor — de uma barbearia a uma agencia digital — deve conseguir estar online em minutos, sem conhecimento tecnico e sem gastar fortunas.
              </p>
            </div>

            {/* Visão */}
            <div className="rounded-2xl bg-black/[0.03] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#6366f1]/[0.08]">
                <IconBulb className="h-5 w-5" style={{ color: '#6366f1' }} />
              </div>
              <h2
                className="mb-3 text-xl font-semibold text-black/80"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Nossa Visão
              </h2>
              <p className="text-sm leading-relaxed text-black/55">
                Ser a plataforma de criacao de sites com IA mais usada do Brasil. Queremos que cada empreendedor tenha um site profissional que apareca no Google e converta visitantes em clientes.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

const values = [
  {
    icon: IconHeart,
    title: 'Compromisso com resultados',
    description: 'Tratamos cada cliente como único. Seu sucesso é o nosso sucesso e cada detalhe importa.',
    iconBg: 'bg-emerald-500/[0.08]',
    iconColor: '#10b981',
  },
  {
    icon: IconBulb,
    title: 'Inovação acessível',
    description: 'Usamos IA e tecnologia de ponta para que qualquer pessoa consiga criar um site profissional em segundos.',
    iconBg: 'bg-amber-500/[0.08]',
    iconColor: '#f59e0b',
  },
  {
    icon: IconUsers,
    title: 'Acessibilidade',
    description: 'Tecnologia profissional ao alcance de todos os bolsos, sem surpresas ou cobranças ocultas.',
    iconBg: 'bg-blue-500/[0.08]',
    iconColor: '#3b82f6',
  },
  {
    icon: IconTrendingUp,
    title: 'Foco em resultados',
    description: 'Cada feature é pensada para gerar vendas. Conversão é o nosso principal indicador.',
    iconBg: 'bg-[#6366f1]/[0.08]',
    iconColor: '#6366f1',
  },
]

function ValuesSection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <ScrollReveal className="mb-12 text-center">
          <h2
            className="text-2xl font-semibold text-black/80 md:text-3xl"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Nossos Valores
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-black/55">
            Os princípios que guiam cada decisão e cada linha de código.
          </p>
        </ScrollReveal>

        <StaggerGroup className="grid gap-6 md:grid-cols-2">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <div className="rounded-2xl bg-black/[0.03] p-6">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${value.iconBg}`}>
                  <value.icon className="h-5 w-5" style={{ color: value.iconColor }} />
                </div>
                <h3 className="mb-2 text-base font-semibold text-black/75">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-black/55">
                  {value.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// CTA
// ---------------------------------------------------------------------------

function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-14">
        <ScrollReveal>
          <div className="rounded-3xl bg-black/80 p-12 text-center">
            <h2
              className="text-2xl font-semibold text-white/90 md:text-3xl"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Faça parte dessa história
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/55">
              Crie seu site profissional com IA em segundos e comece a atrair clientes pelo Google.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <PglButton
                asChild
                size="lg"
                className="bg-white text-black/80 hover:bg-white/90 hover:text-black shadow-none"
                onClick={() => trackWhatsAppClick('sobre_nos_cta')}
              >
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <IconBrandWhatsapp className="h-5 w-5" />
                  Falar no WhatsApp
                </a>
              </PglButton>

              <PglButton asChild size="lg" variant="ghost" className="text-white/70 hover:bg-white/10 hover:text-white">
                <Link href="/contato">
                  Enviar email
                </Link>
              </PglButton>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
