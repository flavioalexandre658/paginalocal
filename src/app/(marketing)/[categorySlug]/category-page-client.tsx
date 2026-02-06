'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import {
  IconRocket,
  IconSparkles,
  IconBrandWhatsapp,
  IconCheck,
  IconArrowRight,
  IconStar,
  IconMapPin,
  IconPhone,
  IconBuilding,
  IconChevronDown,
  IconSearch,
  IconUsers,
  IconShieldCheck,
  IconQuestionMark,
} from '@tabler/icons-react'
import { cn, getStoreUrl, getWhatsAppUrl } from '@/lib/utils'
import { MarketingHeader } from '../_components/marketing-header'
import { MarketingFooter } from '../_components/marketing-footer'
import { Breadcrumb } from '@/components/shared/breadcrumb'

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

interface CategoryPageClientProps {
  category: {
    name: string
    slug: string
    description: string | null
    heroTitle: string | null
    heroSubtitle: string | null
    longDescription: string | null
    seoDescription: string | null
    suggestedServices: string[] | null
    faqs: Array<{ question: string; answer: string }> | null
  }
  stores: Array<{
    id: string
    name: string
    slug: string
    description: string | null
    city: string
    state: string
    address: string | null
    phone: string | null
    whatsapp: string | null
    coverUrl: string | null
    logoUrl: string | null
    googleRating: string | null
    googleReviewsCount: number | null
  }>
  stats: {
    totalStores: number
    totalCities: number
    avgRating: string
    totalReviews: number
  }
  cities: Array<{
    city: string
    state: string
    slug: string
    count: number
  }>
}

export function CategoryPageClient({ category, stores, stats, cities }: CategoryPageClientProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <MarketingHeader />
      <Breadcrumb items={[{ label: category.name }]} />
      <HeroSection category={category} stats={stats} />
      <SocialProofBar stats={stats} categoryName={category.name} />
      <BenefitsSection categoryName={category.name} />
      {stores.length > 0 && <FeaturedStoresSection stores={stores} categoryName={category.name} />}
      {category.suggestedServices && category.suggestedServices.length > 0 && (
        <ServicesSection services={category.suggestedServices} categoryName={category.name} />
      )}
      {cities.length > 0 && <CitiesSection cities={cities} categorySlug={category.slug} categoryName={category.name} />}
      {category.faqs && category.faqs.length > 0 && (
        <FAQSection faqs={category.faqs} categoryName={category.name} />
      )}
      <CTASection categoryName={category.name} />
      <MarketingFooter />
    </main>
  )
}

