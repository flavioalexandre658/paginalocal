'use client'

import { useEffect, useRef, useState } from 'react'
import type { StoreStat } from '@/db/schema/stores.schema'

const CATEGORY_STATS: Record<string, StoreStat[]> = {
  'Barbearia': [
    { label: 'Cortes Realizados', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Profissionais', value: '10', prefix: '+' },
  ],
  'Salão de Beleza': [
    { label: 'Clientes Atendidas', value: '800', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Profissionais', value: '10', prefix: '+' },
  ],
  'Restaurante': [
    { label: 'Refeições Servidas', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Clientes Satisfeitos', value: '500', prefix: '+' },
  ],
  'Pizzaria': [
    { label: 'Pizzas Entregues', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Sabores no Cardápio', value: '30', prefix: '+' },
  ],
  'Lanchonete': [
    { label: 'Lanches Preparados', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Clientes Satisfeitos', value: '500', prefix: '+' },
  ],
  'Padaria': [
    { label: 'Pães Assados', value: '5000', prefix: '+' },
    { label: 'Anos de Tradição', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Produtos no Cardápio', value: '50', prefix: '+' },
  ],
  'Academia': [
    { label: 'Alunos Ativos', value: '300', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Alunos', value: '98', suffix: '%' },
    { label: 'Treinos Realizados', value: '1000', prefix: '+' },
  ],
  'Pet Shop': [
    { label: 'Pets Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Tutores', value: '98', suffix: '%' },
    { label: 'Banhos Realizados', value: '1000', prefix: '+' },
  ],
  'Clínica Veterinária': [
    { label: 'Pets Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Tutores', value: '98', suffix: '%' },
    { label: 'Consultas Realizadas', value: '1000', prefix: '+' },
  ],
  'Oficina Mecânica': [
    { label: 'Veículos Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Reparos Realizados', value: '1000', prefix: '+' },
  ],
  'Borracharia': [
    { label: 'Pneus Trocados', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Atendimentos de Socorro', value: '500', prefix: '+' },
  ],
  'Consultório Odontológico': [
    { label: 'Pacientes Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Pacientes', value: '98', suffix: '%' },
    { label: 'Procedimentos Realizados', value: '1000', prefix: '+' },
  ],
  'Clínica Médica': [
    { label: 'Pacientes Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Pacientes', value: '98', suffix: '%' },
    { label: 'Consultas Realizadas', value: '1000', prefix: '+' },
  ],
  'Farmácia': [
    { label: 'Clientes Atendidos', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Produtos Disponíveis', value: '500', prefix: '+' },
  ],
  'Imobiliária': [
    { label: 'Imóveis Negociados', value: '200', prefix: '+' },
    { label: 'Anos no Mercado', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Clientes Atendidos', value: '500', prefix: '+' },
  ],
  'Escritório de Advocacia': [
    { label: 'Casos Atendidos', value: '500', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Clientes Atendidos', value: '300', prefix: '+' },
  ],
  'Floricultura': [
    { label: 'Arranjos Entregues', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Variedades de Flores', value: '50', prefix: '+' },
  ],
  'Hotel': [
    { label: 'Hóspedes Recebidos', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Hóspedes', value: '98', suffix: '%' },
    { label: 'Quartos Disponíveis', value: '30', prefix: '+' },
  ],
  'Lava Jato': [
    { label: 'Veículos Lavados', value: '1000', prefix: '+' },
    { label: 'Anos de Experiência', value: '5', prefix: '+' },
    { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
    { label: 'Atendimentos por Mês', value: '200', prefix: '+' },
  ],
}

const DEFAULT_STATS: StoreStat[] = [
  { label: 'Clientes Atendidos', value: '500', prefix: '+' },
  { label: 'Anos de Experiência', value: '5', prefix: '+' },
  { label: 'Satisfação dos Clientes', value: '98', suffix: '%' },
  { label: 'Atendimentos Realizados', value: '1000', prefix: '+' },
]

function getDefaultStats(category?: string): StoreStat[] {
  if (category && CATEGORY_STATS[category]) {
    return CATEGORY_STATS[category]
  }
  return DEFAULT_STATS
}

interface StatItemProps {
  stat: StoreStat
  shouldAnimate: boolean
}

function StatItem({ stat, shouldAnimate }: StatItemProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 md:py-8">
      <div
        className={`text-3xl font-black text-white md:text-4xl lg:text-5xl ${
          shouldAnimate ? 'animate-fade-in-up' : 'opacity-0'
        }`}
      >
        {stat.prefix && <span>{stat.prefix}</span>}
        <span>{stat.value}</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <p
        className={`mt-2 text-sm font-medium text-white/80 md:text-base ${
          shouldAnimate ? 'animate-fade-in-up animation-delay-200' : 'opacity-0'
        }`}
      >
        {stat.label}
      </p>
    </div>
  )
}

interface StatsSectionProps {
  stats?: StoreStat[] | null
  category?: string
}

export function StatsSection({ stats, category }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const displayStats = stats && stats.length > 0
    ? stats
    : getDefaultStats(category)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
            {displayStats.map((stat, index) => (
              <StatItem
                key={`${stat.label}-${index}`}
                stat={stat}
                shouldAnimate={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
