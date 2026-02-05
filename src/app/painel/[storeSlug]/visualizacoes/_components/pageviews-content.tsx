'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
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
  IconCalendar,
} from '@tabler/icons-react'
import {
  PageHeader,
  PageHeaderContent,
  PageTitle,
  PageDescription,
  ContentSection,
  StatsRow,
  StatCard,
  StatsRowSkeleton,
} from '@/components/ui/page-blocks'
import {
  DataTableRoot,
  DataTableToolbar,
  DataTableSearch,
  DataTableContent,
  DataTableEmptyState,
  ServerPagination,
  DataTableSkeleton,
  MobileCardList,
  MobileCard,
  MobileCardHeader,
  MobileCardTitle,
  MobileCardContent,
} from '@/components/ui/data-table-blocks'
import {
  FilterBar,
  FilterBarRow,
  FilterSelect,
  DateRangeFilter,
  FilterClearButton,
} from '@/components/ui/filter-blocks'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getPageviewsPaginatedAction, getPageviewsStatsAction } from '@/actions/pageviews/get-pageviews-paginated.action'

dayjs.locale('pt-br')

interface PageviewsContentProps {
  storeId: string
  storeSlug: string
  initialPage: number
  initialPageSize: number
  initialDevice?: 'mobile' | 'desktop' | 'all'
  initialReferrer?: string
  initialStartDate?: string
  initialEndDate?: string
  initialUtmSource?: string
  initialSearch?: string
}

