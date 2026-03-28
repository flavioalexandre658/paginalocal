'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconLoader2,
  IconMapPin,
  IconSparkles,
  IconFileText,
  IconRocket,
  IconCheck,
  IconSearch,
  IconBrandWhatsapp,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createStoreManualAction } from '@/actions/stores/create-store-manual.action'
import { generateSiteAfterOnboarding } from '@/actions/ai/generate-site-after-onboarding'
import {
  searchLocationAction,
  getLocationDetailsAction,
  type LocationDetails,
} from '@/actions/utils/search-location.action'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'
import { cn } from '@/lib/utils'
import { PglButton } from '@/components/ui/pgl-button'
import { PglField, PglFieldLabel, PglFieldInput, PglFieldTextarea, PglFieldPhone } from '@/components/ui/pgl-field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  OnboardingShell,
  OnboardingProgress,
  OnboardingHeader,
  OnboardingCreatingItem,
} from '@/components/ui/pgl-onboarding'
import { IconArrowLeft } from '@tabler/icons-react'

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
    <OnboardingShell>
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
    </OnboardingShell>
  )
}

// ─── Step Layout (Durable-style) ─────────────────────────────────────────────

function StepLayout({
  children,
  step,
  totalSteps,
  onBack,
  backHref,
}: {
  children: React.ReactNode
  step: number
  totalSteps: number
  onBack?: () => void
  backHref?: string
}) {
  return (
    <motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-1 flex-col"
    >
      <div className="p-4">
        {backHref ? (
          <Link href={backHref}>
            <button className="rounded-xl p-1 text-black/55 transition-[background,color] duration-150 hover:bg-black/5 hover:text-black/80">
              <IconArrowLeft className="size-5" />
            </button>
          </Link>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="rounded-xl p-1 text-black/55 transition-[background,color] duration-150 hover:bg-black/5 hover:text-black/80"
          >
            <IconArrowLeft className="size-5" />
          </button>
        ) : (
          <div className="h-7" />
        )}
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-4">
          {children}
        </div>
      </div>
      <OnboardingProgress current={step} total={totalSteps} className="p-8" />
    </motion.div>
  )
}

// ─── Step 0: Business Type ───────────────────────────────────────────────────

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
    <StepLayout step={0} totalSteps={5} backHref="/onboarding">
      <OnboardingHeader title="Qual é o tipo do seu negócio?" />

      <div className="space-y-6">
        <PglFieldTextarea
          autoFocus
          placeholder="Ex: academia de musculação e funcional"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && value.trim().length >= 2) { e.preventDefault(); onNext() } }}
          rows={3}
          className="bg-black/[0.03] ring-black/10 text-base"
        />

        <PglButton
          variant="default"
          disabled={value.trim().length < 2}
          onClick={onNext}
          className="w-full rounded-2xl px-4 py-3 text-base"
        >
          Próximo
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── Step 1: Revenue ─────────────────────────────────────────────────────────

