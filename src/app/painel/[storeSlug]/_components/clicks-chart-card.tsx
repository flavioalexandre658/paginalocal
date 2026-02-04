'use client'

import { motion } from 'framer-motion'
import { IconClick, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface ClicksChartCardProps {
  totalThisMonth: number
  totalLastWeek: number
  leadsPerDay: Array<{ date: string; count: number }>
}

export function ClicksChartCard({ totalThisMonth, totalLastWeek, leadsPerDay }: ClicksChartCardProps) {
  const last7Days = getLast7Days()
  const chartData = last7Days.map((date) => {
    const found = leadsPerDay.find((d) => d.date === date)
    return { date, count: found?.count || 0 }
  })

  const maxCount = Math.max(...chartData.map((d) => d.count), 1)
  const trend = totalLastWeek > 0 ? ((totalThisMonth - totalLastWeek) / totalLastWeek) * 100 : 0
  const trendUp = trend >= 0

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
            <IconClick className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Contatos este mês
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Últimos 30 dias
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {totalThisMonth}
          </p>
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          )}>
            {trendUp ? (
              <IconTrendingUp className="h-3 w-3" />
            ) : (
              <IconTrendingDown className="h-3 w-3" />
            )}
            {trend > 0 ? '+' : ''}{trend.toFixed(0)}% vs semana anterior
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex h-20 items-end justify-between gap-1">
          {chartData.map((data, index) => (
            <motion.div
              key={data.date}
              className="relative flex-1"
              initial={{ height: 0 }}
              animate={{ height: `${(data.count / maxCount) * 100}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div
                className={cn(
                  'absolute inset-x-0 bottom-0 rounded-t-sm transition-colors',
                  data.count > 0
                    ? 'bg-primary hover:bg-primary/80'
                    : 'bg-slate-200 dark:bg-slate-700'
                )}
                style={{ height: `${Math.max((data.count / maxCount) * 100, 4)}%` }}
              />
              {data.count > 0 && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {data.count}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-2 flex justify-between">
          {chartData.map((data) => (
            <span key={data.date} className="flex-1 text-center text-[10px] text-slate-400">
              {formatDayLabel(data.date)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}

function formatDayLabel(dateString: string): string {
  const date = new Date(dateString + 'T00:00:00')
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  return days[date.getDay()]
}
