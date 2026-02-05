'use client'

import Link from 'next/link'
import {
  IconEye,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconLink,
  IconMapPin,
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

interface Pageview {
  id: string
  device: string | null
  referrer: string | null
  location: string | null
  createdAt: Date
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

interface RecentPageviewsCardProps {
  pageviews: Pageview[]
  storeSlug: string
}

const referrerInfo: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
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

export function RecentPageviewsCard({ pageviews, storeSlug }: RecentPageviewsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-500 shadow-lg shadow-cyan-500/10">
            <IconEye className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Últimas visualizações
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Visitantes recentes no seu site
            </p>
          </div>
        </div>
        <Link
          href={`/painel/${storeSlug}/visualizacoes`}
          className="flex items-center gap-1 text-sm font-medium text-cyan-600 hover:text-cyan-500 transition-colors dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          Ver todos
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {pageviews.length > 0 ? (
        <div className="custom-scrollbar max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {pageviews.map((pv) => (
            <PageviewItem key={pv.id} pageview={pv} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <IconEye className="h-8 w-8" />
          </div>
          <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
            Nenhuma visualização ainda
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            As visualizações aparecerão aqui quando chegarem
          </p>
        </div>
      )}
    </div>
  )
}

function PageviewItem({ pageview }: { pageview: Pageview }) {
  const DeviceIcon = pageview.device === 'mobile' ? IconDeviceMobile : IconDeviceDesktop
  const deviceLabel = pageview.device === 'mobile' ? 'Celular' : 'Desktop'

  const ref = referrerInfo[pageview.referrer || 'direct'] || referrerInfo.other
  const ReferrerIcon = ref.icon

  const hasUtm = pageview.utmSource || pageview.utmMedium || pageview.utmCampaign
  const utmLabel = hasUtm
    ? [pageview.utmSource, pageview.utmMedium, pageview.utmCampaign].filter(Boolean).join(' / ')
    : null

  const formattedTime = dayjs(pageview.createdAt).format('HH:mm')
  const date = dayjs(pageview.createdAt)
  let formattedDay: string

  if (date.isToday()) {
    formattedDay = 'Hoje'
  } else if (date.isYesterday()) {
    formattedDay = 'Ontem'
  } else {
    formattedDay = date.format('DD/MM')
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
        <IconEye className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
            ref.color
          )}>
            <ReferrerIcon className="h-3 w-3" />
            {ref.label}
          </span>

          {pageview.device && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              <DeviceIcon className="h-3 w-3" />
              {deviceLabel}
            </span>
          )}

          {pageview.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              <IconMapPin className="h-3 w-3" />
              {pageview.location}
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

      <span className="shrink-0 text-xs text-slate-400">
        {formattedDay}, {formattedTime}
      </span>
    </div>
  )
}
