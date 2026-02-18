'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

// ✅ local-seo modular
import { getCopy } from '@/lib/local-copy'
import { renderTokens } from '@/lib/local-copy/render'
import type { StoreMode, LocalPageCtx } from '@/lib/local-copy/types'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faq: FAQItem[]
  storeName: string
  city?: string
  state?: string
  category?: string
  termGender?: TermGender
  termNumber?: TermNumber

  // ✅ para variar por MODE:
  mode: StoreMode

  // ✅ para seed forte/estável:
  id?: string | number
  slug?: string
}

export function FAQSection({
  faq,
  storeName,
  city,
  state,
  category,
  termGender,
  termNumber,
  mode,
  id,
  slug,
}: FAQSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faq || faq.length === 0) return null

  const ctx: LocalPageCtx = {
    id,
    slug,
    mode,
    name: storeName || "",
    category: category || "Serviços",
    city: city || "",
    state: state || "",
  }

  return (
    <section id="faq" className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7] dark:bg-slate-950/50">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              {renderTokens(getCopy(ctx, "faq.kicker"))}
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              {renderTokens(getCopy(ctx, "faq.heading"))}
            </h2>

            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              {/* mantém seu g.art sem quebrar o copy */}
              {city && category ? `Encontre respostas sobre ${g.art} ${storeName}, ${category.toLowerCase()} em ${city}. ` : ""}
              {renderTokens(getCopy(ctx, "faq.intro"))}
            </p>
          </div>

          {/* FAQ Accordion (conteúdo vem do CMS/store) */}
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

                  <div className={cn('grid transition-all duration-300', isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
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
