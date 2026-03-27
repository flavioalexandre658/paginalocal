'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconLoader2,
  IconMapPin,
  IconSparkles,
  IconFileText,
  IconRocket,
  IconCheck,
  IconSearch,
  IconBuildingStore,
  IconCategory,
  IconCoin,
  IconChartBar,
  IconUsers,
  IconWorld,
  IconFlag,
  IconId,
  IconLetterCase,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { PatternFormat } from 'react-number-format'
import { createStoreManualAction } from '@/actions/stores/create-store-manual.action'
import { generateSiteAfterOnboarding } from '@/actions/ai/generate-site-after-onboarding'
import {
  searchLocationAction,
  getLocationDetailsAction,
  type LocationDetails,
} from '@/actions/utils/search-location.action'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

// ─── Types & Constants ───────────────────────────────────────────────────────

type ManualStep = 'business-type' | 'revenue' | 'location' | 'name-contact' | 'summary' | 'creating'

const STEPS: ManualStep[] = ['business-type', 'revenue', 'location', 'name-contact', 'summary', 'creating']

interface LocationPrediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

const REVENUE_OPTIONS = [
  'Estou começando',
  'Até R$ 5.000',
  'R$ 5.000 a R$ 15.000',
  'R$ 15.000 a R$ 50.000',
  'Acima de R$ 50.000',
  'Prefiro não informar',
]

const HUMANIZED_LOGS = [
  { icon: IconSparkles, text: 'Analisando seu negócio...' },
  { icon: IconMapPin, text: 'Buscando bairros próximos...' },
  { icon: IconSparkles, text: 'Gerando conteúdo com IA...' },
  { icon: IconFileText, text: 'Criando descrições para SEO...' },
  { icon: IconSparkles, text: 'Desenhando o layout...' },
  { icon: IconSparkles, text: 'Escolhendo cores e fontes...' },
  { icon: IconSparkles, text: 'Montando as seções...' },
  { icon: IconRocket, text: 'Finalizando seu site!' },
]

const fadeVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function ManualOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<ManualStep>('business-type')
  const [currentLogIndex, setCurrentLogIndex] = useState(0)

  // Form data
  const [businessType, setBusinessType] = useState('')
  const [monthlyRevenue, setMonthlyRevenue] = useState('')
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [differential, setDifferential] = useState('')

  // Location
  const [locationQuery, setLocationQuery] = useState('')
  const [locationPredictions, setLocationPredictions] = useState<LocationPrediction[]>([])
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { executeAsync: createStore, isExecuting } = useAction(createStoreManualAction)
  const { executeAsync: generateSiteV2 } = useAction(generateSiteAfterOnboarding)
  const { executeAsync: searchLocation } = useAction(searchLocationAction)
  const { executeAsync: getLocationDetails } = useAction(getLocationDetailsAction)
  const { handleActionError } = usePlanLimitRedirect()

  const currentIndex = STEPS.indexOf(step)

  // Animate logs during creating step
  useEffect(() => {
    if (step !== 'creating') return
    const interval = setInterval(() => {
      setCurrentLogIndex(prev => (prev < HUMANIZED_LOGS.length - 1 ? prev + 1 : prev))
    }, 2500)
    return () => clearInterval(interval)
  }, [step])

  // Auto-detect location on mount
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&language=pt-BR`
          )
          const data = await res.json()
          if (data.results?.[0]) {
            const components = data.results[0].address_components
            const city = components?.find((c: { types: string[] }) => c.types.includes('administrative_area_level_2'))?.long_name
            const state = components?.find((c: { types: string[] }) => c.types.includes('administrative_area_level_1'))?.short_name
            if (city && state) {
              setLocationQuery(`${city}, ${state}`)
              setSelectedLocation({
                placeId: data.results[0].place_id || '',
                city,
                state,
                fullAddress: data.results[0].formatted_address,
                street: '',
                streetNumber: '',
                neighborhood: components?.find((c: { types: string[] }) => c.types.includes('sublocality_level_1'))?.long_name || '',
                zipCode: components?.find((c: { types: string[] }) => c.types.includes('postal_code'))?.long_name || '',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                locationScope: 'city',
              })
            }
          }
        } catch {
          // Silently fail
        }
      },
      () => { /* denied or unavailable */ },
      { timeout: 5000 }
    )
  }, [])

  // Location search
  const handleLocationSearch = useCallback(async (query: string) => {
    setLocationQuery(query)
    setSelectedLocation(null)
    if (query.length < 3) { setLocationPredictions([]); return }
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true)
      const result = await searchLocation({ query })
      if (result?.data) setLocationPredictions(result.data)
      setIsSearchingLocation(false)
    }, 300)
  }, [searchLocation])

  const handleLocationSelect = useCallback(async (prediction: LocationPrediction) => {
    setIsSearchingLocation(true)
    setIsPopoverOpen(false)
    const result = await getLocationDetails({ placeId: prediction.placeId })
    if (result?.data) {
      setSelectedLocation(result.data)
      const { city, state, locationScope } = result.data
      if (locationScope === 'country') setLocationQuery('Todo o Brasil')
      else if (locationScope === 'state') setLocationQuery(`Todo o ${city}, ${state}`)
      else setLocationQuery(`${city}, ${state}`)
    } else {
      toast.error('Erro ao buscar detalhes da localização')
    }
    setIsSearchingLocation(false)
    setLocationPredictions([])
  }, [getLocationDetails])

  // Navigation
  function goNext() {
    const i = STEPS.indexOf(step)
    if (i < STEPS.length - 1) setStep(STEPS[i + 1])
  }

  function goBack() {
    const i = STEPS.indexOf(step)
    if (i > 0) setStep(STEPS[i - 1])
  }

  // Handle create
  async function handleCreate() {
    if (!selectedLocation) return

    setStep('creating')
    setCurrentLogIndex(0)

    const whatsappClean = whatsapp.replace(/\D/g, '')

    const result = await createStore({
      name: name.trim(),
      businessType: businessType.trim(),
      city: selectedLocation.city,
      state: selectedLocation.state as 'SP' | 'RJ' | 'MG' | 'BA' | 'PR' | 'RS' | 'SC' | 'GO' | 'PE' | 'CE' | 'PA' | 'MA' | 'AM' | 'ES' | 'PB' | 'RN' | 'AL' | 'PI' | 'SE' | 'RO' | 'TO' | 'AC' | 'AP' | 'RR' | 'MT' | 'MS' | 'DF' | 'BR',
      whatsapp: whatsappClean,
      monthlyRevenue: monthlyRevenue || undefined,
      differential: differential.trim() || undefined,
      address: selectedLocation.fullAddress || undefined,
      neighborhood: selectedLocation.neighborhood || undefined,
      latitude: selectedLocation.latitude || undefined,
      longitude: selectedLocation.longitude || undefined,
    })

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) toast.error(result.serverError)
      setStep('summary')
      return
    }

    if (result?.validationErrors) {
      const errors = Object.values(result.validationErrors).flatMap(
        (field) => (field as { _errors?: string[] })?._errors ?? []
      )
      toast.error(errors[0] || 'Erro de validação')
      setStep('summary')
      return
    }

    if (result?.data) {
      try {
        await generateSiteV2({ storeId: result.data.store.id })
      } catch {
        // Generation errors are non-blocking
      }
      router.push(`/negocio/${result.data.slug}/site`)
    } else {
      toast.error('Erro inesperado ao criar site')
      setStep('summary')
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <AnimatePresence mode="wait">
        {step === 'business-type' && (
          <BusinessTypeStep
            key="business-type"
            value={businessType}
            onChange={setBusinessType}
            onNext={goNext}
          />
        )}

        {step === 'revenue' && (
          <RevenueStep
            key="revenue"
            selected={monthlyRevenue}
            onSelect={(v) => { setMonthlyRevenue(v); goNext() }}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {step === 'location' && (
          <LocationStep
            key="location"
            locationQuery={locationQuery}
            locationPredictions={locationPredictions}
            isSearchingLocation={isSearchingLocation}
            selectedLocation={selectedLocation}
            isPopoverOpen={isPopoverOpen}
            setIsPopoverOpen={setIsPopoverOpen}
            onLocationSearch={handleLocationSearch}
            onLocationSelect={handleLocationSelect}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {step === 'name-contact' && (
          <NameContactStep
            key="name-contact"
            name={name}
            setName={setName}
            whatsapp={whatsapp}
            setWhatsapp={setWhatsapp}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {step === 'summary' && (
          <SummaryStep
            key="summary"
            name={name}
            businessType={businessType}
            city={selectedLocation?.city || ''}
            differential={differential}
            setDifferential={setDifferential}
            isExecuting={isExecuting}
            onBack={goBack}
            onSubmit={handleCreate}
          />
        )}

        {step === 'creating' && (
          <CreatingStep
            key="creating"
            businessName={name}
            currentLogIndex={currentLogIndex}
          />
        )}
      </AnimatePresence>

      {/* Progress dots */}
      {step !== 'creating' && (
        <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {STEPS.filter(s => s !== 'creating').map((s, i) => (
            <div
              key={s}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i <= currentIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-200 dark:bg-slate-700'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Step Layout Wrapper ─────────────────────────────────────────────────────

function StepLayout({
  children,
  onBack,
  icons,
  title,
}: {
  children: React.ReactNode
  onBack?: () => void
  icons: [React.ComponentType<{ className?: string }>, React.ComponentType<{ className?: string }>, React.ComponentType<{ className?: string }>]
  iconColors?: string
  title: string
}) {
  const [Icon1] = icons

  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-16"
    >
      {/* Back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="fixed left-4 top-6 z-20 flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <IconArrowLeft className="h-4 w-4" />
        </button>
      )}

      <div className="w-full max-w-md">
        {/* Gradient icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <Icon1 className="h-6 w-6 text-primary" />
        </motion.div>

        {/* Title */}
        <h1 className="mb-6 text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          {title}
        </h1>

        {/* GlassCard wrapper */}
        <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
          {children}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Step 1: Business Type ───────────────────────────────────────────────────

function BusinessTypeStep({
  value,
  onChange,
  onNext,
}: {
  value: string
  onChange: (v: string) => void
  onNext: () => void
}) {
  return (
    <StepLayout
      icons={[IconBuildingStore, IconCategory, IconSparkles]}
      iconColors="text-primary"
      title="Qual é o tipo do seu negócio?"
    >
      <div className="space-y-4">
        <Input
          autoFocus
          placeholder="Ex: Barbearia, Restaurante, Academia..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && value.trim().length >= 2) onNext() }}
          className="h-12 rounded-lg border-slate-200 bg-white text-base placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
        />
        <Button
          disabled={value.trim().length < 2}
          onClick={onNext}
          className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Próximo
        </Button>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/onboarding"
          className="text-sm text-slate-400 transition-colors hover:text-slate-600"
        >
          Voltar ao início
        </Link>
      </div>
    </StepLayout>
  )
}

// ─── Step 2: Revenue ─────────────────────────────────────────────────────────

function RevenueStep({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: string
  onSelect: (v: string) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <StepLayout
      onBack={onBack}
      icons={[IconCoin, IconChartBar, IconUsers]}
      iconColors="text-primary"
      title="Qual seu faturamento mensal atual?"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {REVENUE_OPTIONS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                'cursor-pointer rounded-lg border-2 px-4 py-3 text-sm transition-all hover:border-primary/40 hover:bg-primary/5',
                selected === option
                  ? 'border-primary bg-primary/5 font-semibold text-primary'
                  : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <Button
          disabled={!selected}
          onClick={onNext}
          className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Próximo
        </Button>
      </div>
    </StepLayout>
  )
}

// ─── Step 3: Location ────────────────────────────────────────────────────────

function LocationStep({
  locationQuery,
  locationPredictions,
  isSearchingLocation,
  selectedLocation,
  isPopoverOpen,
  setIsPopoverOpen,
  onLocationSearch,
  onLocationSelect,
  onBack,
  onNext,
}: {
  locationQuery: string
  locationPredictions: LocationPrediction[]
  isSearchingLocation: boolean
  selectedLocation: LocationDetails | null
  isPopoverOpen: boolean
  setIsPopoverOpen: (v: boolean) => void
  onLocationSearch: (q: string) => void
  onLocationSelect: (p: LocationPrediction) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <StepLayout
      onBack={onBack}
      icons={[IconMapPin, IconWorld, IconFlag]}
      iconColors="text-indigo-500"
      title="Onde fica seu negócio?"
    >
      <div className="space-y-4">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                autoFocus
                placeholder="Digite cidade ou bairro..."
                value={locationQuery}
                className={cn(
                  'h-12 rounded-lg border-slate-200 bg-white pr-10 text-base placeholder:text-slate-400 focus:border-slate-400 focus:ring-0',
                  selectedLocation && 'border-emerald-400'
                )}
                onChange={e => {
                  onLocationSearch(e.target.value)
                  if (!isPopoverOpen && e.target.value.length >= 3) setIsPopoverOpen(true)
                }}
                onFocus={() => {
                  if (locationQuery.length >= 3) setIsPopoverOpen(true)
                }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isSearchingLocation ? (
                  <IconLoader2 className="h-4 w-4 animate-spin text-slate-400" />
                ) : selectedLocation ? (
                  <IconCheck className="h-4 w-4 text-emerald-500" />
                ) : (
                  <IconSearch className="h-4 w-4 text-slate-400" />
                )}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            onOpenAutoFocus={e => e.preventDefault()}
          >
            {locationPredictions.length > 0 ? (
              <div className="max-h-[300px] overflow-auto py-1">
                {locationPredictions.map(prediction => (
                  <button
                    key={prediction.placeId}
                    type="button"
                    className="flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
                    onClick={() => onLocationSelect(prediction)}
                  >
                    <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{prediction.mainText}</p>
                      <p className="text-sm text-slate-500">{prediction.secondaryText}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-slate-500">
                {isSearchingLocation ? 'Buscando...' : 'Digite para buscar'}
              </div>
            )}
          </PopoverContent>
        </Popover>

        {selectedLocation && (
          <p className="flex items-center gap-2 text-sm text-emerald-600">
            <IconCheck className="h-4 w-4" />
            {selectedLocation.locationScope === 'country'
              ? 'Atendimento em todo o Brasil'
              : selectedLocation.locationScope === 'state'
                ? `Atendimento em todo o ${selectedLocation.city}, ${selectedLocation.state}`
                : selectedLocation.fullAddress || `${selectedLocation.city}, ${selectedLocation.state}`}
          </p>
        )}

        <p className="text-center text-xs text-slate-400">
          Idioma do site: Portugues
        </p>

        <Button
          disabled={!selectedLocation}
          onClick={onNext}
          className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Próximo
        </Button>
      </div>
    </StepLayout>
  )
}

// ─── Step 4: Name & Contact ──────────────────────────────────────────────────

function NameContactStep({
  name,
  setName,
  whatsapp,
  setWhatsapp,
  onBack,
  onNext,
}: {
  name: string
  setName: (v: string) => void
  whatsapp: string
  setWhatsapp: (v: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const canContinue = name.trim().length >= 2 && whatsapp.replace(/\D/g, '').length >= 10

  return (
    <StepLayout
      onBack={onBack}
      icons={[IconId, IconUsers, IconLetterCase]}
      iconColors="text-primary"
      title="Qual o nome do seu negócio?"
    >
      <div className="space-y-4">
        <Input
          autoFocus
          placeholder="Nome do negócio"
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-12 rounded-lg border-slate-200 bg-white text-base placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
        />

        <div className="relative">
          <IconBrandWhatsapp className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <PatternFormat
            format="(##) #####-####"
            mask="_"
            value={whatsapp}
            onValueChange={values => setWhatsapp(values.formattedValue)}
            customInput={Input}
            placeholder="(11) 99999-9999"
            className="h-12 rounded-lg border-slate-200 bg-white pl-10 text-base placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
          />
        </div>

        <Button
          disabled={!canContinue}
          onClick={onNext}
          onKeyDown={e => { if (e.key === 'Enter' && canContinue) onNext() }}
          className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          Próximo
        </Button>
      </div>
    </StepLayout>
  )
}

// ─── Step 5: Summary ─────────────────────────────────────────────────────────

function SummaryStep({
  name,
  businessType,
  city,
  differential,
  setDifferential,
  isExecuting,
  onBack,
  onSubmit,
}: {
  name: string
  businessType: string
  city: string
  differential: string
  setDifferential: (v: string) => void
  isExecuting: boolean
  onBack: () => void
  onSubmit: () => void
}) {
  const detailScore = Math.min(differential.trim().length / 120, 1)

  return (
    <StepLayout
      onBack={onBack}
      icons={[IconSparkles, IconLetterCase, IconFlag]}
      iconColors="text-primary"
      title="Resumo"
    >
      <div className="space-y-5">
        <p className="text-center text-sm text-slate-600">
          Voce esta criando <span className="font-semibold">{name}</span>, um negocio de{' '}
          <span className="font-semibold">{businessType}</span> em{' '}
          <span className="font-semibold">{city}</span>.
        </p>

        <textarea
          rows={4}
          value={differential}
          onChange={e => setDifferential(e.target.value)}
          placeholder="Conte mais sobre seus servicos, publico-alvo ou qualquer detalhe..."
          className="w-full resize-none rounded-lg border border-slate-200/50 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-primary/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white"
        />

        {/* Detail progress bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${detailScore * 100}%` }}
            />
          </div>
          <p className="text-center text-xs text-slate-400">
            Adicione mais detalhes para a IA gerar resultados melhores
          </p>
        </div>

        <Button
          disabled={isExecuting}
          onClick={onSubmit}
          className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          {isExecuting ? (
            <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <IconRocket className="mr-2 h-5 w-5" />
          )}
          Criar meu site
        </Button>
      </div>
    </StepLayout>
  )
}

