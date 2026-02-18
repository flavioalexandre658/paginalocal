
import Image from 'next/image'
import {
  IconCheck,
  IconBrandWhatsapp,
  IconPhone,
} from '@tabler/icons-react'
import { formatCurrency, getWhatsAppUrl, getPhoneUrl } from '@/lib/utils'

import { ServicesSection } from '../../../_components/services-section'
import { TestimonialsSection } from '../../../_components/testimonials-section'
import { FAQSection } from '../../../_components/faq-section'
import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'
import type { StoreMode } from '@/lib/local-copy/types'

import { getCopy } from "@/lib/local-copy"
import { renderTokens } from "@/lib/local-copy/render"
import type { LocalPageCtx } from "@/lib/local-copy/types"
import { HeroSection } from '../../../_components/hero-section'


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
    coverUrl: string | null
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
    iconName: string | null
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

  const ctx: LocalPageCtx = {
    id: store.id,
    slug: store.slug,
    mode: store.mode,
    name: store.name,
    category: store.category,
    city: store.city,
    state: store.state,

    serviceName: service.name,
    serviceDesc: service.description,
  }



  const whatsappMessage = store.whatsappDefaultMessage?.trim()
    || `Olá! Gostaria de saber mais sobre o serviço de ${service.name} ${g.na} ${store.name}.`

  return (
    <main className="w-full max-w-full overflow-x-clip">
      {/* Hero */}
      <HeroSection
        store={store}
        pageTitle={service.name}
        pageSubtitle={`Confira mais sobre este serviço fornecido por ${store.name} em ${store.city}, ${store.state}`}
        compact
        showBackLink
      />

      {/* Hero image 
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
      )}*/}

      {/* Description + CTA */}
      <section className="py-20 md:py-28 bg-[#f3f5f7] dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="mb-14 animate-fade-in-up">
              <span className="text-sm font-bold uppercase tracking-widest text-primary">
                {renderTokens(getCopy(ctx, "service.kicker"))}
              </span>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
                {renderTokens(getCopy(ctx, "service.heading"))}
              </h2>

              <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
                {renderTokens(getCopy(ctx, "service.intro"))}
              </p>

            </div>

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
                    {renderTokens(getCopy(ctx, "service.priceHint"))}
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
                {renderTokens(getCopy(ctx, "service.ctaTitle"))}
              </h3>
              <p className="mb-6 text-white/90">
                {renderTokens(getCopy(ctx, "service.ctaDesc"))}
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
                    {renderTokens(getCopy(ctx, "service.ctaWhatsapp"))}
                  </a>
                )}
                {store.showCallButton && store.phone && (
                  <a
                    href={getPhoneUrl(store.phone)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 font-bold text-white transition-all hover:bg-white/10"
                  >
                    <IconPhone className="h-5 w-5" />
                    {renderTokens(getCopy(ctx, "service.ctaPhone"))}
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
