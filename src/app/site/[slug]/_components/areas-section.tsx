import { IconMapPin } from '@tabler/icons-react'
import { getStoreGrammar } from '@/lib/store-terms'
import type { TermGender, TermNumber } from '@/lib/store-terms'

interface AreasSectionProps {
  neighborhoods: string[]
  city: string
  state: string
  category: string
  storeName?: string
  termGender?: TermGender
  termNumber?: TermNumber
}

export function AreasSection({ neighborhoods, city, state, category, storeName, termGender, termNumber }: AreasSectionProps) {
  const g = getStoreGrammar(termGender, termNumber)
  if (!neighborhoods || neighborhoods.length === 0) return null

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-[#f3f5f7] dark:bg-slate-950/50">
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 animate-fade-in-up">
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              Áreas de Atendimento em {city}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-5xl">
              Bairros e Regiões Atendidas por {category} em <span className="text-primary">{city}</span>, {state}
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              {storeName ? `${g.Art} ${storeName} atende` : 'Atendemos'} diversos bairros de {city} com serviços de {category.toLowerCase()} de qualidade. Confira abaixo as regiões onde atuamos.
            </p>
          </div>

          {/* Bento grid: hero card + neighborhood cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 stagger-children">
            {/* Hero card spans 2 cols, 2 rows */}
            <div className="col-span-2 row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-8 shadow-lg animate-fade-in-up">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <IconMapPin className="h-6 w-6 text-white" />
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-extrabold text-white md:text-3xl">
                  {category} em {city}
                </h3>
                <p className="mt-3 text-sm text-white/90 leading-relaxed">
                  Somos {category.toLowerCase()} em {city}, {state}, atendendo toda a região com qualidade, profissionalismo e compromisso. Nossa equipe está preparada para atender você com agilidade.
                </p>
              </div>
            </div>

            {/* Neighborhood cards */}
            {neighborhoods.map((neighborhood, index) => (
              <div
                key={index}
                className="group flex flex-col items-start justify-center gap-2 rounded-2xl border-2 border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 animate-fade-in-up dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary/30"
                style={{ animationDelay: `${(index + 1) * 60}ms` }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-white">
                  <IconMapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {neighborhood}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-400 animate-fade-in-up dark:text-slate-500">
            Não encontrou seu bairro? {storeName ? `Entre em contato com a ${storeName}` : 'Entre em contato'} e verificaremos a disponibilidade de atendimento na sua região.
          </p>
        </div>
      </div>
    </section>
  )
}
