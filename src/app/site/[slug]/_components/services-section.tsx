import Link from 'next/link'
import { IconSparkles, IconArrowRight } from '@tabler/icons-react'
import { getServicePageUrl } from '@/lib/utils'

interface Service {
  id: string
  name: string
  slug?: string | null
  description?: string | null
  priceInCents?: number | null
  imageUrl?: string | null
}

interface ServicesSectionProps {
  services: Service[]
  storeName: string
  storeSlug: string
  category: string
  city: string
}

export function ServicesSection({ services, storeName, storeSlug, category, city }: ServicesSectionProps) {
  return (
    <section id="servicos" className="relative py-20 md:py-28 overflow-hidden bg-primary dark:bg-slate-950/50">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-white/90">
              Nossos Serviços
            </span>
            <h2 className="mt-3 text-3xl tracking-tight text-white dark:text-slate-900 md:text-4xl lg:text-5xl">
              Serviços de {storeName} <span className="text-white  font-extrabold"> em {city}</span>
            </h2>
            <p className="mt-4 text-lg text-white/90 dark:text-slate-400">
              Conheça os serviços relacionados a {category} oferecidos por {storeName} em {city}.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid gap-8 md:grid-cols-2 stagger-children">
            {services.map((svc) => {
              const cardContent = (
                <div className="relative flex h-full flex-col p-8">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                    <IconSparkles className="h-8 w-8" />
                  </div>

                  {/* Service name */}
                  <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                    {svc.name}
                  </h3>

                  {/* Description */}
                  {svc.description && (
                    <p className="mb-4 flex-1 text-slate-500 leading-relaxed dark:text-slate-400">
                      {svc.description}
                    </p>
                  )}

                  {/* Price */}
                  {svc.priceInCents != null && svc.priceInCents > 0 && (
                    <p className="mb-5 text-2xl font-extrabold text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(svc.priceInCents / 100)}
                    </p>
                  )}

                  {/* Link */}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-3">
                    Saiba mais
                    <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              )

              const cardClasses = "group relative overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-primary/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/30 dark:hover:border-primary/30 animate-fade-in-up"

              if (svc.slug) {
                return (
                  <Link key={svc.id} href={getServicePageUrl(storeSlug, svc.slug)} className={`block ${cardClasses}`}>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={svc.id} className={cardClasses}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
