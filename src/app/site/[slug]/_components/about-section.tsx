import { IconMapPin, IconClock, IconCheck, IconCircleCheck, IconCircleX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

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

const DAY_ORDER = [
  'monday', 'seg',
  'tuesday', 'ter',
  'wednesday', 'qua',
  'thursday', 'qui',
  'friday', 'sex',
  'saturday', 'sab',
  'sunday', 'dom',
]

function sortDays(entries: [string, string][]) {
  return [...entries].sort((a, b) => {
    const ia = DAY_ORDER.indexOf(a[0].toLowerCase())
    const ib = DAY_ORDER.indexOf(b[0].toLowerCase())
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
  })
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
    <section id="sobre" className="relative py-20 md:py-28 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-12 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Sobre
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              {category} em <span className="text-primary">{city}</span> — {name}
            </h2>
          </div>

          <div className="space-y-8">
            {/* Main description card */}
            <div className="animate-fade-in-up animation-delay-200 rounded-2xl border-2 border-slate-100 border-l-4 border-l-primary bg-white p-8 md:p-10 shadow-lg dark:border-slate-800 dark:border-l-primary dark:bg-slate-900 dark:shadow-slate-900/30">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
                {description || `A ${name} é ${category.toLowerCase()} em ${city}, ${state}. Oferecemos${servicesCount ? ` ${servicesCount} serviços` : ' atendimento'} para clientes de ${city} e região. Entre em contato pelo WhatsApp para saber mais.`}
              </p>

              {serviceNames && serviceNames.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Serviços oferecidos
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {serviceNames.map((svcName) => (
                      <span
                        key={svcName}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15 dark:bg-primary/15 dark:hover:bg-primary/20"
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                        {svcName}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Opening Hours — bento-style day cards */}
            {hasHours && (
              <div className="animate-fade-in-up animation-delay-300">
                {/* Section sub-header */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconClock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Horário de Funcionamento
                  </h3>
                </div>

                {/* Day cards grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {sortDays(Object.entries(openingHours!)).map(([day, hours]) => {
                    const isClosed = hours === 'Fechado'
                    return (
                      <div
                        key={day}
                        className={cn(
                          'relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-200',
                          isClosed
                            ? 'border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50'
                            : 'border-primary/20 bg-primary/5 dark:border-primary/20 dark:bg-primary/5'
                        )}
                      >
                        {/* Day name */}
                        <p className={cn(
                          'text-xs font-bold uppercase tracking-widest',
                          isClosed ? 'text-slate-400 dark:text-slate-500' : 'text-primary'
                        )}>
                          {DAY_LABELS[day.toLowerCase()] || day}
                        </p>

                        {/* Hours */}
                        {isClosed ? (
                          <div className="mt-2 flex items-center gap-1.5">
                            <IconCircleX className="h-4 w-4 text-red-400" />
                            <span className="text-sm font-semibold text-red-400">Fechado</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-1.5">
                            <IconCircleCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{hours}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Neighborhoods — styled as full-width featured block */}
            {neighborhoods && neighborhoods.length > 0 && (
              <div className="animate-fade-in-up animation-delay-400 overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-900/30">
                {/* Colored header with stat */}
                <div className="bg-primary px-8 py-8 md:px-10">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
                      <IconMapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-4xl font-black text-white md:text-5xl">
                        {neighborhoods.length}+
                      </div>
                      <p className="text-sm font-medium text-white/80">
                        Regiões atendidas em {city}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content area */}
                <div className="px-8 py-8 md:px-10">
                  <p className="mb-6 text-slate-500 leading-relaxed dark:text-slate-400">
                    Atendemos diversas regiões de {city} e proximidades com a mesma qualidade e dedicação. Confira abaixo as áreas de cobertura.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {neighborhoods.map((n) => (
                      <span
                        key={n}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-slate-100 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-primary/30 dark:hover:bg-primary/10"
                      >
                        <IconMapPin className="h-3.5 w-3.5 text-primary" />
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
