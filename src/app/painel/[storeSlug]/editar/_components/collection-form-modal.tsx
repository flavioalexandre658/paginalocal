'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconFolders, IconPhoto, IconUpload, IconTrash, IconLoader2 } from '@tabler/icons-react'

import { createCollectionAction } from '@/actions/collections/create-collection.action'
import { updateCollectionAction } from '@/actions/collections/update-collection.action'
import { uploadEntityImageAction } from '@/actions/uploads/upload-entity-image.action'
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

const collectionFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  description: z.string().optional(),
})

type CollectionFormData = z.infer<typeof collectionFormSchema>

interface CollectionForEdit {
  id: string
  name: string
  description: string | null
}

interface CollectionFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  storeId: string
  collection?: CollectionForEdit | null
  onCreated: (collection: { id: string; name: string; description: string | null }) => void
  onUpdated: (collection: { id: string; name: string; description: string | null }) => void
}

export function CollectionFormModal({
  open,
  onOpenChange,
  storeId,
  collection,
  onCreated,
  onUpdated,
}: CollectionFormModalProps) {
  const isEditing = !!collection

  const { executeAsync: createAsync, isExecuting: isCreating } =
    useAction(createCollectionAction)
  const { executeAsync: updateAsync, isExecuting: isUpdating } =
    useAction(updateCollectionAction)
  const { executeAsync: uploadImage, isExecuting: isUploading } =
    useAction(uploadEntityImageAction)

  const isExecuting = isCreating || isUpdating

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<CollectionFormData>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

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

    const result = await uploadImage({
      storeId,
      file: formData,
      entity: 'collection',
      entityId: collection?.id,
    })

    if (result?.data?.url) {
      setImagePreview(result.data.url)
      toast.success('Imagem enviada!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    event.target.value = ''
  }

  useEffect(() => {
    if (open) {
      setImagePreview(null)
      form.reset({
        name: collection?.name || '',
        description: collection?.description || '',
      })
    }
  }, [open, collection, form])

  async function onSubmit(data: CollectionFormData) {
    if (isEditing && collection) {
      const result = await updateAsync({
        collectionId: collection.id,
        name: data.name,
        description: data.description || null,
        imageUrl: imagePreview || undefined,
      })

      if (result?.data) {
        toast.success('Coleção atualizada!')
        onOpenChange(false)
        onUpdated({
          id: collection.id,
          name: result.data.name,
          description: result.data.description,
        })
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    } else {
      const result = await createAsync({
        storeId,
        name: data.name,
        description: data.description || undefined,
        imageUrl: imagePreview || undefined,
      })

      if (result?.data) {
        toast.success('Coleção adicionada!')
        onOpenChange(false)
        onCreated({
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
        })
      } else if (result?.serverError) {
        toast.error(result.serverError)
      }
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader icon={<IconFolders className="h-5 w-5" />}>
          <ModalTitle>
            {isEditing ? 'Editar Coleção' : 'Nova Coleção'}
          </ModalTitle>
          <ModalDescription>
            {isEditing
              ? 'Altere as informações da coleção'
              : 'Preencha os dados da nova coleção. A IA vai gerar o SEO automaticamente.'}
          </ModalDescription>
        </ModalHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-1 flex-col min-h-0">
            <ModalBody className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-900 dark:text-white">Imagem de capa</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recomendado: 1200x900px
                </p>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative aspect-[4/3] max-w-[240px] overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <img
                      src={imagePreview}
                      alt="Capa da coleção"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                      <button
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        {isUploading ? (
                          <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <IconUpload className="h-3.5 w-3.5" />
                        )}
                        Trocar
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-transform hover:scale-105"
                      >
                        <IconTrash className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex w-full max-w-[240px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-6 transition-colors hover:border-primary/50 hover:bg-primary/5 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    {isUploading ? (
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da coleção</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Roupas Masculinas"
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
                        placeholder="Ex: Camisetas, calças e acessórios para homens de todos os estilos"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Se preenchida, será usada como base para a IA gerar o conteúdo SEO. Se vazia, a IA gera tudo automaticamente.
                    </FormDescription>
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
                  {isEditing ? 'Salvar alterações' : 'Adicionar coleção'}
                </EnhancedButton>
              </ModalFooterActions>
            </ModalFooter>
          </form>
        </Form>
      </ModalContent>
    </Modal>
  )
}
