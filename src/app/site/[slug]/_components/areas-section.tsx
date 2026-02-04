import { IconMapPin, IconMapPins } from '@tabler/icons-react'

interface AreasSectionProps {
  neighborhoods: string[]
  city: string
  state: string
  category: string
}

export function AreasSection({ neighborhoods, city, state, category }: AreasSectionProps) {
  if (!neighborhoods || neighborhoods.length === 0) return null

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-800/30 dark:via-slate-900/50 dark:to-slate-950" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <IconMapPins className="h-4 w-4" />
            Cobertura de Atendimento
          </div>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            Áreas Atendidas
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400">
            Atendemos {city} e região com qualidade e agilidade
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <IconMapPin className="h-8 w-8" />
              </div>
              <div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                  {category} em {city}, {state}
                </h3>
                <p className="text-slate-600 leading-relaxed dark:text-slate-300">
                  Oferecemos nossos serviços para toda a região de {city} e bairros próximos.
                  Nossa equipe está preparada para atender você com rapidez e qualidade,
                  independentemente da sua localização na cidade.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {neighborhoods.map((neighborhood, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
              >
                <IconMapPin className="h-4 w-4 text-blue-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {neighborhood}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Não encontrou seu bairro?{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">Entre em contato</span> que verificamos a disponibilidade de atendimento na sua região.
          </p>
        </div>
      </div>
    </section>
  )
}