interface Pageview {
  id: string
  device: string | null
  referrer: string | null
  location: string | null
  sessionId: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  createdAt: Date
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

export function PageviewsContent({
  storeId,
  storeSlug,
  initialPage,
  initialPageSize,
  initialDevice,
  initialReferrer,
  initialStartDate,
  initialEndDate,
  initialUtmSource,
  initialSearch,
}: PageviewsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [pageviews, setPageviews] = useState<Pageview[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [device, setDevice] = useState<'mobile' | 'desktop' | 'all' | undefined>(initialDevice)
  const [referrer, setReferrer] = useState<string | undefined>(initialReferrer)
  const [startDate, setStartDate] = useState<string | undefined>(initialStartDate)
  const [endDate, setEndDate] = useState<string | undefined>(initialEndDate)
  const [utmSource, setUtmSource] = useState<string | undefined>(initialUtmSource)
  const [search, setSearch] = useState(initialSearch || '')

  const [stats, setStats] = useState<{
    total: number
    mobile: number
    desktop: number
    last30Days: number
  } | null>(null)

  const updateUrl = useCallback((params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      } else {
        newParams.delete(key)
      }
    })

    startTransition(() => {
      router.push(`?${newParams.toString()}`, { scroll: false })
    })
  }, [router, searchParams])

  const fetchPageviews = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getPageviewsPaginatedAction({
        storeId,
        page,
        pageSize,
        device: device === 'all' ? undefined : device,
        referrer,
        startDate,
        endDate,
        utmSource,
        search: search || undefined,
      })

      if (result?.data) {
        setPageviews(result.data.data)
        setTotalCount(result.data.totalCount)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching pageviews:', error)
    } finally {
      setIsLoading(false)
    }
  }, [storeId, page, pageSize, device, referrer, startDate, endDate, utmSource, search])

  const fetchStats = useCallback(async () => {
    try {
      const result = await getPageviewsStatsAction({ storeId })
      if (result?.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [storeId])

  useEffect(() => {
    fetchPageviews()
  }, [fetchPageviews])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrl({ page: newPage.toString() })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    updateUrl({ pageSize: newPageSize.toString(), page: '1' })
  }

  const handleDeviceChange = (newDevice: 'mobile' | 'desktop' | 'all') => {
    setDevice(newDevice)
    setPage(1)
    updateUrl({ device: newDevice === 'all' ? undefined : newDevice, page: '1' })
  }

  const handleReferrerChange = (newReferrer: string | undefined) => {
    setReferrer(newReferrer)
    setPage(1)
    updateUrl({ referrer: newReferrer, page: '1' })
  }

  const handleDateChange = (newStartDate?: string, newEndDate?: string) => {
    setStartDate(newStartDate)
    setEndDate(newEndDate)
    setPage(1)
    updateUrl({ startDate: newStartDate, endDate: newEndDate, page: '1' })
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const clearFilters = () => {
    setDevice(undefined)
    setReferrer(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    setUtmSource(undefined)
    setSearch('')
    setPage(1)
    router.push(`/painel/${storeSlug}/visualizacoes`)
  }

  const hasActiveFilters = device || referrer || startDate || endDate || utmSource || search

  const referrerOptions = [
    { value: 'google', label: 'Google' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'direct', label: 'Direto' },
    { value: 'other', label: 'Outro' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader backHref={`/painel/${storeSlug}`} backLabel="Voltar ao painel">
        <PageHeaderContent>
          <PageTitle icon={<IconEye className="h-5 w-5" />}>
            Visualizações
          </PageTitle>
          <PageDescription>
            Histórico completo de visitas ao seu site
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      {stats ? (
        <StatsRow>
          <StatCard
            label="Total de visualizações"
            value={stats.total.toLocaleString('pt-BR')}
            icon={<IconEye className="h-4 w-4" />}
          />
          <StatCard
            label="Mobile"
            value={stats.mobile.toLocaleString('pt-BR')}
            icon={<IconDeviceMobile className="h-4 w-4" />}
          />
          <StatCard
            label="Desktop"
            value={stats.desktop.toLocaleString('pt-BR')}
            icon={<IconDeviceDesktop className="h-4 w-4" />}
          />
          <StatCard
            label="Últimos 30 dias"
            value={stats.last30Days.toLocaleString('pt-BR')}
            icon={<IconCalendar className="h-4 w-4" />}
          />
        </StatsRow>
      ) : (
        <StatsRowSkeleton count={4} />
      )}

      <ContentSection>
        <FilterBar>
          <FilterBarRow>
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar por local, UTM..."
            />
            <FilterSelect
              value={device}
              onChange={(v) => handleDeviceChange(v as 'mobile' | 'desktop' | 'all' || 'all')}
              options={[
                { value: 'mobile', label: 'Mobile' },
                { value: 'desktop', label: 'Desktop' },
              ]}
              placeholder="Dispositivo"
              allLabel="Todos dispositivos"
              className="w-[180px]"
            />
            <FilterSelect
              value={referrer}
              onChange={handleReferrerChange}
              options={referrerOptions}
              placeholder="Origem"
              allLabel="Todas origens"
              className="w-[180px]"
            />
          </FilterBarRow>
          <FilterBarRow>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              label="Período"
            />
            {hasActiveFilters && (
              <FilterClearButton onClick={clearFilters} />
            )}
          </FilterBarRow>
        </FilterBar>

        {isLoading ? (
          <DataTableSkeleton columns={5} rows={10} showToolbar={false} />
        ) : pageviews.length === 0 ? (
          <DataTableEmptyState
            icon={<IconEye className="h-8 w-8" />}
            title="Nenhuma visualização encontrada"
            description={hasActiveFilters ? 'Tente ajustar os filtros' : 'As visualizações aparecerão aqui quando chegarem'}
          />
        ) : (
          <>
            <div className="hidden lg:block mt-4">
              <DataTableContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-700/60">
                      <TableHead className="text-xs font-semibold text-slate-500">Data/Hora</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Origem</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Dispositivo</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Local</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">UTM</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageviews.map((pv) => (
                      <PageviewTableRow key={pv.id} pageview={pv} />
                    ))}
                  </TableBody>
                </Table>
              </DataTableContent>
            </div>

            <MobileCardList className="mt-4">
              {pageviews.map((pv) => (
                <PageviewMobileCard key={pv.id} pageview={pv} />
              ))}
            </MobileCardList>

            <div className="mt-4">
              <ServerPagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            </div>
          </>
        )}
      </ContentSection>
    </div>
  )
}

function PageviewTableRow({ pageview }: { pageview: Pageview }) {
  const ref = referrerInfo[pageview.referrer || 'direct'] || referrerInfo.other
  const ReferrerIcon = ref.icon
  const DeviceIcon = pageview.device === 'mobile' ? IconDeviceMobile : IconDeviceDesktop

  const hasUtm = pageview.utmSource || pageview.utmMedium || pageview.utmCampaign
  const utmLabel = hasUtm
    ? [pageview.utmSource, pageview.utmMedium, pageview.utmCampaign].filter(Boolean).join(' / ')
    : null

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-200/40 dark:border-slate-700/40">
      <TableCell className="py-4">
        <div className="text-sm font-medium text-slate-900 dark:text-white">
          {dayjs(pageview.createdAt).format('DD/MM/YYYY')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {dayjs(pageview.createdAt).format('HH:mm')}
        </div>
      </TableCell>
      <TableCell>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', ref.color)}>
          <ReferrerIcon className="h-3 w-3" />
          {ref.label}
        </span>
      </TableCell>
      <TableCell>
        {pageview.device && (
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            <DeviceIcon className="h-4 w-4" />
            {pageview.device === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
        )}
      </TableCell>
      <TableCell>
        {pageview.location ? (
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            <IconMapPin className="h-4 w-4" />
            {pageview.location}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </TableCell>
      <TableCell>
        {utmLabel ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <IconTag className="h-3 w-3" />
            {utmLabel.length > 30 ? utmLabel.slice(0, 30) + '...' : utmLabel}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </TableCell>
    </TableRow>
  )
}

function PageviewMobileCard({ pageview }: { pageview: Pageview }) {
  const ref = referrerInfo[pageview.referrer || 'direct'] || referrerInfo.other
  const ReferrerIcon = ref.icon

  const hasUtm = pageview.utmSource || pageview.utmMedium || pageview.utmCampaign
  const utmLabel = hasUtm
    ? [pageview.utmSource, pageview.utmMedium, pageview.utmCampaign].filter(Boolean).join(' / ')
    : null

  return (
    <MobileCard>
      <MobileCardHeader>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <IconEye className="h-5 w-5" />
        </div>
        <MobileCardTitle
          title="Visualização"
          subtitle={dayjs(pageview.createdAt).format('DD/MM/YYYY [às] HH:mm')}
        />
      </MobileCardHeader>
      <MobileCardContent>
        <div className="flex flex-wrap gap-1.5">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', ref.color)}>
            <ReferrerIcon className="h-3 w-3" />
            {ref.label}
          </span>
          {pageview.device && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {pageview.device === 'mobile' ? <IconDeviceMobile className="h-3 w-3" /> : <IconDeviceDesktop className="h-3 w-3" />}
              {pageview.device === 'mobile' ? 'Mobile' : 'Desktop'}
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
              {utmLabel.length > 20 ? utmLabel.slice(0, 20) + '...' : utmLabel}
            </span>
          )}
        </div>
      </MobileCardContent>
    </MobileCard>
  )
}
