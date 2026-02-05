'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { IconChartBar, IconEye, IconClick } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface AnalyticsChartCardProps {
  pageviewsPerDay: Array<{ date: string; count: number }>
  leadsPerDay: Array<{ date: string; count: number }>
  totalPageviews: number
  totalLeads: number
}

type Period = '7d' | '30d'

export function AnalyticsChartCard({
  pageviewsPerDay,
  leadsPerDay,
  totalPageviews,
  totalLeads,
}: AnalyticsChartCardProps) {
  const [period, setPeriod] = useState<Period>('7d')

  const days = period === '7d' ? 7 : 30
  const dateRange = getDateRange(days)

  const chartData = dateRange.map((date) => {
    const pageviews = pageviewsPerDay.find((d) => d.date === date)?.count || 0
    const leads = leadsPerDay.find((d) => d.date === date)?.count || 0
    return { date, pageviews, leads }
  })

  const maxPageviews = Math.max(...chartData.map((d) => d.pageviews), 1)
  const maxLeads = Math.max(...chartData.map((d) => d.leads), 1)
  const maxValue = Math.max(maxPageviews, maxLeads, 1)

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
            <IconChartBar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Visualizações vs Contatos
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Últimos {period === '7d' ? '7 dias' : '30 dias'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPeriod('7d')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
              period === '7d'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            7 dias
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
              period === '30d'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            )}
          >
            30 dias
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary/60" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Visualizações ({totalPageviews})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Contatos ({totalLeads})
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex h-32 items-end gap-1">
          {chartData.map((data, index) => (
            <div key={data.date} className="group relative flex flex-1 flex-col items-center">
              <div className="absolute -top-12 left-1/2 z-10 hidden -translate-x-1/2 rounded-lg border border-slate-200/60 bg-white px-2 py-1 text-xs shadow-lg group-hover:block dark:border-slate-700 dark:bg-slate-800">
                <div className="flex items-center gap-1">
                  <IconEye className="h-3 w-3 text-primary" />
                  <span>{data.pageviews}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconClick className="h-3 w-3 text-emerald-500" />
                  <span>{data.leads}</span>
                </div>
              </div>

              <div className="flex w-full items-end justify-center gap-0.5">
                <motion.div
                  className="w-[45%] rounded-t bg-primary/60"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.pageviews / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  style={{ minHeight: data.pageviews > 0 ? '4px' : '0' }}
                />
                <motion.div
                  className="w-[45%] rounded-t bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.leads / maxValue) * 100}%` }}
                  transition={{ delay: index * 0.02 + 0.1, duration: 0.3 }}
                  style={{ minHeight: data.leads > 0 ? '4px' : '0' }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-between overflow-hidden">
          {chartData.map((data, index) => {
            const showLabel = period === '7d' || index % 5 === 0 || index === chartData.length - 1
            return (
              <span
                key={data.date}
                className={cn(
                  'flex-1 text-center text-[10px] text-slate-400',
                  !showLabel && 'opacity-0'
                )}
              >
                {formatDayLabel(data.date, period)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getDateRange(days: number): string[] {
  const dates: string[] = []
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

function formatDayLabel(dateString: string, period: Period): string {
  const date = new Date(dateString + 'T00:00:00')
  if (period === '7d') {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    return days[date.getDay()]
  }
  return `${date.getDate()}/${date.getMonth() + 1}`
}
