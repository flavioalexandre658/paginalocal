'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconSparkles,
  IconPhoto,
  IconUpload,
  IconLoader2,
  IconInfoCircle,
  IconCheck,
  IconPalette,
} from '@tabler/icons-react'

const PRESET_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#22c55e' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Amarelo', value: '#eab308' },
  { name: 'Ciano', value: '#06b6d4' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Slate', value: '#475569' },
]

import { updateStoreAction } from '@/actions/stores/update-store.action'
import { uploadStoreImageAction } from '@/actions/uploads/upload-store-image.action'
import { uploadFaviconAction } from '@/actions/uploads/upload-favicon.action'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedButton } from '@/components/ui/enhanced-button'

const generalFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
})

type GeneralFormData = z.infer<typeof generalFormSchema>

interface GeneralTabProps {
  store: {
    id: string
    name: string
    description: string | null
    category: string
    primaryColor: string | null
    logoUrl: string | null
    faviconUrl: string | null
  }
}

export function GeneralTab({ store }: GeneralTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)
  const { executeAsync: uploadImage } = useAction(uploadStoreImageAction)
  const { executeAsync: uploadFavicon } = useAction(uploadFaviconAction)

  const [logoUrl, setLogoUrl] = useState<string | null>(store.logoUrl)
  const [faviconUrl, setFaviconUrl] = useState<string | null>(store.faviconUrl)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<GeneralFormData>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      name: store.name,
      description: store.description || '',
      primaryColor: store.primaryColor || '#3b82f6',
    },
  })

  async function onSubmit(data: GeneralFormData) {
    const result = await executeAsync({
      storeId: store.id,
      ...data,
    })

    if (result?.data) {
      toast.success('Informações atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    setIsUploadingLogo(true)

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadImage({
      storeId: store.id,
      file: formData,
      role: 'gallery',
    })

    if (result?.data?.url) {
      setLogoUrl(result.data.url)

      await executeAsync({
        storeId: store.id,
        logoUrl: result.data.url,
      })

      toast.success('Logo atualizado!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    setIsUploadingLogo(false)
    event.target.value = ''
  }

  async function handleFaviconUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem válida')
      return
    }

    if (file.size > 1 * 1024 * 1024) {
      toast.error('O favicon deve ter no máximo 1MB')
      return
    }

    setIsUploadingFavicon(true)

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadFavicon({
      storeId: store.id,
      file: formData,
    })

    if (result?.data?.url) {
      setFaviconUrl(result.data.url)
      toast.success('Favicon atualizado!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }

    setIsUploadingFavicon(false)
    event.target.value = ''
  }

  const descriptionLength = form.watch('description')?.length || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Informações Gerais
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dados básicos do seu negócio
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
      >
        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
          Identidade Visual
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Logo
            </p>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Recomendado: 512x512px, PNG ou JPG
            </p>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            <div
              onClick={() => !isUploadingLogo && logoInputRef.current?.click()}
              className="group relative flex aspect-square w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/50"
            >
              {logoUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="h-full w-full object-contain p-2"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {isUploadingLogo ? (
                      <IconLoader2 className="h-6 w-6 animate-spin text-white" />
                    ) : (
                      <IconUpload className="h-6 w-6 text-white" />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  {isUploadingLogo ? (
                    <IconLoader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <>
                      <IconPhoto className="h-8 w-8" />
                      <span className="text-xs">Adicionar</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Favicon
            </p>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
              Recomendado: 32x32px ou 64x64px, PNG ou ICO
            </p>

            <input
              ref={faviconInputRef}
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              className="hidden"
            />

            <div
              onClick={() => !isUploadingFavicon && faviconInputRef.current?.click()}
              className="group relative flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/50"
            >
              {faviconUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconUrl}
                    alt="Favicon"
                    className="h-full w-full object-contain p-1"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    {isUploadingFavicon ? (
                      <IconLoader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      <IconUpload className="h-4 w-4 text-white" />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  {isUploadingFavicon ? (
                    <IconLoader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <IconPhoto className="h-5 w-5" />
                  )}
                </div>
              )}
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
              <IconInfoCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>O favicon aparece na aba do navegador</span>
            </div>
          </div>
        </div>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Negócio</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Borracharia Salmo 23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-medium">Categoria:</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {store.category}
              </span>
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Descrição do Negócio</FormLabel>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    <IconSparkles className="h-3 w-3" />
                    Melhorar com IA
                  </button>
                </div>
                <FormControl>
                  <Textarea
                    placeholder="Descreva seu negócio, seus diferenciais e o que você oferece aos clientes..."
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormDescription>
                    Textos com 100+ caracteres melhoram seu SEO
                  </FormDescription>
                  <span className={`text-xs ${descriptionLength >= 100 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {descriptionLength}/100
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor Principal</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className={`group relative h-10 w-10 rounded-xl transition-all hover:scale-110 ${field.value === color.value
                            ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white'
                            : ''
                            }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {field.value === color.value && (
                            <IconCheck className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-md" />
                          )}
                        </button>
                      ))}

                      <div className="relative">
                        <input
                          type="color"
                          value={field.value}
                          onChange={field.onChange}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 transition-colors hover:border-slate-400 dark:border-slate-600"
                          style={{
                            background: !PRESET_COLORS.some((c) => c.value === field.value)
                              ? field.value
                              : undefined,
                          }}
                        >
                          {PRESET_COLORS.some((c) => c.value === field.value) ? (
                            <IconPalette className="h-5 w-5 text-slate-400" />
                          ) : (
                            <IconCheck className="h-5 w-5 text-white drop-shadow-md" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="h-12 w-12 shrink-0 rounded-xl shadow-lg"
                        style={{ backgroundColor: field.value }}
                      />
                      <div className="flex-1">
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="font-mono text-sm"
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Essa cor será usada nos botões e destaques do site
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
            <EnhancedButton type="submit" loading={isExecuting}>
              Salvar Alterações
            </EnhancedButton>
          </div>
        </form>
      </Form>
    </div>
  )
}
