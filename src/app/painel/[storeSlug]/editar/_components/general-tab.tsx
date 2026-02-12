'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PatternFormat } from 'react-number-format'
import {
  IconSparkles,
  IconPhoto,
  IconUpload,
  IconLoader2,
  IconInfoCircle,
  IconCheck,
  IconPalette,
  IconBrandWhatsapp,
  IconPhone,
  IconMapPin,
  IconBuilding,
  IconEye,
  IconMessage,
  IconStarFilled,
  IconExternalLink,
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

const HERO_BG_COLORS = [
  { name: 'Slate Escuro', value: '#1e293b' },
  { name: 'Cinza Escuro', value: '#111827' },
  { name: 'Preto', value: '#0a0a0a' },
  { name: 'Azul Escuro', value: '#1e3a5f' },
  { name: 'Verde Escuro', value: '#14532d' },
  { name: 'Roxo Escuro', value: '#3b0764' },
  { name: 'Branco', value: '#ffffff' },
  { name: 'Cinza Claro', value: '#f1f5f9' },
  { name: 'Bege', value: '#fef3c7' },
  { name: 'Azul Claro', value: '#dbeafe' },
]

const BUTTON_COLORS = [
  { name: 'Esmeralda', value: '#22c55e' },
  { name: 'Verde Escuro', value: '#16a34a' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Roxo', value: '#8b5cf6' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Ciano', value: '#06b6d4' },
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
import { Switch } from '@/components/ui/switch'
import { getContrastColor } from '@/lib/color-contrast'

const generalFormSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(255),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').optional().or(z.literal('')),
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  phone: z.string().optional(),
  whatsappDefaultMessage: z.string().max(300, 'Máximo 300 caracteres').optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().optional(),
  showWhatsappButton: z.boolean(),
  showCallButton: z.boolean(),
  highlightBadge: z.string().max(50, 'Máximo 50 caracteres').optional().or(z.literal('')),
  highlightText: z.string().max(500, 'Máximo 500 caracteres').optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  heroBackgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
})

type GeneralFormData = z.infer<typeof generalFormSchema>

interface GeneralTabProps {
  store: {
    id: string
    name: string
    description: string | null
    category: string
    primaryColor: string | null
    heroBackgroundColor: string | null
    buttonColor: string | null
    logoUrl: string | null
    faviconUrl: string | null
    whatsapp: string
    phone: string
    whatsappDefaultMessage: string | null
    address: string
    city: string
    state: string
    zipCode: string | null
    latitude: string | null
    longitude: string | null
    showWhatsappButton: boolean
    showCallButton: boolean
    highlightBadge: string | null
    highlightText: string | null
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
      whatsapp: store.whatsapp,
      phone: store.phone || '',
      whatsappDefaultMessage: store.whatsappDefaultMessage || '',
      address: store.address,
      city: store.city,
      state: store.state,
      zipCode: store.zipCode || '',
      showWhatsappButton: store.showWhatsappButton,
      showCallButton: store.showCallButton,
      highlightBadge: store.highlightBadge || '',
      highlightText: store.highlightText || '',
      primaryColor: store.primaryColor || '#3b82f6',
      heroBackgroundColor: store.heroBackgroundColor || '#1e293b',
      buttonColor: store.buttonColor || '#22c55e',
    },
  })

  async function onSubmit(data: GeneralFormData) {
    const result = await executeAsync({
      storeId: store.id,
      name: data.name,
      description: data.description || undefined,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      phone: data.phone?.replace(/\D/g, '') || '',
      whatsappDefaultMessage: data.whatsappDefaultMessage?.trim() || null,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      showWhatsappButton: data.showWhatsappButton,
      showCallButton: data.showCallButton,
      highlightBadge: data.highlightBadge?.trim() || null,
      highlightText: data.highlightText?.trim() || null,
      primaryColor: data.primaryColor,
      heroBackgroundColor: data.heroBackgroundColor,
      buttonColor: data.buttonColor,
    })

    if (result?.data) {
      toast.success('Informações atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  const mapsUrl =
    store.latitude && store.longitude
      ? `https://www.google.com/maps?q=${store.latitude},${store.longitude}`
      : null

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
              Recomendado: 180x180px ou maior, PNG ou JPG
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-lg shadow-amber-500/10">
                <IconStarFilled className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Destaque
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Texto de destaque exibido no hero e no rodapé do site
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="highlightBadge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Badge no Hero (curto)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Desde 1995"
                        maxLength={50}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Exibido como badge no topo do site (máx 50 caracteres)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="highlightText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto completo (rodapé)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Estamos no segmento de eventos desde 1995"
                        className="min-h-[80px] resize-none"
                        maxLength={500}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Versão completa exibida no rodapé do site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg shadow-emerald-500/10">
                <IconBrandWhatsapp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Telefones de Contato
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Como os clientes podem ligar para você
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconBrandWhatsapp className="h-4 w-4 text-emerald-500" />
                      WhatsApp *
                    </FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="(##) #####-####"
                        mask="_"
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        customInput={Input}
                        placeholder="(11) 99999-9999"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4 text-slate-500" />
                      Telefone Fixo
                    </FormLabel>
                    <FormControl>
                      <PatternFormat
                        format="(##) ####-####"
                        mask="_"
                        value={field.value}
                        onValueChange={(values) => field.onChange(values.value)}
                        customInput={Input}
                        placeholder="(11) 3333-4444"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-slate-700/40">
              <FormField
                control={form.control}
                name="whatsappDefaultMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconMessage className="h-4 w-4 text-emerald-500" />
                      Mensagem padrão do WhatsApp
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Olá! Vi seu site e gostaria de mais informações."
                        className="min-h-[80px] resize-none"
                        maxLength={300}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Mensagem enviada automaticamente quando o cliente clicar no botão do WhatsApp
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 shadow-lg shadow-violet-500/10">
                <IconEye className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Botões de Contato
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Escolha quais botões aparecem no seu site
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="showWhatsappButton"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                        <IconBrandWhatsapp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <FormLabel className="text-sm font-medium text-slate-900 dark:text-white">
                          Botão do WhatsApp
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Exibe o botão de WhatsApp no site
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showCallButton"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                        <IconPhone className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <FormLabel className="text-sm font-medium text-slate-900 dark:text-white">
                          Botão de Ligar
                        </FormLabel>
                        <FormDescription className="text-xs">
                          Exibe o botão de ligação no site
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/10">
                <IconMapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Localização
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Endereço do seu estabelecimento
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço Completo *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IconBuilding className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          className="pl-10"
                          placeholder="Rua, número, bairro"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade *</FormLabel>
                      <FormControl>
                        <Input placeholder="São Paulo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UF *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SP"
                          maxLength={2}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          mask="_"
                          value={field.value}
                          onValueChange={(values) => field.onChange(values.value)}
                          customInput={Input}
                          placeholder="01234-567"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {mapsUrl && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                  <div>
                    <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                      Localização no Google Maps
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Coordenadas importadas do Google
                    </p>
                  </div>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-500/30 dark:text-emerald-300"
                  >
                    <IconExternalLink className="h-4 w-4" />
                    Ver no mapa
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Cores do Site
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Personalize as cores do seu site. O texto se adapta automaticamente ao fundo.
              </p>
            </div>

            <div className="space-y-8">
              <FormField
                control={form.control}
                name="heroBackgroundColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor do Fundo (Hero)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {HERO_BG_COLORS.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => field.onChange(color.value)}
                              className={`group relative h-10 w-10 rounded-xl border border-slate-200 transition-all hover:scale-110 dark:border-slate-700 ${field.value === color.value
                                ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-white'
                                : ''
                                }`}
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            >
                              {field.value === color.value && (
                                <IconCheck
                                  className="absolute inset-0 m-auto h-5 w-5 drop-shadow-md"
                                  style={{ color: getContrastColor(color.value) }}
                                />
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
                                background: !HERO_BG_COLORS.some((c) => c.value === field.value)
                                  ? field.value
                                  : undefined,
                              }}
                            >
                              {HERO_BG_COLORS.some((c) => c.value === field.value) ? (
                                <IconPalette className="h-5 w-5 text-slate-400" />
                              ) : (
                                <IconCheck
                                  className="h-5 w-5 drop-shadow-md"
                                  style={{ color: getContrastColor(field.value) }}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg"
                            style={{ backgroundColor: field.value }}
                          >
                            <span
                              className="text-xs font-bold"
                              style={{ color: getContrastColor(field.value) }}
                            >
                              Aa
                            </span>
                          </div>
                          <div className="flex-1">
                            <Input
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono text-sm"
                              placeholder="#1e293b"
                            />
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Cor de fundo das seções de destaque do site
                    </FormDescription>
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
                      Usada em destaques, links e elementos de ênfase
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor dos Botões</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {BUTTON_COLORS.map((color) => (
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
                                <IconCheck
                                  className="absolute inset-0 m-auto h-5 w-5 drop-shadow-md"
                                  style={{ color: getContrastColor(color.value) }}
                                />
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
                                background: !BUTTON_COLORS.some((c) => c.value === field.value)
                                  ? field.value
                                  : undefined,
                              }}
                            >
                              {BUTTON_COLORS.some((c) => c.value === field.value) ? (
                                <IconPalette className="h-5 w-5 text-slate-400" />
                              ) : (
                                <IconCheck
                                  className="h-5 w-5 drop-shadow-md"
                                  style={{ color: getContrastColor(field.value) }}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 shrink-0 items-center justify-center rounded-xl px-4 shadow-lg"
                            style={{ backgroundColor: field.value }}
                          >
                            <span
                              className="text-xs font-semibold"
                              style={{ color: getContrastColor(field.value) }}
                            >
                              WhatsApp
                            </span>
                          </div>
                          <div className="flex-1">
                            <Input
                              value={field.value}
                              onChange={field.onChange}
                              className="font-mono text-sm"
                              placeholder="#22c55e"
                            />
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Cor dos botões de WhatsApp e contato
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

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
