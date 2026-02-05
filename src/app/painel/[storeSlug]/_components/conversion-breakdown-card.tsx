'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconChartDonut, IconBrandWhatsapp, IconPhone, IconEye } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface ConversionBreakdownCardProps {
  totalPageviews: number
  whatsappLeads: number
  phoneLeads: number
  conversionRate: number
  whatsappConversionRate: number
  phoneConversionRate: number
}

export function ConversionBreakdownCard({
  totalPageviews,
  whatsappLeads,
  phoneLeads,
  conversionRate,
  whatsappConversionRate,
  phoneConversionRate,
}: ConversionBreakdownCardProps) {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null)
  
  const totalLeads = whatsappLeads + phoneLeads
  const viewsWithoutAction = Math.max(0, totalPageviews - totalLeads)

  // Calcular porcentagens baseadas no total de pageviews
  const noActionPercentage = totalPageviews > 0 ? (viewsWithoutAction / totalPageviews) * 100 : 100
  const whatsappPercentage = totalPageviews > 0 ? (whatsappLeads / totalPageviews) * 100 : 0
  const phonePercentage = totalPageviews > 0 ? (phoneLeads / totalPageviews) * 100 : 0

  const segments = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      value: whatsappLeads,
      percentage: whatsappPercentage,
      strokeColor: '#10b981',
      hoverStrokeColor: '#059669',
    },
    {
      id: 'phone',
      label: 'Ligação',
      value: phoneLeads,
      percentage: phonePercentage,
      strokeColor: '#3b82f6',
      hoverStrokeColor: '#2563eb',
    },
    {
      id: 'no-action',
      label: 'Sem ação',
      value: viewsWithoutAction,
      percentage: noActionPercentage,
      strokeColor: '#cbd5e1',
      hoverStrokeColor: '#94a3b8',
    },
  ]

  const radius = 60
  const strokeWidth = 14
  const circumference = 2 * Math.PI * radius

  // Calcular os offsets para cada segmento (começando do topo)
  let cumulativeOffset = 0
  const donutSegments = segments.map((segment) => {
    const segmentLength = (segment.percentage / 100) * circumference
    const offset = cumulativeOffset
    cumulativeOffset += segment.percentage
    return {
      ...segment,
      segmentLength,
      offset,
    }
  })

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-500 shadow-lg shadow-purple-500/10">
          <IconChartDonut className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            Conversão
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Últimos 30 dias
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-6 lg:flex-row">
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Segments */}
            {donutSegments.map((segment, index) => {
              const isHovered = hoveredSegment === segment.id
              const rotation = (segment.offset / 100) * 360 - 90 // -90 to start from top
              
              return (
                <motion.circle
                  key={segment.id}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={isHovered ? segment.hoverStrokeColor : segment.strokeColor}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${segment.segmentLength} ${circumference}`}
                  strokeDashoffset={0}
                  style={{
                    transformOrigin: '80px 80px',
                    transform: `rotate(${rotation}deg)`,
                    cursor: 'pointer',
                  }}
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ 
                    strokeDasharray: `${segment.segmentLength} ${circumference}`,
                    strokeWidth: isHovered ? strokeWidth + 4 : strokeWidth,
                  }}
                  transition={{ 
                    strokeDasharray: { delay: index * 0.15, duration: 0.6, ease: 'easeOut' },
                    strokeWidth: { duration: 0.2 },
                  }}
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => setHoveredSegment(hoveredSegment === segment.id ? null : segment.id)}
                />
              )
            })}
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredSegment ? (
              <>
                <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {donutSegments.find(s => s.id === hoveredSegment)?.value.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {donutSegments.find(s => s.id === hoveredSegment)?.label}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {donutSegments.find(s => s.id === hoveredSegment)?.percentage.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {conversionRate.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  taxa total
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <BreakdownItem
            id="views"
            icon={<IconEye className="h-4 w-4" />}
            label="Visualizações"
            value={totalPageviews}
            percentage={100}
            bgColor="bg-slate-200 dark:bg-slate-700"
            barColor="bg-slate-400 dark:bg-slate-500"
            textColor="text-slate-600 dark:text-slate-300"
            isHovered={false}
            onHover={() => {}}
          />
          <BreakdownItem
            id="whatsapp"
            icon={<IconBrandWhatsapp className="h-4 w-4" />}
            label="WhatsApp"
            value={whatsappLeads}
            percentage={whatsappConversionRate}
            bgColor="bg-emerald-100 dark:bg-emerald-900/30"
            barColor="bg-emerald-500"
            textColor="text-emerald-600 dark:text-emerald-400"
            isHovered={hoveredSegment === 'whatsapp'}
            onHover={(id) => setHoveredSegment(id)}
          />
          <BreakdownItem
            id="phone"
            icon={<IconPhone className="h-4 w-4" />}
            label="Ligação"
            value={phoneLeads}
            percentage={phoneConversionRate}
            bgColor="bg-blue-100 dark:bg-blue-900/30"
            barColor="bg-blue-500"
            textColor="text-blue-600 dark:text-blue-400"
            isHovered={hoveredSegment === 'phone'}
            onHover={(id) => setHoveredSegment(id)}
          />
        </div>
      </div>
    </div>
  )
}

interface BreakdownItemProps {
  id: string
  icon: React.ReactNode
  label: string
  value: number
  percentage: number
  bgColor: string
  barColor: string
  textColor: string
  isHovered: boolean
  onHover: (id: string | null) => void
}

function BreakdownItem({ 
  id, 
  icon, 
  label, 
  value, 
  percentage, 
  bgColor, 
  barColor, 
  textColor,
  isHovered,
  onHover,
}: BreakdownItemProps) {
  return (
    <div 
      className={cn(
        'flex items-center gap-3 rounded-xl p-2 -mx-2 transition-all cursor-pointer',
        isHovered && 'bg-slate-100/80 dark:bg-slate-800/50 scale-[1.02]'
      )}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onHover(isHovered ? null : id)}
    >
      <div className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-transform',
        barColor,
        id === 'views' ? 'text-slate-600 dark:text-slate-300' : 'text-white',
        isHovered && 'scale-110'
      )}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {label}
          </span>
          <span className={cn('text-sm font-semibold tabular-nums', textColor)}>
            {value.toLocaleString('pt-BR')}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className={cn('h-full rounded-full', barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className={cn(
        'w-14 text-right text-xs font-medium tabular-nums',
        isHovered ? textColor : 'text-slate-500 dark:text-slate-400'
      )}>
        {percentage.toFixed(1)}%
      </span>
    </div>
  )
}
