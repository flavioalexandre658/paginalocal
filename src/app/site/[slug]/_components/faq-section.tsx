'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

interface FAQSectionProps {
  faq: FAQItem[]
  storeName: string
  city?: string
  category?: string
  termGender?: TermGender
  termNumber?: TermNumber
}

export function FAQSection({ faq, storeName, city, category, termGender, termNumber }: FAQSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faq || faq.length === 0) return null

  return (
    <section id="faq" className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7] dark:bg-slate-950/50">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Dúvidas Frequentes
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              Perguntas Frequentes sobre <span className="text-primary">{storeName}</span>{city ? ` em ${city}` : ''}
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Encontre respostas para as dúvidas mais comuns sobre {g.art} {storeName}{category && city ? `, ${category.toLowerCase()} em ${city}` : ''}. Se precisar de mais informações, entre em contato pelo WhatsApp.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3 stagger-children">
            {faq.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className={cn(
                    'overflow-hidden transition-all duration-300 animate-fade-in-up',
                    isOpen
                      ? 'rounded-2xl border-l-4 border-l-primary bg-white shadow-lg dark:bg-slate-900'
                      : 'rounded-2xl border-l-4 border-l-transparent bg-white shadow-sm hover:shadow-md dark:bg-slate-900'
                  )}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                  >
                    <h3
                      className={cn(
                        'pr-4 text-base font-bold transition-colors duration-200 m-0',
                        isOpen ? 'text-primary' : 'text-slate-900 dark:text-white'
                      )}
                    >
                      {item.question}
                    </h3>
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300',
                        isOpen
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      )}
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-300',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-0">
                        <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
