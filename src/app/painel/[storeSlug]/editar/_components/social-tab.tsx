'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandGoogle,
  IconExternalLink,
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
import { EnhancedButton } from '@/components/ui/enhanced-button'

const socialFormSchema = z.object({
  instagramUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  facebookUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  googleBusinessUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
})

type SocialFormData = z.infer<typeof socialFormSchema>

interface SocialTabProps {
  store: {
    id: string
    instagramUrl: string | null
    facebookUrl: string | null
    googleBusinessUrl: string | null
  }
}

const socialNetworks = [
  {
    name: 'instagramUrl' as const,
    label: 'Instagram',
    placeholder: 'https://instagram.com/seunegocio',
    description: 'Link do perfil do Instagram do seu negócio',
    icon: IconBrandInstagram,
    iconColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-gradient-to-br from-pink-500/20 to-pink-500/5 shadow-lg shadow-pink-500/10',
  },
  {
    name: 'facebookUrl' as const,
    label: 'Facebook',
    placeholder: 'https://facebook.com/seunegocio',
    description: 'Link da página do Facebook do seu negócio',
    icon: IconBrandFacebook,
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-lg shadow-blue-500/10',
  },
  {
    name: 'googleBusinessUrl' as const,
    label: 'Google Meu Negócio',
    placeholder: 'https://g.page/seunegocio',
    description: 'Link do perfil do Google Meu Negócio',
    icon: IconBrandGoogle,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 shadow-lg shadow-emerald-500/10',
  },
]

export function SocialTab({ store }: SocialTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)

  const form = useForm<SocialFormData>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      instagramUrl: store.instagramUrl || '',
      facebookUrl: store.facebookUrl || '',
      googleBusinessUrl: store.googleBusinessUrl || '',
    },
  })

  async function onSubmit(data: SocialFormData) {
    const result = await executeAsync({
      storeId: store.id,
      instagramUrl: data.instagramUrl?.trim() || null,
      facebookUrl: data.facebookUrl?.trim() || null,
      googleBusinessUrl: data.googleBusinessUrl?.trim() || null,
    })

    if (result?.data) {
      toast.success('Redes sociais atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Redes Sociais
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Adicione os links das redes sociais do seu negócio para exibir no site
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-700/60 dark:bg-slate-900/50"
          >
            <div className="space-y-6">
              {socialNetworks.map((network, index) => {
                const Icon = network.icon
                const fieldValue = form.watch(network.name)
                const hasUrl = fieldValue && fieldValue.length > 0

                return (
                  <motion.div
                    key={network.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-5 dark:border-slate-700/40 dark:bg-slate-800/30"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${network.bgColor}`}>
                          <Icon className={`h-5 w-5 ${network.iconColor}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {network.label}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {network.description}
                          </p>
                        </div>
                      </div>

                      {hasUrl && (
                        <a
                          href={fieldValue}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          <IconExternalLink className="h-3.5 w-3.5" />
                          Visitar
                        </a>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name={network.name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">{network.label}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <Input
                                className="pl-10"
                                placeholder={network.placeholder}
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            Cole a URL completa do perfil
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )
              })}
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
