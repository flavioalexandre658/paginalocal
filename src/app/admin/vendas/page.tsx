'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAction } from 'next-safe-action/hooks'
import {
  IconLink,
  IconCopy,
  IconCheck,
  IconLoader2,
  IconBrandWhatsapp,
  IconExternalLink,
  IconCreditCard,
  IconBuildingStore,
  IconX,
  IconChevronDown,
} from '@tabler/icons-react'

import { getAdminPlansAction } from '@/actions/admin/get-admin-plans.action'
import { getAdminStoresAction } from '@/actions/admin/get-admin-stores.action'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface StoreOption {
  id: string
  name: string
  slug: string
  city: string
  state: string
  isActive: boolean
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function StorePicker({
  value,
  onChange,
}: {
  value: string
  onChange: (slug: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [stores, setStores] = useState<StoreOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedStore, setSelectedStore] = useState<StoreOption | null>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const { executeAsync } = useAction(getAdminStoresAction)

  const fetchStores = useCallback(async (q: string) => {
    setIsLoading(true)
    const res = await executeAsync({ search: q || undefined, limit: 50, page: 1 })
    if (res?.data?.stores) setStores(res.data.stores as StoreOption[])
    setIsLoading(false)
  }, [executeAsync])

  useEffect(() => {
    if (!open) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchStores(search), 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search, open, fetchStores])

  useEffect(() => {
    if (open && stores.length === 0) fetchStores('')
  }, [open, stores.length, fetchStores])

  function handleSelect(store: StoreOption) {
    setSelectedStore(store)
    onChange(store.slug)
    setOpen(false)
    setSearch('')
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    setSelectedStore(null)
    onChange('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors',
            'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
            open && 'border-primary/50 ring-2 ring-primary/10',
          )}
        >
          {selectedStore ? (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-br from-primary/20 to-primary/5 text-[10px] font-bold text-primary">
                {getInitials(selectedStore.name)}
              </div>
              <span className="truncate font-medium text-slate-900 dark:text-white">
                {selectedStore.name}
              </span>
              <span className="shrink-0 font-mono text-xs text-slate-400">
                {selectedStore.slug}
              </span>
            </div>
          ) : (
            <span className="text-slate-400">Selecionar loja (opcional)...</span>
          )}
          <div className="ml-2 flex shrink-0 items-center gap-1">
            {selectedStore && (
              <span
                role="button"
                onClick={handleClear}
                className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              >
                <IconX className="h-3.5 w-3.5" />
              </span>
            )}
            <IconChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', open && 'rotate-180')} />
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar por nome ou slug..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-slate-400">
                <IconLoader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </div>
            ) : (
              <>
                <CommandEmpty>Nenhuma loja encontrada.</CommandEmpty>
                <CommandGroup>
                  {stores.map((store) => (
                    <CommandItem
                      key={store.id}
                      value={store.id}
                      onSelect={() => handleSelect(store)}
                      className="cursor-pointer gap-3 py-2.5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-bold text-primary">
                        {getInitials(store.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {store.name}
                        </p>
                        <p className="truncate font-mono text-xs text-slate-400">
                          {store.slug}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          store.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                        )} />
                        <span className="text-[10px] text-slate-400">
                          {store.city}/{store.state}
                        </span>
                        {selectedStore?.id === store.id && (
                          <IconCheck className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

const checkoutSchema = z.object({
  planId: z.string().min(1, 'Selecione um plano'),
  billingInterval: z.enum(['MONTHLY', 'YEARLY']),
  storeSlug: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface Plan {
  id: string
  name: string
  type: string
  monthlyPriceInCents: number
  yearlyPriceInCents: number
  stripeMonthlyPriceId: string | null
  stripeYearlyPriceId: string | null
  isHighlighted: boolean
}

export default function VendasPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const { executeAsync } = useAction(getAdminPlansAction)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      planId: '',
      billingInterval: 'MONTHLY',
      storeSlug: '',
    },
  })

  const selectedPlanId = form.watch('planId')
  const billingInterval = form.watch('billingInterval')
  const selectedPlan = plans.find((p) => p.id === selectedPlanId)

  useEffect(() => {
    executeAsync({ onlyActive: true }).then((res) => {
      if (res?.data?.plans) setPlans(res.data.plans)
    })
  }, [executeAsync])

  async function handleSubmit(data: CheckoutFormData) {
    setIsGenerating(true)
    setGeneratedUrl(null)

    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: data.planId,
          billingInterval: data.billingInterval,
          storeSlug: data.storeSlug || undefined,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Erro ao gerar link de pagamento')
        return
      }

      setGeneratedUrl(json.url)
      toast.success('Link de pagamento gerado!')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopy() {
    if (!generatedUrl) return
    await navigator.clipboard.writeText(generatedUrl)
    setIsCopied(true)
    toast.success('Link copiado!')
    setTimeout(() => setIsCopied(false), 2000)
  }

  const whatsappUrl = generatedUrl
    ? `https://wa.me/?text=${encodeURIComponent(`Olá! Segue o link para assinar o seu plano na Página Local:\n\n${generatedUrl}`)}`
    : null

  const selectedIntervalPrice =
    selectedPlan && billingInterval === 'MONTHLY'
      ? selectedPlan.monthlyPriceInCents
      : selectedPlan?.yearlyPriceInCents

  const hasPriceId =
    selectedPlan &&
    (billingInterval === 'MONTHLY'
      ? !!selectedPlan.stripeMonthlyPriceId
      : !!selectedPlan.stripeYearlyPriceId)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl dark:text-white">
          Gerar Link de Pagamento
        </h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Crie um link do Stripe Checkout para enviar ao cliente via WhatsApp. O cliente cria a
          conta no momento do pagamento.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <GlassCard>
            <GlassCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                  <IconCreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <GlassCardTitle>Configurar link</GlassCardTitle>
                  <GlassCardDescription>
                    Selecione o plano e o período de cobrança
                  </GlassCardDescription>
                </div>
              </div>
            </GlassCardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                {/* Plan selector */}
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plano</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um plano..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {plans.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              <span className="font-medium">{p.name}</span>
                              <span className="ml-2 text-slate-400">
                                {formatCurrency(p.monthlyPriceInCents)}/mês
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Billing interval */}
                <FormField
                  control={form.control}
                  name="billingInterval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cobrança</FormLabel>
                      <FormControl>
                        <div className="flex rounded-xl border border-slate-200 bg-slate-50/50 p-1 dark:border-slate-700 dark:bg-slate-800/50">
                          {(
                            [
                              { value: 'MONTHLY', label: 'Mensal' },
                              { value: 'YEARLY', label: 'Anual' },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => field.onChange(opt.value)}
                              className={cn(
                                'flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all',
                                field.value === opt.value
                                  ? 'bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white'
                                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400',
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Store picker (optional) */}
                <FormField
                  control={form.control}
                  name="storeSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loja (opcional)</FormLabel>
                      <FormControl>
                        <StorePicker
                          value={field.value ?? ''}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Se selecionada, a loja será ativada e transferida ao cliente
                        automaticamente após o pagamento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price preview */}
                {selectedPlan && selectedIntervalPrice !== undefined && (
                  <div
                    className={cn(
                      'rounded-xl border px-4 py-3 text-sm',
                      hasPriceId
                        ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                        : 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">
                        {selectedPlan.name} — {billingInterval === 'MONTHLY' ? 'Mensal' : 'Anual'}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(selectedIntervalPrice)}
                        {billingInterval === 'MONTHLY' ? '/mês' : '/ano'}
                      </span>
                    </div>
                    {!hasPriceId && (
                      <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                        ⚠ Stripe priceId não configurado para este intervalo
                      </p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating || !hasPriceId}
                >
                  {isGenerating ? (
                    <IconLoader2 className="animate-spin" />
                  ) : (
                    <IconLink className="h-4 w-4" />
                  )}
                  {isGenerating ? 'Gerando...' : 'Gerar link de pagamento'}
                </Button>
              </form>
            </Form>
          </GlassCard>
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GlassCard className="flex h-full flex-col">
            <GlassCardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
                  <IconBrandWhatsapp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <GlassCardTitle>Link gerado</GlassCardTitle>
                  <GlassCardDescription>Copie e envie via WhatsApp</GlassCardDescription>
                </div>
              </div>
            </GlassCardHeader>

            {generatedUrl ? (
              <div className="flex flex-1 flex-col gap-4">
                {/* URL display */}
                <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                  <p className="flex-1 break-all text-sm font-mono text-slate-700 dark:text-slate-200">
                    {generatedUrl}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleCopy}
                  >
                    {isCopied ? (
                      <IconCheck className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <IconCopy className="h-4 w-4" />
                    )}
                    {isCopied ? 'Copiado!' : 'Copiar link'}
                  </Button>

                  <a
                    href={whatsappUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md"
                  >
                    <IconBrandWhatsapp className="h-4 w-4" />
                    Enviar pelo WhatsApp Web
                  </a>

                  <a
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <IconExternalLink className="h-4 w-4" />
                    Abrir checkout
                  </a>
                </div>

                <p className="mt-auto text-xs text-slate-400">
                  Este link expira após 24 horas. Gere um novo se necessário.
                </p>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <IconLink className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-sm text-slate-400 dark:text-slate-500">
                  Configure o plano ao lado e clique em{' '}
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    Gerar link
                  </span>{' '}
                  para criar o link de pagamento.
                </p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <GlassCard>
          <GlassCardHeader>
            <GlassCardTitle>Como funciona</GlassCardTitle>
          </GlassCardHeader>
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {[
              'Selecione o plano e período de cobrança desejados.',
              'Se já existe uma loja criada para o cliente, informe o slug dela.',
              'Clique em Gerar link e copie a URL.',
              'Envie o link pelo WhatsApp — o cliente preenche nome, e-mail e dados do cartão diretamente no Stripe.',
              'Após o pagamento, o sistema cria a conta automaticamente e envia um link para o cliente definir a senha.',
              'Se um slug de loja foi informado, a loja é ativada e transferida para a conta do cliente automaticamente.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </GlassCard>
      </motion.div>
    </div>
  )
}
