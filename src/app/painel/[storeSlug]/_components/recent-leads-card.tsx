'use client'

import Link from 'next/link'
import {
  IconMessageCircle,
  IconPhone,
  IconTrendingUp,
  IconEyeOff,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandWhatsapp,
  IconLink,
  IconMapPin,
  IconEye,
  IconTag,
  IconArrowRight,
} from '@tabler/icons-react'
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
  sessionId?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  pageviewsBeforeConversion?: number | null
}

interface RecentLeadsCardProps {
  leads: Lead[]
  isDraft: boolean
  storeSlug: string
}

const touchpointLabels: Record<string, string> = {
  hero_whatsapp: 'botão principal',
  hero_call: 'botão de ligação',
  floating_whatsapp: 'botão flutuante',
  contact_call: 'seção de contato',
  floating_bar_whatsapp: 'barra fixa',
  floating_bar_call: 'barra fixa',
}

const referrerLabels: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  google: { label: 'Google', icon: IconBrandGoogle, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  instagram: { label: 'Instagram', icon: IconBrandInstagram, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  facebook: { label: 'Facebook', icon: IconBrandFacebook, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  tiktok: { label: 'TikTok', icon: IconBrandTiktok, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  youtube: { label: 'YouTube', icon: IconBrandYoutube, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  twitter: { label: 'Twitter/X', icon: IconBrandTwitter, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' },
  linkedin: { label: 'LinkedIn', icon: IconBrandLinkedin, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  whatsapp: { label: 'WhatsApp', icon: IconBrandWhatsapp, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  direct: { label: 'Direto', icon: IconLink, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  other: { label: 'Outro', icon: IconLink, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
}

export function RecentLeadsCard({ leads, isDraft, storeSlug }: RecentLeadsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
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
        <Link
          href={`/painel/${storeSlug}/contatos`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Ver todos
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {leads.length > 0 ? (
        <div className="custom-scrollbar max-h-[420px] space-y-3 overflow-y-auto pr-1">
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

  const hasUtm = lead.utmSource || lead.utmMedium || lead.utmCampaign
  const utmLabel = hasUtm
    ? [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')
    : null

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
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {lead.pageviewsBeforeConversion !== null && lead.pageviewsBeforeConversion !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                  <IconEye className="h-3 w-3" />
                  {lead.pageviewsBeforeConversion} {lead.pageviewsBeforeConversion === 1 ? 'visita' : 'visitas'} antes
                </span>
              )}
              {lead.referrer && (
                <span className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  referrerInfo.color
                )}>
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
              {utmLabel && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <IconTag className="h-3 w-3" />
                  {utmLabel}
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
