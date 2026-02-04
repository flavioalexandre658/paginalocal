'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAction } from 'next-safe-action/hooks'
import toast from 'react-hot-toast'
import { PatternFormat } from 'react-number-format'
import { IconExternalLink } from '@tabler/icons-react'

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

const contactFormSchema = z.object({
  whatsapp: z.string().min(10, 'WhatsApp inválido'),
  phone: z.string().optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF deve ter 2 caracteres'),
  zipCode: z.string().optional(),
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
  }
  storeSlug: string
}

export function ContactTab({ store, storeSlug }: ContactTabProps) {
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
    },
  })

  async function onSubmit(data: ContactFormData) {
    const result = await executeAsync({
      storeId: store.id,
      ...data,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      phone: data.phone?.replace(/\D/g, '') || '',
    })

    if (result?.data) {
      toast.success('Informações atualizadas!')
    } else if (result?.serverError) {
      toast.error(result.serverError)
    }
  }

  const mapsUrl = store.latitude && store.longitude
    ? `https://www.google.com/maps?q=${store.latitude},${store.longitude}`
    : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Contato & Endereço
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Como seus clientes podem encontrar e contatar você
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp *</FormLabel>
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
                  <FormLabel>Telefone Fixo</FormLabel>
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

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Rua, número, bairro" {...field} />
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
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
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
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 dark:border-slate-700/60 dark:bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Localização no Google Maps
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Coordenadas importadas do Google
                  </p>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  <IconExternalLink className="h-4 w-4" />
                  Ver no mapa
                </a>
              </div>
            </div>
          )}

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
