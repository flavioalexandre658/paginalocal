'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  IconRocket,
  IconSearch,
  IconSparkles,
  IconBrandWhatsapp,
  IconCheck,
  IconX,
  IconArrowRight,
  IconBolt,
  IconShieldCheck,
  IconSeo,
  IconGauge,
  IconCircleDotted,
  IconEngine,
  IconCarGarage,
  IconScissors,
  IconDog,
  IconToolsKitchen2,
  IconBarbell,
  IconStethoscope,
  IconBuildingStore,
  IconHomeHeart,
  IconRazor,
  IconPizza,
  IconCoffee,
  IconDental,
  IconTrophy,
  IconChartBar,
  IconEye,
  IconPercentage,
  IconWorld,
  IconTag,
  IconDeviceMobile,
  IconUsers,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandFacebook,
  IconPhone,
  IconMessageCircle,
  IconTrendingUp,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { MarketingHeader } from './marketing-header'
import { MarketingFooter } from './marketing-footer'

interface LandingPageProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

const revealVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
  }
}

function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={revealVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function LandingPage({ isLoggedIn = false, hasSubscription = false }: LandingPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <HeroSection />
      <SocialProofBar />
      <StepsSection />
      <BeforeAfterSection />
      <PageSpeedSection />
      <AnalyticsSection />
      <ComparisonSection />
      <NichesSection />
      <CTASection />
      <MarketingFooter />
      <FloatingWhatsAppButton />
    </main>
  )
}

const WHATSAPP_URL = `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Quero saber mais sobre o site para meu negócio.')}`

function HeroSection() {
  return (
    <section id="hero" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <IconSparkles className="h-4 w-4" />
          Seu site pronto em até 24 horas
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
        >
          Seu negócio no topo do Google.
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Clientes no WhatsApp.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400"
        >
          Tenha um site profissional com SEO nativo, otimizado para sua cidade
          e feito para converter visitantes em contatos pelo WhatsApp.
          Nós fazemos tudo por você.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
          >
            <IconBrandWhatsapp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            Quero meu site agora
          </a>
          <Link
            href="#como-funciona"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Ver como funciona
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-slate-400"
        >
          <span className="font-semibold text-primary">+2.000 negócios</span> já faturam mais com Página Local
        </motion.p>
      </div>
    </section>
  )
}

