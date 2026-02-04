'use client'

import { IconMessageCircle, IconPhone, IconTrendingUp, IconEyeOff } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Lead {
  id: string
  name: string | null
  phone: string | null
  source: string | null
  createdAt: Date
  isFromBlockedSite: boolean
}

interface RecentLeadsCardProps {
  leads: Lead[]
  isDraft: boolean
}

export function RecentLeadsCard({ leads, isDraft }: RecentLeadsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary shadow-lg shadow-primary/10">
          <IconTrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Últimos contatos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Atividade recente no seu site
          </p>
        </div>
      </div>

      {leads.length > 0 ? (
        <div className="space-y-3">
          {leads.map((lead) => (
            <LeadItem key={lead.id} lead={lead} isDraft={isDraft} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <IconMessageCircle className="h-8 w-8" />
          </div>
          <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
            Nenhum contato ainda
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Os contatos aparecerão aqui quando chegarem
          </p>
        </div>
      )}
    </div>
  )
}

function LeadItem({ lead, isDraft }: { lead: Lead; isDraft: boolean }) {
  const isWhatsapp = lead.source?.includes('whatsapp')
  const isBlocked = lead.isFromBlockedSite

  return (
    <div className={cn(
      'flex items-center justify-between rounded-xl border p-3 transition-colors',
      isBlocked
        ? 'border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
        : 'border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-800/30'
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          isWhatsapp
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        )}>
          {isWhatsapp ? (
            <IconMessageCircle className="h-4 w-4" />
          ) : (
            <IconPhone className="h-4 w-4" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-slate-900 dark:text-white">
              {isDraft || isBlocked ? '••••••••' : lead.name || 'Anônimo'}
            </p>
            {isBlocked && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                <IconEyeOff className="h-3 w-3" />
                Bloqueado
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isDraft || isBlocked ? '(••) •••••-••••' : lead.phone} · {isWhatsapp ? 'WhatsApp' : 'Ligação'}
          </p>
        </div>
      </div>
      <span className="text-xs text-slate-400">
        {dayjs(lead.createdAt).fromNow()}
      </span>
    </div>
  )
}
