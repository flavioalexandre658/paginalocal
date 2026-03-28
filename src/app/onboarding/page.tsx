'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconSearch,
  IconMapPin,
  IconSparkles,
  IconCheck,
  IconLoader2,
  IconStar,
  IconStarFilled,
  IconPhoto,
  IconFileText,
  IconRocket,
  IconEdit,
  IconArrowLeft,
  IconPlus,
  IconBuildingStore,
  IconPhone,
  IconBrandWhatsapp,
  IconClock,
  IconBrandGoogle,
  IconForms,
  IconChevronRight,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'

import { searchPlacesAction } from '@/actions/google/search-places.action'
import { getPlacePreviewAction, type PlacePreview } from '@/actions/google/get-place-preview.action'
import { createStoreFromGoogleAction } from '@/actions/stores/create-store-from-google.action'
import { generateSiteAfterOnboarding } from '@/actions/ai/generate-site-after-onboarding'
import { getUserStoresAction } from '@/actions/stores/get-user-stores.action'
import { PglButton } from '@/components/ui/pgl-button'
import { PglField, PglFieldLabel, PglFieldInput } from '@/components/ui/pgl-field'
import { PglFieldPhone } from '@/components/ui/pgl-field'
import { Skeleton } from '@/components/ui/skeleton'
import {
  OnboardingShell,
  OnboardingProgress,
  OnboardingHeader,
  OnboardingCreatingItem,
} from '@/components/ui/pgl-onboarding'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'

interface PlaceResult {
  placeId: string
  name: string
  address: string
  rating: number | null
  reviewsCount: number | null
  photoUrl: string | null
  isOpen: boolean | null
  category: string | null
}

type OnboardingStep = 'choose' | 'search' | 'confirm' | 'contacts' | 'creating'

