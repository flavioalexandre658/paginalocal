'use client'

import { useState } from 'react'
import { IconStar, IconQuote, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { TestimonialAvatar } from './testimonial-avatar'

interface Testimonial {
  id: string
  authorName: string
  content: string
  rating: number
  imageUrl?: string | null
  isGoogleReview: boolean
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
  storeName?: string
}

const ITEMS_PER_PAGE = 6

export function TestimonialsSection({ testimonials, storeName }: TestimonialsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE)
  const startIndex = currentPage * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTestimonials = testimonials.slice(startIndex, endIndex)

  const goToPrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <section className="relative overflow-hidden py-8 md:py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-800/30 dark:via-slate-900/50 dark:to-slate-950" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-5 py-2 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <IconStar className="h-4 w-4 fill-current" />
            Avaliações Reais
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            O que nossos clientes dizem
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            {testimonials.length > 0
              ? `${testimonials.length} avaliações de clientes satisfeitos${storeName ? ` da ${storeName}` : ''}`
              : 'Feedback de quem já conhece nosso trabalho'}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50"
            >
              <div className="absolute -right-6 -top-6 opacity-5 transition-opacity duration-300 group-hover:opacity-10">
                <IconQuote className="h-24 w-24 text-slate-900 dark:text-white" />
              </div>

              <div className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <TestimonialAvatar
                    imageUrl={testimonial.imageUrl}
                    authorName={testimonial.authorName}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.authorName}
                    </p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <IconStar
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200 dark:text-slate-700'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  {testimonial.isGoogleReview && <GoogleIcon />}
                </div>

                <p className="text-slate-600 leading-relaxed line-clamp-4 dark:text-slate-300">
                  {testimonial.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={goToPrevious}
              disabled={currentPage === 0}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              aria-label="Página anterior"
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition-all ${currentPage === i
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700'
                    }`}
                  aria-label={`Ir para página ${i + 1}`}
                  aria-current={currentPage === i ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentPage === totalPages - 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700"
              aria-label="Próxima página"
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Mostrando {startIndex + 1}-{Math.min(endIndex, testimonials.length)} de {testimonials.length} avaliações
          </p>
        )}
      </div>
    </section>
  )
}

function GoogleIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md dark:bg-slate-700">
      <svg className="h-4 w-4" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    </div>
  )
}
