'use client'

import { useState } from 'react'
import { IconChevronDown, IconHelpCircle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faq: FAQItem[]
  storeName: string
}

export function FAQSection({ faq, storeName }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faq || faq.length === 0) return null

  return (
    <section id="faq" className="relative py-16 md:py-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/[0.03] to-transparent" />
      
      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-600 mb-4">
            <IconHelpCircle className="h-4 w-4" />
            Tire suas dúvidas
          </span>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Respostas rápidas sobre {storeName}
          </p>
        </div>

        {/* FAQ Accordion with Glassmorphism */}
        <div className="mx-auto max-w-3xl space-y-4 stagger-children">
          {faq.map((item, index) => (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-300 animate-fade-in-up',
                openIndex === index
                  ? 'border-violet-200/50 bg-white/80 shadow-lg shadow-violet-500/5 dark:border-violet-800/50 dark:bg-slate-900/80'
                  : 'border-slate-200/60 bg-white/70 shadow-sm hover:border-violet-200/40 dark:border-slate-700/40 dark:bg-slate-900/70 dark:hover:border-violet-800/40'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="pr-4 font-semibold text-slate-900 dark:text-white">
                  {item.question}
                </span>
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                    openIndex === index
                      ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                  )}
                >
                  <IconChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform duration-300',
                      openIndex === index && 'rotate-180'
                    )}
                  />
                </div>
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300',
                  openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100/50 px-6 pb-6 pt-4 dark:border-slate-700/50">
                    <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