const HUMANIZED_LOGS = [
  { icon: IconMapPin, text: 'Conectando com o Google Maps...', shortText: 'Google Maps' },
  { icon: IconStar, text: 'Analisando suas avaliações...', shortText: 'Avaliações' },
  { icon: IconPhoto, text: 'Importando suas melhores fotos...', shortText: 'Fotos' },
  { icon: IconSparkles, text: 'Redigindo títulos persuasivos...', shortText: 'Títulos IA' },
  { icon: IconFileText, text: 'Gerando descrições para SEO...', shortText: 'SEO' },
  { icon: IconSparkles, text: 'Desenhando o layout...', shortText: 'Layout' },
  { icon: IconSparkles, text: 'Escolhendo cores e fontes...', shortText: 'Design' },
  { icon: IconSparkles, text: 'Montando as seções...', shortText: 'Seções' },
  { icon: IconRocket, text: 'Finalizando seu site!', shortText: 'Finalizando' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('choose')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [, setCreatedStore] = useState<{ slug: string; name: string; id?: string } | null>(null)
  const [placePreview, setPlacePreview] = useState<PlacePreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [hasStores, setHasStores] = useState(false)
  const [editedWhatsapp, setEditedWhatsapp] = useState('')
  const [editedPhone, setEditedPhone] = useState('')
  const [editedName, setEditedName] = useState('')

  const { executeAsync: searchPlaces } = useAction(searchPlacesAction)
  const { executeAsync: getPlacePreview } = useAction(getPlacePreviewAction)
  const { executeAsync: generateSiteV2 } = useAction(generateSiteAfterOnboarding)
  const { executeAsync: createStore } = useAction(createStoreFromGoogleAction)
  const { executeAsync: getUserStores } = useAction(getUserStoresAction)
  const { handleActionError } = usePlanLimitRedirect()

  useEffect(() => {
    async function checkUserStores() {
      const result = await getUserStores()
      if (result?.data && result.data.length > 0) {
        setHasStores(true)
      }
    }
    checkUserStores()
  }, [getUserStores])

  useEffect(() => {
    if (step === 'creating') {
      const interval = setInterval(() => {
        setCurrentLogIndex(prev => {
          if (prev < HUMANIZED_LOGS.length - 1) return prev + 1
          return prev
        })
      }, 2500)
      return () => clearInterval(interval)
    }
  }, [step])

  async function handleSearch() {
    if (query.length < 3) return
    setIsSearching(true)
    setHasSearched(true)
    const result = await searchPlaces({ query })
    setIsSearching(false)
    if (result?.data) {
      setResults(result.data)
    }
  }

  async function handleSelectPlace(place: PlaceResult) {
    setSelectedPlace(place)
    setEditedName(place.name)
    setStep('confirm')
    setIsLoadingPreview(true)
    setPlacePreview(null)

    const result = await getPlacePreview({ placeId: place.placeId })
    if (result?.data) {
      setPlacePreview(result.data)
      setEditedName(result.data.name || place.name)
      if (result.data.phone) {
        const cleanPhone = result.data.phone.replace(/\D/g, '')
        setEditedWhatsapp(cleanPhone)
        setEditedPhone(cleanPhone)
      }
    }
    setIsLoadingPreview(false)
  }

  async function handleCreateAndGenerate() {
    if (!selectedPlace) return

    const cleanWhatsapp = editedWhatsapp.replace(/\D/g, '')
    if (cleanWhatsapp.length < 10) {
      toast.error('Por favor, informe um WhatsApp válido')
      return
    }

    setStep('creating')
    setCurrentLogIndex(0)

    const result = await createStore({
      googlePlaceId: selectedPlace.placeId,
      searchTerm: query.trim(),
      whatsappOverride: cleanWhatsapp,
      phoneOverride: editedPhone.replace(/\D/g, '') || undefined,
      nameOverride: editedName.trim() !== selectedPlace.name ? editedName.trim() : undefined,
    })

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) {
        toast.error(result.serverError)
      }
      setStep('search')
      return
    }

    if (!result?.data) {
      toast.error('Erro ao criar site')
      setStep('search')
      return
    }

    setCreatedStore({
      slug: result.data.slug,
      name: result.data.displayName,
      id: result.data.store.id,
    })

    const v2Result = await generateSiteV2({ storeId: result.data.store.id })
    if (v2Result?.serverError) {
      console.error('[Onboarding] V2 failed:', v2Result.serverError)
    }

    router.push(`/negocio/${result.data.slug}/site`)
  }

  function handleBackToChoose() {
    setStep('choose')
    setQuery('')
    setResults([])
    setHasSearched(false)
    setSelectedPlace(null)
    setPlacePreview(null)
    setEditedWhatsapp('')
    setEditedPhone('')
    setEditedName('')
  }

  return (
    <OnboardingShell>
      <AnimatePresence mode="wait">
        {step === 'choose' && (
          <ChoosePathStep
            key="choose"
            hasStores={hasStores}
            onChooseAutomatic={() => setStep('search')}
          />
        )}

        {step === 'search' && (
          <SearchStep
            key="search"
            query={query}
            setQuery={setQuery}
            results={results}
            isSearching={isSearching}
            hasSearched={hasSearched}
            hasStores={hasStores}
            onSearch={handleSearch}
            onSelectPlace={handleSelectPlace}
            onBackToChoose={handleBackToChoose}
          />
        )}

        {step === 'confirm' && selectedPlace && (
          <ConfirmStep
            key="confirm"
            place={selectedPlace}
            preview={placePreview}
            isLoadingPreview={isLoadingPreview}
            editedName={editedName}
            onNameChange={setEditedName}
            onConfirm={() => setStep('contacts')}
            onBack={() => {
              setStep('search')
              setSelectedPlace(null)
              setPlacePreview(null)
              setEditedWhatsapp('')
              setEditedPhone('')
              setEditedName('')
            }}
          />
        )}

        {step === 'contacts' && (
          <ContactsStep
            key="contacts"
            editedWhatsapp={editedWhatsapp}
            editedPhone={editedPhone}
            onWhatsappChange={setEditedWhatsapp}
            onPhoneChange={setEditedPhone}
            preview={placePreview}
            onConfirm={handleCreateAndGenerate}
            onBack={() => setStep('confirm')}
          />
        )}

        {step === 'creating' && selectedPlace && (
          <CreatingStep
            key="creating"
            place={selectedPlace}
            currentLogIndex={currentLogIndex}
          />
        )}
      </AnimatePresence>
    </OnboardingShell>
  )
}

