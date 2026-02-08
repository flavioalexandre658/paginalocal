import Link from 'next/link'
import { IconCheck, IconSparkles, IconChevronRight } from '@tabler/icons-react'
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
    <section id="servicos" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.03] to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mb-12 text-center animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-600 mb-4">
            <IconSparkles className="h-4 w-4" />
            Nossos Serviços
          </span>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl lg:text-4xl">
            Serviços de {category} em {city}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Conheça os serviços oferecidos pela {storeName}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 stagger-children">
          {services.map((svc) => {
            const content = (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:from-emerald-500/5 group-hover:to-emerald-500/5" />
                
                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-sm ring-1 ring-emerald-200/50 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:ring-emerald-300/50 dark:from-emerald-900/40 dark:to-emerald-800/30 dark:text-emerald-400 dark:ring-emerald-700/50">
                    <IconCheck className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {svc.name}
                      {svc.slug && (
                        <IconChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                      )}
                    </h3>
                    {svc.description && (
                      <p className="text-slate-500 leading-relaxed dark:text-slate-400">
                        {svc.description}
                      </p>
                    )}
                    {svc.priceInCents && (
                      <p className="mt-4 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(svc.priceInCents / 100)}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )

            const cardClasses = "group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-200/50 dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/30 dark:hover:border-emerald-800/50 animate-fade-in-up"

            if (svc.slug) {
              return (
                <Link key={svc.id} href={getServicePageUrl(storeSlug, svc.slug)} className={`block ${cardClasses}`}>
                  {content}
                </Link>
              )
            }

            return (
              <div key={svc.id} className={cardClasses}>
                {content}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
