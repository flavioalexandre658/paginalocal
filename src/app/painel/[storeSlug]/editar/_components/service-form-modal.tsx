'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconListDetails } from '@tabler/icons-react'
import { NumericFormat } from 'react-number-format'

import { createServiceAction } from '@/actions/services/create-service.action'
import { updateServiceAction } from '@/actions/services/update-service.action'
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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'

const serviceFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  priceInCents: z.number().int().positive().nullable().optional(),
})

type ServiceFormData = z.infer<typeof serviceFormSchema>

interface ServiceForEdit {
  id: string
  name: string
  description: string | null
  priceInCents: number | null
}

interface ServiceFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeId: string
  service?: ServiceForEdit | null
  onCreated: (service: { id: string; name: string; description: string | null; priceInCents: number | null; position: number }) => void
  onUpdated: (service: { id: string; name: string; description: string | null; priceInCents: number | null }) => void
}

export function ServiceFormModal({
  open,
  onOpenChange,
  storeId,
  service,
  onCreated,
  onUpdated,
}: ServiceFormModalProps) {
  const isEditing = !!service

  const { executeAsync: createAsync, isExecuting: isCreating } =
    useAction(createServiceAction)
  const { executeAsync: updateAsync, isExecuting: isUpdating } =
    useAction(updateServiceAction)

  const isExecuting = isCreating || isUpdating

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      priceInCents: null,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: service?.name || '',
        description: service?.description || '',
        priceInCents: service?.priceInCents ?? null,
      })
    }
  }, [open, service, form])

  async function onSubmit(data: ServiceFormData) {
    if (isEditing && service) {
      const result = await updateAsync({
        id: service.id,
        storeId,
        name: data.name,
        description: data.description || null,
        priceInCents: data.priceInCents ?? null,
      })

      if (result?.data) {
        toast.success('Serviço atualizado!')
        onOpenChange(false)
        onUpdated({
          id: service.id,
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
        priceInCents: data.priceInCents ?? undefined,
      })

      if (result?.data) {
        toast.success('Serviço adicionado!')
        onOpenChange(false)
        onCreated({
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          priceInCents: result.data.priceInCents,
          position: result.data.position,
        })
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader icon={<IconListDetails className="h-5 w-5" />}>
          <ModalTitle>
            {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? 'Altere as informações do serviço'
              : 'Preencha os dados do novo serviço'}
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
                    <FormLabel>Nome do serviço</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Troca de óleo"
                        {...field}
                      />
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
                        placeholder="Descreva o serviço brevemente..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceInCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (opcional)</FormLabel>
                    <FormControl>
                      <NumericFormat
                        value={
                          field.value != null ? field.value / 100 : ''
                        }
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
            </ModalBody>

            <ModalFooter>
              <ModalClose asChild>
                <EnhancedButton type="button" variant="outline">
                  Cancelar
                </EnhancedButton>
              </ModalClose>
              <ModalFooterActions>
                <EnhancedButton type="submit" loading={isExecuting}>
                  {isEditing ? 'Salvar alterações' : 'Adicionar serviço'}
                </EnhancedButton>
              </ModalFooterActions>
            </ModalFooter>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  )
}
