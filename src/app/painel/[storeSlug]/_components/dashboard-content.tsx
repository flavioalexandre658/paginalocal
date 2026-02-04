'use client'

import { useEffect } from 'react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import {
  IconEdit,
  IconExternalLink,
  IconAlertTriangle,
  IconRocket,
  IconLoader2,
  IconMessageCircle,
  IconPhone,
} from '@tabler/icons-react'

import { getStoreDashboardAction } from '@/actions/stores/get-store-dashboard.action'
import { SyncGoogleButton } from './sync-google-button'
import { ClicksChartCard } from './clicks-chart-card'
import { ReviewsWidget } from './reviews-widget'
import { DynamicTipsCard } from './dynamic-tips-card'
import { RecentLeadsCard } from './recent-leads-card'
import { getStoreUrl } from '@/lib/utils'

interface DashboardContentProps {
  storeSlug: string
}

export function DashboardContent({ storeSlug }: DashboardContentProps) {
  const { executeAsync, result, isExecuting } = useAction(getStoreDashboardAction)

  useEffect(() => {
    executeAsync({ storeSlug })
  }, [executeAsync, storeSlug])

  if (isExecuting || !result?.data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <IconLoader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-slate-500 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const data = result.data
  const siteUrl = getStoreUrl(storeSlug)
  const isDraft = !data.store.isActive

  return (
    <main className="container mx-auto px-4 py-8">
      {isDraft && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-amber-100/50 shadow-lg dark:border-amber-900/40 dark:from-amber-950/30 dark:to-amber-900/20">
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <IconAlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                  Site em Modo Rascunho
                </h3>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                  Seu site está visível, mas os botões de contato estão bloqueados para os visitantes.
                </p>
              </div>
            </div>
            <Link
              href={`/planos`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/40"
            >
              <IconRocket className="h-4 w-4" />
              Publicar Site
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Painel de Controle
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gerenciando: <span className="font-medium text-primary">{data.store.name}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {data.store.googlePlaceId && (
            <SyncGoogleButton storeId={data.store.id} />
          )}
          <Link
            href={`/painel/${storeSlug}/editar`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <IconEdit className="h-4 w-4" />
            <span className="hidden sm:inline">Editar site</span>
          </Link>
          <Link
            href={siteUrl}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <IconExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Ver site</span>
          </Link>
        </div>
      </div>

      <div className="my-6 grid gap-6 md:grid-cols-3">
        <StatsCard
          icon={<IconMessageCircle className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-green-500/20 to-green-500/5"
          iconColor="text-green-500"
          title="WhatsApp"
          value={data.stats.whatsappLeads.toString()}
        />
        <StatsCard
          icon={<IconPhone className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-blue-500/20 to-blue-500/5"
          iconColor="text-blue-500"
          title="Ligações"
          value={data.stats.phoneLeads.toString()}
        />
        <StatsCard
          icon={<IconExternalLink className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-purple-500/20 to-purple-500/5"
          iconColor="text-purple-500"
          title="Total de contatos"
          value={data.stats.totalLeadsThisMonth.toString()}
        />
      </div>


      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLeadsCard
            leads={data.recentLeads}
            isDraft={isDraft}
          />
        </div>
        <ClicksChartCard
          totalThisMonth={data.stats.totalLeadsThisMonth}
          totalLastWeek={data.stats.totalLeadsLastWeek}
          leadsPerDay={data.stats.leadsPerDay}
        />
      </div>



      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <DynamicTipsCard
          tips={data.dynamicTips}
          allCompleted={data.allTipsCompleted}
          storeSlug={storeSlug}
        />
        <ReviewsWidget
          reviews={data.recentTestimonials}
          googleRating={data.store.googleRating}
          googleReviewsCount={data.store.googleReviewsCount}
          googlePlaceId={data.store.googlePlaceId}
        />
      </div>

    </main>
  )
}

function StatsCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
}: {
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  title: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all hover:shadow-lg dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        </div>
      </div>
    </div>
  )
}