function RevenueStep({
  selected,
  onSelect,
  onBack,
}: {
  selected: string
  onSelect: (v: string) => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <StepLayout step={1} totalSteps={5} onBack={onBack}>
      <OnboardingHeader title="Qual seu faturamento mensal?" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {REVENUE_OPTIONS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={cn(
                'inline-flex w-full cursor-pointer items-center justify-center rounded-2xl px-6 py-4 text-sm font-medium outline-none',
                'transition-[background,color] duration-150',
                selected === option
                  ? 'bg-black/80 text-white'
                  : 'bg-black/5 text-black/80 hover:bg-black/10',
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <PglButton
          variant="default"
          disabled={!selected}
          onClick={onBack}
          className="w-full rounded-2xl px-4 py-3 text-base"
          style={{ display: 'none' }}
        >
          {/* Auto-advances on select, hidden button for form consistency */}
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── Step 2: Location ────────────────────────────────────────────────────────

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
  const locationText = selectedLocation
    ? selectedLocation.locationScope === 'country'
      ? 'Atendimento em todo o Brasil'
      : selectedLocation.locationScope === 'state'
        ? `Atendimento em todo o ${selectedLocation.city}, ${selectedLocation.state}`
        : selectedLocation.fullAddress || `${selectedLocation.city}, ${selectedLocation.state}`
    : ''

  return (
    <StepLayout step={2} totalSteps={5} onBack={onBack}>
      <OnboardingHeader title="Onde fica o seu negócio?" />

      <div className="space-y-6">
        <PglField>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <div className="relative">
                <PglFieldInput
                  autoFocus
                  placeholder="Digite cidade ou bairro..."
                  value={locationQuery}
                  onChange={e => {
                    onLocationSearch(e.target.value)
                    if (!isPopoverOpen && e.target.value.length >= 3) setIsPopoverOpen(true)
                  }}
                  onFocus={() => {
                    if (locationQuery.length >= 3) setIsPopoverOpen(true)
                  }}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearchingLocation ? (
                    <IconLoader2 className="size-4 animate-spin text-black/30" />
                  ) : selectedLocation ? (
                    <IconCheck className="size-4 text-emerald-500" />
                  ) : (
                    <IconSearch className="size-4 text-black/30" />
                  )}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] rounded-2xl border border-black/[0.08] bg-white p-1 shadow-xl shadow-black/10"
              align="start"
              onOpenAutoFocus={e => e.preventDefault()}
            >
              {locationPredictions.length > 0 ? (
                <div className="max-h-[300px] overflow-auto">
                  {locationPredictions.map(prediction => (
                    <button
                      key={prediction.placeId}
                      type="button"
                      className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-black/[0.03]"
                      onClick={() => onLocationSelect(prediction)}
                    >
                      <IconMapPin className="size-4 shrink-0 text-black/30" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-black/80">{prediction.mainText}</p>
                        <p className="text-xs text-black/40">{prediction.secondaryText}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-sm text-black/40">
                  {isSearchingLocation ? 'Buscando...' : 'Digite para buscar'}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </PglField>

        {selectedLocation && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/55">
            <IconCheck className="size-3" /> {locationText}
          </div>
        )}

        <p className="text-xs text-black/30">Idioma do site: Português</p>

        <PglButton
          variant="default"
          disabled={!selectedLocation}
          onClick={onNext}
          className="w-full rounded-2xl px-4 py-3 text-base"
        >
          Próximo
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── Step 3: Name & Contact ──────────────────────────────────────────────────

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
    <StepLayout step={3} totalSteps={5} onBack={onBack}>
      <OnboardingHeader title="Nome e contato do negócio" />

      <div className="space-y-6">
        <div className="space-y-4">
          <PglField>
            <PglFieldLabel>Nome do negócio</PglFieldLabel>
            <PglFieldInput
              autoFocus
              placeholder="Ex: Alonso Academia"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </PglField>

          <PglField>
            <PglFieldLabel className="flex items-center gap-1.5">
              <IconBrandWhatsapp className="size-4 text-emerald-500" /> WhatsApp
            </PglFieldLabel>
            <PglFieldPhone
              value={whatsapp}
              onValueChange={values => setWhatsapp(values.formattedValue)}
              placeholder="(11) 99999-9999"
            />
          </PglField>
        </div>

        <PglButton
          variant="default"
          disabled={!canContinue}
          onClick={onNext}
          className="w-full rounded-2xl px-4 py-3 text-base"
        >
          Próximo
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── Step 4: Summary ─────────────────────────────────────────────────────────

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
  return (
    <StepLayout step={4} totalSteps={5} onBack={onBack}>
      <OnboardingHeader title="Quase pronto!" />

      <div className="space-y-6">
        <div className="rounded-2xl bg-black/[0.03] px-4 py-3 text-sm text-black/55">
          Você está criando <strong className="text-black/80">{name}</strong>, um negócio de{' '}
          <strong className="text-black/80">{businessType}</strong> em{' '}
          <strong className="text-black/80">{city}</strong>.
        </div>

        <PglField>
          <PglFieldLabel>Algo mais sobre o negócio? (opcional)</PglFieldLabel>
          <PglFieldTextarea
            rows={4}
            value={differential}
            onChange={e => setDifferential(e.target.value)}
            placeholder="Conte mais sobre seus serviços, público-alvo, diferenciais..."
            className="bg-black/[0.03] ring-black/10 text-base"
          />
        </PglField>

        <div className="space-y-1.5">
          <div className="h-1 w-full rounded-full bg-black/10">
            <div
              className="h-1 rounded-full bg-black/80 transition-all"
              style={{ width: `${Math.min(100, (differential.length / 120) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-black/30">Adicione detalhes para a IA gerar melhores resultados</p>
        </div>

        <PglButton
          variant="default"
          disabled={isExecuting}
          loading={isExecuting}
          onClick={onSubmit}
          className="w-full rounded-2xl px-4 py-3 text-base"
        >
          {!isExecuting && 'Criar meu site'}
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── Site Skeleton Preview ───────────────────────────────────────────────────

function SiteSkeletonPreview() {
  return (
    <div className="overflow-hidden rounded-2xl bg-black/[0.03]">
      <div className="relative h-14 bg-black/[0.06]">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="space-y-1.5 p-3">
        <div className="h-3 w-3/4 rounded bg-black/[0.06]" />
        <div className="h-2 w-1/2 rounded bg-black/[0.04]" />
        <div className="mt-2 flex gap-1.5">
          <div className="h-5 w-16 rounded bg-black/[0.06]" />
          <div className="h-5 w-14 rounded bg-black/[0.04]" />
        </div>
      </div>
    </div>
  )
}

// ─── Step 5: Creating ────────────────────────────────────────────────────────

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
      className="flex flex-1 flex-col"
    >
      <div className="h-12" />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg p-4">
          <div className="mb-6 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-black/5"
            >
              <IconSparkles className="size-6 text-black/55" />
            </motion.div>
            <p className="text-xl font-medium text-black/80 md:text-2xl">Criando seu site</p>
            <p className="mt-1.5 text-sm text-black/40">
              Nossa IA está montando a página de{' '}
              <span className="font-medium text-black/55">{businessName || 'seu negócio'}</span>
            </p>
          </div>

          <SiteSkeletonPreview />

          <div className="mt-5 space-y-1.5">
            {HUMANIZED_LOGS.map((log, index) => (
              <OnboardingCreatingItem
                key={index}
                icon={log.icon}
                label={log.text}
                status={
                  index < currentLogIndex
                    ? 'done'
                    : index === currentLogIndex
                      ? 'active'
                      : 'pending'
                }
              />
            ))}
          </div>
        </div>
      </div>
      <OnboardingProgress current={4} total={5} className="p-8" />
    </motion.div>
  )
}