// ─── ChoosePathStep ──────────────────────────────────────────────────────────

function ChoosePathStep({
  hasStores,
  onChooseAutomatic,
}: {
  hasStores: boolean
  onChooseAutomatic: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-1 flex-col"
    >
      {/* Top bar — back link */}
      <div className="p-4">
        {hasStores ? (
          <Link href="/painel">
            <button className="rounded-xl p-1 text-black/55 transition-[background,color] duration-150 hover:bg-black/5 hover:text-black/80">
              <IconArrowLeft className="size-5" />
            </button>
          </Link>
        ) : (
          <div className="h-7" />
        )}
      </div>

      {/* Center content */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-4">
          <OnboardingHeader title="Como deseja criar seu site?" />

          <div className="space-y-6">
            <div className="grid gap-2">
              {/* Google import */}
              <button
                onClick={onChooseAutomatic}
                className="group flex w-full items-center gap-4 rounded-2xl bg-black/5 px-5 py-4 text-left font-medium transition-[background,color] duration-150 hover:bg-black/10"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                  <IconBrandGoogle className="size-5 text-black/55" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-black/80">Importar do Google</span>
                  <p className="mt-0.5 text-xs font-normal text-black/40">Fotos, avaliações e dados importados com IA</p>
                </div>
                <IconChevronRight className="size-5 shrink-0 text-black/20 transition-transform duration-150 group-hover:translate-x-0.5" />
              </button>

              {/* Manual */}
              <Link href="/onboarding/manual">
                <button className="group flex w-full items-center gap-4 rounded-2xl bg-black/5 px-5 py-4 text-left font-medium transition-[background,color] duration-150 hover:bg-black/10">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06]">
                    <IconForms className="size-5 text-black/55" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-black/80">Criar manualmente</span>
                    <p className="mt-0.5 text-xs font-normal text-black/40">Preencha as informações do seu negócio</p>
                  </div>
                  <IconChevronRight className="size-5 shrink-0 text-black/20 transition-transform duration-150 group-hover:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom progress */}
      <OnboardingProgress current={0} total={4} className="p-8" />
    </motion.div>
  )
}

// ─── Step layout wrapper ─────────────────────────────────────────────────────

