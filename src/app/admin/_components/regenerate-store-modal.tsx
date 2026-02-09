'use client'

import { useState } from 'react'
import { useAction } from 'next-safe-action/hooks'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  IconSearch,
  IconMapPin,
  IconLoader2,
  IconStarFilled,
  IconArrowRight,
  IconBuildingStore,
  IconClock,
  IconSparkles,
  IconArrowLeft,
} from '@tabler/icons-react'

import { searchPlacesAction } from '@/actions/google/search-places.action'
import { regenerateStoreContentAction } from '@/actions/admin/regenerate-store-content.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
} from '@/components/ui/modal-blocks'
import { cn } from '@/lib/utils'

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

interface RegenerateStoreModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  store: { id: string; name: string }
  onSuccess: () => void
}

type ModalStep = 'search' | 'regenerating'

export function RegenerateStoreModal({
  open,
  onOpenChange,
  store,
  onSuccess,
}: RegenerateStoreModalProps) {
  const [step, setStep] = useState<ModalStep>('search')
  const [query, setQuery] = useState(store.name)
  const [results, setResults] = useState<PlaceResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const { executeAsync: searchPlaces } = useAction(searchPlacesAction)
  const { executeAsync: regenerateStore } = useAction(regenerateStoreContentAction)

  function handleClose() {
    if (step === 'regenerating') return
    setStep('search')
    setQuery(store.name)
    setResults([])
    setHasSearched(false)
    onOpenChange(false)
  }

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
    setStep('regenerating')

    try {
      const res = await regenerateStore({
        storeId: store.id,
        googlePlaceId: place.placeId,
      })

      if (res?.serverError) {
        toast.error(res.serverError)
        setStep('search')
        return
      }

      if (res?.data) {
        toast.success(
          `"${res.data.displayName}" regenerada com sucesso! ` +
          `${res.data.servicesCreated} serviços, ${res.data.faqGenerated} FAQs, ` +
          `${res.data.testimonialsSynced} avaliações.`
        )
        onSuccess()
        handleClose()
      }
    } catch {
      toast.error('Erro ao regenerar a loja')
      setStep('search')
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <ModalContent size="lg" hideCloseButton={step === 'regenerating'}>
        <ModalHeader icon={<IconSparkles className="h-5 w-5 text-amber-500" />}>
          <ModalTitle>Regenerar Loja</ModalTitle>
          <ModalDescription>
            Busque a empresa no Google para atualizar <strong>{store.name}</strong> com dados frescos.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          {step === 'search' && (
            <div className="space-y-4">
              {/* Search bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Ex: Qualidade do Sabor Rio de Janeiro..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="h-10 pl-9 text-sm"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || query.length < 3}
                  className="h-10 gap-2 cursor-pointer"
                  size="sm"
                >
                  {isSearching ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconSearch className="h-4 w-4" />
                  )}
                  Buscar
                </Button>
              </div>

              <p className="text-xs text-slate-400">
                Dica: inclua o nome da cidade para resultados mais precisos
              </p>

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {results.length} {results.length === 1 ? 'resultado' : 'resultados'}. Selecione a empresa correta:
                  </p>
                  <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
                    {results.map((place) => (
                      <PlaceResultCard
                        key={place.placeId}
                        place={place}
                        onClick={() => handleSelectPlace(place)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {hasSearched && results.length === 0 && !isSearching && (
                <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <IconBuildingStore className="h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Nenhum resultado encontrado
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Tente buscar com termos diferentes ou inclua a cidade.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'regenerating' && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/20">
                <IconSparkles className="h-8 w-8 animate-pulse text-amber-500" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  Regenerando...
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Buscando dados do Google, gerando conteúdo com IA, atualizando serviços e FAQ...
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Isso pode levar até 30 segundos. Não feche esta janela.
                </p>
              </div>
              <IconLoader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

function PlaceResultCard({
  place,
  onClick,
}: {
  place: PlaceResult
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative w-full cursor-pointer overflow-hidden rounded-lg border border-slate-200/60 bg-white p-3 text-left transition-all',
        'hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm',
        'dark:border-slate-700/60 dark:bg-slate-800/70 dark:hover:border-primary/30 dark:hover:bg-primary/10'
      )}
    >
      <div className="flex gap-3">
        {place.photoUrl ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
            <Image
              src={place.photoUrl}
              alt={place.name}
              fill
              className="object-cover"
              unoptimized
              sizes="64px"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-700">
            <IconBuildingStore className="h-6 w-6 text-slate-400" />
          </div>
        )}

        <div className="flex flex-1 flex-col justify-center gap-0.5 min-w-0">
          <p className="font-medium text-sm leading-tight text-slate-900 dark:text-white line-clamp-1">
            {place.name}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {place.rating && (
              <span className="flex items-center gap-0.5 text-xs">
                <IconStarFilled className="h-3 w-3 text-amber-500" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">{place.rating.toFixed(1)}</span>
                {place.reviewsCount && (
                  <span className="text-slate-400">({place.reviewsCount})</span>
                )}
              </span>
            )}
            {place.category && place.category !== 'Outro' && (
              <span className="text-xs text-slate-500">
                · {place.category}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 line-clamp-1">
            <IconMapPin className="mr-0.5 inline-block h-3 w-3 -translate-y-px" />
            {place.address}
          </p>

          {place.isOpen !== null && (
            <span className={cn(
              'inline-flex w-fit items-center gap-0.5 text-[10px] font-medium',
              place.isOpen
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-500 dark:text-red-400'
            )}>
              <IconClock className="h-2.5 w-2.5" />
              {place.isOpen ? 'Aberto agora' : 'Fechado'}
            </span>
          )}
        </div>

        <IconArrowRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-primary dark:text-slate-600" />
      </div>
    </button>
  )
}
