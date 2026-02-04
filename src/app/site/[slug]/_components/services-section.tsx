import { IconCheck, IconSparkles } from '@tabler/icons-react'

interface Service {
  id: string
  name: string
  description?: string | null
  priceInCents?: number | null
  imageUrl?: string | null
}

interface ServicesSectionProps {
  services: Service[]
  storeName: string
  category: string
  city: string
}

export function ServicesSection({ services, storeName, category, city }: ServicesSectionProps) {
  return (
    <section className="relative py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <IconSparkles className="h-4 w-4" />
            Nossos Serviços
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Serviços de {category} em {city}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Conheça os serviços oferecidos pela {storeName}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
            >
              <div className="relative flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md dark:from-emerald-900/30 dark:to-emerald-800/20 dark:text-emerald-400">
                  <IconCheck className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-slate-500 leading-relaxed dark:text-slate-400">
                      {service.description}
                    </p>
                  )}
                  {service.priceInCents && (
                    <p className="mt-4 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(service.priceInCents / 100)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
