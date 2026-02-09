import { IconInfoCircle, IconMapPin, IconClock, IconCheck } from '@tabler/icons-react'

const DAY_LABELS: Record<string, string> = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo',
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
  dom: 'Domingo',
}

interface AboutSectionProps {
  name: string
  category: string
  city: string
  state: string
  description?: string | null
  neighborhoods?: string[]
  openingHours?: Record<string, string> | null
  servicesCount?: number
  serviceNames?: string[]
}

export function AboutSection({
  name,
  category,
  city,
  state,
  description,
  neighborhoods,
  openingHours,
  servicesCount,
  serviceNames,
}: AboutSectionProps) {
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
              {category} em {city} – {name}
            </h2>
          </div>
          
          <div className="animate-fade-in-up animation-delay-200 space-y-6">
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 md:p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/40 dark:shadow-slate-900/30">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {description || `A ${name} é ${category.toLowerCase()} em ${city}, ${state}. Oferecemos${servicesCount ? ` ${servicesCount} serviços` : ' atendimento'} para clientes de ${city} e região. Entre em contato pelo WhatsApp para saber mais.`}
              </p>

              {serviceNames && serviceNames.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Serviços oferecidos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {serviceNames.map((svcName) => (
                      <span
                        key={svcName}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/60 bg-slate-50/80 px-3 py-1.5 text-sm text-slate-600 dark:border-slate-700/40 dark:bg-slate-800/50 dark:text-slate-300"
                      >
                        <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {svcName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {(hasHours || (neighborhoods && neighborhoods.length > 0)) && (
              <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 md:p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/40 dark:shadow-slate-900/30">
                <div className="grid gap-6 sm:grid-cols-2">
                  {hasHours && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                        <IconClock className="h-5 w-5 text-primary" />
                        Horário de Funcionamento
                      </h3>
                      <dl className="space-y-1.5">
                        {Object.entries(openingHours!).map(([day, hours]) => (
                          <div key={day} className="flex items-center justify-between text-sm">
                            <dt className="font-medium text-slate-600 dark:text-slate-300">
                              {DAY_LABELS[day.toLowerCase()] || day}
                            </dt>
                            <dd className="text-slate-500 dark:text-slate-400">
                              {hours === 'Fechado' ? (
                                <span className="text-red-400">Fechado</span>
                              ) : (
                                hours
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {neighborhoods && neighborhoods.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                        <IconMapPin className="h-5 w-5 text-primary" />
                        Regiões Atendidas
                      </h3>
                      <ul className="space-y-1.5">
                        {neighborhoods.slice(0, 6).map((n) => (
                          <li key={n} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                            {n}
                          </li>
                        ))}
                        {neighborhoods.length > 6 && (
                          <li className="text-sm text-slate-400 dark:text-slate-500">
                            e mais {neighborhoods.length - 6} regiões
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
