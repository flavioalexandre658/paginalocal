import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { getServicePageUrl } from '@/lib/utils'
import { getServiceIcon } from '@/lib/service-icons'

interface Service {
  id: string
  name: string
  slug?: string | null
  description?: string | null
  priceInCents?: number | null
  imageUrl?: string | null
  iconName?: string | null
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
    <section id="servicos" className="relative py-20 md:py-28 overflow-hidden bg-[#f3f5f7] dark:bg-slate-950/50">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Serviços Profissionais
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              Serviços de {category} em <span className="text-primary">{city}</span> — {storeName}
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Confira os serviços de {category.toLowerCase()} oferecidos pela {storeName} em {city}. Atendimento profissional e de qualidade para você e sua família.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid gap-8 md:grid-cols-2 stagger-children">
            {services.map((svc) => {
              const ServiceIcon = getServiceIcon(svc.iconName)
              const cardContent = (
                <div className="relative flex h-full flex-col p-8">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                    <ServiceIcon className="h-8 w-8" />
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
                    Ver detalhes de {svc.name}
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
