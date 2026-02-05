import { IconInfoCircle } from '@tabler/icons-react'

interface AboutSectionProps {
  name: string
  category: string
  city: string
  description?: string | null
}

export function AboutSection({ name, category, city, description }: AboutSectionProps) {
  const defaultDescription = `${name} é uma ${category.toLowerCase()} em ${city} especializada em oferecer serviços de qualidade com atendimento rápido, preços justos e compromisso com a satisfação do cliente em toda a região.`

  return (
    <section id="sobre" className="relative py-16 md:py-20 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header with Badge */}
          <div className="text-center mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              <IconInfoCircle className="h-4 w-4" />
              Sobre
            </span>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
              Conheça a {name}
            </h2>
          </div>
          
          {/* Description Card */}
          <div className="animate-fade-in-up animation-delay-200">
            <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 md:p-8 shadow-lg shadow-slate-200/20 backdrop-blur-sm dark:bg-slate-900/70 dark:border-slate-700/40 dark:shadow-slate-900/30">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 text-center">
                {description || defaultDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
