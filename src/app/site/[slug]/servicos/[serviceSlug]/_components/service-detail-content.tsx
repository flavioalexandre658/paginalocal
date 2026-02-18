import Link from 'next/link'
import Image from 'next/image'
import {
  IconArrowLeft,
  IconCheck,
  IconMapPin,
  IconBrandWhatsapp,
  IconPhone,
  IconStar,
} from '@tabler/icons-react'
import { formatCurrency, getWhatsAppUrl, getPhoneUrl, getStoreHomeUrl } from '@/lib/utils'
import {
  getContrastTextClass,
  getContrastMutedClass,
  getContrastBadgeClasses,
  isLightColor,
} from '@/lib/color-contrast'
import { ServicesSection } from '../../../_components/services-section'
import { TestimonialsSection } from '../../../_components/testimonials-section'
import { FAQSection } from '../../../_components/faq-section'
import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'
import type { StoreMode } from '@/lib/local-copy/types'

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
    whatsappDefaultMessage?: string | null
    logoUrl: string | null
    primaryColor: string | null
    heroBackgroundColor: string | null
    buttonColor: string | null
    isActive: boolean
    showWhatsappButton: boolean
    showCallButton: boolean
    googleRating: string | null
    googleReviewsCount: number | null
    termGender?: TermGender | null
    termNumber?: TermNumber | null
    mode: StoreMode
  }
  service: {
    name: string
    slug: string | null
    description: string | null
    longDescription: string | null
    priceInCents: number | null
    imageUrl: string | null
    heroImageUrl: string | null
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
  faq: { question: string; answer: string }[]
}

