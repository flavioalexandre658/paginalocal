'use client'

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
  const totalLeads = whatsappLeads + phoneLeads
  const viewsWithoutAction = totalPageviews - totalLeads

  const segments = [
    {
      label: 'Sem ação',
      value: viewsWithoutAction,
      percentage: totalPageviews > 0 ? (viewsWithoutAction / totalPageviews) * 100 : 100,
      color: 'text-slate-400',
      bgColor: 'bg-slate-200 dark:bg-slate-700',
      strokeColor: '#94a3b8',
    },
    {
      label: 'WhatsApp',
      value: whatsappLeads,
      percentage: whatsappConversionRate,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
      strokeColor: '#10b981',
    },
    {
      label: 'Ligação',
      value: phoneLeads,
      percentage: phoneConversionRate,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      strokeColor: '#3b82f6',
    },
  ]

  const radius = 60
  const strokeWidth = 12
  const circumference = 2 * Math.PI * radius

  let cumulativePercentage = 0
  const donutSegments = segments.map((segment) => {
    const dashArray = (segment.percentage / 100) * circumference
    const dashOffset = circumference - (cumulativePercentage / 100) * circumference
    cumulativePercentage += segment.percentage
    return {
      ...segment,
      dashArray,
      dashOffset,
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
          <svg width="160" height="160" className="-rotate-90">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
            />
            {donutSegments.map((segment, index) => (
              <motion.circle
                key={segment.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={segment.strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={`${segment.dashArray} ${circumference}`}
                strokeDashoffset={segment.dashOffset}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${segment.dashArray} ${circumference}` }}
                transition={{ delay: index * 0.2, duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold text-slate-900 dark:text-white">
              {conversionRate.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              taxa total
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <BreakdownItem
            icon={<IconEye className="h-4 w-4" />}
            label="Visualizações"
            value={totalPageviews}
            percentage={100}
            bgColor="bg-slate-200 dark:bg-slate-700"
            textColor="text-slate-600 dark:text-slate-300"
          />
          <BreakdownItem
            icon={<IconBrandWhatsapp className="h-4 w-4" />}
            label="WhatsApp"
            value={whatsappLeads}
            percentage={whatsappConversionRate}
            bgColor="bg-emerald-500"
            textColor="text-emerald-600 dark:text-emerald-400"
          />
          <BreakdownItem
            icon={<IconPhone className="h-4 w-4" />}
            label="Ligação"
            value={phoneLeads}
            percentage={phoneConversionRate}
            bgColor="bg-blue-500"
            textColor="text-blue-600 dark:text-blue-400"
          />
        </div>
      </div>
    </div>
  )
}

interface BreakdownItemProps {
  icon: React.ReactNode
  label: string
  value: number
  percentage: number
  bgColor: string
  textColor: string
}

function BreakdownItem({ icon, label, value, percentage, bgColor, textColor }: BreakdownItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', bgColor, textColor === 'text-slate-600 dark:text-slate-300' ? 'text-slate-600 dark:text-slate-300' : 'text-white')}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </span>
          <span className={cn('text-sm font-semibold', textColor)}>
            {value.toLocaleString('pt-BR')}
          </span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <motion.div
            className={cn('h-full rounded-full', bgColor)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <span className="w-12 text-right text-xs text-slate-500 dark:text-slate-400">
        {percentage.toFixed(1)}%
      </span>
    </div>
  )
}
