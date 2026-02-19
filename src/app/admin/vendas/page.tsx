'use client'

import { useEffect, useState } from 'react'
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
} from '@tabler/icons-react'

import { getAdminPlansAction } from '@/actions/admin/get-admin-plans.action'
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

                {/* Store slug (optional) */}
                <FormField
                  control={form.control}
                  name="storeSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug da loja (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ex: borracharia-silva-guarulhos"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Se preenchido, a loja será ativada e transferida ao cliente
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