function StepLayout({
  children,
  step,
  totalSteps,
  onBack,
}: {
  children: React.ReactNode
  step: number
  totalSteps: number
  onBack?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-1 flex-col"
    >
      <div className="p-4">
        {onBack ? (
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

// ─── SearchStep ──────────────────────────────────────────────────────────────

function SearchStep({
  query,
  setQuery,
  results,
  isSearching,
  hasSearched,
  onSearch,
  onSelectPlace,
  onBackToChoose,
}: {
  query: string
  setQuery: (q: string) => void
  results: PlaceResult[]
  isSearching: boolean
  hasSearched: boolean
  hasStores: boolean
  onSearch: () => void
  onSelectPlace: (place: PlaceResult) => void
  onBackToChoose: () => void
}) {
  return (
    <StepLayout step={0} totalSteps={4} onBack={onBackToChoose}>
      <OnboardingHeader title="Encontre seu negócio no Google" />

      <div className="space-y-6">
        <div className="flex items-stretch gap-2">
          <PglFieldInput
            placeholder="Ex: Borracharia do João em São Paulo..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="flex-1"
          />
          <PglButton variant="dark" onClick={onSearch} disabled={isSearching || query.length < 3} loading={isSearching} className="h-auto shrink-0 rounded-2xl px-5">
            {!isSearching && <IconSearch className="size-4" />}
            Buscar
          </PglButton>
        </div>

        <p className="text-xs text-black/30">Dica: inclua o nome da cidade para resultados mais precisos</p>

        {/* Searching skeleton */}
        {isSearching && (
          <div className="space-y-2">
            {[0, 1, 2].map(i => <Skeleton key={i} className="h-[72px] w-full rounded-2xl bg-[#f5f5f4]" />)}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results.length > 0 && !isSearching && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <p className="text-xs font-medium text-black/40">{results.length} resultado(s) encontrado(s)</p>
              <div className="max-h-[50vh] space-y-2 overflow-y-auto">
                {results.map((place, i) => <PlaceCard key={place.placeId} place={place} index={i} onClick={() => onSelectPlace(place)} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {hasSearched && results.length === 0 && !isSearching && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2 text-center">
            <p className="text-sm text-black/40">Nenhum resultado encontrado</p>
            <Link href="/onboarding/manual">
              <PglButton variant="default" size="sm">
                <IconPlus className="size-4" /> Criar manualmente
              </PglButton>
            </Link>
          </motion.div>
        )}
      </div>
    </StepLayout>
  )
}

// ─── PlaceCard ───────────────────────────────────────────────────────────────

function PlaceCard({
  place,
  index,
  onClick,
}: {
  place: PlaceResult
  index: number
  onClick: () => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.25 }}
      onClick={onClick}
      className="group flex w-full items-center gap-3.5 rounded-2xl bg-black/5 p-3.5 text-left transition-[background,color] duration-150 hover:bg-black/10"
    >
      {place.photoUrl ? (
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
          <Image src={place.photoUrl} alt={place.name} fill className="object-cover" unoptimized sizes="48px" />
        </div>
      ) : (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-black/[0.06]">
          <IconBuildingStore className="size-5 text-black/30" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <p className="text-sm font-medium text-black/80 line-clamp-1">{place.name}</p>
        <p className="text-xs text-black/40 line-clamp-1">{place.address}</p>
        {place.rating && (
          <span className="flex items-center gap-1 text-xs text-black/40">
            <IconStarFilled className="size-3 text-amber-500" />
            {place.rating.toFixed(1)}
            {place.reviewsCount && <span>({place.reviewsCount})</span>}
          </span>
        )}
      </div>
      <IconChevronRight className="size-4 shrink-0 text-black/20" />
    </motion.button>
  )
}

// ─── ConfirmStep ─────────────────────────────────────────────────────────────

function ConfirmStep({
  place,
  preview,
  isLoadingPreview,
  editedName,
  onNameChange,
  onConfirm,
  onBack,
}: {
  place: PlaceResult
  preview: PlacePreview | null
  isLoadingPreview: boolean
  editedName: string
  onNameChange: (value: string) => void
  onConfirm: () => void
  onBack: () => void
}) {
  const [isEditingName, setIsEditingName] = useState(false)

  return (
    <StepLayout step={1} totalSteps={4} onBack={onBack}>
      <OnboardingHeader title="Este é o seu negócio?" subtitle="Veja o que encontramos no Google" />

      {isLoadingPreview ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-64 rounded bg-[#f5f5f4]" />
          <Skeleton className="h-4 w-32 rounded bg-[#f5f5f4]" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Business name — editable */}
          <div>
            {isEditingName ? (
              <PglFieldInput
                value={editedName}
                onChange={e => onNameChange(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="text-lg font-semibold"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingName(true)}
                className="group inline-flex items-center gap-2"
              >
                <h3 className="text-lg font-semibold text-black/80">{editedName || place.name}</h3>
                <IconEdit className="size-3.5 text-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )}
          </div>

          {/* Address */}
          <p className="text-sm text-black/40">{preview?.address || place.address}</p>

          {/* Rating */}
          {preview?.rating && (
            <div className="flex items-center gap-2 text-sm text-black/55">
              <IconStarFilled className="size-4 text-amber-500" />
              <span className="font-medium">{preview.rating.toFixed(1)}</span>
              {preview.reviewsCount && (
                <span className="text-black/30">{preview.reviewsCount} avaliações</span>
              )}
            </div>
          )}

          {/* Category */}
          {preview?.category && (
            <span className="inline-block rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black/55">
              {preview.category}
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <PglButton variant="ghost" size="sm" onClick={onBack}>
              <IconArrowLeft className="size-4" /> Voltar
            </PglButton>
            <PglButton variant="dark" size="sm" onClick={onConfirm} disabled={isLoadingPreview}>
              <IconCheck className="size-4" /> Confirmar
            </PglButton>
          </div>
        </div>
      )}
    </StepLayout>
  )
}

// ─── ContactsStep ────────────────────────────────────────────────────────────

function ContactsStep({
  editedWhatsapp,
  editedPhone,
  onWhatsappChange,
  onPhoneChange,
  preview,
  onConfirm,
  onBack,
}: {
  editedWhatsapp: string
  editedPhone: string
  onWhatsappChange: (value: string) => void
  onPhoneChange: (value: string) => void
  preview: PlacePreview | null
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <StepLayout step={2} totalSteps={4} onBack={onBack}>
      <OnboardingHeader title="Confirme seus contatos" subtitle="Seus clientes usarão esses dados para falar com você" />

      <div className="space-y-6">
        <div className="space-y-4">
          <PglField>
            <PglFieldLabel className="flex items-center gap-1.5">
              <IconBrandWhatsapp className="size-4 text-emerald-500" /> WhatsApp
            </PglFieldLabel>
            <PglFieldPhone value={editedWhatsapp} onValueChange={values => onWhatsappChange(values.value)} placeholder="(11) 99999-9999" />
          </PglField>

          <PglField>
            <PglFieldLabel className="flex items-center gap-1.5">
              <IconPhone className="size-4 text-black/40" /> Telefone
              <span className="text-xs font-normal text-black/30">(opcional)</span>
            </PglFieldLabel>
            <PglFieldPhone value={editedPhone} onValueChange={values => onPhoneChange(values.value)} placeholder="(11) 99999-9999" />
          </PglField>

          {preview?.openingHours && preview.openingHours.length > 0 && (
            <div className="space-y-1.5">
              <PglFieldLabel className="flex items-center gap-1.5">
                <IconClock className="size-4 text-black/40" /> Horário de funcionamento
              </PglFieldLabel>
              <div className="rounded-2xl bg-black/[0.03] px-4 py-3">
                {preview.openingHours.map((h, i) => <p key={i} className="text-xs text-black/55">{h}</p>)}
              </div>
            </div>
          )}
        </div>

        <PglButton
          variant="default"
          onClick={onConfirm}
          className="w-full rounded-2xl px-4 py-3 text-base"
        >
          Criar meu site
        </PglButton>
      </div>
    </StepLayout>
  )
}

// ─── CreatingStep ────────────────────────────────────────────────────────────

function CreatingStep({
  place,
  currentLogIndex,
}: {
  place: PlaceResult
  currentLogIndex: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
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
            <p className="mt-1.5 text-sm text-black/40">Nossa IA está trabalhando na sua página</p>
          </div>

          <div className="mb-4 rounded-2xl bg-black/[0.03] px-4 py-2.5 text-center text-sm font-medium text-black/55">
            {place.name}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <SiteSkeletonPreview />
            <div className="space-y-1.5">
              {HUMANIZED_LOGS.map((log, index) => (
                <OnboardingCreatingItem
                  key={index}
                  icon={log.icon}
                  label={log.shortText}
                  status={index < currentLogIndex ? 'done' : index === currentLogIndex ? 'active' : 'pending'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <OnboardingProgress current={3} total={4} className="p-8" />
    </motion.div>
  )
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

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
