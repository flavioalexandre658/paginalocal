'use client'

import { useRef } from 'react'
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
} from '@tabler/icons-react'
import { Logo } from '@/components/shared/logo'
import { cn } from '@/lib/utils'

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

export function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <Header />
      <HeroSection />
      <SocialProofBar />
      <StepsSection />
      <BeforeAfterSection />
      <PageSpeedSection />
      <ComparisonSection />
      <NichesSection />
      <CTASection />
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/70 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo size="sm" href="/" />
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/planos"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:block"
          >
            Planos
          </Link>
          <Link
            href="/entrar"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:px-4"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 sm:px-4"
          >
            Começar
          </Link>
        </nav>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <IconSparkles className="h-4 w-4" />
          Presença digital em 5 minutos
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
          Crie uma landing page profissional em minutos. SEO otimizado para sua cidade, 
          integração com Google Meu Negócio e conversão direta via WhatsApp.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/cadastro"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
          >
            <IconRocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
            Criar minha página agora
          </Link>
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
      icon: IconSearch,
      title: 'Conecte',
      description: 'Busque sua empresa no Google ou cadastre manualmente. Importamos avaliações, fotos e dados automaticamente.',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      number: '02',
      icon: IconSparkles,
      title: 'Gere',
      description: 'Nossa IA cria textos persuasivos e otimiza suas fotos. Tudo pensado para SEO local e conversão.',
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
    },
    {
      number: '03',
      icon: IconRocket,
      title: 'Venda',
      description: 'Seu site vai ao ar instantaneamente. Leads começam a chegar direto no seu WhatsApp.',
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
            Pronto para vender em 5 minutos
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Sem código, sem designer, sem espera. Conecte, gere e comece a receber clientes.
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
            Saia do anonimato digital
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Transforme uma busca perdida em um cliente no seu WhatsApp
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
            Seu site mais rápido que 90% da internet
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Google ama velocidade. Seus clientes também. Sites lentos perdem clientes.
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

function ComparisonSection() {
  const features = [
    { name: 'Tempo para ficar pronto', local: '5 minutos', agency: '30+ dias', alone: 'Semanas' },
    { name: 'Custo inicial', local: 'A partir de R$ 49', agency: 'R$ 2.500+', alone: 'R$ 0' },
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
            Por que pagar caro por algo que você pode ter agora?
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
            Feito para quem faz a cidade girar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
            Não importa se você troca pneus ou corta cabelos. Se seu cliente está no Google, você precisa estar aqui.
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
                seu concorrente pode estar recebendo o cliente que era seu.
              </p>
              <p className="mx-auto mt-2 text-slate-500 dark:text-slate-400">
                Crie sua página agora e comece a converter.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/cadastro"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-10 py-5 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
                >
                  <IconRocket className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
                  Criar minha página
                </Link>
              </div>

              <p className="mt-6 text-sm text-slate-400">
                Sem cartão de crédito • Pronto em 5 minutos
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative border-t border-slate-200/40 bg-slate-50/50 py-12 dark:border-slate-700/40 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo size="sm" href="/" />
          
          <nav className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/planos" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Planos
            </Link>
            <Link href="/entrar" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Entrar
            </Link>
            <Link href="/cadastro" className="text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
              Criar conta
            </Link>
          </nav>

          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Página Local
          </p>
        </div>
      </div>
    </footer>
  )
}
