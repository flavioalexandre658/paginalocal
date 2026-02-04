'use client'

import { IconMessageCircle, IconPhone, IconTrendingUp, IconEyeOff, IconDeviceMobile, IconDeviceDesktop, IconBrandGoogle, IconBrandInstagram, IconBrandFacebook, IconLink, IconMapPin } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.locale('pt-br')

interface Lead {
  id: string
  name: string | null
  phone: string | null
  source: string | null
  device: string | null
  referrer: string | null
  location: string | null
  touchpoint: string | null
  createdAt: Date
  isFromBlockedSite: boolean
}

interface RecentLeadsCardProps {
  leads: Lead[]
  isDraft: boolean
}

const touchpointLabels: Record<string, string> = {
  hero_whatsapp: 'botão principal',
  hero_call: 'botão de ligação',
  floating_whatsapp: 'botão flutuante',
  contact_call: 'seção de contato',
  floating_bar_whatsapp: 'barra fixa',
  floating_bar_call: 'barra fixa',
}

const referrerLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  google: { label: 'Google', icon: IconBrandGoogle },
  instagram: { label: 'Instagram', icon: IconBrandInstagram },
  facebook: { label: 'Facebook', icon: IconBrandFacebook },
  direct: { label: 'acesso direto', icon: IconLink },
  other: { label: 'outro site', icon: IconLink },
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

  const DeviceIcon = lead.device === 'mobile' ? IconDeviceMobile : IconDeviceDesktop
  const deviceLabel = lead.device === 'mobile' ? 'celular' : 'computador'

  const referrerInfo = referrerLabels[lead.referrer || 'direct'] || referrerLabels.other
  const ReferrerIcon = referrerInfo.icon

  const touchpointLabel = lead.touchpoint ? touchpointLabels[lead.touchpoint] : null

  const formattedDate = dayjs(lead.createdAt).format('HH:mm')
  const date = dayjs(lead.createdAt)
  let formattedDay: string

  if (date.isToday()) {
    formattedDay = 'Hoje'
  } else if (date.isYesterday()) {
    formattedDay = 'Ontem'
  } else {
    formattedDay = date.format('DD/MM')
  }

  const buildDescription = () => {
    const parts: string[] = []

    if (lead.location) {
      parts.push(`Alguém de ${lead.location}`)
    } else {
      parts.push('Alguém')
    }

    if (isWhatsapp) {
      parts.push('clicou no WhatsApp')
    } else {
      parts.push('clicou para ligar')
    }

    if (touchpointLabel) {
      parts.push(`pelo ${touchpointLabel}`)
    }

    if (lead.device) {
      parts.push(`via ${deviceLabel}`)
    }

    return parts.join(' ')
  }

  return (
    <div className={cn(
      'rounded-xl border p-4 transition-colors',
      isBlocked
        ? 'border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
        : 'border-slate-200/60 bg-slate-50/50 dark:border-slate-700/60 dark:bg-slate-800/30'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            isWhatsapp
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          )}>
            {isWhatsapp ? (
              <IconMessageCircle className="h-5 w-5" />
            ) : (
              <IconPhone className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {isBlocked && (
                <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                  <IconEyeOff className="h-3 w-3" />
                  Bloqueado
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
              {isDraft || isBlocked ? (
                <span className="text-slate-400">••••••••••••••••</span>
              ) : (
                buildDescription()
              )}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {lead.referrer && lead.referrer !== 'direct' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <ReferrerIcon className="h-3 w-3" />
                  {referrerInfo.label}
                </span>
              )}
              {lead.device && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <DeviceIcon className="h-3 w-3" />
                  {deviceLabel}
                </span>
              )}
              {lead.location && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  <IconMapPin className="h-3 w-3" />
                  {lead.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-xs text-slate-400">
          {formattedDay}, {formattedDate}
        </span>
      </div>
    </div>
  )
}
