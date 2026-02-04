'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { IconSparkles } from '@tabler/icons-react'

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
  }
  storeSlug: string
}

export function GeneralTab({ store, storeSlug }: GeneralTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)

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

  const descriptionLength = form.watch('description')?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Informações Gerais
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Dados básicos do seu negócio
        </p>
      </div>

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
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={field.value}
                      onChange={field.onChange}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    <Input
                      {...field}
                      className="w-32 font-mono"
                      placeholder="#3b82f6"
                    />
                    <div
                      className="h-10 flex-1 rounded-lg"
                      style={{ backgroundColor: field.value }}
                    />
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
