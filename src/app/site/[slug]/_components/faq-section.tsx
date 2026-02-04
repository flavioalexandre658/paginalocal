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
    <section className="relative py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <IconHelpCircle className="h-4 w-4" />
            Tire suas dúvidas
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Respostas rápidas sobre {storeName}
          </p>
        </div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className={cn(
                'overflow-hidden rounded-2xl border transition-all duration-300',
                openIndex === index
                  ? 'border-slate-300 bg-white shadow-md dark:border-slate-600 dark:bg-slate-800'
                  : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
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
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
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
                  <div className="border-t border-slate-100 px-6 pb-6 pt-4 dark:border-slate-700">
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
