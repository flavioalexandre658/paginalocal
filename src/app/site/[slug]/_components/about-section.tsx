interface AboutSectionProps {
  name: string
  category: string
  city: string
  description?: string | null
}

export function AboutSection({ name, category, city, description }: AboutSectionProps) {
  const defaultDescription = `${name} é uma ${category.toLowerCase()} em ${city} especializada em oferecer serviços de qualidade com atendimento rápido, preços justos e compromisso com a satisfação do cliente em toda a região.`

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            {description || defaultDescription}
          </p>
        </div>
      </div>
    </section>
  )
}
