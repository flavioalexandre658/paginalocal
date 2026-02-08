import { IconInfoCircle, IconMapPin, IconClock, IconStar } from '@tabler/icons-react'

interface AboutSectionProps {
  name: string
  category: string
  city: string
  state: string
  description?: string | null
  neighborhoods?: string[]
  googleRating?: string | null
  googleReviewsCount?: number | null
  openingHours?: Record<string, string> | null
  servicesCount?: number
}

export function AboutSection({
  name,
  category,
  city,
  state,
  description,
  neighborhoods,
  googleRating,
  googleReviewsCount,
  openingHours,
  servicesCount,
}: AboutSectionProps) {
  const rating = googleRating ? parseFloat(googleRating) : 0
  const hasRating = rating > 0 && googleReviewsCount && googleReviewsCount > 0
  const hasHours = openingHours && Object.keys(openingHours).length > 0

  return (
    <section id="sobre" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              <IconInfoCircle className="h-4 w-4" />
              Sobre
            </span>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
              Conheça a {name}
            </h2>
          </div>
          
          <div className="animate-fade-in-up animation-delay-200 space-y-6">
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 md:p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/40 dark:shadow-slate-900/30">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {description || `A ${name} é referência em ${category.toLowerCase()} na região de ${city}, ${state}. Com foco em qualidade e atendimento personalizado, oferecemos${servicesCount ? ` ${servicesCount} serviços especializados` : ' serviços de qualidade'} para atender as necessidades dos nossos clientes.`}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/50">
                  <IconMapPin className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {city}, {state}
                    {neighborhoods && neighborhoods.length > 0 && ` e ${neighborhoods.length} bairros`}
                  </span>
                </div>

                {hasRating && (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/50">
                    <IconStar className="h-5 w-5 shrink-0 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {rating.toFixed(1)} estrelas ({googleReviewsCount} avaliações)
                    </span>
                  </div>
                )}

                {hasHours && (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 p-3 dark:bg-slate-800/50">
                    <IconClock className="h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Horários disponíveis
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 md:p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/40 dark:shadow-slate-900/30">
              <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Por que escolher a {name}?
              </h3>
              <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                Localizada em {city}, a {name} se destaca como {category.toLowerCase()} pela qualidade dos serviços prestados e pelo compromisso com a satisfação de cada cliente. Nossa equipe está preparada para oferecer o melhor atendimento{neighborhoods && neighborhoods.length > 0 ? `, atendendo toda a região de ${city} incluindo bairros como ${neighborhoods.slice(0, 3).join(', ')}` : ` em toda a região de ${city}`}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
