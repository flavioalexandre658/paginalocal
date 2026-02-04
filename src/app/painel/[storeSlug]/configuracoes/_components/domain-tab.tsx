'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  IconWorld,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconCopy,
  IconExternalLink,
} from '@tabler/icons-react'

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
import { cn } from '@/lib/utils'

const domainFormSchema = z.object({
  domain: z.string()
    .min(4, 'Domínio muito curto')
    .regex(/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i, 'Formato de domínio inválido'),
})

type DomainFormData = z.infer<typeof domainFormSchema>

interface DomainTabProps {
  storeSlug: string
}

export function DomainTab({ storeSlug }: DomainTabProps) {
  const [isProPlan] = useState(false)
  const [domainStatus, setDomainStatus] = useState<'none' | 'pending' | 'verified'>('none')

  const form = useForm<DomainFormData>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      domain: '',
    },
  })

  async function onSubmit(data: DomainFormData) {
    toast.success('Domínio adicionado! Verifique as configurações de DNS.')
    setDomainStatus('pending')
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('Copiado!')
  }

  if (!isProPlan) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Domínio Próprio
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use seu próprio domínio (ex: www.seunegocio.com.br)
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <IconLock className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
            Recurso do Plano Pro
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Faça upgrade para o plano Profissional para usar seu próprio domínio
            e aumentar a autoridade do seu negócio.
          </p>
          <EnhancedButton className="mt-6">
            Fazer upgrade
          </EnhancedButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Domínio Próprio
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure seu domínio personalizado
        </p>
      </div>

      {domainStatus === 'none' && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu domínio</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <IconWorld className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        className="pl-10"
                        placeholder="www.seunegocio.com.br"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Insira o domínio completo que você já possui
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <EnhancedButton type="submit">
              Adicionar domínio
            </EnhancedButton>
          </form>
        </Form>
      )}

      {domainStatus === 'pending' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <IconAlertCircle className="h-5 w-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">
                Aguardando verificação DNS
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Configure os registros abaixo no painel do seu provedor de domínio
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 dark:text-white">
              Configuração de DNS
            </h3>

            <div className="overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                      Nome/Host
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">
                      Valor/Destino
                    </th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
                  <tr>
                    <td className="px-4 py-3 font-mono text-sm">CNAME</td>
                    <td className="px-4 py-3 font-mono text-sm">www</td>
                    <td className="px-4 py-3 font-mono text-sm text-primary">
                      cname.paginalocal.com.br
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copyToClipboard('cname.paginalocal.com.br')}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                      >
                        <IconCopy className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-sm">A</td>
                    <td className="px-4 py-3 font-mono text-sm">@</td>
                    <td className="px-4 py-3 font-mono text-sm text-primary">
                      76.76.21.21
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copyToClipboard('76.76.21.21')}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                      >
                        <IconCopy className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-3">
              <EnhancedButton variant="outline" size="sm">
                Verificar agora
              </EnhancedButton>
              <button className="text-sm text-slate-500 hover:text-red-500">
                Remover domínio
              </button>
            </div>
          </div>
        </div>
      )}

      {domainStatus === 'verified' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <IconCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">
                Domínio verificado e ativo
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Seu site está disponível em www.seunegocio.com.br
              </p>
            </div>
            <a
              href="https://www.seunegocio.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto"
            >
              <IconExternalLink className="h-5 w-5 text-emerald-600" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
