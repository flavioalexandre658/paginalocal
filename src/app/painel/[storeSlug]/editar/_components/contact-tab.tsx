'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PatternFormat } from 'react-number-format'
import {
  IconExternalLink,
  IconBrandWhatsapp,
  IconPhone,
  IconMapPin,
  IconBuilding,
  IconEye,
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
import { Switch } from '@/components/ui/switch'

const contactFormSchema = z.object({
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  phone: z.string().optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().optional(),
  showWhatsappButton: z.boolean(),
  showCallButton: z.boolean(),
})

type ContactFormData = z.infer<typeof contactFormSchema>

interface ContactTabProps {
  store: {
    id: string
    whatsapp: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string | null
    latitude: string | null
    longitude: string | null
    showWhatsappButton: boolean
    showCallButton: boolean
  }
  storeSlug: string
}

export function ContactTab({ store }: ContactTabProps) {
  const { executeAsync, isExecuting } = useAction(updateStoreAction)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      whatsapp: store.whatsapp,
      phone: store.phone || '',
      address: store.address,
      city: store.city,
      state: store.state,
      zipCode: store.zipCode || '',
      showWhatsappButton: store.showWhatsappButton,
      showCallButton: store.showCallButton,
    },
  })

  async function onSubmit(data: ContactFormData) {
    const result = await executeAsync({
      storeId: store.id,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      phone: data.phone?.replace(/\D/g, '') || '',
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      showWhatsappButton: data.showWhatsappButton,
      showCallButton: data.showCallButton,
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Contato & Endereço
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Como seus clientes podem encontrar e contatar você
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
                    <FormDescription>
                      Principal meio de contato dos clientes
                    </FormDescription>
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
                    <FormDescription>
                      Opcional, será exibido se preenchido
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
            transition={{ delay: 0.05 }}
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
            transition={{ delay: 0.1 }}
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
