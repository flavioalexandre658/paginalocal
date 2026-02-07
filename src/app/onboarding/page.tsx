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
  IconArrowRight,
  IconEdit,
  IconArrowLeft,
  IconPlus,
  IconBuildingStore,
  IconPhone,
  IconBrandWhatsapp,
  IconAlertCircle,
  IconClock,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { PatternFormat } from 'react-number-format'

import { searchPlacesAction } from '@/actions/google/search-places.action'
import { getPlacePreviewAction, type PlacePreview } from '@/actions/google/get-place-preview.action'
import { createStoreFromGoogleAction } from '@/actions/stores/create-store-from-google.action'
import { getUserStoresAction } from '@/actions/stores/get-user-stores.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn, getStoreUrl } from '@/lib/utils'
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

type OnboardingStep = 'search' | 'confirm' | 'creating' | 'complete'

const HUMANIZED_LOGS = [
  { icon: IconMapPin, text: 'Conectando com o Google Maps...', shortText: 'Google Maps' },
  { icon: IconStar, text: 'Analisando suas avaliações para destacar pontos fortes...', shortText: 'Avaliações' },
  { icon: IconPhoto, text: 'Importando suas melhores fotos...', shortText: 'Fotos' },
  { icon: IconSparkles, text: 'Redigindo títulos persuasivos com IA...', shortText: 'Títulos IA' },
  { icon: IconFileText, text: 'Gerando descrições otimizadas para SEO...', shortText: 'SEO' },
  { icon: IconRocket, text: 'Otimizando carregamento para o Google...', shortText: 'Otimizando' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('search')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null)
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [createdStore, setCreatedStore] = useState<{ slug: string; name: string } | null>(null)
  const [placePreview, setPlacePreview] = useState<PlacePreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0)
  const [hasStores, setHasStores] = useState(false)
  const [editedWhatsapp, setEditedWhatsapp] = useState<string>('')
  const [editedPhone, setEditedPhone] = useState<string>('')

  const { executeAsync: searchPlaces } = useAction(searchPlacesAction)
  const { executeAsync: getPlacePreview } = useAction(getPlacePreviewAction)
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
      }, 2000)
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
    setStep('confirm')
    setIsLoadingPreview(true)
    setPlacePreview(null)

    const result = await getPlacePreview({ placeId: place.placeId })
    if (result?.data) {
      setPlacePreview(result.data)
      // Initialize phone fields with Google data
      if (result.data.phone) {
        const cleanPhone = result.data.phone.replace(/\D/g, '')
        setEditedWhatsapp(cleanPhone)
        setEditedPhone(cleanPhone)
      }
    }
    setIsLoadingPreview(false)
  }

  async function handleConfirmAndCreate() {
    if (!selectedPlace) return

    // Validate WhatsApp
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
      selectedCoverIndex,
      whatsappOverride: cleanWhatsapp,
      phoneOverride: editedPhone.replace(/\D/g, '') || undefined,
    })

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) {
        toast.error(result.serverError)
      }
      setStep('search')
      setSelectedPlace(null)
      return
    }

    if (result?.data) {
      setCreatedStore({
        slug: result.data.slug,
        name: result.data.displayName,
      })
      setStep('complete')
      setShowConfetti(true)
      toast.success('Site criado com sucesso!')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {showConfetti && <ConfettiEffect />}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
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
            />
          )}

          {step === 'confirm' && selectedPlace && (
            <ConfirmStep
              key="confirm"
              place={selectedPlace}
              preview={placePreview}
              isLoadingPreview={isLoadingPreview}
              selectedCoverIndex={selectedCoverIndex}
              onSelectCover={setSelectedCoverIndex}
              onConfirm={handleConfirmAndCreate}
              onBack={() => {
                setStep('search')
                setSelectedPlace(null)
                setPlacePreview(null)
                setSelectedCoverIndex(0)
                setEditedWhatsapp('')
                setEditedPhone('')
              }}
              editedWhatsapp={editedWhatsapp}
              editedPhone={editedPhone}
              onWhatsappChange={setEditedWhatsapp}
              onPhoneChange={setEditedPhone}
            />
          )}

          {step === 'creating' && selectedPlace && (
            <CreatingStep
              key="creating"
              place={selectedPlace}
              currentLogIndex={currentLogIndex}
            />
          )}

          {step === 'complete' && selectedPlace && createdStore && (
            <CompleteStep key="complete" place={selectedPlace} storeSlug={createdStore.slug} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SearchStep({
  query,
  setQuery,
  results,
  isSearching,
  hasSearched,
  hasStores,
  onSearch,
  onSelectPlace,
}: {
  query: string
  setQuery: (q: string) => void
  results: PlaceResult[]
  isSearching: boolean
  hasSearched: boolean
  hasStores: boolean
  onSearch: () => void
  onSelectPlace: (place: PlaceResult) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl"
    >
      {hasStores && (
        <Link
          href="/painel"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <IconArrowLeft className="h-4 w-4" />
          Voltar para minhas lojas
        </Link>
      )}

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md shadow-primary/10">
          <IconSearch className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Cadastrar nova loja
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Busque sua empresa no Google para importar automaticamente
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Ex: Borracharia do João em São Paulo..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch()}
            className="h-12 border-slate-200/60 bg-white/70 pl-11 pr-4 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
          />
        </div>
        <Button
          onClick={onSearch}
          disabled={isSearching || query.length < 3}
          className="h-12 gap-2 px-6 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          {isSearching ? (
            <IconLoader2 className="h-5 w-5 animate-spin" />
          ) : (
            <IconSearch className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Buscar</span>
        </Button>
      </div>

      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Dica: inclua o nome da cidade para resultados mais precisos
      </p>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-3"
          >
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}. Qual deles é o seu?
            </p>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
              {results.map((place, index) => (
                <PlaceCard
                  key={place.placeId}
                  place={place}
                  index={index}
                  onClick={() => onSelectPlace(place)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasSearched && results.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <IconBuildingStore className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Nenhum resultado encontrado
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Tente buscar com termos diferentes ou crie seu site manualmente.
                </p>
                <Link href="/onboarding/manual" className="mt-4 inline-block">
                  <Button
                    className="gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                  >
                    <IconPlus className="h-4 w-4" />
                    Criar meu site manualmente
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-slate-400"
      >
        Mais de <span className="font-semibold text-primary">2.000 negócios</span> já criaram sua presença digital
      </motion.p>
    </motion.div>
  )
}

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 bg-white/70 p-3 text-left backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-lg hover:shadow-primary/5',
        'dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-primary/30 dark:hover:bg-slate-800'
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-primary/0" />

      <div className="relative flex gap-3">
        {place.photoUrl ? (
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
            <Image
              src={place.photoUrl}
              alt={place.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
              sizes="96px"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 sm:h-24 sm:w-24">
            <IconBuildingStore className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center gap-1 min-w-0">
          <p className="font-semibold leading-tight text-slate-900 dark:text-white line-clamp-2">
            {place.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {place.rating && (
              <span className="flex items-center gap-0.5 text-sm">
                <IconStarFilled className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{place.rating.toFixed(1)}</span>
                {place.reviewsCount && (
                  <span className="text-slate-400 dark:text-slate-500">({place.reviewsCount})</span>
                )}
              </span>
            )}
            {place.category && place.category !== 'Outro' && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                · {place.category}
              </span>
            )}
          </div>

          <p className="text-sm leading-snug text-slate-500 dark:text-slate-400 line-clamp-2">
            <IconMapPin className="mr-0.5 inline-block h-3.5 w-3.5 shrink-0 -translate-y-px" />
            {place.address}
          </p>

          {place.isOpen !== null && (
            <span className={cn(
              'inline-flex w-fit items-center gap-1 text-xs font-medium',
              place.isOpen
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            )}>
              <IconClock className="h-3 w-3" />
              {place.isOpen ? 'Aberto agora' : 'Fechado'}
            </span>
          )}
        </div>

        <IconArrowRight className="mt-2 h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-primary dark:text-slate-600" />
      </div>
    </motion.button>
  )
}

function ConfirmStep({
  place,
  preview,
  isLoadingPreview,
  selectedCoverIndex,
  onSelectCover,
  onConfirm,
  onBack,
  editedWhatsapp,
  editedPhone,
  onWhatsappChange,
  onPhoneChange,
}: {
  place: PlaceResult
  preview: PlacePreview | null
  isLoadingPreview: boolean
  selectedCoverIndex: number
  onSelectCover: (index: number) => void
  onConfirm: () => void
  onBack: () => void
  editedWhatsapp: string
  editedPhone: string
  onWhatsappChange: (value: string) => void
  onPhoneChange: (value: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl px-4"
    >
      {/* Header compacto */}
      <div className="mb-3 text-center md:mb-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg shadow-emerald-500/10 md:mb-3 md:h-12 md:w-12"
        >
          <IconCheck className="h-5 w-5 text-emerald-500 md:h-6 md:w-6" />
        </motion.div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          Confirme sua empresa
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
          Veja o que vamos importar do Google
        </p>
      </div>

      <GlassCard className="p-4 md:p-5">
        {isLoadingPreview ? (
          <div className="space-y-3">
            {/* Skeleton fotos - compacto */}
            <div className="-mx-4 -mt-4 flex gap-2 overflow-hidden rounded-t-xl bg-slate-100 p-2.5 dark:bg-slate-800 md:-mx-5 md:-mt-5 md:p-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700 md:h-20 md:w-20">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-4 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-full rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : preview ? (
          <div className="space-y-3 md:space-y-4">
            {/* Fotos - compacto */}
            {preview.photos.length > 0 && (
              <div className="-mx-4 -mt-4 rounded-t-xl bg-gradient-to-b from-slate-100 to-slate-50 px-2.5 pb-2.5 pt-2 dark:from-slate-800 dark:to-slate-800/50 md:-mx-5 md:-mt-5 md:px-3 md:pb-3">
                <div className="mb-1.5 flex items-center justify-between md:mb-2">
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 md:text-xs">
                    <IconPhoto className="mr-1 inline h-3 w-3" />
                    {preview.photos.length} {preview.photos.length === 1 ? 'foto' : 'fotos'}
                  </p>
                  {preview.photos.length > 1 && (
                    <p className="hidden text-[10px] text-slate-400 dark:text-slate-500 sm:block md:text-xs">
                      Clique para escolher capa
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide md:gap-2">
                  {preview.photos.map((photo, i) => {
                    const isSelected = selectedCoverIndex === i
                    return (
                      <motion.button
                        key={i}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => onSelectCover(i)}
                        className={cn(
                          "group relative shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all duration-200",
                          isSelected
                            ? "border-primary shadow-lg shadow-primary/20"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={photo}
                          alt={`Foto ${i + 1}`}
                          className="h-16 w-16 object-cover md:h-20 md:w-20"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                        )}
                        {isSelected && (
                          <div className="absolute bottom-1 left-1 flex items-center gap-0.5 rounded bg-primary px-1 py-0.5 text-[8px] font-semibold text-white shadow-sm md:text-[9px]">
                            <IconCheck className="h-2 w-2 md:h-2.5 md:w-2.5" />
                            Capa
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Info do negócio + Contatos lado a lado no desktop */}
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              {/* Info do negócio */}
              <div className="flex items-start justify-between gap-2 md:gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  {preview.category && (
                    <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary md:text-xs">
                      {preview.category}
                    </span>
                  )}
                  <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white md:text-base" title={preview.name}>
                    {preview.name}
                  </h2>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 md:text-xs">
                    {preview.address}
                  </p>
                </div>

                {preview.rating && (
                  <div className="shrink-0 text-center">
                    <div className="flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 dark:bg-amber-950/30">
                      <IconStarFilled className="h-3.5 w-3.5 text-amber-500 md:h-4 md:w-4" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400 md:text-base">
                        {preview.rating.toFixed(1)}
                      </span>
                    </div>
                    {preview.reviewsCount && (
                      <p className="mt-0.5 text-[9px] text-slate-500 md:text-[10px]">
                        {preview.reviewsCount} avaliações
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Seção de Contatos - compacta */}
              <div className="space-y-2 rounded-lg border border-amber-200/60 bg-amber-50/50 p-2.5 dark:border-amber-900/40 dark:bg-amber-950/20 md:p-3">
                <div className="flex items-center gap-2">
                  <IconAlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                    Verifique seus contatos
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {/* WhatsApp */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 md:text-xs">
                      <IconBrandWhatsapp className="h-3 w-3 text-emerald-600" />
                      WhatsApp
                    </label>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      value={editedWhatsapp}
                      onValueChange={(values) => onWhatsappChange(values.value)}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-base ring-offset-background transition-colors md:h-9 md:text-sm",
                        "placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20",
                        "dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500 dark:focus:border-emerald-500"
                      )}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  {/* Telefone (Ligação) */}
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 md:text-xs">
                      <IconPhone className="h-3 w-3 text-blue-600" />
                      Telefone
                    </label>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      value={editedPhone}
                      onValueChange={(values) => onPhoneChange(values.value)}
                      className={cn(
                        "flex h-9 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-base ring-offset-background transition-colors md:h-9 md:text-sm",
                        "placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20",
                        "dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500 dark:focus:border-blue-500"
                      )}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews em Carrossel */}
            {preview.topReviews.length > 0 && (
              <div className="space-y-1.5 md:space-y-2">
                <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 md:text-xs">
                  <IconStar className="h-3 w-3 text-amber-500 md:h-3.5 md:w-3.5" />
                  Avaliações que vamos destacar ({preview.topReviews.length})
                </p>
                
                <div className="relative -mx-4 md:-mx-5">
                  <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory md:px-5">
                    {preview.topReviews.map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + Math.min(i * 0.03, 0.3) }}
                        className={cn(
                          "flex-shrink-0 snap-center",
                          review.text
                            ? "min-w-[200px] max-w-[200px] md:min-w-[220px] md:max-w-[220px]"
                            : "min-w-[140px] max-w-[140px] md:min-w-[160px] md:max-w-[160px]",
                          "rounded-lg border border-slate-200/60 bg-white/80 p-2.5",
                          "dark:border-slate-700/60 dark:bg-slate-800/50"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                          <ReviewAvatar photoUrl={review.photoUrl} author={review.author} size="sm" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-medium text-slate-800 dark:text-slate-200 md:text-xs">
                              {review.author}
                            </p>
                            <div className="flex">
                              {[...Array(5)].map((_, j) => (
                                <IconStarFilled
                                  key={j}
                                  className={cn(
                                    'h-2.5 w-2.5',
                                    j < review.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.text && (
                          <p className="mt-1.5 text-[10px] leading-relaxed text-slate-600 line-clamp-2 dark:text-slate-400 md:text-xs">
                            &ldquo;{review.text}&rdquo;
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Success message - inline compacto */}
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200/60 bg-emerald-50/50 px-3 py-2 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-500/20 md:h-6 md:w-6">
                <IconCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 md:text-sm">
                <span className="font-medium">Pronto para importar!</span>
                <span className="ml-1 text-emerald-700 dark:text-emerald-300">Nossa IA vai otimizar para SEO.</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-5">
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/50 md:p-5">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary md:h-12 md:w-12 md:rounded-xl">
                  <IconMapPin className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-slate-900 dark:text-white md:text-lg">
                    {place.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                    {place.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {[
                { icon: IconStar, label: 'Avaliações' },
                { icon: IconPhoto, label: 'Fotos' },
                { icon: IconMapPin, label: 'Localização' },
                { icon: IconSparkles, label: 'Dados do negócio' },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 rounded-lg bg-slate-100/80 px-3 py-2.5 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-300 md:gap-2.5 md:rounded-xl md:px-4 md:py-3 md:text-sm"
                >
                  <item.icon className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2 border-t border-slate-200/60 pt-4 dark:border-slate-700/60 md:mt-6 md:gap-3 md:pt-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="h-10 flex-1 cursor-pointer gap-1.5 border-slate-200/60 text-sm dark:border-slate-700/60 md:h-12 md:gap-2"
          >
            <IconEdit className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Alterar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoadingPreview}
            className="h-10 flex-1 cursor-pointer gap-1.5 text-sm shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 md:h-12 md:gap-2"
          >
            {isLoadingPreview ? (
              <IconLoader2 className="h-3.5 w-3.5 animate-spin md:h-4 md:w-4" />
            ) : (
              <IconRocket className="h-3.5 w-3.5 md:h-4 md:w-4" />
            )}
            Criar meu site
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function ReviewAvatar({ photoUrl, author, size = 'md' }: { photoUrl: string | null; author: string; size?: 'sm' | 'md' }) {
  const [hasError, setHasError] = useState(false)
  const initials = author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const sizeClasses = size === 'sm' 
    ? 'h-8 w-8' 
    : 'h-10 w-10'
  
  const textSizeClass = size === 'sm' ? 'text-xs' : 'text-sm'

  if (!photoUrl || hasError) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5", sizeClasses)}>
        <span className={cn("font-medium text-primary", textSizeClass)}>{initials}</span>
      </div>
    )
  }

  return (
    <img
      src={photoUrl}
      alt={author}
      className={cn("shrink-0 rounded-full object-cover", sizeClasses)}
      onError={() => setHasError(true)}
    />
  )
}

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
      className="w-full max-w-2xl px-4"
    >
      {/* Header compacto */}
      <div className="mb-3 text-center md:mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10 md:mb-3 md:h-14 md:w-14"
        >
          <IconSparkles className="h-6 w-6 text-primary md:h-7 md:w-7" />
        </motion.div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-2xl">
          Criando seu site
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 md:text-sm">
          Nossa IA está trabalhando na sua página
        </p>
      </div>

      <GlassCard className="p-4 md:p-5">
        {/* Nome do negócio - compacto */}
        <div className="mb-3 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-800/50 md:mb-4">
          <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-200">
            {place.name}
          </p>
        </div>

        {/* Layout lado a lado no desktop */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Skeleton preview */}
          <SiteSkeletonPreview />

          {/* Steps - grid em ambos mobile e desktop */}
          <div className="grid grid-cols-3 gap-2 md:grid-cols-2 md:gap-2">
            {HUMANIZED_LOGS.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: index <= currentLogIndex ? 1 : 0.4,
                  scale: 1,
                }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-colors md:flex-row md:gap-2 md:p-2.5 md:text-left',
                  index < currentLogIndex && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                  index === currentLogIndex && 'bg-primary/5 dark:bg-primary/10'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-colors md:h-7 md:w-7',
                    index < currentLogIndex && 'bg-emerald-500 text-white',
                    index === currentLogIndex && 'bg-primary text-white',
                    index > currentLogIndex && 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  )}
                >
                  {index < currentLogIndex ? (
                    <IconCheck className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  ) : index === currentLogIndex ? (
                    <IconLoader2 className="h-3 w-3 animate-spin md:h-3.5 md:w-3.5" />
                  ) : (
                    <log.icon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-[10px] leading-tight transition-colors md:text-xs',
                    index <= currentLogIndex
                      ? 'text-slate-700 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                >
                  {log.shortText}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
}

function CompleteStep({ place, storeSlug }: { place: PlaceResult; storeSlug: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30 md:mb-5 md:h-20 md:w-20"
      >
        <IconCheck className="h-8 w-8 text-white md:h-10 md:w-10" />
      </motion.div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-3xl">
        Site criado!
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 md:mt-3 md:text-base">
        {place.name} está online
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 flex flex-col gap-2 md:mt-8 md:gap-3"
      >
        <Link href={getStoreUrl(storeSlug)} target="_blank">
          <Button
            size="lg"
            className="h-11 w-full gap-2 cursor-pointer text-sm shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 md:h-12 md:gap-3 md:text-base"
          >
            <IconRocket className="h-5 w-5" />
            Ver página
          </Button>
        </Link>
        <Link href={`/painel/${storeSlug}`}>
          <Button
            variant="outline"
            size="lg"
            className="h-10 w-full gap-2 cursor-pointer border-slate-200/60 text-sm text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-primary/30 dark:hover:text-primary md:h-11"
          >
            <IconArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            Ir para o painel
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

function SiteSkeletonPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
      {/* Header image skeleton - compacto */}
      <div className="relative h-14 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 md:h-16">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {/* Content skeleton - compacto */}
      <div className="space-y-1.5 p-2.5 md:space-y-2 md:p-3">
        <div className="h-3 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-2 w-1/2 rounded bg-slate-100 dark:bg-slate-800 md:h-2.5" />
        <div className="mt-2 flex gap-1.5 md:mt-3 md:gap-2">
          <div className="h-5 w-16 rounded bg-primary/20 md:h-6 md:w-20" />
          <div className="h-5 w-14 rounded bg-slate-100 dark:bg-slate-800 md:h-6 md:w-16" />
        </div>
      </div>
    </div>
  )
}

function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50",
      className
    )}>
      {children}
    </div>
  )
}

function ConfettiEffect() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 1,
            x: '50vw',
            y: '50vh',
            scale: 0,
          }}
          animate={{
            opacity: 0,
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 2 + 1,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            ease: 'easeOut',
          }}
          className={cn(
            'absolute h-3 w-3 rounded-sm',
            ['bg-primary/60', 'bg-emerald-500/60', 'bg-amber-500/60', 'bg-rose-500/60'][
            Math.floor(Math.random() * 4)
            ]
          )}
        />
      ))}
    </div>
  )
}
