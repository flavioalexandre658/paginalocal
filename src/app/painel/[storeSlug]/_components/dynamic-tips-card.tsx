'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  IconSparkles,
  IconPhoto,
  IconFileText,
  IconRocket,
  IconHelpCircle,
  IconListDetails,
  IconWorld,
  IconSearch,
  IconTrophy,
  IconShare,
  IconBrandGoogle,
  IconBrandWhatsapp,
  IconChevronRight,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type TipIcon = 'photo' | 'description' | 'publish' | 'faq' | 'services' | 'domain' | 'seo' | 'gmb'

interface DynamicTip {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionUrl: string
  actionLabel: string
  icon: TipIcon
}

interface DynamicTipsCardProps {
  tips: DynamicTip[]
  allCompleted: boolean
  storeSlug: string
}

const iconMap: Record<TipIcon, React.ReactNode> = {
  photo: <IconPhoto className="h-4 w-4" />,
  description: <IconFileText className="h-4 w-4" />,
  publish: <IconRocket className="h-4 w-4" />,
  faq: <IconHelpCircle className="h-4 w-4" />,
  services: <IconListDetails className="h-4 w-4" />,
  domain: <IconWorld className="h-4 w-4" />,
  seo: <IconSearch className="h-4 w-4" />,
  gmb: <IconBrandGoogle className="h-4 w-4" />,
}

const priorityColors: Record<string, string> = {
  high: 'border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20',
  medium: 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20',
  low: 'border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50',
}

const priorityIconColors: Record<string, string> = {
  high: 'bg-red-500/20 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  low: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

export function DynamicTipsCard({ tips, allCompleted, storeSlug }: DynamicTipsCardProps) {
  if (allCompleted) {
    return <CompletedState storeSlug={storeSlug} />
  }

  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/10">
          <IconSparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Dicas para melhorar
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {tips.length} otimização{tips.length !== 1 && 'ões'} pendente{tips.length !== 1 && 's'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tips.map((tip, index) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={tip.actionUrl}
              className={cn(
                'group flex items-start gap-3 rounded-xl border p-4 transition-all hover:shadow-md',
                priorityColors[tip.priority]
              )}
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                priorityIconColors[tip.priority]
              )}>
                {iconMap[tip.icon]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {tip.title}
                </p>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {tip.description}
                </p>
              </div>
              <IconChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function CompletedState({ storeSlug }: { storeSlug: string }) {
  const marketingTips = [
    {
      icon: <IconShare className="h-4 w-4" />,
      title: 'Compartilhe nas redes sociais',
      description: 'Divulgue seu link no Instagram e Facebook',
    },
    {
      icon: <IconBrandGoogle className="h-4 w-4" />,
      title: 'Peça avaliações',
      description: 'Clientes satisfeitos podem avaliar no Google Maps',
    },
    {
      icon: <IconBrandWhatsapp className="h-4 w-4" />,
      title: 'Use no WhatsApp Business',
      description: 'Adicione seu link na mensagem de ausência',
    },
  ]

  return (
    <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 shadow-xl shadow-emerald-200/30 dark:border-emerald-900/40 dark:from-emerald-950/30 dark:to-emerald-900/20 dark:shadow-emerald-900/20">
      <div className="mb-6 flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600 shadow-lg shadow-emerald-500/20 dark:text-emerald-400"
        >
          <IconTrophy className="h-7 w-7" />
        </motion.div>
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-emerald-900 dark:text-emerald-100"
          >
            Parabéns! Site 100% otimizado
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-emerald-700 dark:text-emerald-300"
          >
            Seu site está pronto para converter visitantes em clientes
          </motion.p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
          Próximos passos para crescer:
        </p>
        {marketingTips.map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-white/50 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/30"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              {tip.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                {tip.title}
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                {tip.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