function SocialProofBar() {
  const niches = [
    { icon: IconEngine, name: 'Oficinas' },
    { icon: IconScissors, name: 'Salões' },
    { icon: IconDog, name: 'Pet Shops' },
    { icon: IconToolsKitchen2, name: 'Restaurantes' },
    { icon: IconBarbell, name: 'Academias' },
    { icon: IconStethoscope, name: 'Clínicas' },
  ]

  return (
    <div className="border-y border-slate-200/40 bg-slate-50/50 py-6 dark:border-slate-700/40 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {niches.map((niche, index) => (
            <motion.div
              key={niche.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 text-slate-400"
            >
              <niche.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{niche.name}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5"
          >
            <span className="text-sm font-semibold text-primary">+2.000 confiam</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StepsSection() {
  const steps = [
    {
      number: '01',
      icon: IconBrandWhatsapp,
      title: 'Fale conosco',
      description: 'Entre em contato pelo WhatsApp e conte sobre seu negócio. Sem burocracia.',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      number: '02',
      icon: IconSparkles,
      title: 'Nós montamos',
      description: 'Nossa equipe monta seu site com SEO otimizado para sua cidade e seu nicho.',
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
    },
    {
      number: '03',
      icon: IconRocket,
      title: 'Receba clientes',
      description: 'Seu site vai ao ar e leads começam a chegar direto no seu WhatsApp.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="como-funciona" className="relative py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <IconCheck className="h-4 w-4" />
            Simples assim
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Você fala, nós fazemos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Sem código, sem designer, sem complicação. Conte sobre seu negócio e receba seu site pronto em até 24 horas.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              className="group relative"
            >
              <div className="relative rounded-2xl border border-slate-200/40 bg-white/70 p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/20">
                <div className="absolute -top-4 left-6 rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                  {step.number}
                </div>

                <div className={cn(
                  'mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg',
                  step.color,
                  step.iconColor
                )}>
                  <step.icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-1/2 hidden h-0.5 w-8 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700 md:block" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function BeforeAfterSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-white dark:from-slate-900/50 dark:to-slate-950" />

      <div className="container relative mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">
            <IconBolt className="h-4 w-4" />
            Transformação real
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Sem site, sem clientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Veja a diferença entre quem tem um site profissional e quem ainda não aparece no Google
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-5xl">
            <div className="grid overflow-hidden rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 dark:border-slate-700/60 dark:shadow-slate-900/50 md:grid-cols-2">
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 dark:from-slate-800 dark:to-slate-900 md:p-12">
                <div className="absolute left-4 top-4 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500">
                  ANTES
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-xl bg-white/80 p-4 shadow-lg dark:bg-slate-700/80">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-slate-300" />
                      <div className="h-2 w-32 rounded bg-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-full rounded bg-slate-100" />
                      <div className="h-2 w-3/4 rounded bg-slate-100" />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                      <IconX className="h-3 w-3 text-red-400" />
                      Sem site
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/60 p-4 shadow dark:bg-slate-700/60">
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="h-8 w-8 rounded-full bg-slate-200" />
                      <div>
                        <div className="h-2 w-24 rounded bg-slate-200" />
                        <div className="mt-1 text-xs">Concorrente com site</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                    Cliente buscou...
                  </p>
                  <p className="mt-1 text-3xl font-bold text-red-500">
                    e foi embora
                  </p>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 dark:from-emerald-950/30 dark:to-slate-900 md:p-12">
                <div className="absolute right-4 top-4 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
                  DEPOIS
                </div>

                <div className="mt-8 space-y-4">
                  <div className="rounded-xl bg-white p-4 shadow-xl ring-2 ring-emerald-500/20 dark:bg-slate-800">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <div className="h-2 w-32 rounded bg-slate-300" />
                      <div className="ml-auto flex text-amber-400">
                        {'★★★★★'.split('').map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Seu Negócio - Especialista na região
                    </div>
                    <div className="mt-1 text-xs text-emerald-600">
                      seu-negocio.paginalocal.com.br
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                        Site otimizado
                      </span>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                        WhatsApp direto
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 p-3 text-white shadow-lg shadow-emerald-500/30">
                    <IconBrandWhatsapp className="h-5 w-5" />
                    <span className="font-semibold">Cliente entrou em contato!</span>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                    Cliente buscou...
                  </p>
                  <p className="mt-1 text-3xl font-bold text-emerald-500">
                    e virou venda
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function PageSpeedSection() {
  const metrics = [
    { name: 'Performance', score: 95, icon: IconGauge },
    { name: 'Acessibilidade', score: 100, icon: IconShieldCheck },
    { name: 'Boas Práticas', score: 100, icon: IconCheck },
    { name: 'SEO', score: 100, icon: IconSeo },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400">
            <IconBolt className="h-4 w-4" />
            Ultra-rápido
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Sites ultra-rápidos que o Google adora
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Google prioriza sites rápidos no ranking. Os nossos são mais rápidos que 90% da internet.
          </p>
        </ScrollReveal>

        <div ref={ref} className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 md:p-12"
          >
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <svg className="h-48 w-48 -rotate-90 transform">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-slate-200 dark:text-slate-700"
                    />
                    <motion.circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      className="text-emerald-500"
                      initial={{ strokeDasharray: '0 553' }}
                      animate={isInView ? { strokeDasharray: '525 553' } : {}}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-5xl font-bold text-emerald-500"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      95+
                    </motion.span>
                    <span className="text-sm text-slate-500">PageSpeed</span>
                  </div>
                </div>

                <div className="mt-6 w-full max-w-xs">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <span className="text-slate-500">Sites comuns: 40-60</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="font-medium text-emerald-600">Página Local: 95+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {metrics.map((metric, index) => (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <metric.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 dark:text-slate-200">
                          {metric.name}
                        </span>
                        <span className="font-bold text-emerald-500">{metric.score}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                        <motion.div
                          className="h-full rounded-full bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${metric.score}%` } : {}}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function AnalyticsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const metrics = [
    { label: 'Visualizações', shortLabel: 'Visitas', value: 847, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Contatos', shortLabel: 'Contatos', value: 127, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Conversão', shortLabel: 'Conversão', value: 15, suffix: '%', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  const sources = [
    { name: 'Google', icon: IconBrandGoogle, color: 'bg-blue-500', percentage: 45 },
    { name: 'Instagram', icon: IconBrandInstagram, color: 'bg-pink-500', percentage: 30 },
    { name: 'Direto', icon: IconWorld, color: 'bg-slate-500', percentage: 25 },
  ]

  const features = [
    {
      icon: IconEye,
      title: 'Visualizações em tempo real',
      description: 'Acompanhe quantas pessoas visitam seu site a cada dia',
    },
    {
      icon: IconMessageCircle,
      title: 'Cliques no WhatsApp',
      description: 'Saiba quantos clientes entraram em contato via WhatsApp',
    },
    {
      icon: IconPhone,
      title: 'Cliques para ligar',
      description: 'Contabilize quantas ligações seu site gerou',
    },
    {
      icon: IconPercentage,
      title: 'Taxa de conversão',
      description: 'Descubra qual porcentagem de visitantes vira cliente',
    },
    {
      icon: IconWorld,
      title: 'Origem do tráfego',
      description: 'Saiba se seus clientes vêm do Google, Instagram ou outros',
    },
    {
      icon: IconTag,
      title: 'Rastreamento UTM',
      description: 'Acompanhe o desempenho de suas campanhas de marketing',
    },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />

      <div className="container relative mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400">
            <IconChartBar className="h-4 w-4" />
            Analytics Completo
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Dados que transformam visitantes em clientes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Chega de ficar no escuro. Saiba exatamente de onde vêm seus clientes
            e quais ações geram mais resultados.
          </p>
        </ScrollReveal>

        <div ref={ref} className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/80 md:p-8">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500">
                    <IconChartBar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Analytics em Tempo Real
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Últimos 30 dias
                    </p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className={cn(
                        'rounded-2xl p-3 text-center sm:p-4',
                        metric.bg
                      )}
                    >
                      <AnimatedCounter
                        value={metric.value}
                        suffix={metric.suffix}
                        isInView={isInView}
                        className={cn('text-xl font-bold sm:text-2xl md:text-3xl', metric.color)}
                      />
                      <p className="mt-1 text-[10px] text-slate-600 dark:text-slate-300 sm:text-xs">
                        <span className="sm:hidden">{metric.shortLabel}</span>
                        <span className="hidden sm:inline">{metric.label}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Mini Chart */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Visualizações vs Contatos
                    </span>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <IconTrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">+23%</span>
                    </div>
                  </div>
                  <MiniChart isInView={isInView} />
                </motion.div>

                {/* Traffic Sources */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <p className="mb-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                    Origem do Tráfego
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sources.map((source) => (
                      <div
                        key={source.name}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800"
                      >
                        <div className={cn('flex h-5 w-5 items-center justify-center rounded-full text-white', source.color)}>
                          <source.icon className="h-3 w-3" />
                        </div>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                          {source.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {source.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Floating decoration */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 blur-2xl" />
            </motion.div>

            {/* Features List */}
            <motion.div
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={staggerContainer}
              className="space-y-4"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  className="group flex gap-4 rounded-2xl border border-transparent bg-white/50 p-4 transition-all hover:border-purple-200/60 hover:bg-white/80 hover:shadow-lg hover:shadow-purple-500/5 dark:bg-slate-900/50 dark:hover:border-purple-800/40 dark:hover:bg-slate-900/80"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500 transition-transform group-hover:scale-110">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnimatedCounter({
  value,
  suffix = '',
  isInView,
  className
}: {
  value: number
  suffix?: string
  isInView: boolean
  className?: string
}) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  return (
    <motion.span
      ref={nodeRef}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {isInView ? (
          <CountUp value={value} />
        ) : (
          0
        )}
        {suffix}
      </motion.span>
    </motion.span>
  )
}

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <>{count}</>
}

function MiniChart({ isInView }: { isInView: boolean }) {
  const points = [
    { x: 0, y: 60 },
    { x: 20, y: 45 },
    { x: 40, y: 55 },
    { x: 60, y: 35 },
    { x: 80, y: 40 },
    { x: 100, y: 25 },
    { x: 120, y: 30 },
    { x: 140, y: 15 },
  ]

  const points2 = [
    { x: 0, y: 75 },
    { x: 20, y: 70 },
    { x: 40, y: 68 },
    { x: 60, y: 60 },
    { x: 80, y: 55 },
    { x: 100, y: 50 },
    { x: 120, y: 45 },
    { x: 140, y: 35 },
  ]

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const pathD2 = points2.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox="0 0 140 80" className="h-20 w-full">
      {/* Grid lines */}
      {[20, 40, 60].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="140"
          y2={y}
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-slate-200 dark:text-slate-700"
        />
      ))}

      {/* Area fill for line 1 */}
      <motion.path
        d={`${pathD} L 140 80 L 0 80 Z`}
        fill="url(#gradient1)"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.3 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Line 1 - Visualizações */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Line 2 - Contatos */}
      <motion.path
        d={pathD2}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ComparisonSection() {
  const features = [
    { name: 'Tempo para ficar pronto', local: 'Até 24 horas', agency: '30+ dias', alone: 'Semanas' },
    { name: 'Custo mensal', local: 'A partir de R$ 59', agency: 'R$ 2.500+', alone: 'R$ 0' },
    { name: 'Manutenção mensal', local: 'Inclusa', agency: 'R$ 500+', alone: 'Você mesmo' },
    { name: 'SEO otimizado', local: true, agency: 'Talvez', alone: false },
    { name: 'Integração Google', local: true, agency: false, alone: false },
    { name: 'IA para conteúdo', local: true, agency: false, alone: false },
    { name: 'Analytics de leads', local: true, agency: 'Pago à parte', alone: false },
  ]

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50" />

      <div className="container relative mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-600 dark:text-orange-400">
            <IconTrophy className="h-4 w-4" />
            Compare e escolha
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Por que pagar caro se você pode ter melhor?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Veja como o Página Local se compara a outras opções do mercado
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="hidden md:block mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200/60 bg-white shadow-xl dark:border-slate-700/60 dark:bg-slate-900">
              <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <div className="p-4" />
                <div className="relative border-x-2 border-orange-400/30 bg-gradient-to-b from-orange-500/10 to-orange-500/5 px-4 pb-4 pt-8 text-center">
                  <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    Melhor opção
                  </div>
                  <span className="text-sm font-bold text-orange-600">Página Local</span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Agência</span>
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Fazer sozinho</span>
                </div>
              </div>

              {features.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    'grid grid-cols-4 border-b border-slate-100 dark:border-slate-800',
                    index === features.length - 1 && 'border-b-0'
                  )}
                >
                  <div className="p-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {feature.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-center border-x-2 border-orange-400/30 bg-orange-500/5 p-4">
                    {typeof feature.local === 'boolean' ? (
                      feature.local ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-orange-600">{feature.local}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-4">
                    {typeof feature.agency === 'boolean' ? (
                      feature.agency ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm text-slate-500">{feature.agency}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-4">
                    {typeof feature.alone === 'boolean' ? (
                      feature.alone ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm text-slate-500">{feature.alone}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden space-y-4">
            <div className="relative overflow-hidden rounded-2xl border-2 border-orange-400/50 bg-gradient-to-br from-orange-500/10 to-white p-6 shadow-xl dark:from-orange-500/20 dark:to-slate-900">
              <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                Melhor opção
              </div>
              <h3 className="mb-4 text-lg font-bold text-orange-600">Página Local</h3>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">{feature.name}</span>
                    {typeof feature.local === 'boolean' ? (
                      feature.local ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm font-semibold text-orange-600">{feature.local}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg dark:border-slate-700/60 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Agência</h3>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{feature.name}</span>
                    {typeof feature.agency === 'boolean' ? (
                      feature.agency ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm text-slate-500">{feature.agency}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-lg dark:border-slate-700/60 dark:bg-slate-900">
              <h3 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Fazer sozinho</h3>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{feature.name}</span>
                    {typeof feature.alone === 'boolean' ? (
                      feature.alone ? (
                        <IconCheck className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <IconX className="h-5 w-5 text-red-400" />
                      )
                    ) : (
                      <span className="text-sm text-slate-500">{feature.alone}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function NichesSection() {
  const niches = [
    { icon: IconCircleDotted, name: 'Borracharias', slug: 'borracharias' },
    { icon: IconEngine, name: 'Oficinas', slug: 'oficinas' },
    { icon: IconCarGarage, name: 'Auto Centers', slug: 'auto-centers' },
    { icon: IconScissors, name: 'Salões de Beleza', slug: 'saloes' },
    { icon: IconRazor, name: 'Barbearias', slug: 'barbearias' },
    { icon: IconDog, name: 'Pet Shops', slug: 'pet-shops' },
    { icon: IconDental, name: 'Dentistas', slug: 'dentistas' },
    { icon: IconPizza, name: 'Pizzarias', slug: 'pizzarias' },
    { icon: IconBarbell, name: 'Academias', slug: 'academias' },
    { icon: IconBuildingStore, name: 'Lojas', slug: 'lojas' },
    { icon: IconHomeHeart, name: 'Imobiliárias', slug: 'imobiliarias' },
    { icon: IconCoffee, name: 'Cafeterias', slug: 'cafeterias' },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400">
            <IconBuildingStore className="h-4 w-4" />
            Feito para você
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Sites para todos os tipos de negócio local
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Oficinas, salões, pet shops, restaurantes... Se seu cliente pesquisa no Google, nós colocamos você lá.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
        >
          {niches.map((niche) => (
            <motion.div
              key={niche.slug}
              variants={staggerItem}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 dark:border-slate-700/40 dark:bg-slate-900/70"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10 transition-transform duration-300 group-hover:scale-110">
                <niche.icon className="h-6 w-6" />
              </div>
              <span className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                {niche.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-slate-200/40 bg-gradient-to-br from-primary/10 via-white to-primary/5 p-8 shadow-2xl shadow-primary/10 backdrop-blur-xl dark:border-slate-700/40 dark:from-primary/20 dark:via-slate-900 dark:to-primary/10 md:p-16">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
              >
                <IconRocket className="h-8 w-8 text-white" />
              </motion.div>

              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
                Enquanto você lê isso...
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
                seu concorrente já está aparecendo no Google e recebendo os clientes que poderiam ser seus.
              </p>
              <p className="mx-auto mt-2 text-slate-500 dark:text-slate-400">
                Fale conosco e tenha seu site profissional pronto em até 24 horas.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-5 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
                >
                  <IconBrandWhatsapp className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
                  Falar no WhatsApp
                </a>
              </div>

              <p className="mt-6 text-sm text-slate-400">
                Sem complicação • Nós cuidamos de tudo
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function FloatingWhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      if (!heroSection) return

      const heroBottom = heroSection.getBoundingClientRect().bottom
      setIsVisible(heroBottom < 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed bottom-0 left-0 right-0 z-50 p-3 md:hidden"
    >
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#25D366]/30 transition-all active:scale-[0.98]"
      >
        <IconBrandWhatsapp className="h-5 w-5" />
        Falar no WhatsApp
      </a>
    </motion.div>
  )
}

