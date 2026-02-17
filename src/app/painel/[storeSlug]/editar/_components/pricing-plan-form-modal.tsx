'use client'

import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconCreditCard, IconPlus, IconX } from '@tabler/icons-react'
import { NumericFormat } from 'react-number-format'

import { createPricingPlanAction } from '@/actions/pricing-plans/create-pricing-plan.action'
import { updatePricingPlanAction } from '@/actions/pricing-plans/update-pricing-plan.action'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
  ModalClose,
} from '@/components/ui/modal-blocks'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const pricingPlanFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().optional(),
  priceInCents: z.number().int().positive().nullable().optional(),
  interval: z.enum(['MONTHLY', 'YEARLY', 'ONE_TIME']),
  features: z.array(z.object({ value: z.string() })),
  isHighlighted: z.boolean(),
  isActive: z.boolean(),
  ctaMode: z.enum(['WHATSAPP', 'EXTERNAL_LINK']),
  ctaExternalUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

type PricingPlanFormData = z.infer<typeof pricingPlanFormSchema>

interface PlanForEdit {
  id: string
  name: string
  description: string | null
  priceInCents: number
  interval: string
  features: string[] | null
  isHighlighted: boolean
  isActive: boolean
  ctaMode: string
  ctaExternalUrl: string | null
}

interface PricingPlanFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeId: string
  plan?: PlanForEdit | null
  onCreated: (plan: { id: string; name: string; description: string | null; priceInCents: number }) => void
  onUpdated: (plan: { id: string; name: string; description: string | null; priceInCents: number }) => void
}

export function PricingPlanFormModal({
  open,
  onOpenChange,
  storeId,
  plan,
  onCreated,
  onUpdated,
}: PricingPlanFormModalProps) {
  const isEditing = !!plan

  const { executeAsync: createAsync, isExecuting: isCreating } =
    useAction(createPricingPlanAction)
  const { executeAsync: updateAsync, isExecuting: isUpdating } =
    useAction(updatePricingPlanAction)

  const isExecuting = isCreating || isUpdating

  const form = useForm<PricingPlanFormData>({
    resolver: zodResolver(pricingPlanFormSchema),
    defaultValues: {
      name: '',
      description: '',
      priceInCents: null,
      interval: 'MONTHLY',
      features: [{ value: '' }],
      isHighlighted: false,
      isActive: true,
      ctaMode: 'WHATSAPP',
      ctaExternalUrl: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'features',
  })

  useEffect(() => {
    if (open) {
      const features = plan?.features || []
      form.reset({
        name: plan?.name || '',
        description: plan?.description || '',
        priceInCents: plan?.priceInCents ?? null,
        interval: (plan?.interval as 'MONTHLY' | 'YEARLY' | 'ONE_TIME') || 'MONTHLY',
        features: features.length > 0 ? features.map(f => ({ value: f })) : [{ value: '' }],
        isHighlighted: plan?.isHighlighted ?? false,
        isActive: plan?.isActive ?? true,
        ctaMode: (plan?.ctaMode as 'WHATSAPP' | 'EXTERNAL_LINK') || 'WHATSAPP',
        ctaExternalUrl: plan?.ctaExternalUrl || '',
      })
    }
  }, [open, plan, form])

  const ctaMode = form.watch('ctaMode')

  async function onSubmit(data: PricingPlanFormData) {
    const features = data.features.map(f => f.value).filter(v => v.trim())

    if (isEditing && plan) {
      const result = await updateAsync({
        planId: plan.id,
        name: data.name,
        description: data.description || null,
        priceInCents: data.priceInCents ?? undefined,
        interval: data.interval,
        features,
        isHighlighted: data.isHighlighted,
        isActive: data.isActive,
        ctaMode: data.ctaMode,
        ctaExternalUrl: data.ctaExternalUrl || null,
      })

      if (result?.data) {
        toast.success('Plano atualizado!')
        onOpenChange(false)
        onUpdated({
          id: plan.id,
          name: result.data.name,
          description: result.data.description,
          priceInCents: result.data.priceInCents,
        })
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    } else {
      const result = await createAsync({
        storeId,
        name: data.name,
        description: data.description || undefined,
        priceInCents: data.priceInCents ?? 0,
        interval: data.interval,
        features,
        isHighlighted: data.isHighlighted,
        isActive: data.isActive,
        ctaMode: data.ctaMode,
        ctaExternalUrl: data.ctaExternalUrl || undefined,
      })

      if (result?.data) {
        toast.success('Plano adicionado!')
        onOpenChange(false)
        onCreated({
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          priceInCents: result.data.priceInCents,
        })
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="lg">
        <ModalHeader icon={<IconCreditCard className="h-5 w-5" />}>
          <ModalTitle>
            {isEditing ? 'Editar Plano' : 'Novo Plano'}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? 'Altere as informações do plano'
              : 'Preencha os dados do plano. A IA vai gerar a descrição automaticamente.'}
          </ModalDescription>
        </ModalHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ModalBody className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do plano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Plano Premium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Acesso completo à musculação, funcional e aulas coletivas"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Se preenchida, será usada como base para a IA. Se vazia, a IA gera automaticamente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="priceInCents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <NumericFormat
                          value={field.value != null ? field.value / 100 : ''}
                          onValueChange={(values) => {
                            field.onChange(
                              values.floatValue != null
                                ? Math.round(values.floatValue * 100)
                                : null
                            )
                          }}
                          thousandSeparator="."
                          decimalSeparator=","
                          prefix="R$ "
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          customInput={Input}
                          placeholder="R$ 0,00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intervalo</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Mensal</SelectItem>
                          <SelectItem value="YEARLY">Anual</SelectItem>
                          <SelectItem value="ONE_TIME">Pagamento Único</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Recursos inclusos</FormLabel>
                <div className="mt-3 space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <FormField
                        control={form.control}
                        name={`features.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input {...field} placeholder="Ex: Acesso ilimitado" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {fields.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => remove(index)}>
                          <IconX className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })} className="mt-3">
                  <IconPlus className="mr-2 h-4 w-4" />
                  Adicionar recurso
                </Button>
              </div>

              {ctaMode === 'EXTERNAL_LINK' && (
                <FormField
                  control={form.control}
                  name="ctaExternalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL do link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="isHighlighted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Destaque</FormLabel>
                        <FormDescription>Badge "Mais Popular"</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>Exibir no site</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ModalBody>

            <ModalFooter>
              <ModalClose asChild>
                <EnhancedButton type="button" variant="outline">
                  Cancelar
                </EnhancedButton>
              </ModalClose>
              <ModalFooterActions>
                <EnhancedButton type="submit" loading={isExecuting}>
                  {isEditing ? 'Salvar alterações' : 'Adicionar plano'}
                </EnhancedButton>
              </ModalFooterActions>
            </ModalFooter>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  )
}
