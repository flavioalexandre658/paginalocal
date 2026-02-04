'use client'

import { motion } from 'framer-motion'
import { IconTrophy, IconChevronRight } from '@tabler/icons-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HealthScoreItem {
  id: string
  label: string
  description: string
  score: number
  maxScore: number
  actionUrl: string
  actionLabel: string
  completed: boolean
}

interface HealthScoreCardProps {
  score: number
  items: HealthScoreItem[]
  storeSlug: string
}

export function HealthScoreCard({ score, items, storeSlug }: HealthScoreCardProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = () => {
    if (score >= 80) return { stroke: '#22c55e', bg: 'from-emerald-500/20 to-emerald-500/5', text: 'text-emerald-500' }
    if (score >= 60) return { stroke: '#eab308', bg: 'from-amber-500/20 to-amber-500/5', text: 'text-amber-500' }
    return { stroke: '#ef4444', bg: 'from-red-500/20 to-red-500/5', text: 'text-red-500' }
  }

  const colors = getScoreColor()

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="flex items-start gap-6">
        <div className="relative flex-shrink-0">
          <svg className="h-28 w-28 -rotate-90 transform">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            <motion.circle
              cx="56"
              cy="56"
              r="45"
              stroke={colors.stroke}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className={cn('text-2xl font-bold', colors.text)}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              {score}
            </motion.span>
            <span className="text-xs text-slate-500 dark:text-slate-400">de 100</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Nota do Site
            </h3>
            {score === 100 && (
              <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <IconTrophy className="h-3 w-3" />
                Excelente!
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {score >= 80
              ? 'Seu site está bem otimizado!'
              : score >= 60
                ? 'Bom progresso, continue melhorando'
                : 'Complete as dicas para melhorar'}
          </p>

          <div className="mt-4 space-y-2">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      item.completed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    )}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {item.score}/{item.maxScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Link
        href={`/painel/${storeSlug}/editar`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-slate-50/50 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-100 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Ver todas as métricas
        <IconChevronRight className="h-4 w-4" />
      </Link>
    </div>
  )
}
