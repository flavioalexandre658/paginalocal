'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
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

function parseNumericValue(value: string): number {
  return parseInt(value.replace(/\D/g, ''), 10) || 0
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return num.toLocaleString('pt-BR')
  }
  return num.toString()
}

interface CounterState {
  targets: number[]
  current: number[]
}

interface StatsSectionProps {
  stats?: StoreStat[] | null
  category?: string
}

export function StatsSection({ stats, category }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState<number[]>([0, 0, 0, 0])

  const displayStats = useMemo(
    () => (stats && stats.length > 0 ? stats : getDefaultStats(category)),
    [stats, category]
  )

  const targets = useMemo(
    () => displayStats.map(s => parseNumericValue(s.value)),
    [displayStats]
  )

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
      { threshold: 0.2, rootMargin: '50px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 1500
    let startTime: number | null = null
    let frame: number

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      setCounters(targets.map(target => Math.floor(eased * target)))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [isVisible, targets])

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-primary">
      <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
            {displayStats.map((stat, index) => (
              <div key={`${stat.label}-${index}`} className="flex flex-col items-center justify-center py-6 md:py-8">
                <div className="text-3xl font-black text-white md:text-4xl lg:text-5xl">
                  {stat.prefix && <span>{stat.prefix}</span>}
                  <span>{formatNumber(counters[index])}</span>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </div>
                <p className="mt-2 text-sm font-medium text-white/80 md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