// ─── Step 6: Creating ────────────────────────────────────────────────────────

function CreatingStep({
  businessName,
  currentLogIndex,
}: {
  businessName: string
  currentLogIndex: number
}) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-16"
    >
      <div className="w-full max-w-md">
        {/* Gradient icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <IconSparkles className="h-7 w-7 text-primary animate-pulse" />
        </motion.div>

        <h1 className="mb-2 text-center text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          Criando seu site
        </h1>
        <p className="mb-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Nossa IA está montando a página de <span className="font-medium text-slate-700 dark:text-slate-200">{businessName || 'seu negócio'}</span>
        </p>

        {/* Skeleton preview in GlassCard */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200/40 bg-white/70 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70">
          <div className="relative h-20 bg-slate-100">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="space-y-2.5 p-4">
            <div className="h-3 w-3/4 rounded bg-slate-100" />
            <div className="h-2.5 w-1/2 rounded bg-slate-50" />
            <div className="mt-3 flex gap-2">
              <div className="h-7 w-20 rounded bg-slate-100" />
              <div className="h-7 w-16 rounded bg-slate-50" />
            </div>
          </div>
        </div>

        {/* Log items */}
        <div className="space-y-2">
          {HUMANIZED_LOGS.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -16 }}
              animate={{
                opacity: index <= currentLogIndex ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                index < currentLogIndex && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                index === currentLogIndex && 'bg-primary/5 dark:bg-primary/10'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                index < currentLogIndex && 'bg-emerald-500 text-white',
                index === currentLogIndex && 'bg-primary text-white',
                index > currentLogIndex && 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              )}>
                {index < currentLogIndex ? (
                  <IconCheck className="h-3.5 w-3.5" />
                ) : index === currentLogIndex ? (
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <log.icon className="h-3.5 w-3.5" />
                )}
              </div>
              <span className={cn(
                'text-sm',
                index <= currentLogIndex ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
              )}>
                {log.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