function HeroSection({ category, stats }: { category: CategoryPageClientProps['category']; stats: CategoryPageClientProps['stats'] }) {
  return (
    <section className="relative py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
        >
          <IconBuilding className="h-4 w-4" />
          {category.name}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
        >
          {category.heroTitle || `Encontre a Melhor ${category.name}`}
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            perto de você
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400"
        >
          {category.heroSubtitle || category.seoDescription || `Compare avaliações, veja endereços e entre em contato diretamente pelo WhatsApp com as melhores ${category.name.toLowerCase()} da sua cidade.`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="#estabelecimentos"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
          >
            <IconSearch className="h-5 w-5" />
            Ver estabelecimentos
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-8 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cadastrar meu negócio
            <IconArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <IconBuilding className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-semibold text-slate-900 dark:text-white">{stats.totalStores}</div>
              <div className="text-xs text-slate-500">Estabelecimentos</div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <IconMapPin className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className="text-xl font-semibold text-slate-900 dark:text-white">{stats.totalCities}</div>
              <div className="text-xs text-slate-500">Cidades</div>
            </div>
          </div>

          {Number(stats.avgRating) > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/70">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                <IconStar className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="text-xl font-semibold text-slate-900 dark:text-white">{stats.avgRating}</div>
                <div className="text-xs text-slate-500">Avaliação média</div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function SocialProofBar({ stats, categoryName }: { stats: CategoryPageClientProps['stats']; categoryName: string }) {
  const proofs = [
    { icon: IconUsers, text: `${stats.totalStores}+ ${categoryName}` },
    { icon: IconMapPin, text: `${stats.totalCities} cidades` },
    { icon: IconStar, text: 'Avaliações reais' },
    { icon: IconBrandWhatsapp, text: 'Contato direto' },
  ]

  return (
    <div className="border-y border-slate-200/40 bg-slate-50/50 py-6 dark:border-slate-700/40 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {proofs.map((proof, index) => (
            <motion.div
              key={proof.text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400"
            >
              <proof.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{proof.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BenefitsSection({ categoryName }: { categoryName: string }) {
  const benefits = [
    {
      icon: IconSearch,
      title: 'Fácil de encontrar',
      description: `Pesquise ${categoryName.toLowerCase()} por cidade, bairro ou avaliação e encontre o ideal para você.`,
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: IconShieldCheck,
      title: 'Avaliações reais',
      description: 'Todas as avaliações são importadas do Google, garantindo autenticidade e confiança.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: IconBrandWhatsapp,
      title: 'Contato direto',
      description: 'Entre em contato via WhatsApp ou telefone com um clique, sem intermediários.',
      color: 'from-green-500/20 to-green-500/5',
      iconColor: 'text-green-500',
    },
  ]

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <IconSparkles className="h-4 w-4" />
            Por que usar o Página Local
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl lg:text-3xl">
            A forma mais fácil de encontrar {categoryName.toLowerCase()}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
            Compare opções, veja avaliações reais e entre em contato diretamente.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={staggerItem}
              className="group relative"
            >
              <div className="relative rounded-xl border border-slate-200/40 bg-white/70 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-900/70">
                <div className={cn(
                  'mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br',
                  benefit.color,
                  benefit.iconColor
                )}>
                  <benefit.icon className="h-5 w-5" />
                </div>

                <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedStoresSection({ stores, categoryName }: { stores: CategoryPageClientProps['stores']; categoryName: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="estabelecimentos" className="relative py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-white dark:from-slate-900/50 dark:to-slate-950" />

      <div className="container relative mx-auto px-4">
        <ScrollReveal className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <IconStar className="h-4 w-4" />
            Destaques
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl lg:text-3xl">
            {categoryName} em destaque
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
            Os estabelecimentos mais bem avaliados pelos clientes.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {stores.slice(0, 8).map((store) => (
            <motion.div
              key={store.id}
              variants={staggerItem}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900"
            >
              <div className="relative">
                {/* Cover Image */}
                <div className="relative h-36 w-full overflow-hidden">
                  {store.coverUrl ? (
                    <Image
                      src={store.coverUrl}
                      alt={store.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : store.logoUrl ? (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <Image
                        src={store.logoUrl}
                        alt={store.name}
                        width={64}
                        height={64}
                        className="rounded-lg object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <span className="text-3xl font-bold text-primary/30">
                        {store.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Rating Badge */}
                  {store.googleRating && Number(store.googleRating) > 0 && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900 shadow-md">
                      <IconStar className="h-3 w-3 fill-current" />
                      {store.googleRating}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <Link href={getStoreUrl(store.slug)} target="_blank" rel="noopener noreferrer">
                    <h3 className="mb-1 line-clamp-1 font-semibold text-slate-900 transition-colors group-hover:text-primary dark:text-white">
                      {store.name}
                    </h3>
                  </Link>

                  {store.city && (
                    <div className="mb-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <IconMapPin className="h-3.5 w-3.5" />
                      <span>{store.city}{store.state && `, ${store.state}`}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {store.whatsapp && (
                      <a
                        href={getWhatsAppUrl(store.whatsapp, `Olá! Vi o perfil de ${store.name} no Página Local.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                      >
                        <IconBrandWhatsapp className="h-4 w-4" />
                        WhatsApp
                      </a>
                    )}
                    {store.phone && (
                      <a
                        href={`tel:${store.phone}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-500 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
                      >
                        <IconPhone className="h-4 w-4" />
                        Ligar
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {stores.length > 8 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <span className="text-slate-500 dark:text-slate-400">
              E mais {stores.length - 8} estabelecimentos disponíveis
            </span>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function ServicesSection({ services, categoryName }: { services: string[]; categoryName: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400">
            <IconCheck className="h-4 w-4" />
            Serviços oferecidos
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl lg:text-3xl">
            O que você encontra em {categoryName.toLowerCase()}
          </h2>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3"
        >
          {services.map((service) => (
            <motion.div
              key={service}
              variants={staggerItem}
              className="flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl dark:border-slate-700/60 dark:bg-slate-900/70"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <IconCheck className="h-4 w-4" />
              </div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{service}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CitiesSection({ cities, categorySlug, categoryName }: { cities: CategoryPageClientProps['cities']; categorySlug: string; categoryName: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100/50 dark:from-slate-950 dark:to-slate-900/50" />

      <div className="container relative mx-auto px-4">
        <ScrollReveal className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            <IconMapPin className="h-4 w-4" />
            Por localização
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl lg:text-3xl">
            Encontre {categoryName.toLowerCase()} por cidade
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 md:text-base">
            Selecione sua cidade e veja os estabelecimentos disponíveis na sua região.
          </p>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-3"
        >
          {cities.slice(0, 20).map((city) => (
            <motion.div key={city.slug} variants={staggerItem}>
              <Link
                href={`/${categorySlug}/${city.slug}`}
                className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md hover:shadow-primary/5 dark:border-slate-700/60 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                <IconMapPin className="h-4 w-4 text-slate-400 transition-colors group-hover:text-primary" />
                <span>{city.city}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {city.count}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {cities.length > 20 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            E mais {cities.length - 20} cidades disponíveis
          </motion.p>
        )}
      </div>
    </section>
  )
}

function FAQSection({ faqs, categoryName }: { faqs: Array<{ question: string; answer: string }>; categoryName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-600 dark:text-violet-400">
            <IconQuestionMark className="h-4 w-4" />
            Perguntas frequentes
          </span>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl lg:text-3xl">
            Dúvidas sobre {categoryName.toLowerCase()}
          </h2>
        </ScrollReveal>

        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mx-auto max-w-3xl space-y-3"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className={cn(
                'overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300',
                openIndex === index
                  ? 'border-violet-200/50 bg-white/80 shadow-lg shadow-violet-500/5 dark:border-violet-800/50 dark:bg-slate-900/80'
                  : 'border-slate-200/60 bg-white/70 hover:border-slate-300/60 dark:border-slate-700/60 dark:bg-slate-900/70'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="pr-4 font-medium text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    'flex-shrink-0',
                    openIndex === index ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400'
                  )}
                >
                  <IconChevronDown className="h-5 w-5" />
                </motion.div>
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-200/60 px-5 pb-5 pt-4 dark:border-slate-700/60">
                    <p className="text-slate-600 dark:text-slate-300">{faq.answer}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CTASection({ categoryName }: { categoryName: string }) {
  return (
    <section className="relative py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ScrollReveal>
            <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200/40 bg-gradient-to-br from-primary/10 via-white to-primary/5 p-6 shadow-xl backdrop-blur-xl dark:border-slate-700/40 dark:from-primary/20 dark:via-slate-900 dark:to-primary/10 md:p-10">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
              >
                <IconRocket className="h-6 w-6 text-white" />
              </motion.div>

              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
                Sua {categoryName.toLowerCase()} não está aqui?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-300 md:text-base">
                Cadastre seu negócio gratuitamente e seja encontrado por milhares de clientes.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {['Apareça no Google', 'Contatos via WhatsApp', 'Grátis para começar'].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  >
                    <IconCheck className="h-3.5 w-3.5" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/cadastro"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/40 md:px-8 md:py-4 md:text-base"
                >
                  <IconRocket className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                  Cadastrar meu negócio grátis
                </Link>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Sem cartão de crédito • Pronto em 5 minutos
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
