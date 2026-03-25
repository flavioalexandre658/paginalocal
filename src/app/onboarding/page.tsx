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
  IconClock,
  IconBrandGoogle,
  IconForms,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import Image from 'next/image'
import { PatternFormat } from 'react-number-format'

import { searchPlacesAction } from '@/actions/google/search-places.action'
import { getPlacePreviewAction, type PlacePreview } from '@/actions/google/get-place-preview.action'
import { createStoreFromGoogleAction } from '@/actions/stores/create-store-from-google.action'
import { generateSiteAfterOnboarding } from '@/actions/ai/generate-site-after-onboarding'
import { getUserStoresAction } from '@/actions/stores/get-user-stores.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
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

type OnboardingStep = 'choose' | 'search' | 'confirm' | 'style' | 'contacts' | 'creating'

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

const STYLE_OPTIONS = [
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Moderno e direto ao ponto',
    palette: { primary: '#0f1923', secondary: '#1e3a5f', accent: '#ea580c' },
  },
  {
    id: 'elegant',
    name: 'Elegante',
    description: 'Sofisticado e refinado',
    palette: { primary: '#581c87', secondary: '#7c3aed', accent: '#d4a574' },
  },
  {
    id: 'warm',
    name: 'Acolhedor',
    description: 'Amigável e convidativo',
    palette: { primary: '#9a3412', secondary: '#78350f', accent: '#f97316' },
  },
  {
    id: 'bold',
    name: 'Impactante',
    description: 'Forte e energético',
    palette: { primary: '#111111', secondary: '#1f2937', accent: '#84cc16' },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Clean e espaçoso',
    palette: { primary: '#1e293b', secondary: '#334155', accent: '#3b82f6' },
  },
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
  const [createdStore, setCreatedStore] = useState<{ slug: string; name: string; id?: string } | null>(null)
  const [placePreview, setPlacePreview] = useState<PlacePreview | null>(null)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [hasStores, setHasStores] = useState(false)
  const [editedWhatsapp, setEditedWhatsapp] = useState('')
  const [editedPhone, setEditedPhone] = useState('')
  const [editedName, setEditedName] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#0f1923')
  const [selectedStyle, setSelectedStyle] = useState('industrial')

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

    const styleOption = STYLE_OPTIONS.find(s => s.id === selectedStyle)

    const result = await createStore({
      googlePlaceId: selectedPlace.placeId,
      searchTerm: query.trim(),
      whatsappOverride: cleanWhatsapp,
      phoneOverride: editedPhone.replace(/\D/g, '') || undefined,
      nameOverride: editedName.trim() !== selectedPlace.name ? editedName.trim() : undefined,
      primaryColor,
      secondaryColor: styleOption?.palette.secondary,
      accentColor: styleOption?.palette.accent,
      selectedStyle: selectedStyle as 'industrial' | 'elegant' | 'warm' | 'bold' | 'minimal',
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

    router.push(`/site/${result.data.slug}`)
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
    setPrimaryColor('#0f1923')
    setSelectedStyle('industrial')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
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
              onConfirm={() => setStep('style')}
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

          {step === 'style' && (
            <StyleStep
              key="style"
              selectedStyle={selectedStyle}
              onStyleChange={(styleId, palette) => {
                setSelectedStyle(styleId)
                setPrimaryColor(palette.primary)
              }}
              onContinue={() => setStep('contacts')}
              onBack={() => setStep('confirm')}
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
              onBack={() => setStep('style')}
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
      </div>
    </div>
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
      className="w-full max-w-2xl"
    >
      {hasStores && (
        <Link
          href="/painel"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <IconArrowLeft className="h-4 w-4" />
          Voltar para meus sites
        </Link>
      )}

      <div className="mb-6 text-center md:mb-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <IconRocket className="h-6 w-6 text-primary" />
        </motion.div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
          Como você quer criar seu site?
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Escolha a melhor opção para o seu negócio
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          onClick={onChooseAutomatic}
          className={cn(
            'group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-primary/20 bg-white/70 p-5 text-left backdrop-blur-sm transition-all duration-300 md:p-6',
            'hover:-translate-y-1 hover:border-primary/40 hover:bg-white hover:shadow-xl hover:shadow-primary/10',
            'dark:border-primary/20 dark:bg-slate-800/70 dark:hover:border-primary/40 dark:hover:bg-slate-800'
          )}
        >
          <div className="absolute right-3 top-3 md:right-4 md:top-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary md:text-xs">
              <IconSparkles className="h-3 w-3" />
              Recomendado
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/5 group-hover:via-primary/3 group-hover:to-transparent" />
          <div className="relative">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md shadow-primary/10 transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12">
              <IconBrandGoogle className="h-5 w-5 text-primary md:h-6 md:w-6" />
            </div>
            <h2 className="mb-1.5 pr-16 text-base font-semibold text-slate-900 dark:text-white md:pr-20 md:text-lg">
              Importar do Google
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:text-sm">
              Importamos fotos, avaliações e dados do seu Google Meu Negócio automaticamente.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
              {['Fotos', 'Avaliações', 'Endereço', 'IA'].map((tag, i) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700/60 dark:text-slate-300 md:text-xs"
                >
                  {i === 3 && <IconSparkles className="h-2.5 w-2.5 text-primary" />}
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary transition-all group-hover:gap-2.5 md:text-sm">
              Começar
              <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
        >
          <Link href="/onboarding/manual" className="block h-full">
            <div
              className={cn(
                'group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200/60 bg-white/70 p-5 text-left backdrop-blur-sm transition-all duration-300 md:p-6',
                'hover:-translate-y-1 hover:border-slate-300/80 hover:bg-white hover:shadow-lg hover:shadow-slate-200/30',
                'dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-slate-600/80 dark:hover:bg-slate-800 dark:hover:shadow-slate-900/30'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/0 via-slate-100/0 to-slate-100/0 transition-all duration-300 group-hover:from-slate-50/50 group-hover:via-slate-50/30 group-hover:to-transparent dark:group-hover:from-slate-800/50 dark:group-hover:via-slate-800/30" />
              <div className="relative">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 shadow-sm transition-transform duration-300 group-hover:scale-110 dark:bg-slate-700/60 md:h-12 md:w-12">
                  <IconForms className="h-5 w-5 text-slate-500 dark:text-slate-400 md:h-6 md:w-6" />
                </div>
                <h2 className="mb-1.5 text-base font-semibold text-slate-900 dark:text-white md:text-lg">
                  Criar manualmente
                </h2>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:text-sm">
                  Preencha as informações do seu negócio e monte seu site do zero.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5 md:gap-2">
                  {['Personalizado', 'Sem Google'].map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700/60 dark:text-slate-400 md:text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-all group-hover:gap-2.5 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200 md:text-sm">
                  Começar
                  <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/*process.env.NEXT_PUBLIC_SUPPORT_NUMBER && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-4"
        >
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'group flex items-center justify-center gap-2.5 rounded-xl border border-slate-200/60 bg-white/70 px-4 py-3 backdrop-blur-sm transition-all duration-300',
              'hover:border-emerald-300/60 hover:bg-emerald-50/50 hover:shadow-md hover:shadow-emerald-500/5',
              'dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/20'
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
              <IconBrandWhatsapp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                Precisa de ajuda?
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Nossa equipe pode criar seu site.{' '}
                <span className="font-medium text-emerald-600 group-hover:underline dark:text-emerald-400">
                  Chame no WhatsApp
                </span>
              </p>
            </div>
            <IconArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-500 dark:text-slate-600" />
          </a>
        </motion.div>
      )*/}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-slate-400"
      >
        Mais de <span className="font-semibold text-primary">200 negócios</span> já criaram sua presença digital
      </motion.p>
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
  hasStores,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl"
    >
      <button
        onClick={onBackToChoose}
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <IconArrowLeft className="h-4 w-4" />
        Voltar para opções
      </button>

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-md shadow-primary/10">
          <IconSearch className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            Escreva o nome e a cidade do seu negócio
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
                  <Button className="gap-2 cursor-pointer shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30">
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
        Mais de <span className="font-semibold text-primary">200 negócios</span> já criaram sua presença digital
      </motion.p>
    </motion.div>
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
  const heroPhoto = preview?.photos?.[0] || place.photoUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg px-4"
    >
      <GlassCard className="p-6 md:p-8">
        {isLoadingPreview ? (
          <div className="space-y-4">
            <div className="mx-auto h-40 w-40 rounded-xl bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <div className="space-y-2 text-center">
              <div className="mx-auto h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <div className="mx-auto h-4 w-64 rounded-lg bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
                Confirme seu negócio
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Veja o que encontramos no Google
              </p>
            </div>

            {heroPhoto && (
              <div className="flex justify-center">
                <img
                  src={heroPhoto}
                  alt={editedName || place.name}
                  className="h-40 w-40 rounded-xl object-cover shadow-lg md:h-48 md:w-48"
                />
              </div>
            )}

            <div className="text-center">
              {isEditingName ? (
                <div className="mx-auto max-w-sm">
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => onNameChange(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    autoFocus
                    className="text-center text-xl font-semibold md:text-2xl"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="group inline-flex items-center gap-2 cursor-pointer"
                >
                  <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                    {editedName || place.name}
                  </h3>
                  <IconEdit className="h-4 w-4 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              )}

              {(preview?.address || place.address) && (
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {preview?.address || place.address}
                </p>
              )}
            </div>

            {preview?.rating && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
                <IconStarFilled className="h-4 w-4 text-amber-500" />
                <span className="font-medium">{preview.rating.toFixed(1)}</span>
                {preview.reviewsCount && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span>{preview.reviewsCount} avaliações</span>
                  </>
                )}
              </div>
            )}

            {preview?.category && (
              <div className="flex justify-center">
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {preview.category}
                </span>
              </div>
            )}

            <Button
              onClick={onConfirm}
              disabled={isLoadingPreview}
              className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              {isLoadingPreview ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconCheck className="h-4 w-4" />
              )}
              Confirmar e continuar
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
              >
                <IconArrowLeft className="mr-1 inline h-3.5 w-3.5" />
                Voltar
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  )
}

// ─── StyleStep ───────────────────────────────────────────────────────────────

function StyleStep({
  selectedStyle,
  onStyleChange,
  onContinue,
  onBack,
}: {
  selectedStyle: string
  onStyleChange: (styleId: string, palette: { primary: string; secondary: string; accent: string }) => void
  onContinue: () => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl px-4"
    >
      <GlassCard className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
              Escolha o estilo do seu site
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Selecione o visual que mais combina com o seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyle === style.id
              return (
                <motion.button
                  key={style.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onStyleChange(style.id, style.palette)}
                  className={cn(
                    'group cursor-pointer overflow-hidden rounded-xl border-2 text-left transition-all duration-200',
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                      : 'border-slate-200/60 hover:border-slate-300 dark:border-slate-700/60 dark:hover:border-slate-600'
                  )}
                >
                  <div
                    className="relative flex h-32 flex-col items-center justify-center gap-2 p-4"
                    style={{ backgroundColor: style.palette.primary }}
                  >
                    <div
                      className="h-3 w-24 rounded-full opacity-80"
                      style={{ backgroundColor: style.palette.accent }}
                    />
                    <div className="h-2 w-32 rounded-full bg-white/30" />
                    <div className="h-2 w-20 rounded-full bg-white/20" />
                    <div
                      className="mt-2 h-7 w-28 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: style.palette.accent }}
                    >
                      <span className="text-[10px] font-semibold text-white">Saiba mais</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
                        <IconCheck className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-3 dark:bg-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {style.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {style.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      {[style.palette.primary, style.palette.secondary, style.palette.accent].map((color, i) => (
                        <div
                          key={i}
                          className="h-4 w-4 rounded-full border border-slate-200/60 dark:border-slate-600"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          <Button
            onClick={onContinue}
            className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <IconArrowRight className="h-4 w-4" />
            Continuar
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <IconArrowLeft className="mr-1 inline h-3.5 w-3.5" />
              Voltar
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg px-4"
    >
      <GlassCard className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white md:text-2xl">
              Confirme seus contatos
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Seus clientes vão usar esses dados para falar com você
            </p>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              <IconBrandWhatsapp className="h-4 w-4 text-emerald-600" />
              WhatsApp
            </label>
            <PatternFormat
              format="(##) #####-####"
              mask="_"
              value={editedWhatsapp}
              onValueChange={(values) => onWhatsappChange(values.value)}
              className={cn(
                'flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base ring-offset-background transition-colors',
                'placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
                'dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500 dark:focus:border-emerald-500'
              )}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
              <IconPhone className="h-4 w-4 text-blue-600" />
              Telefone
              <span className="text-xs font-normal text-slate-400">(opcional)</span>
            </label>
            <PatternFormat
              format="(##) #####-####"
              mask="_"
              value={editedPhone}
              onValueChange={(values) => onPhoneChange(values.value)}
              className={cn(
                'flex h-11 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base ring-offset-background transition-colors',
                'placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                'dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-500 dark:focus:border-blue-500'
              )}
              placeholder="(11) 99999-9999"
            />
          </div>

          {preview?.openingHours && preview.openingHours.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                <IconClock className="h-4 w-4 text-slate-500" />
                Horário de funcionamento
              </label>
              <div className="rounded-lg border border-slate-200/60 bg-slate-50/50 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
                <div className="grid gap-1">
                  {preview.openingHours.map((hours, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-400">
                      {hours}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={onConfirm}
            className="h-12 w-full cursor-pointer gap-2 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <IconRocket className="h-4 w-4" />
            Criar meu site
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <IconArrowLeft className="mr-1 inline h-3.5 w-3.5" />
              Voltar
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
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
      className="w-full max-w-2xl px-4"
    >
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
        <div className="mb-3 rounded-lg border border-slate-200/60 bg-slate-50/50 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-800/50 md:mb-4">
          <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-200">
            {place.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SiteSkeletonPreview />

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

// ─── Shared UI ───────────────────────────────────────────────────────────────

function SiteSkeletonPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
      <div className="relative h-14 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 md:h-16">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
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
      'rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50',
      className
    )}>
      {children}
    </div>
  )
}