export function ServiceDetailContent({ store, service, otherServices, testimonials, faq }: ServiceDetailContentProps) {
  const g = getStoreGrammar(store.termGender ?? undefined, store.termNumber ?? undefined)
  const whatsappMessage = store.whatsappDefaultMessage?.trim()
    || `Olá! Gostaria de saber mais sobre o serviço de ${service.name} ${g.na} ${store.name}.`
  const rating = store.googleRating ? parseFloat(store.googleRating) : 0
  const showRating = rating >= 4.0 && store.googleReviewsCount && store.googleReviewsCount > 0

  const heroBg = store.heroBackgroundColor || '#1e293b'
  const textClass = getContrastTextClass(heroBg)
  const mutedClass = getContrastMutedClass(heroBg)
  const badgeClasses = getContrastBadgeClasses(heroBg)
  const isLight = isLightColor(heroBg)

  return (
    <main className="w-full max-w-full overflow-x-clip">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0" style={{ backgroundColor: heroBg }} />
        <div className="absolute -top-24 -right-24 z-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 z-0 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

        <div className={`container relative z-10 mx-auto px-4 ${textClass}`}>
          <div className="mx-auto max-w-4xl">
            <Link
              href={getStoreHomeUrl(store.slug)}
              className={`mb-8 mr-4 inline-flex max-w-full items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md transition-all ${badgeClasses} ${isLight ? 'hover:bg-black/10' : 'hover:bg-white/20'}`}
            >
              <IconArrowLeft className="h-4 w-4 shrink-0" />
              <span className="truncate">Voltar para {store.name}</span>
            </Link>

            <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-md ${badgeClasses}`}>
              <IconMapPin className="h-4 w-4" />
              {store.city}, {store.state}
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {service.name}
            </h1>

            <p className={`mb-6 text-lg leading-relaxed ${mutedClass}`}>
              {store.name} &middot; {store.category} em {store.city}, {store.state}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              {service.priceInCents && (
                <span className={`rounded-full px-5 py-2 text-lg font-bold ${isLight ? 'bg-primary/10 text-primary' : 'bg-white/15 text-white'}`}>
                  {formatCurrency(service.priceInCents)}
                </span>
              )}

              {showRating && (
                <div className={`flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md ${isLight ? 'bg-black/5' : 'bg-white/10'}`}>
                  <IconStar className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{store.googleRating}</span>
                  <span className={mutedClass}>({store.googleReviewsCount} avaliações)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero image */}
      {service.heroImageUrl && (
        <section className="bg-[#f3f5f7] py-8 dark:bg-slate-950/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border-2 border-slate-100 shadow-xl dark:border-slate-800">
              <Image
                src={service.heroImageUrl}
                alt={`${service.name} - ${store.name}`}
                width={1200}
                height={675}
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Description + CTA */}
      <section className="py-20 md:py-28 bg-[#f3f5f7] dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Service image */}
            {service.imageUrl && (
              <div className="overflow-hidden rounded-2xl border-2 border-slate-100 shadow-lg dark:border-slate-800">
                <Image
                  src={service.imageUrl}
                  alt={`${service.name} - ${store.name} em ${store.city}`}
                  width={800}
                  height={450}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            {/* Description card */}
            <div className="rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 shadow-lg md:p-10 dark:border-slate-800 dark:border-l-primary dark:bg-slate-900">
              <h2 className="mb-4 text-2xl font-extrabold text-slate-900 dark:text-white md:text-3xl">
                {service.name} em <span className="text-primary">{store.city}, {store.state}</span> — {store.name}
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
                    || `A ${store.name}, ${store.category.toLowerCase()} em ${store.city}, ${store.state}, oferece o serviço de ${service.name.toLowerCase()} com atendimento profissional e personalizado. Entre em contato pelo WhatsApp para saber mais detalhes, consultar valores e agendar um horário.`
                  }
                </p>
              )}

              {service.priceInCents && (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-primary/10 p-4">
                  <IconCheck className="h-5 w-5 text-primary" />
                  <span className="text-slate-700 dark:text-slate-300">
                    A partir de{' '}
                    <span className="font-bold text-primary">
                      {formatCurrency(service.priceInCents)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="overflow-hidden rounded-2xl bg-primary p-8 shadow-lg md:p-10">
              <h3 className="mb-2 text-xl font-extrabold text-white">
                Solicite {service.name} em {store.city}
              </h3>
              <p className="mb-6 text-white/90">
                Fale agora com a {store.name} e solicite o serviço de {service.name.toLowerCase()}. Atendemos em {store.city} e região com qualidade e profissionalismo.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {store.showWhatsappButton && (
                  <a
                    href={getWhatsAppUrl(store.whatsapp, whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-slate-900 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <IconBrandWhatsapp className="h-5 w-5" />
                    Solicitar via WhatsApp
                  </a>
                )}
                {store.showCallButton && store.phone && (
                  <a
                    href={getPhoneUrl(store.phone)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 font-bold text-white transition-all hover:bg-white/10"
                  >
                    <IconPhone className="h-5 w-5" />
                    Ligar para {store.name}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reuse real TestimonialsSection from main site */}
      {testimonials.length > 0 && (
        <TestimonialsSection
          testimonials={testimonials}
          storeName={store.name}
          city={store.city}
          category={store.category}
          mode={store.mode}
          id={store.id}
        />
      )}

      {otherServices.length > 0 && (
        <ServicesSection
          services={otherServices}
          storeName={store.name}
          storeSlug={store.slug}
          category={store.category}
          city={store.city}
          termGender={store.termGender ?? undefined}
          termNumber={store.termNumber ?? undefined}
          mode={store.mode}
          id={store.id}
        />
      )}

      {faq.length > 0 && (
        <FAQSection faq={faq} storeName={store.name} city={store.city} category={store.category} termGender={store.termGender ?? undefined} termNumber={store.termNumber ?? undefined} mode={store.mode} id={store.id} />
      )}

      <section className="sr-only" aria-hidden="false">
        <h2>{service.name} perto de mim em {store.city}, {store.state}</h2>
        <p>
          Procurando por {service.name.toLowerCase()} perto de você em {store.city}, {store.state}?
          {g.Art} {store.name} é {store.category.toLowerCase()} em {store.city} que oferece {service.name.toLowerCase()} com atendimento profissional e personalizado.
          {store.googleRating && parseFloat(store.googleRating) >= 4.0 && ` Com nota ${store.googleRating} no Google e ${store.googleReviewsCount} avaliações de clientes satisfeitos.`}
          {` Nosso serviço de ${service.name.toLowerCase()} está disponível para clientes de ${store.city} e toda a região.`}
          {` Agende pelo WhatsApp e garanta atendimento de qualidade em ${store.category.toLowerCase()} em ${store.city}, ${store.state}.`}
        </p>
      </section>
    </main>
  )
}
