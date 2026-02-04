'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MarketingHeader } from './marketing-header'
import { MarketingFooter } from './marketing-footer'

const revealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
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

interface LegalPageLayoutProps {
  icon: React.ReactNode
  title: string
  description: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalPageLayout({
  icon,
  title,
  description,
  lastUpdated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <MarketingHeader />

      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
              {icon}
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
              {description}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Última atualização: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-slate-900/50 md:p-12">
              <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-600 prose-p:dark:text-slate-300 prose-li:text-slate-600 prose-li:dark:text-slate-300 prose-strong:text-slate-900 prose-strong:dark:text-white">
                {children}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <MarketingFooter />
    </main>
  )
}

interface LegalSectionProps {
  id?: string
  title: string
  children: React.ReactNode
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2>{title}</h2>
      {children}
    </section>
  )
}

interface LegalHighlightProps {
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'success'
}

export function LegalHighlight({ children, variant = 'info' }: LegalHighlightProps) {
  const variants = {
    info: 'border-blue-500/20 bg-blue-500/5 text-blue-700 dark:text-blue-300',
    warning: 'border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-300',
    success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  }

  return (
    <div className={`my-6 rounded-xl border p-4 ${variants[variant]}`}>
      {children}
    </div>
  )
}
