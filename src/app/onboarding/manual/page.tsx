'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  IconArrowLeft,
  IconArrowRight,
  IconBuildingStore,
  IconCheck,
  IconLoader2,
  IconMapPin,
  IconPhone,
  IconRocket,
  IconSparkles,
  IconFileText,
  IconStar,
  IconSearch,
} from '@tabler/icons-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

import { createStoreManualAction } from '@/actions/stores/create-store-manual.action'
import { getCategoriesAction } from '@/actions/categories/get-categories.action'
import {
  searchLocationAction,
  getLocationDetailsAction,
  getNearbyNeighborhoodsAction,
  type LocationDetails,
} from '@/actions/utils/search-location.action'
import { usePlanLimitRedirect } from '@/hooks/use-plan-limit-redirect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn, getStoreUrl } from '@/lib/utils'
import { PatternFormat } from 'react-number-format'

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  suggestedServices: string[] | null
  createdAt: Date | null
}

interface LocationPrediction {
  placeId: string
  description: string
  mainText: string
  secondaryText: string
}

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  categoryId: z.string().uuid('Selecione uma categoria'),
  locationQuery: z.string().min(1, 'Selecione uma localização'),
  differential: z.string().min(10, 'Descreva seu diferencial (mínimo 10 caracteres)').max(300),
  whatsapp: z.string().min(14, 'WhatsApp é obrigatório'),
})

type FormData = z.infer<typeof formSchema>

type ManualStep = 'form' | 'creating' | 'complete'

const HUMANIZED_LOGS = [
  { icon: IconSparkles, text: 'Analisando seu negócio...' },
  { icon: IconMapPin, text: 'Buscando bairros próximos...' },
  { icon: IconStar, text: 'Gerando conteúdo otimizado com IA...' },
  { icon: IconFileText, text: 'Criando descrições para SEO...' },
  { icon: IconRocket, text: 'Finalizando sua página...' },
]

