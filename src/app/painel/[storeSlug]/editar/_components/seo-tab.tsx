'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconSearch, IconExternalLink, IconSparkles } from '@tabler/icons-react'

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
import { getStoreUrl } from '@/lib/utils'

const seoFormSchema = z.object({
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífens'),
  seoTitle: z.string().max(70, 'Máximo de 70 caracteres').optional().or(z.literal('')),
  seoDescription: z.string().max(160, 'Máximo de 160 caracteres').optional().or(z.literal('')),
  heroTitle: z.string().max(100, 'Máximo de 100 caracteres').optional().or(z.literal('')),
  heroSubtitle: z.string().max(200, 'Máximo de 200 caracteres').optional().or(z.literal('')),
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

export function SeoTab({ store, storeSlug }: SeoTabProps) {
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
  const watchSlug = form.watch('slug')
  const watchTitle = form.watch('seoTitle')
  const watchDescription = form.watch('seoDescription')

  const previewTitle = watchTitle || `${store.category} em ${store.city} | ${store.name}`
  const previewDescription = watchDescription || `Encontre os melhores serviços de ${store.category.toLowerCase()} em ${store.city}. ${store.name} - atendimento de qualidade.`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Otimização para Buscas (SEO)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure como seu site aparece no Google
        </p>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
        <div className="mb-3 flex items-center gap-2">
          <IconSearch className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Prévia no Google
          </span>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-emerald-700 dark:text-emerald-400">
            {siteUrl.replace('https://', '')}
          </p>
          <p className="mt-1 text-lg font-medium text-blue-700 hover:underline dark:text-blue-400">
            {previewTitle.slice(0, 70)}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {previewDescription.slice(0, 160)}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Site (Slug)</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${store.slug}.paginalocal.com.br`}
                      className="flex-1 font-mono"
                      disabled
                    />
                  </div>
                </FormControl>
                <FormDescription>
                  O slug é gerado automaticamente e não pode ser alterado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Meta Tags
            </h3>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="seoTitle"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Título da Página</FormLabel>
                      <span className={`text-xs ${(field.value?.length || 0) > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {field.value?.length || 0}/70
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder={`${store.category} em ${store.city} | ${store.name}`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Aparece na aba do navegador e nos resultados do Google
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
                      <span className={`text-xs ${(field.value?.length || 0) > 150 ? 'text-amber-600' : 'text-slate-400'}`}>
                        {field.value?.length || 0}/160
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Textarea
                          placeholder="Descreva seu negócio para os resultados de busca..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <div className="flex items-center justify-between">
                      <FormDescription>
                        Descrição que aparece abaixo do título no Google
                      </FormDescription>
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <IconSparkles className="h-3 w-3" />
                        Gerar com IA
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
            <h3 className="mb-4 font-medium text-slate-900 dark:text-white">
              Seção Hero (Topo do Site)
            </h3>

            <div className="space-y-4">
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
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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
