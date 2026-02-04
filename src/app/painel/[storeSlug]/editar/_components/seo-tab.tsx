'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconSearch,
  IconSparkles,
  IconWorld,
  IconHeading,
  IconFileText,
  IconCheck,
} from '@tabler/icons-react'

import { updateStoreAction } from '@/actions/stores/update-store.action'
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
import { Badge } from '@/components/ui/badge'
import { getStoreUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

const seoFormSchema = z.object({
  slug: z
    .string()
    .min(3, 'Slug deve ter pelo menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
  seoTitle: z
    .string()
    .max(70, 'Máximo de 70 caracteres')
    .optional()
    .or(z.literal('')),
  seoDescription: z
    .string()
    .max(160, 'Máximo de 160 caracteres')
    .optional()
    .or(z.literal('')),
  heroTitle: z
    .string()
    .max(100, 'Máximo de 100 caracteres')
    .optional()
    .or(z.literal('')),
  heroSubtitle: z
    .string()
    .max(200, 'Máximo de 200 caracteres')
    .optional()
    .or(z.literal('')),
})

type SeoFormData = z.infer<typeof seoFormSchema>

interface SeoTabProps {
  store: {
    id: string
    slug: string
    seoTitle: string | null
    seoDescription: string | null
    heroTitle: string | null
    heroSubtitle: string | null
    name: string
    city: string
    category: string
  }
  storeSlug: string
}

export function SeoTab({ store }: SeoTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)

  const form = useForm<SeoFormData>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      slug: store.slug,
      seoTitle: store.seoTitle || '',
      seoDescription: store.seoDescription || '',
      heroTitle: store.heroTitle || '',
      heroSubtitle: store.heroSubtitle || '',
    },
  })

  async function onSubmit(data: SeoFormData) {
    const result = await executeAsync({
      storeId: store.id,
      seoTitle: data.seoTitle || undefined,
      seoDescription: data.seoDescription || undefined,
      heroTitle: data.heroTitle || undefined,
      heroSubtitle: data.heroSubtitle || undefined,
    })

    if (result?.data) {
      toast.success('SEO atualizado!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  const siteUrl = getStoreUrl(store.slug)
  const watchTitle = form.watch('seoTitle')
  const watchDescription = form.watch('seoDescription')

  const previewTitle =
    watchTitle || `${store.category} em ${store.city} | ${store.name}`
  const previewDescription =
    watchDescription ||
    `Encontre os melhores serviços de ${store.category.toLowerCase()} em ${store.city}. ${store.name} - atendimento de qualidade.`

  const titleLength = watchTitle?.length || 0
  const descriptionLength = watchDescription?.length || 0

  const titleScore = titleLength >= 30 && titleLength <= 60 ? 'good' : titleLength > 0 ? 'warning' : 'empty'
  const descriptionScore = descriptionLength >= 120 && descriptionLength <= 155 ? 'good' : descriptionLength > 0 ? 'warning' : 'empty'

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Otimização para Buscas (SEO)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure como seu site aparece no Google
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900/50"
      >
        <div className="flex items-center gap-3 border-b border-slate-200/60 bg-slate-50/50 px-5 py-4 dark:border-slate-700/60 dark:bg-slate-800/30">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/10">
            <IconSearch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Prévia no Google
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Como seu site aparece nos resultados de busca
            </p>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {siteUrl.replace('https://', '')}
            </p>
            <p className="mt-1 text-lg font-medium text-blue-700 hover:underline dark:text-blue-400">
              {previewTitle.slice(0, 70)}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {previewDescription.slice(0, 160)}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full",
                titleScore === 'good' ? 'bg-emerald-500' : titleScore === 'warning' ? 'bg-amber-500' : 'bg-slate-300'
              )} />
              <span className="text-xs text-slate-500">Título</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-2 w-2 rounded-full",
                descriptionScore === 'good' ? 'bg-emerald-500' : descriptionScore === 'warning' ? 'bg-amber-500' : 'bg-slate-300'
              )} />
              <span className="text-xs text-slate-500">Descrição</span>
            </div>
          </div>
        </div>
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg shadow-primary/10">
                <IconWorld className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  URL do Site
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Endereço onde seu site está disponível
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="slug"
              render={() => (
                <FormItem>
                  <FormLabel>Endereço do site</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <IconCheck className="h-4 w-4 text-emerald-500" />
                      <code className="font-mono text-sm text-slate-700 dark:text-slate-300">
                        {store.slug}.paginalocal.com.br
                      </code>
                    </div>
                  </FormControl>
                  <FormDescription>
                    O endereço é gerado automaticamente e não pode ser alterado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 shadow-lg shadow-amber-500/10">
                <IconFileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Meta Tags
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Informações que aparecem no Google
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Título da Página</FormLabel>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          titleLength > 60
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : titleLength >= 30
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : ''
                        )}
                      >
                        {titleLength}/70
                      </Badge>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={`${store.category} em ${store.city} | ${store.name}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Ideal: 30-60 caracteres. Aparece na aba do navegador e no Google.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Meta Description</FormLabel>
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          descriptionLength > 155
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : descriptionLength >= 120
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : ''
                        )}
                      >
                        {descriptionLength}/160
                      </Badge>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva seu negócio para os resultados de busca..."
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        Ideal: 120-155 caracteres. Descrição abaixo do título no Google.
                      </FormDescription>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <IconSparkles className="h-3.5 w-3.5" />
                        Gerar com IA
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 shadow-lg shadow-purple-500/10">
                <IconHeading className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Seção Hero
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Textos que aparecem no topo do site
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="heroTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título Principal</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Bem-vindo à ${store.name}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroSubtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtítulo</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Uma breve descrição que aparece logo abaixo do título..."
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          <div className="flex justify-end">
            <EnhancedButton type="submit" loading={isExecuting}>
              Salvar Alterações
            </EnhancedButton>
          </div>
        </form>
      </Form>
    </div>
  )
}
