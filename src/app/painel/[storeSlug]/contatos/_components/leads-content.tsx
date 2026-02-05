'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import {
  IconMessageCircle,
  IconPhone,
  IconUsers,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconBrandGoogle,
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandTiktok,
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconLink,
  IconMapPin,
  IconEye,
  IconTag,
  IconArrowLeft,
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
  DataTableActions,
  DataTableContent,
  DataTableEmptyState,
  ServerPagination,
  DataTableSkeleton,
  MobileCardList,
  MobileCard,
  MobileCardHeader,
  MobileCardTitle,
  MobileCardContent,
  MobileCardFooter,
  MobileCardEmptyState,
} from '@/components/ui/data-table-blocks'
import {
  FilterBar,
  FilterBarRow,
  FilterChip,
  FilterChipGroup,
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getLeadsPaginatedAction, getLeadsStatsAction } from '@/actions/leads/get-leads-paginated.action'

dayjs.locale('pt-br')

interface LeadsContentProps {
  storeId: string
  storeSlug: string
  isDraft: boolean
  initialPage: number
  initialPageSize: number
  initialSource?: 'whatsapp' | 'call' | 'all'
  initialDevice?: 'mobile' | 'desktop' | 'all'
  initialReferrer?: string
  initialStartDate?: string
  initialEndDate?: string
  initialSearch?: string
}

interface Lead {
  id: string
  source: string
  device: string | null
  referrer: string | null
  location: string | null
  touchpoint: string | null
  sessionId: string | null
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  pageviewsBeforeConversion: number | null
  isFromBlockedSite: boolean
  createdAt: Date
}

