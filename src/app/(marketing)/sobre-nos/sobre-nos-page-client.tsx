'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  IconRocket,
  IconTarget,
  IconHeart,
  IconBulb,
  IconUsers,
  IconTrendingUp,
  IconBuildingStore,
  IconMapPin,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import { MarketingHeader } from '../_components/marketing-header'
import { MarketingFooter } from '../_components/marketing-footer'
import { Breadcrumb } from '@/components/shared/breadcrumb'

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
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
  const isInView = useInView(ref, { once: true, margin: '-50px' })

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

interface SobreNosPageClientProps {
  isLoggedIn?: boolean
  hasSubscription?: boolean
}

export function SobreNosPageClient({ isLoggedIn = false, hasSubscription = false }: SobreNosPageClientProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <MarketingHeader isLoggedIn={isLoggedIn} hasSubscription={hasSubscription} />
      <Breadcrumb items={[{ label: 'Sobre Nós' }]} />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <StatsSection />
      <CTASection />
      <MarketingFooter />
    </main>
  )
}

function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
            <IconMapPin className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
            Colocamos negócios locais
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              no topo do Google
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Acreditamos que todo negócio local merece ser encontrado online. Nossa missão é entregar sites profissionais com SEO de alto nível para empreendedores de todo o Brasil, sem que eles precisem se preocupar com nada técnico.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function MissionSection() {
  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200/60 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 md:p-12">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 text-blue-500">
                  <IconTarget className="h-6 w-6" />
                </div>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Nossa Missão
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Entregar sites profissionais com SEO de alto nível para negócios locais, sem que o empreendedor precise de conhecimento técnico ou grandes investimentos. Nós fazemos tudo por você.
                </p>
              </div>

              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-500">
                  <IconBulb className="h-6 w-6" />
                </div>
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Nossa Visão
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  Ser a referência em sites para negócios locais no Brasil, onde cada empreendedor tem um site profissional que aparece no Google e converte visitantes em clientes pelo WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ValuesSection() {
  const values = [
    {
      icon: IconHeart,
      title: 'Compromisso',
      description: 'Tratamos cada cliente como único. Seu sucesso é nosso sucesso.',
      color: 'from-rose-500/20 to-rose-500/5',
      iconColor: 'text-rose-500',
    },
    {
      icon: IconBulb,
      title: 'Inovação',
      description: 'Usamos IA e tecnologia de ponta para simplificar o complexo.',
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
    },
    {
      icon: IconUsers,
      title: 'Acessibilidade',
      description: 'Tecnologia profissional ao alcance de todos os bolsos.',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: IconTrendingUp,
      title: 'Resultados',
      description: 'Foco em conversão. Cada feature é pensada para gerar vendas.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Nossos Valores
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Os princípios que guiam cada decisão e cada linha de código.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={staggerItem}
              className="group rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-900/70"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${value.color} ${value.iconColor}`}>
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                {value.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '2.000+', label: 'Negócios ativos' },
    { value: '50.000+', label: 'Leads gerados' },
    { value: '95+', label: 'Score PageSpeed' },
    { value: '24/7', label: 'Suporte disponível' },
  ]

  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200/60 bg-gradient-to-br from-primary/10 via-white to-primary/5 p-8 shadow-xl dark:border-slate-700/60 dark:from-primary/20 dark:via-slate-900 dark:to-primary/10 md:p-12">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                <IconBuildingStore className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
                Números que falam
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-primary md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

const WHATSAPP_URL = `https://wa.me/55${process.env.NEXT_PUBLIC_SUPPORT_NUMBER || '73981269904'}?text=${encodeURIComponent('Olá! Quero saber mais sobre o site para meu negócio.')}`

function CTASection() {
  return (
    <section className="relative py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
              Faça parte dessa história
            </h2>
            <p className="mx-auto mt-4 text-slate-500 dark:text-slate-400">
              Junte-se a milhares de empreendedores que já estão no topo do Google com o Página Local.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
              >
                <IconBrandWhatsapp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                Falar no WhatsApp
              </a>
              <Link
                href="/contato"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Enviar email
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
