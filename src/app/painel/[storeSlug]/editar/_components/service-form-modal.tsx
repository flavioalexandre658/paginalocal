'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconListDetails, IconPhoto, IconUpload, IconTrash, IconLoader2 } from '@tabler/icons-react'
import { NumericFormat } from 'react-number-format'

import { createServiceAction } from '@/actions/services/create-service.action'
import { updateServiceAction } from '@/actions/services/update-service.action'
import { uploadServiceHeroAction } from '@/actions/services/upload-service-hero.action'
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
  heroImageUrl?: string | null
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
  const { executeAsync: uploadHero, isExecuting: isUploadingHero } =
    useAction(uploadServiceHeroAction)

  const isExecuting = isCreating || isUpdating

  const [heroPreview, setHeroPreview] = useState<string | null>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

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
      setHeroPreview(service?.heroImageUrl || null)
    }
  }, [open, service, form])

  async function handleHeroUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || !isEditing || !service) return

    if (!file.type.startsWith('image/')) {
      toast.error('O arquivo deve ser uma imagem')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadHero({
      serviceId: service.id,
      storeId,
      file: formData,
    })

    if (result?.data?.url) {
      setHeroPreview(result.data.url)
      toast.success('Imagem de destaque salva!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    event.target.value = ''
  }

  async function handleRemoveHero() {
    if (!isEditing || !service) return

    const result = await updateAsync({
      id: service.id,
      storeId,
      heroImageUrl: null,
    })

    if (result?.data) {
      setHeroPreview(null)
      toast.success('Imagem de destaque removida!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

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
                        placeholder="Ex: Troca de óleo para carros e motos, com filtro incluso e atendimento rápido"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Se preenchida, será usada como base para a IA gerar o conteúdo da página do serviço. Se vazia, a IA gera tudo automaticamente.
                    </FormDescription>
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
              {isEditing && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-900 dark:text-white">
                    Imagem de destaque (hero)
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aparece no fundo da página do serviço. Recomendado: 1200x675px
                  </p>

                  <input
                    ref={heroInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                  />

                  {heroPreview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <img
                        src={heroPreview}
                        alt="Imagem de destaque do serviço"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                        <button
                          type="button"
                          onClick={() => heroInputRef.current?.click()}
                          disabled={isUploadingHero}
                          className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                        >
                          {isUploadingHero ? (
                            <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <IconUpload className="h-3.5 w-3.5" />
                          )}
                          Trocar
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveHero}
                          disabled={isUploadingHero}
                          className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                          Remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => heroInputRef.current?.click()}
                      disabled={isUploadingHero}
                      className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50"
                    >
                      {isUploadingHero ? (
                        <>
                          <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="mt-2 text-xs font-medium text-primary">Enviando...</span>
                        </>
                      ) : (
                        <>
                          <IconPhoto className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                          <span className="mt-2 text-xs font-medium text-slate-500">Clique para adicionar</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
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