const referrerInfo: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  google: { label: 'Google', icon: IconBrandGoogle, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  instagram: { label: 'Instagram', icon: IconBrandInstagram, color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
  facebook: { label: 'Facebook', icon: IconBrandFacebook, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  tiktok: { label: 'TikTok', icon: IconBrandTiktok, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  youtube: { label: 'YouTube', icon: IconBrandYoutube, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  whatsapp: { label: 'WhatsApp', icon: IconBrandWhatsapp, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  direct: { label: 'Direto', icon: IconLink, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  other: { label: 'Outro', icon: IconLink, color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
}

export function LeadsContent({
  storeId,
  storeSlug,
  isDraft,
  initialPage,
  initialPageSize,
  initialSource,
  initialDevice,
  initialReferrer,
  initialStartDate,
  initialEndDate,
  initialSearch,
}: LeadsContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [leads, setLeads] = useState<Lead[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [source, setSource] = useState<'whatsapp' | 'call' | 'all' | undefined>(initialSource)
  const [device, setDevice] = useState<'mobile' | 'desktop' | 'all' | undefined>(initialDevice)
  const [referrer, setReferrer] = useState<string | undefined>(initialReferrer)
  const [startDate, setStartDate] = useState<string | undefined>(initialStartDate)
  const [endDate, setEndDate] = useState<string | undefined>(initialEndDate)
  const [search, setSearch] = useState(initialSearch || '')

  const [stats, setStats] = useState<{
    total: number
    whatsapp: number
    call: number
    mobile: number
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

  const fetchLeads = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getLeadsPaginatedAction({
        storeId,
        page,
        pageSize,
        source: source === 'all' ? undefined : source,
        device: device === 'all' ? undefined : device,
        referrer,
        startDate,
        endDate,
        search: search || undefined,
      })

      if (result?.data) {
        setLeads(result.data.data)
        setTotalCount(result.data.totalCount)
        setTotalPages(result.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }, [storeId, page, pageSize, source, device, referrer, startDate, endDate, search])

  const fetchStats = useCallback(async () => {
    try {
      const result = await getLeadsStatsAction({ storeId })
      if (result?.data) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }, [storeId])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

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

  const handleSourceChange = (newSource: 'whatsapp' | 'call' | 'all') => {
    setSource(newSource)
    setPage(1)
    updateUrl({ source: newSource === 'all' ? undefined : newSource, page: '1' })
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

  const handleSearchSubmit = () => {
    setPage(1)
    updateUrl({ search: search || undefined, page: '1' })
  }

  const clearFilters = () => {
    setSource(undefined)
    setDevice(undefined)
    setReferrer(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    setSearch('')
    setPage(1)
    router.push(`/painel/${storeSlug}/contatos`)
  }

  const hasActiveFilters = source || device || referrer || startDate || endDate || search

  const referrerOptions = [
    { value: 'google', label: 'Google' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'direct', label: 'Direto' },
    { value: 'other', label: 'Outro' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader backHref={`/painel/${storeSlug}`} backLabel="Voltar ao painel">
        <PageHeaderContent>
          <PageTitle icon={<IconUsers className="h-5 w-5" />}>
            Contatos
          </PageTitle>
          <PageDescription>
            Histórico completo de contatos recebidos pelo seu site
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>

      {stats ? (
        <StatsRow>
          <StatCard
            label="Total de contatos"
            value={stats.total.toLocaleString('pt-BR')}
            icon={<IconUsers className="h-4 w-4" />}
          />
          <StatCard
            label="WhatsApp"
            value={stats.whatsapp.toLocaleString('pt-BR')}
            icon={<IconMessageCircle className="h-4 w-4" />}
          />
          <StatCard
            label="Ligações"
            value={stats.call.toLocaleString('pt-BR')}
            icon={<IconPhone className="h-4 w-4" />}
          />
          <StatCard
            label="Mobile"
            value={stats.mobile.toLocaleString('pt-BR')}
            icon={<IconDeviceMobile className="h-4 w-4" />}
          />
          <StatCard
            label="Últimos 30 dias"
            value={stats.last30Days.toLocaleString('pt-BR')}
            icon={<IconCalendar className="h-4 w-4" />}
          />
        </StatsRow>
      ) : (
        <StatsRowSkeleton count={5} />
      )}

      <ContentSection>
        <FilterBar>
          <FilterBarRow>
            <DataTableSearch
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar por local, UTM..."
            />
            <FilterChipGroup>
              <FilterChip
                label="Todos"
                isActive={!source || source === 'all'}
                onClick={() => handleSourceChange('all')}
              />
              <FilterChip
                label="WhatsApp"
                isActive={source === 'whatsapp'}
                onClick={() => handleSourceChange('whatsapp')}
              />
              <FilterChip
                label="Ligação"
                isActive={source === 'call'}
                onClick={() => handleSourceChange('call')}
              />
            </FilterChipGroup>
          </FilterBarRow>
          <FilterBarRow>
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
          <DataTableSkeleton columns={6} rows={10} showToolbar={false} />
        ) : leads.length === 0 ? (
          <DataTableEmptyState
            icon={<IconUsers className="h-8 w-8" />}
            title="Nenhum contato encontrado"
            description={hasActiveFilters ? 'Tente ajustar os filtros' : 'Os contatos aparecerão aqui quando chegarem'}
          />
        ) : (
          <>
            <div className="hidden lg:block mt-4">
              <DataTableContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200/60 dark:border-slate-700/60">
                      <TableHead className="text-xs font-semibold text-slate-500">Data/Hora</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Tipo</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Origem</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Dispositivo</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Local</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">UTM</TableHead>
                      <TableHead className="text-xs font-semibold text-slate-500">Visitas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <LeadTableRow key={lead.id} lead={lead} isDraft={isDraft} />
                    ))}
                  </TableBody>
                </Table>
              </DataTableContent>
            </div>

            <MobileCardList className="mt-4">
              {leads.map((lead) => (
                <LeadMobileCard key={lead.id} lead={lead} isDraft={isDraft} />
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

function LeadTableRow({ lead, isDraft }: { lead: Lead; isDraft: boolean }) {
  const isWhatsapp = lead.source?.includes('whatsapp')
  const ref = referrerInfo[lead.referrer || 'direct'] || referrerInfo.other
  const ReferrerIcon = ref.icon
  const DeviceIcon = lead.device === 'mobile' ? IconDeviceMobile : IconDeviceDesktop

  const hasUtm = lead.utmSource || lead.utmMedium || lead.utmCampaign
  const utmLabel = hasUtm
    ? [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')
    : null

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-b border-slate-200/40 dark:border-slate-700/40">
      <TableCell className="py-4">
        <div className="text-sm font-medium text-slate-900 dark:text-white">
          {dayjs(lead.createdAt).format('DD/MM/YYYY')}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {dayjs(lead.createdAt).format('HH:mm')}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={cn(
          'gap-1',
          isWhatsapp
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400'
        )}>
          {isWhatsapp ? <IconMessageCircle className="h-3 w-3" /> : <IconPhone className="h-3 w-3" />}
          {isWhatsapp ? 'WhatsApp' : 'Ligação'}
        </Badge>
      </TableCell>
      <TableCell>
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', ref.color)}>
          <ReferrerIcon className="h-3 w-3" />
          {ref.label}
        </span>
      </TableCell>
      <TableCell>
        {lead.device && (
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            <DeviceIcon className="h-4 w-4" />
            {lead.device === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
        )}
      </TableCell>
      <TableCell>
        {isDraft ? (
          <span className="text-slate-400">••••••</span>
        ) : lead.location ? (
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            <IconMapPin className="h-4 w-4" />
            {lead.location}
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
      <TableCell>
        {lead.pageviewsBeforeConversion !== null && lead.pageviewsBeforeConversion !== undefined ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <IconEye className="h-3 w-3" />
            {lead.pageviewsBeforeConversion}
          </span>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </TableCell>
    </TableRow>
  )
}

function LeadMobileCard({ lead, isDraft }: { lead: Lead; isDraft: boolean }) {
  const isWhatsapp = lead.source?.includes('whatsapp')
  const ref = referrerInfo[lead.referrer || 'direct'] || referrerInfo.other
  const ReferrerIcon = ref.icon

  const hasUtm = lead.utmSource || lead.utmMedium || lead.utmCampaign
  const utmLabel = hasUtm
    ? [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(' / ')
    : null

  return (
    <MobileCard>
      <MobileCardHeader>
        <div className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          isWhatsapp
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
        )}>
          {isWhatsapp ? <IconMessageCircle className="h-5 w-5" /> : <IconPhone className="h-5 w-5" />}
        </div>
        <MobileCardTitle
          title={isWhatsapp ? 'WhatsApp' : 'Ligação'}
          subtitle={dayjs(lead.createdAt).format('DD/MM/YYYY [às] HH:mm')}
        />
      </MobileCardHeader>
      <MobileCardContent>
        <div className="flex flex-wrap gap-1.5">
          <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', ref.color)}>
            <ReferrerIcon className="h-3 w-3" />
            {ref.label}
          </span>
          {lead.device && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {lead.device === 'mobile' ? <IconDeviceMobile className="h-3 w-3" /> : <IconDeviceDesktop className="h-3 w-3" />}
              {lead.device === 'mobile' ? 'Mobile' : 'Desktop'}
            </span>
          )}
          {!isDraft && lead.location && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              <IconMapPin className="h-3 w-3" />
              {lead.location}
            </span>
          )}
          {lead.pageviewsBeforeConversion !== null && lead.pageviewsBeforeConversion !== undefined && (
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
              <IconEye className="h-3 w-3" />
              {lead.pageviewsBeforeConversion} visitas
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