export default function ManualOnboardingPage() {
  const [step, setStep] = useState<ManualStep>('form')
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [createdStore, setCreatedStore] = useState<{ slug: string; name: string } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const [locationPredictions, setLocationPredictions] = useState<LocationPrediction[]>([])
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationDetails | null>(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { executeAsync: createStore, isExecuting } = useAction(createStoreManualAction)
  const { executeAsync: getCategories } = useAction(getCategoriesAction)
  const { executeAsync: searchLocation } = useAction(searchLocationAction)
  const { executeAsync: getLocationDetails } = useAction(getLocationDetailsAction)
  const { executeAsync: getNearbyNeighborhoods } = useAction(getNearbyNeighborhoodsAction)
  const { handleActionError } = usePlanLimitRedirect()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      locationQuery: '',
      differential: '',
      whatsapp: '',
    },
  })

  useEffect(() => {
    async function loadCategories() {
      const result = await getCategories()
      if (result?.data) {
        setCategories(result.data)
      }
      setIsLoadingCategories(false)
    }
    loadCategories()
  }, [getCategories])

  useEffect(() => {
    if (step === 'creating') {
      const interval = setInterval(() => {
        setCurrentLogIndex(prev => {
          if (prev < HUMANIZED_LOGS.length - 1) return prev + 1
          return prev
        })
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleLocationSearch = useCallback(async (query: string) => {
    if (query.length < 3) {
      setLocationPredictions([])
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true)
      const result = await searchLocation({ query })
      if (result?.data) {
        setLocationPredictions(result.data)
      }
      setIsSearchingLocation(false)
    }, 300)
  }, [searchLocation])

  const handleLocationSelect = useCallback(async (prediction: LocationPrediction) => {
    setIsSearchingLocation(true)
    setIsPopoverOpen(false)

    const result = await getLocationDetails({ placeId: prediction.placeId })

    if (result?.data) {
      setSelectedLocation(result.data)
      form.setValue('locationQuery', `${result.data.city}, ${result.data.state}`)
    } else {
      toast.error('Erro ao buscar detalhes da localização')
    }

    setIsSearchingLocation(false)
    setLocationPredictions([])
  }, [getLocationDetails, form])

  async function onSubmit(data: FormData) {
    if (!selectedLocation) {
      toast.error('Selecione uma localização válida')
      return
    }

    setStep('creating')
    setCurrentLogIndex(0)

    const whatsappClean = data.whatsapp.replace(/\D/g, '')
    const selectedCategory = categories.find(c => c.id === data.categoryId)

    let neighborhoods: string[] = []
    if (selectedLocation.latitude && selectedLocation.longitude) {
      const neighborhoodsResult = await getNearbyNeighborhoods({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        city: selectedLocation.city,
      })
      if (neighborhoodsResult?.data) {
        neighborhoods = neighborhoodsResult.data
      }
    }

    const result = await createStore({
      name: data.name,
      categoryId: data.categoryId,
      categoryName: selectedCategory?.name || 'Outro',
      city: selectedLocation.city,
      state: selectedLocation.state as typeof BRAZILIAN_STATES[number],
      address: selectedLocation.fullAddress || undefined,
      neighborhood: selectedLocation.neighborhood || undefined,
      zipCode: selectedLocation.zipCode || undefined,
      latitude: selectedLocation.latitude || undefined,
      longitude: selectedLocation.longitude || undefined,
      neighborhoods: neighborhoods.length > 0 ? neighborhoods : undefined,
      differential: data.differential,
      whatsapp: whatsappClean,
    })

    if (result?.serverError) {
      const isLimitError = handleActionError(result.serverError)
      if (!isLimitError) {
        toast.error(result.serverError)
      }
      setStep('form')
      return
    }

    if (result?.validationErrors) {
      const errors = Object.values(result.validationErrors).flat()
      toast.error(errors[0] as string || 'Erro de validação')
      setStep('form')
      return
    }

    if (result?.data) {
      setCreatedStore({
        slug: result.data.slug,
        name: result.data.name,
      })
      setStep('complete')
      setShowConfetti(true)
      toast.success('Site criado com sucesso!')
    } else {
      toast.error('Erro inesperado ao criar site')
      setStep('form')
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {showConfetti && <ConfettiEffect />}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <FormStep
              key="form"
              form={form}
              onSubmit={onSubmit}
              isExecuting={isExecuting}
              categories={categories}
              isLoadingCategories={isLoadingCategories}
              locationPredictions={locationPredictions}
              isSearchingLocation={isSearchingLocation}
              selectedLocation={selectedLocation}
              isPopoverOpen={isPopoverOpen}
              setIsPopoverOpen={setIsPopoverOpen}
              onLocationSearch={handleLocationSearch}
              onLocationSelect={handleLocationSelect}
            />
          )}

          {step === 'creating' && (
            <CreatingStep
              key="creating"
              businessName={form.getValues('name')}
              currentLogIndex={currentLogIndex}
            />
          )}

          {step === 'complete' && createdStore && (
            <CompleteStep
              key="complete"
              storeName={createdStore.name}
              storeSlug={createdStore.slug}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FormStep({
  form,
  onSubmit,
  isExecuting,
  categories,
  isLoadingCategories,
  locationPredictions,
  isSearchingLocation,
  selectedLocation,
  isPopoverOpen,
  setIsPopoverOpen,
  onLocationSearch,
  onLocationSelect,
}: {
  form: ReturnType<typeof useForm<FormData>>
  onSubmit: (data: FormData) => void
  isExecuting: boolean
  categories: Category[]
  isLoadingCategories: boolean
  locationPredictions: LocationPrediction[]
  isSearchingLocation: boolean
  selectedLocation: LocationDetails | null
  isPopoverOpen: boolean
  setIsPopoverOpen: (open: boolean) => void
  onLocationSearch: (query: string) => void
  onLocationSelect: (prediction: LocationPrediction) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <Link
        href="/onboarding"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <IconArrowLeft className="h-4 w-4" />
        Voltar para busca no Google
      </Link>

      <div className="mb-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <IconBuildingStore className="h-10 w-10 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Criar site manualmente
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Preencha as informações e nossa IA criará seu site
        </p>
      </div>

      <GlassCard>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Nome do negócio
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Borracharia do Zé"
                      className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    Categoria do negócio
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 cursor-pointer border-slate-200/50 bg-white/50 transition-all focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50">
                        <SelectValue placeholder={isLoadingCategories ? 'Carregando...' : 'Selecione uma categoria'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id} className="cursor-pointer">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="locationQuery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <IconMapPin className="h-4 w-4" />
                      Localização
                    </span>
                  </FormLabel>
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Digite cidade ou bairro..."
                            className={cn(
                              "h-11 border-slate-200/50 bg-white/50 pr-10 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50",
                              selectedLocation && "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20"
                            )}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              onLocationSearch(e.target.value)
                              if (selectedLocation) {
                                setIsPopoverOpen(true)
                              }
                            }}
                            onFocus={() => {
                              if (field.value.length >= 3) {
                                setIsPopoverOpen(true)
                              }
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
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                      align="start"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      {locationPredictions.length > 0 ? (
                        <div className="max-h-[300px] overflow-auto py-1">
                          {locationPredictions.map((prediction) => (
                            <button
                              key={prediction.placeId}
                              type="button"
                              className="flex w-full cursor-pointer items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                              onClick={() => onLocationSelect(prediction)}
                            >
                              <IconMapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {prediction.mainText}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {prediction.secondaryText}
                                </p>
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
                    <p className="mt-2 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                      <IconCheck className="h-4 w-4" />
                      {selectedLocation.fullAddress || `${selectedLocation.city}, ${selectedLocation.state}`}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      WhatsApp
                    </span>
                  </FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="(##) #####-####"
                      mask="_"
                      value={field.value}
                      onValueChange={(values) => field.onChange(values.formattedValue)}
                      customInput={Input}
                      placeholder="(11) 99999-9999"
                      className="h-11 border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="differential"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 dark:text-slate-300">
                    O que te diferencia?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Atendimento 24h, socorro na rodovia, mais de 20 anos de experiência..."
                      className="min-h-[100px] resize-none border-slate-200/50 bg-white/50 transition-all placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10 dark:border-slate-700/50 dark:bg-slate-800/50"
                      {...field}
                    />
                  </FormControl>
                  <p className="mt-1 text-xs text-slate-400">
                    {field.value.length}/300 caracteres
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isExecuting || isLoadingCategories || !selectedLocation}
              className="h-12 w-full gap-2 cursor-pointer text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              {isExecuting ? (
                <IconLoader2 className="h-5 w-5 animate-spin" />
              ) : (
                <IconRocket className="h-5 w-5" />
              )}
              Criar meu site
            </Button>
          </form>
        </Form>
      </GlassCard>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-sm text-slate-400"
      >
        Nossa IA vai criar textos otimizados para SEO baseados no seu negócio
      </motion.p>
    </motion.div>
  )
}

function CreatingStep({
  businessName,
  currentLogIndex,
}: {
  businessName: string
  currentLogIndex: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-xl"
    >
      <div className="mb-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10"
        >
          <IconSparkles className="h-10 w-10 text-primary" />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Criando seu site
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Nossa IA está trabalhando na sua página
        </p>
      </div>

      <GlassCard>
        <div className="mb-6 rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/50">
          <p className="text-center font-medium text-slate-700 dark:text-slate-200">
            {businessName || 'Seu negócio'}
          </p>
        </div>

        <SiteSkeletonPreview />

        <div className="mt-6 space-y-3">
          {HUMANIZED_LOGS.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: index <= currentLogIndex ? 1 : 0.3,
                x: 0,
              }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={cn(
                'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                index < currentLogIndex && 'bg-emerald-50/50 dark:bg-emerald-950/20',
                index === currentLogIndex && 'bg-primary/5 dark:bg-primary/10'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                  index < currentLogIndex && 'bg-emerald-500 text-white',
                  index === currentLogIndex && 'bg-primary text-white',
                  index > currentLogIndex && 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                )}
              >
                {index < currentLogIndex ? (
                  <IconCheck className="h-4 w-4" />
                ) : index === currentLogIndex ? (
                  <IconLoader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <log.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'flex-1 pt-1 text-sm leading-snug transition-colors',
                  index <= currentLogIndex
                    ? 'text-slate-700 dark:text-slate-200'
                    : 'text-slate-400 dark:text-slate-500'
                )}
              >
                {log.text}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

function CompleteStep({
  storeName,
  storeSlug,
}: {
  storeName: string
  storeSlug: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-lg text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30"
      >
        <IconCheck className="h-12 w-12 text-white" />
      </motion.div>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Site criado!
      </h1>
      <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
        {storeName} está online
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col gap-3"
      >
        <Link href={getStoreUrl(storeSlug)} target="_blank">
          <Button
            size="lg"
            className="w-full h-14 gap-3 cursor-pointer text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
          >
            <IconRocket className="h-5 w-5" />
            Ver página
          </Button>
        </Link>
        <Link href={`/painel/${storeSlug}`}>
          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 gap-2 cursor-pointer border-slate-200/60 text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700/60 dark:text-slate-300 dark:hover:border-primary/30 dark:hover:text-primary"
          >
            <IconArrowRight className="h-5 w-5" />
            Ir para o painel
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 text-left dark:border-amber-900/40 dark:bg-amber-950/20"
      >
        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
          Dica: Adicione fotos do seu negócio
        </p>
        <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
          No painel, você pode fazer upload de fotos para deixar seu site mais atrativo.
        </p>
      </motion.div>
    </motion.div>
  )
}

function SiteSkeletonPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
      <div className="relative h-24 bg-gradient-to-r from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 flex gap-2">
          <div className="h-8 w-24 rounded-lg bg-primary/20" />
          <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  )
}

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200/40 bg-white/70 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl dark:border-slate-700/40 dark:bg-slate-900/70 dark:shadow-slate-900/50">
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
