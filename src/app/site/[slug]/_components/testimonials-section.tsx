'use client'

import { useState } from 'react'
import { IconStar, IconQuote, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { TestimonialAvatar } from './testimonial-avatar'

interface Testimonial {
  id: string
  authorName: string
  content: string
  rating: number
  imageUrl?: string | null
  isGoogleReview: boolean
}

import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  storeName?: string
  city?: string
  category?: string
  termGender?: TermGender
  termNumber?: TermNumber
}

const ITEMS_PER_PAGE = 6

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <IconStar
          key={i}
          className={cn(
            'h-4 w-4',
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'text-slate-200 dark:text-slate-700'
          )}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection({ testimonials, storeName, city, category, termGender, termNumber }: TestimonialsSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTestimonials = testimonials.slice(startIndex, endIndex)

  const useFeaturedLayout = testimonials.length <= 3

  return (
    <section id="avaliacoes" className="relative overflow-hidden py-20 md:py-28 bg-primary">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header — white text on primary bg */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-white/90">
              Avaliações de Clientes
            </span>
            <h2 className="mt-3 text-3xl tracking-tight text-white md:text-4xl lg:text-5xl">
              Avaliações sobre <span className="text-white font-extrabold">{storeName || 'nosso trabalho'}</span>{city ? ` em ${city}` : ''}
            </h2>
            <p className="mt-4 text-lg text-white/90">
              {testimonials.length > 0
                ? `Veja o que ${testimonials.length} clientes satisfeitos dizem sobre ${g.art} ${storeName || 'nossa empresa'}${category && city ? `, ${category.toLowerCase()} em ${city}` : ''}. Avaliações reais de quem já conhece ${g.nossa} trabalho.`
                : `Avaliações de clientes${storeName ? ` ${g.da} ${storeName}` : ''}${category && city ? `, ${category.toLowerCase()} em ${city}` : ''}`}
            </p>
          </div>

          {useFeaturedLayout ? (
            /* ====== FEATURED: 1-3 testimonials — large centered cards ====== */
            <div className="space-y-8 stagger-children">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-8 shadow-lg animate-fade-in-up md:p-10 dark:border-slate-800 dark:bg-slate-900"
                >
                  {/* Decorative quote */}
                  <div className="absolute -right-4 -top-4 text-primary/10">
                    <IconQuote className="h-24 w-24" />
                  </div>

                  <div className="relative">
                    {/* Quote */}
                    <blockquote className="mb-8 text-lg italic leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
                      &ldquo;{testimonial.content}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <TestimonialAvatar
                        imageUrl={testimonial.imageUrl}
                        authorName={testimonial.authorName}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {testimonial.authorName}
                        </p>
                        <Stars rating={testimonial.rating} />
                      </div>
                      {testimonial.isGoogleReview && <GoogleIcon />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ====== GRID: 4+ testimonials — 2-column cards ====== */
            <>
              <div className="grid gap-6 md:grid-cols-2 stagger-children">
                {currentTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 animate-fade-in-up dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary/30"
                  >
                    {/* Decorative quote */}
                    <div className="absolute -right-3 -top-3 text-primary/5 transition-colors duration-300 group-hover:text-primary/10">
                      <IconQuote className="h-16 w-16" />
                    </div>

                    <div className="relative">
                      {/* Content */}
                      <p className="mb-5 text-slate-600 leading-relaxed line-clamp-4 dark:text-slate-300">
                        &ldquo;{testimonial.content}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <TestimonialAvatar
                          imageUrl={testimonial.imageUrl}
                          authorName={testimonial.authorName}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {testimonial.authorName}
                          </p>
                          <Stars rating={testimonial.rating} />
                        </div>
                        {testimonial.isGoogleReview && <GoogleIcon />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-100 bg-white text-slate-600 shadow-sm transition-all hover:border-primary/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      aria-label="Página anterior"
                    >
                      <IconChevronLeft className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={cn(
                            'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-all',
                            currentPage === i
                              ? 'bg-primary text-white shadow-md'
                              : 'border-2 border-slate-100 bg-white text-slate-600 hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                          )}
                          aria-label={`Ir para página ${i + 1}`}
                          aria-current={currentPage === i ? 'page' : undefined}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-100 bg-white text-slate-600 shadow-sm transition-all hover:border-primary/30 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                      aria-label="Próxima página"
                    >
                      <IconChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="text-sm text-white/95 dark:text-slate-500">
                    Mostrando {startIndex + 1}–{Math.min(endIndex, testimonials.length)} de {testimonials.length} avaliações
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function GoogleIcon() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    </div>
  )
}
