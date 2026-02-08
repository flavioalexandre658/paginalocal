import Link from 'next/link'
import Image from 'next/image'
import {
  IconArrowLeft,
  IconCheck,
  IconMapPin,
  IconBrandWhatsapp,
  IconPhone,
  IconStar,
  IconChevronRight,
} from '@tabler/icons-react'
import { formatCurrency, getWhatsAppUrl, getPhoneUrl, getServicePageUrl, getStoreHomeUrl } from '@/lib/utils'

interface ServiceDetailContentProps {
  store: {
    id: string
    name: string
    slug: string
    category: string
    city: string
    state: string
    phone: string
    whatsapp: string
    logoUrl: string | null
    primaryColor: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
    googleRating: string | null
    googleReviewsCount: number | null
  }
  service: {
    name: string
    slug: string | null
    description: string | null
    longDescription: string | null
    priceInCents: number | null
    imageUrl: string | null
  }
  otherServices: {
    id: string
    name: string
    slug: string | null
    description: string | null
    priceInCents: number | null
  }[]
  testimonials: {
    id: string
    authorName: string
    content: string
    rating: number
    imageUrl: string | null
    isGoogleReview: boolean
  }[]
}

export function ServiceDetailContent({ store, service, otherServices, testimonials }: ServiceDetailContentProps) {
  const whatsappMessage = `Olá! Gostaria de saber mais sobre o serviço de ${service.name}.`
  const rating = store.googleRating ? parseFloat(store.googleRating) : 0
  const showRating = rating >= 4.0 && store.googleReviewsCount && store.googleReviewsCount > 0

  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container relative z-10 mx-auto px-4">
          <Link
            href={getStoreHomeUrl(store.slug)}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/20"
          >
            <IconArrowLeft className="h-4 w-4" />
            Voltar para {store.name}
          </Link>

          <div className="mx-auto max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-md">
              <IconMapPin className="h-4 w-4" />
              {store.city}, {store.state}
            </div>

            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              {service.name}
            </h1>

            <p className="mb-6 text-lg text-white/70">
              {store.category} em {store.city} &middot; {store.name}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {service.priceInCents && (
                <span className="rounded-full bg-emerald-500/20 px-5 py-2 text-lg font-semibold text-emerald-400">
                  {formatCurrency(service.priceInCents)}
                </span>
              )}

              {showRating && (
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  <IconStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-white">{store.googleRating}</span>
                  <span className="text-white/60">({store.googleReviewsCount} avaliações)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {service.imageUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-200/60 shadow-lg dark:border-slate-700/40">
                  <Image
                    src={service.imageUrl}
                    alt={`${service.name} - ${store.name} em ${store.city}`}
                    width={800}
                    height={450}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm md:p-8 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30">
                <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
                  {service.name} em {store.city}
                </h2>
                {service.longDescription ? (
                  <div className="space-y-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    {service.longDescription.split('\n').filter(Boolean).map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                    {service.description
                      || `A ${store.name} oferece o serviço de ${service.name.toLowerCase()} em ${store.city}, ${store.state}. Entre em contato pelo WhatsApp para saber mais sobre este serviço e agendar um horário.`
                    }
                  </p>
                )}

                {service.priceInCents && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-800/40 dark:bg-emerald-900/20">
                    <IconCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      A partir de{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(service.priceInCents)}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              {testimonials.length > 0 && (
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm md:p-8 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30">
                  <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                    Avaliações de clientes
                  </h2>
                  <div className="space-y-4">
                    {testimonials.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-700/40 dark:bg-slate-800/50"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{t.authorName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <IconStar
                                key={i}
                                className={`h-4 w-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed dark:text-slate-300 line-clamp-3">
                          {t.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="sticky top-6 space-y-6">
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                    Solicitar {service.name}
                  </h3>
                  <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
                    Entre em contato com a {store.name} para solicitar este servico.
                  </p>

                  <div className="space-y-3">
                    {store.showWhatsappButton && (
                      <a
                        href={getWhatsAppUrl(store.whatsapp, whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40"
                      >
                        <IconBrandWhatsapp className="h-5 w-5" />
                        Chamar no WhatsApp
                      </a>
                    )}
                    {store.showCallButton && store.phone && (
                      <a
                        href={getPhoneUrl(store.phone)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary/40"
                      >
                        <IconPhone className="h-5 w-5" />
                        Ligar agora
                      </a>
                    )}
                  </div>
                </div>

                {otherServices.length > 0 && (
                  <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                      Outros serviços
                    </h3>
                    <div className="space-y-2">
                      {otherServices.slice(0, 5).map((s) => (
                        <Link
                          key={s.id}
                          href={s.slug ? getServicePageUrl(store.slug, s.slug) : getStoreHomeUrl(store.slug)}
                          className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white hover:shadow-md dark:border-slate-700/40 dark:bg-slate-800/50 dark:hover:border-slate-600"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                              <IconCheck className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 truncate dark:text-slate-200">
                              {s.name}
                            </span>
                          </div>
                          <IconChevronRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 dark:text-slate-500" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sr-only" aria-hidden="false">
        <h2>{service.name} perto de mim em {store.city}</h2>
        <p>
          Procurando por {service.name.toLowerCase()} perto de você em {store.city}, {store.state}?
          A {store.name} é {store.category.toLowerCase()} em {store.city} que oferece {service.name.toLowerCase()} com atendimento profissional.
          {store.googleRating && parseFloat(store.googleRating) >= 4.0 && ` Com nota ${store.googleRating} no Google e ${store.googleReviewsCount} avaliações de clientes.`}
          Entre em contato pelo WhatsApp para agendar.
        </p>
        <p>
          Melhor {store.category.toLowerCase()} em {store.city} para {service.name.toLowerCase()}.
          {service.description && ` ${service.description}`}
        </p>
      </section>
    </main>
  )
}
